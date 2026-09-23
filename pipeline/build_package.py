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

fmt = lambda v: f'{v:,}' if isinstance(v, int) else 'TBD'
n_batches = max(batch_of(x) for x in r)
tot_code = sum(x['codeTokens'] for x in r)
tot_gen = sum(b['generation'] for b in ledger['batches'])
L = [f'# 3D Object Prompt Set — {len(r)} objects total ({n_batches} batches)', '',
     'Each object = one natural-language prompt → one three.js module (`code/NN_name.js`, exporting `build(THREE)` that returns a `THREE.Group`).',
     'Double-click `viewers/*.html` to open in a browser (loads three@0.169.0 from jsdelivr; drag to rotate); `renders/*.png` are offline render screenshots; `token_log.csv` is the per-object cost table.', '',
     '## Overview', '',
     '| Batch | Objects | Code lines | Code tok | Measured generation tok | Avg per object | Measured/code |', '|---|---|---|---|---|---|---|']
for b in ledger['batches']:
    xs = [x for x in r if batch_of(x) == b['batch']]
    ct = sum(x['codeTokens'] for x in xs)
    L.append(f"| {b['batch']} | {b['ids']} | {sum(x['lines'] for x in xs)} | {ct:,} | {b['generation']:,} | {b['generation'] // max(len(xs), 1):,} | {b['generation'] / ct:.2f}× |")
L += [f"| **Total** | {len(r)} | {sum(x['lines'] for x in r)} | **{tot_code:,}** | **{tot_gen:,}** | {tot_gen // len(r):,} | {tot_gen / tot_code:.2f}× |", '',
      '**Methodology**', '',
      '- *Code tok*: counted over the final code files with `@anthropic-ai/tokenizer` (the older Claude tokenizer); approximate.',
      '- *Measured tok*: the difference in the session\'s remaining-token counter before and after each step; includes thinking, tool-call wrapping, and the code itself.',
      '- Dollar cost = tokens × the model\'s unit price (output is usually priced far higher than input).', '']
drows, est = detail_table(r, ledger)
if drows:
    L += ['## Comparison by prompt detail level (from #51)', '',
          'From batch 6 on, prompts mix three detail levels. *Estimated measured tok* = each group of 5 objects\' measured usage, split across individual objects in proportion to code tok.', '',
          '| Detail level | Count | Avg prompt tok | Avg code tok | Avg code lines | Avg mesh | Est. measured tok/object |', '|---|---|---|---|---|---|---|']
    L += [f"| {d['label']} | {d['n']} | {d['prompt']} | {d['code']:,} | {d['lines']} | {d['mesh'] if 'mesh' in d else d['meshes']} | {d['est']:,} |" for d in drows]
    L += ['']
for b in ledger['batches']:
    xs = [x for x in r if batch_of(x) == b['batch']]
    L += [f"## Batch {b['batch']} ({b['ids']})", '', '### Session token ledger', '', '| Stage | tokens |', '|---|---|']
    L += [f'| {s} | {fmt(v)} |' for s, v in b['steps']]
    L += ['', '### Per object', '', '| # | Object | Detail | Prompt tok | Code lines | Code tok | Mesh | Triangles |', '|---|---|---|---|---|---|---|---|']
    L += [f"| {x['id']} | {x['name']} | {LABEL[detail_of(x)]} | {x['promptTokens']} | {x['lines']} | {x['codeTokens']:,} | {x['stats']['meshes']} | {x['stats']['triangles']:,} |" for x in xs]
    L += ['', '### Code summaries', '']
    for x in xs:
        s = x['stats']
        L += [f"#### {x['id']} · {x['name']}", f"> {x['prompt']}", '', summ.get(x['id'], ''), '',
              f"`{x['lines']} lines · {x['codeTokens']} tok · {s['meshes']} mesh · {s['triangles']:,} triangles · {s['materials']} materials`", '']
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
