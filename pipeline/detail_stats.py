"""Shared helper: prompt-detail level per object and allocation of measured group tokens to objects (∝ code tokens)."""
LABEL = {'simple': '简单', 'medium': '中等', 'detailed': '详细'}

def detail_of(x):
    return x.get('detail') or 'detailed'   # objects 01-50 predate the tag; all used detailed prompts

def allocate(r, ledger):
    est = {}
    for rng, tok in ledger.get('groups', {}).items():
        lo, hi = map(int, rng.split('-'))
        xs = [x for x in r if lo <= int(x['id']) <= hi]
        tot = sum(x['codeTokens'] for x in xs)
        for x in xs:
            est[x['id']] = round(tok * x['codeTokens'] / tot)
    return est

def table(r, ledger):
    est = allocate(r, ledger)
    rows = []
    for d in ['simple', 'medium', 'detailed']:
        xs = [x for x in r if int(x['id']) > 50 and detail_of(x) == d]
        if not xs: continue
        n = len(xs)
        rows.append({'detail': d, 'label': LABEL[d], 'n': n,
                     'prompt': round(sum(x['promptTokens'] for x in xs) / n),
                     'code': round(sum(x['codeTokens'] for x in xs) / n),
                     'lines': round(sum(x['lines'] for x in xs) / n),
                     'meshes': round(sum(x['stats']['meshes'] for x in xs) / n),
                     'est': round(sum(est.get(x['id'], 0) for x in xs) / n)})
    return rows, est
