"""Writes the Design canvas: Main.dc.html (cumulative overview) + Batch-NN.dc.html (gallery per batch) + canvas.json.
Inputs: out/results.json, summaries.json, ledger.json, blobs.json (asset url ids per object id), observations.md.
Usage: python3 build_canvas.py <createdOnFiles-at>"""
import json, html, os, sys, re
from detail_stats import detail_of, table as detail_table, LABEL

here = os.path.dirname(os.path.abspath(__file__))
r = json.load(open(f'{here}/out/results.json'))
summ = json.load(open(f'{here}/summaries.json'))
ledger = json.load(open(f'{here}/ledger.json'))
blobs = json.load(open(f'{here}/blobs.json'))
obs = [re.sub(r'^- ', '', l).strip() for l in open(f'{here}/observations.md') if l.startswith('- ')]
created = sys.argv[1] if len(sys.argv) > 1 else '2026-09-23T20:39:51Z'
e = html.escape
batch_of = lambda x: (int(x['id']) - 1) // 10 + 1
proj = f'{here}/canvas/project'
os.makedirs(proj, exist_ok=True)

FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&amp;family=IBM+Plex+Sans:wght@400;600&amp;family=IBM+Plex+Mono:wght@400;600&amp;display=swap">'
CSS = "body{margin:0;background:#efece6;font-family:'IBM Plex Sans',system-ui,sans-serif;color:#1d1c1a}.mono{font-family:'IBM Plex Mono',ui-monospace,monospace}a{color:#9a4520}a:hover{color:#6f3116}"
SERIF = "font-family: 'Fraunces', Georgia, serif"
TD = 'padding: 9px 12px; border-bottom: 1px solid #e3ddd2'
TH = 'padding: 10px 12px; border-bottom: 1px solid #d9d3c7; text-align: left'

def page(title, w, h, body):
    return f'''<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<title>{e(title)}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONTS}
<style>{CSS}</style>
</helmet>
<div style="width: {w}px; min-height: {h}px; box-sizing: border-box; padding: 64px 72px 72px; display: flex; flex-direction: column; gap: 40px; background: #efece6">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>'''

def stat(v, label, accent=False):
    c = 'color: #9a4520; ' if accent else ''
    return f'<div style="display: flex; flex-direction: column; gap: 4px"><span class="mono" style="{c}font-size: 40px; font-weight: 600">{v}</span><span style="font-size: 13px; color: #4a463f">{label}</span></div>'

def header(kicker, title, sub, stats):
    return f'''<div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 40px">
<div style="display: flex; flex-direction: column; gap: 12px">
<span class="mono" style="font-size: 13px; letter-spacing: 0.08em; color: #9a4520">{kicker}</span>
<h1 style="margin: 0; {SERIF}; font-size: 60px; font-weight: 500; line-height: 1.02">{title}</h1>
<p style="margin: 0; max-width: 720px; font-size: 16px; line-height: 1.55; color: #4a463f">{sub}</p>
</div>
<div style="display: flex; gap: 32px">{''.join(stats)}</div>
</div>'''

def table(head, rows, right_cols=()):
    th = ''.join(f'<th style="{TH}{"; text-align: right" if i in right_cols else ""}">{h}</th>' for i, h in enumerate(head))
    trs = ''.join('<tr>' + ''.join(f'<td class="{"mono" if i in right_cols else ""}" style="{TD}{"; text-align: right" if i in right_cols else ""}">{c}</td>' for i, c in enumerate(row)) + '</tr>' for row in rows)
    return f'<table style="border-collapse: collapse; font-size: 14px; background: #faf8f4; border: 1px solid #d9d3c7"><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>'

BADGE = {'simple': ('#e3ecdf', '#2f5a2a'), 'medium': ('#efe4cf', '#6b4a12'), 'detailed': ('#f3dcd2', '#8a2f14')}
def badge(x):
    if 'detail' not in x: return ''
    bg, fg = BADGE[x['detail']]
    return f'<span class="mono" style="margin-left: auto; font-size: 11px; padding: 2px 8px; border-radius: 999px; background: {bg}; color: {fg}">{LABEL[x["detail"]]}</span>'

def card(x):
    s = x['stats']
    return f'''<div style="display: flex; flex-direction: column; background: #faf8f4; border: 1px solid #d9d3c7; border-radius: 10px; overflow: hidden">
<img src="/_blob/{blobs[x['id']]}" alt="{e(x['name'])} render" style="width: 100%; height: 232px; object-fit: cover; display: block">
<div style="display: flex; flex-direction: column; gap: 10px; padding: 16px 16px 18px">
<div style="display: flex; align-items: baseline; gap: 8px"><span class="mono" style="font-size: 12px; color: #9a4520">{x['id']}</span><span style="{SERIF}; font-size: 19px; font-weight: 600">{e(x['name'])}</span>{badge(x)}</div>
<p style="margin: 0; font-size: 12.5px; line-height: 1.45; color: #4a463f; font-style: italic">“{e(x['prompt'])}”</p>
<p style="margin: 0; font-size: 12.5px; line-height: 1.5; color: #2b2925">{e(summ.get(x['id'], ''))}</p>
<div class="mono" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 10px; font-size: 11.5px; color: #4a463f; border-top: 1px solid #e3ddd2; padding-top: 10px">
<span>code <b style="color: #1d1c1a">{x['codeTokens']:,} tok</b></span><span>prompt {x['promptTokens']} tok</span>
<span>{x['lines']} lines</span><span>{s['meshes']} mesh</span>
<span>{s['triangles']:,} tris</span><span>{s['materials']} mat</span>
</div></div></div>'''

