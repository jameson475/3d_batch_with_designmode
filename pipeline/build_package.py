"""Builds the cumulative package: README.md + token_log.csv + code/ viewers/ renders/ -> one zip.
Inputs: out/results.json (from render.mjs), summaries.json, ledger.json. Batch = ceil(id/10)."""
import json, csv, shutil, os, sys, zipfile
from detail_stats import detail_of, table as detail_table, LABEL

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, 'out')
r = json.load(open(os.path.join(out, 'results.json')))
summ = json.load(open(os.path.join(here, 'summaries.json')))
ledger = json.load(open(os.path.join(here, 'ledger.json')))
batch_of = lambda x: (int(x['id']) - 1) // 10 + 1
zip_path = sys.argv[1] if len(sys.argv) > 1 else '/mnt/user-data/outputs/3d_objects_all.zip'

os.makedirs(os.path.join(out, 'code'), exist_ok=True)
for x in r:
    shutil.copy(os.path.join(here, 'objects', x['file']), os.path.join(out, 'code', x['file']))

with open(os.path.join(out, 'token_log.csv'), 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['batch', 'id', 'name', 'detail', 'prompt', 'prompt_tokens', 'code_lines', 'code_chars', 'code_tokens', 'meshes', 'triangles', 'materials', 'lights'])
    for x in r:
        s = x['stats']
        w.writerow([batch_of(x), x['id'], x['name'], detail_of(x), x['prompt'], x['promptTokens'], x['lines'], x['chars'], x['codeTokens'], s['meshes'], s['triangles'], s['materials'], s['lights']])

fmt = lambda v: f'{v:,}' if isinstance(v, int) else '待计'
n_batches = max(batch_of(x) for x in r)
tot_code = sum(x['codeTokens'] for x in r)
tot_gen = sum(b['generation'] for b in ledger['batches'])
L = [f'# 3D Object Prompt Set — 累计 {len(r)} 个物体（{n_batches} 批）', '',
     '每个物体 = 一条自然语言 prompt → 一个 three.js 模块（`code/NN_name.js`，导出 `build(THREE)` 返回 `THREE.Group`）。',
     '`viewers/*.html` 双击即可在浏览器打开（从 jsdelivr 加载 three@0.169.0，可拖拽旋转）；`renders/*.png` 为离线渲染截图；`token_log.csv` 为逐物体成本表。', '',
     '## 总览', '',
     '| 批次 | 物体 | 代码行 | 代码 tok | 生成阶段实测 tok | 每物体平均 | 实测/代码 |', '|---|---|---|---|---|---|---|']
for b in ledger['batches']:
    xs = [x for x in r if batch_of(x) == b['batch']]
    ct = sum(x['codeTokens'] for x in xs)
    L.append(f"| {b['batch']} | {b['ids']} | {sum(x['lines'] for x in xs)} | {ct:,} | {b['generation']:,} | {b['generation'] // max(len(xs), 1):,} | {b['generation'] / ct:.2f}× |")
L += [f"| **合计** | {len(r)} | {sum(x['lines'] for x in r)} | **{tot_code:,}** | **{tot_gen:,}** | {tot_gen // len(r):,} | {tot_gen / tot_code:.2f}× |", '',
      '**计量方法**', '',
      '- *代码 tok*：用 `@anthropic-ai/tokenizer`（旧版 Claude 分词器）对最终代码文件计数，属近似值。',
      '- *实测 tok*：每一步前后读取会话剩余 token 计数器做差，包含思考、工具调用包装和代码本身。',
      '- 美元成本 = token × 所用模型单价（输出单价通常远高于输入）。', '']
drows, est = detail_table(r, ledger)
if drows:
    L += ['## 按 prompt 详细程度对比（51 号起）', '',
          '从第 6 批开始，prompt 混合了三种详细程度。*估算实测 tok* = 每组 5 个物体的实测消耗按代码 tok 比例分摊到单个物体。', '',
          '| 详细程度 | 数量 | 平均 prompt tok | 平均代码 tok | 平均代码行 | 平均 mesh | 估算实测 tok/物体 |', '|---|---|---|---|---|---|---|']
    L += [f"| {d['label']} | {d['n']} | {d['prompt']} | {d['code']:,} | {d['lines']} | {d['mesh'] if 'mesh' in d else d['meshes']} | {d['est']:,} |" for d in drows]
    L += ['']
for b in ledger['batches']:
    xs = [x for x in r if batch_of(x) == b['batch']]
    L += [f"## 第 {b['batch']} 批（{b['ids']}）", '', '### 会话 token 账本', '', '| 阶段 | tokens |', '|---|---|']
    L += [f'| {s} | {fmt(v)} |' for s, v in b['steps']]
    L += ['', '### 逐物体', '', '| # | 物体 | 详细程度 | Prompt tok | 代码行 | 代码 tok | Mesh | 三角面 |', '|---|---|---|---|---|---|---|---|']
    L += [f"| {x['id']} | {x['name']} | {LABEL[detail_of(x)]} | {x['promptTokens']} | {x['lines']} | {x['codeTokens']:,} | {x['stats']['meshes']} | {x['stats']['triangles']:,} |" for x in xs]
    L += ['', '### 代码总结', '']
    for x in xs:
        s = x['stats']
        L += [f"#### {x['id']} · {x['name']}", f"> {x['prompt']}", '', summ.get(x['id'], ''), '',
              f"`{x['lines']} 行 · {x['codeTokens']} tok · {s['meshes']} mesh · {s['triangles']:,} 三角面 · {s['materials']} 材质`", '']
extra = os.path.join(here, 'observations.md')
if os.path.exists(extra):
    L += [open(extra).read()]
open(os.path.join(out, 'README.md'), 'w').write('\n'.join(L))

os.makedirs(os.path.dirname(zip_path), exist_ok=True)
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for name in ['README.md', 'token_log.csv', 'results.json']:
        z.write(os.path.join(out, name), name)
    for sub in ['code', 'viewers', 'renders']:
        for fn in sorted(os.listdir(os.path.join(out, sub))):
            if sub == 'renders' and not fn.endswith('.png'):
                continue
            z.write(os.path.join(out, sub, fn), f'{sub}/{fn}')
print('wrote', zip_path, len(r), 'objects')
