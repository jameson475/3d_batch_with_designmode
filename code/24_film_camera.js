// Prompt 24: "A vintage 35mm rangefinder film camera with a leatherette body, chrome top plate, a lens barrel with focus ring, dials, and a shutter button."
export const meta = { id: '24', name: 'Rangefinder Camera', prompt: 'A vintage 35mm rangefinder film camera with a leatherette body, chrome top plate, a lens barrel with focus ring, dials, and a shutter button.' };

export function build(THREE) {
  const root = new THREE.Group();
  const chrome = new THREE.MeshStandardMaterial({ color: 0xcfd2d6, metalness: 1, roughness: 0.22 });
  const leather = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.85 });
  const black = new THREE.MeshStandardMaterial({ color: 0x0e0e0e, metalness: 0.4, roughness: 0.4 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x223355, metalness: 0.2, roughness: 0.05, clearcoat: 1 });

  // Body: rounded box (extruded rounded rectangle, top view)
  const w = 1.4, d = 0.36, r = 0.16;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -d / 2); s.lineTo(w / 2 - r, -d / 2); s.absarc(w / 2 - r, 0, d / 2, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(-w / 2 + r, d / 2); s.absarc(-w / 2 + r, 0, d / 2, Math.PI / 2, Math.PI * 1.5, false);
  const mk = (h, mat, y) => {
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 16 }), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.y = y;
    root.add(m);
  };
  mk(0.12, chrome, 0);        // bottom plate
  mk(0.5, leather, 0.12);     // leatherette band
  mk(0.16, chrome, 0.62);     // top plate

  // Rangefinder windows on the top plate front
  for (const [x, wdt] of [[-0.45, 0.2], [0.35, 0.12]]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(wdt, 0.08, 0.01), glass);
    win.position.set(x, 0.7, d / 2 + 0.005);
    root.add(win);
  }

  // Lens: stacked cylinders along +z with a knurled focus ring
  const lens = new THREE.Group();
  lens.position.set(0, 0.38, d / 2);
  root.add(lens);
  const seg = (rTop, len, mat, z, n = 40) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rTop, len, n), mat);
    c.rotation.x = Math.PI / 2;
    c.position.z = z + len / 2;
    lens.add(c);
  };
  seg(0.26, 0.06, chrome, 0);
  seg(0.22, 0.12, black, 0.06);
  seg(0.235, 0.08, chrome, 0.18, 60);
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const k = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.012, 0.08), chrome);
    k.position.set(Math.cos(a) * 0.24, Math.sin(a) * 0.24, 0.22);
    k.rotation.z = a;
    lens.add(k);
  }
  seg(0.2, 0.1, black, 0.26);
  const front = new THREE.Mesh(new THREE.CircleGeometry(0.15, 40), glass);
  front.position.z = 0.361;
  lens.add(front);

  // Top dials + shutter button + rewind crank
  const dial = (x, rr, h) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, h, 32), chrome);
    m.position.set(x, 0.78 + h / 2, 0);
    root.add(m);
    return m;
  };
  dial(0.45, 0.12, 0.08);
  dial(0.45, 0.04, 0.12);
  const btn = dial(0.22, 0.035, 0.05);
  btn.material = black;
  dial(-0.5, 0.11, 0.07);
  const crank = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.03), chrome);
  crank.position.set(-0.45, 0.87, 0);
  root.add(crank);
  // Strap lugs
  for (const x of [-0.72, 0.72]) {
    const lug = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 6, 16), chrome);
    lug.position.set(x, 0.62, 0);
    lug.rotation.y = Math.PI / 2;
    root.add(lug);
  }
  return root;
}