fmt = lambda v: f'{v:,}' if isinstance(v, int) else 'see README'
boards, order = {}, []
W, BH = 1440, 2080
MH = 1300 + ((len(r) + 9) // 10) * 132 + 30 * max(0, len(ledger['batches']) - 2)
tot_code = sum(x['codeTokens'] for x in r)
tot_gen = sum(b['generation'] for b in ledger['batches'])

# Overview
rows = []
for b in ledger['batches']:
    xs = [x for x in r if batch_of(x) == b['batch']]
    ct = sum(x['codeTokens'] for x in xs)
    rows.append([f"Batch {b['batch']}", b['ids'], str(sum(x['lines'] for x in xs)), f'{ct:,}', f"{b['generation']:,}", f"{b['generation'] // len(xs):,}", f"{b['generation'] / ct:.2f}×"])
rows.append(['<b>Total</b>', str(len(r)), str(sum(x['lines'] for x in r)), f'<b>{tot_code:,}</b>', f'<b>{tot_gen:,}</b>', f'{tot_gen // len(r):,}', f'{tot_gen / tot_code:.2f}×'])
drows, _ = detail_table(r, ledger)
detail_html = ''
if drows:
    detail_html = f'<h2 style="margin: 16px 0 0; {SERIF}; font-size: 28px; font-weight: 500">By prompt detail level (from #51)</h2>' + table(['Detail level', 'Count', 'Avg prompt tok', 'Avg code tok', 'Avg mesh', 'Est. measured tok/object'], [[d['label'], str(d['n']), str(d['prompt']), f"{d['code']:,}", str(d['meshes']), f"<b>{d['est']:,}</b>"] for d in drows], right_cols=(1, 2, 3, 4, 5)) + '<p style="margin: 0; font-size: 13px; line-height: 1.55; color: #4a463f">Estimated measured = the measured usage of each group of 5 objects, split in proportion to code tok.</p>'
thumbs = ''.join(f'<img src="/_blob/{blobs[x["id"]]}" alt="{e(x["name"])}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px; border: 1px solid #d9d3c7; display: block">' for x in r)
obs_html = ''.join(f'<li style="margin-bottom: 8px">{e(o)}</li>' for o in obs)
body = header('OVERVIEW · PROMPT → THREE.JS CODE', '3D Object Prompt Set',
              'Each natural-language prompt generates a purely procedural three.js module, rendered offline, with geometric complexity measured and token cost logged. One board per batch; this page is the cumulative overview.',
              [stat(len(r), 'objects'), stat(len(ledger['batches']), 'batches'), stat(f'{tot_code:,}', 'code tokens'), stat(f'{tot_gen:,}', 'tokens spent generating', True)])
body += f'<div style="display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); gap: 12px">{thumbs}</div>'
body += f'''<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 48px; align-items: start">
<div style="display: flex; flex-direction: column; gap: 14px"><h2 style="margin: 0; {SERIF}; font-size: 28px; font-weight: 500">Cost by batch</h2>
{table(['Batch', 'Objects', 'Code lines', 'Code tok', 'Measured gen tok', 'Per object', 'Measured/code'], rows, right_cols=(2, 3, 4, 5, 6))}
<p style="margin: 0; font-size: 13px; line-height: 1.55; color: #4a463f">Code tok: final code counted with the Claude tokenizer. Measured gen: the difference in the session's remaining tokens before and after each step (includes thinking and tool wrapping).</p>
{detail_html}</div>
<div style="display: flex; flex-direction: column; gap: 14px"><h2 style="margin: 0; {SERIF}; font-size: 28px; font-weight: 500">Cumulative observations</h2>
<ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.55; color: #2b2925">{obs_html}</ul></div>
</div>'''
open(f'{proj}/Main.dc.html', 'w').write(page('3D Object Prompt Set — Overview', W, MH, body))
boards['Main.dc.html'] = {'x': 0, 'y': 0, 'w': W, 'h': MH, 'title': 'Overview — cumulative'}
order.append('Main.dc.html')

# One board per batch
for i, b in enumerate(ledger['batches']):
    xs = [x for x in r if batch_of(x) == b['batch']]
    ct = sum(x['codeTokens'] for x in xs)
    name = f"Batch-{b['batch']:02d}.dc.html"
    body = header(f"BATCH {b['batch']:02d} · OBJECTS {b['ids']}", f"Batch {b['batch']}",
                  f"{len(xs)} objects, generated on {b['date']}. Cards show the prompt, a code summary, and complexity; the batch's session token ledger is at the bottom.",
                  [stat(len(xs), 'objects'), stat(sum(x['lines'] for x in xs), 'lines of code'), stat(f'{ct:,}', 'code tokens'), stat(f"{b['generation']:,}", 'tokens spent generating', True)])
    body += f'<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 20px">{"".join(card(x) for x in xs)}</div>'
    body += f'''<div style="display: flex; flex-direction: column; gap: 14px; max-width: 760px"><h2 style="margin: 0; {SERIF}; font-size: 28px; font-weight: 500">Token ledger (measured in session)</h2>
{table(['Stage', 'tokens'], [[e(s), fmt(v)] for s, v in b['steps']], right_cols=(1,))}</div>'''
    open(f'{proj}/{name}', 'w').write(page(f"3D Objects — Batch {b['batch']}", W, BH, body))
    boards[name] = {'x': (W + 80) * (i % 5 + 1), 'y': (i // 5) * (BH + 200), 'w': W, 'h': BH, 'title': f"Batch {b['batch']} — objects {b['ids']}"}
    order.append(name)

json.dump({'v': 3, 'createdOnFiles': {'v': 1, 'at': created}, 'title': '3D Object Prompt Set', 'launch': {'view': 'canvas'},
           'pages': [], 'boards': boards, 'order': order, 'notes': {}, 'designSystems': []},
          open(f'{proj}/canvas.json', 'w'), ensure_ascii=False)
print(order)
