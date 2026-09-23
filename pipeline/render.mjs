// Renders each object to PNG, collects geometry stats + token counts, writes standalone HTML viewers.
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { countTokens } = require('@anthropic-ai/tokenizer');

const dir = path.dirname(new URL(import.meta.url).pathname);
const objDir = path.join(dir, 'objects');
const out = path.join(dir, 'out');
fs.mkdirSync(path.join(out, 'renders'), { recursive: true });
fs.mkdirSync(path.join(out, 'viewers'), { recursive: true });

// Optional: `node render.mjs 51 60` renders only ids 51..60 and merges into results.json
const [lo, hi] = process.argv.slice(2).map(Number);
const files = fs.readdirSync(objDir).filter(f => f.endsWith('.js')).filter(f => !lo || (parseInt(f) >= lo && parseInt(f) <= (hi || lo))).sort((a, b) => parseInt(a) - parseInt(b));

const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': p.endsWith('.js') || p.endsWith('.mjs') ? 'text/javascript' : 'text/html' });
  fs.createReadStream(p).pipe(res);
}).listen(8765);

const page_html = (file) => `<!doctype html><html><body style="margin:0;background:#efece6">
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { build } from '/objects/${file}';
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
r.setSize(640, 640); r.setPixelRatio(1);
r.toneMapping = THREE.ACESFilmicToneMapping; r.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(r.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xefece6);
const pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.6;
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7f70, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(4, 7, 5); scene.add(sun);
const obj = build(THREE); scene.add(obj);
const box = new THREE.Box3().setFromObject(obj); const size = box.getSize(new THREE.Vector3()); const c = box.getCenter(new THREE.Vector3());
const rad = size.length() / 2;
const cam = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
cam.position.copy(c).add(new THREE.Vector3(1, 0.55, 1.25).normalize().multiplyScalar(rad / Math.sin(Math.PI * 35 / 360) * 1.05));
cam.lookAt(c);
r.render(scene, cam);
let meshes = 0, tris = 0, lights = 0; const mats = new Set(), geos = new Set();
obj.traverse(o => {
  if (o.isLight) lights++;
  if (o.isMesh) { meshes++; mats.add(o.material.uuid); geos.add(o.geometry.uuid);
    const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; }
});
window.__stats = { meshes, triangles: Math.round(tris), materials: mats.size, uniqueGeometries: geos.size, lights,
  bbox: [size.x, size.y, size.z].map(v => +v.toFixed(2)) };
</script></body></html>`;

const viewer_html = (src, meta) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${meta.name}</title>
<style>html,body{margin:0;height:100%;background:#efece6;font-family:system-ui,sans-serif}
#cap{position:fixed;left:16px;bottom:16px;max-width:520px;color:#333;font-size:14px}</style></head>
<body><div id="cap"><b>${meta.id} · ${meta.name}</b><br>${meta.prompt}</div>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
${src.replace(/export /g, '')}
const r = new THREE.WebGLRenderer({ antialias: true });
r.setPixelRatio(devicePixelRatio); r.setSize(innerWidth, innerHeight);
r.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(r.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xefece6);
const pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.6;
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7f70, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(4, 7, 5); scene.add(sun);
const obj = build(THREE); scene.add(obj);
const box = new THREE.Box3().setFromObject(obj), c = box.getCenter(new THREE.Vector3()), rad = box.getSize(new THREE.Vector3()).length() / 2;
const cam = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.01, 100);
cam.position.copy(c).add(new THREE.Vector3(1, 0.55, 1.25).normalize().multiplyScalar(rad * 3.4));
const ctl = new OrbitControls(cam, r.domElement); ctl.target.copy(c); ctl.autoRotate = true; ctl.update();
addEventListener('resize', () => { cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); r.setSize(innerWidth, innerHeight); });
r.setAnimationLoop(() => { ctl.update(); r.render(scene, cam); });
</script></body></html>`;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 640, height: 640 } });
const results = [];
for (const f of files) {
  fs.writeFileSync(path.join(dir, '_p.html'), page_html(f));
  const errs = [];
  page.removeAllListeners('pageerror');
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto('http://localhost:8765/_p.html?' + f);
  await page.waitForFunction(() => window.__stats, null, { timeout: 20000 }).catch(() => {});
  const stats = await page.evaluate(() => window.__stats || null);
  const png = path.join(out, 'renders', f.replace('.js', '.png'));
  await page.locator('canvas').screenshot({ path: png }).catch(() => {});
  const src = fs.readFileSync(path.join(objDir, f), 'utf8');
  const mod = await import(path.join(objDir, f));
  fs.writeFileSync(path.join(out, 'viewers', f.replace('.js', '.html')), viewer_html(src, mod.meta));
  results.push({ file: f, ...mod.meta, lines: src.split('\n').length, chars: src.length,
    codeTokens: countTokens(src), promptTokens: countTokens(mod.meta.prompt), stats, errors: errs });
  console.log(f, JSON.stringify(stats), errs.length ? errs : '');
}
const prev = lo && fs.existsSync(path.join(out, 'results.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'results.json'))) : [];
const merged = [...prev.filter(p => !results.some(x => x.id === p.id)), ...results].sort((a, b) => +a.id - +b.id);
fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(merged, null, 2));
await browser.close(); server.close();
