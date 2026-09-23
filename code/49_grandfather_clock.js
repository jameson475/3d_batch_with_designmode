// Prompt 49: "A tall mahogany grandfather clock with an arched hood, a clock face with Roman-numeral ticks and hands, a glass-front trunk showing a brass pendulum and weights, and a plinth base."
export const meta = { id: '49', name: 'Grandfather Clock', prompt: 'A tall mahogany grandfather clock with an arched hood, a clock face with Roman-numeral ticks and hands, a glass-front trunk showing a brass pendulum and weights, and a plinth base.' };

export function build(THREE) {
  const root = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x5a2415, roughness: 0.45 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xcfa648, metalness: 1, roughness: 0.25 });
  const dial = new THREE.MeshStandardMaterial({ color: 0xf3ecd9, roughness: 0.6 });
  const ink = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 0.9, transparent: true, opacity: 0.2 });
  const box = (w, h, d, x, y, z, m = wood) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); root.add(b); return b; };

  // Plinth + trunk (hollow front) + hood
  box(0.9, 0.12, 0.55, 0, 0.06, 0);
  box(0.8, 0.6, 0.5, 0, 0.42, 0);
  box(0.86, 0.06, 0.53, 0, 0.75, 0);
  const trunkH = 1.6, ty = 0.78;
  box(0.62, trunkH, 0.04, 0, ty + trunkH / 2, -0.21);                 // back
  for (const s of [-1, 1]) box(0.06, trunkH, 0.44, s * 0.28, ty + trunkH / 2, 0);  // sides
  box(0.62, 0.08, 0.46, 0, ty + trunkH - 0.04, 0);
  const door = box(0.5, 1.3, 0.01, 0, ty + 0.72, 0.22, glass);
  for (const [w, h, x, y] of [[0.5, 0.05, 0, ty + 0.07], [0.5, 0.05, 0, ty + 1.37], [0.05, 1.3, -0.25, ty + 0.72], [0.05, 1.3, 0.25, ty + 0.72]]) box(w, h, 0.03, x, y, 0.22);

  // Pendulum + weights visible through the glass
  const pivotY = ty + trunkH - 0.15;
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.05, 6), brass);
  const pend = new THREE.Group();
  pend.position.set(0, pivotY, 0.02);
  pend.rotation.z = 0.12;
  root.add(pend);
  rod.position.y = -0.52;
  pend.add(rod);
  const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 32), brass);
  bob.rotation.x = Math.PI / 2;
  bob.position.y = -1.05;
  pend.add(bob);
  for (const [x, h] of [[-0.14, 0.4], [0, 0.25], [0.14, 0.55]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.26, 16), brass);
    w.position.set(x, ty + trunkH - h - 0.2, -0.1);
    root.add(w);
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, h, 4), brass);
    chain.position.set(x, ty + trunkH - h / 2 - 0.05, -0.1);
    root.add(chain);
  }

  // Hood: box with an arched top (extruded shape)
  const hy = ty + trunkH;
  const hood = new THREE.Shape();
  hood.moveTo(-0.38, 0); hood.lineTo(0.38, 0); hood.lineTo(0.38, 0.55);
  hood.absarc(0, 0.55, 0.38, 0, Math.PI, false); hood.closePath();
  const hoodGeo = new THREE.ExtrudeGeometry(hood, { depth: 0.52, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, curveSegments: 32 });
  hoodGeo.translate(0, 0, -0.26);
  const hoodM = new THREE.Mesh(hoodGeo, wood);
  hoodM.position.y = hy;
  root.add(hoodM);
  // Finials
  for (const x of [-0.36, 0, 0.36]) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), brass);
    f.position.set(x, hy + (x === 0 ? 0.96 : 0.6), 0);
    root.add(f);
  }

  // Dial: face, chapter ring ticks, hands
  const cy = hy + 0.45, cz = 0.285;
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.28, 48), dial);
  face.position.set(0, cy, cz);
  root.add(face);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.015, 8, 48), brass);
  bezel.position.set(0, cy, cz);
  root.add(bezel);
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, major = i % 5 === 0;
    const t = new THREE.Mesh(new THREE.PlaneGeometry(major ? 0.018 : 0.006, major ? 0.05 : 0.02), ink);
    t.position.set(Math.sin(a) * 0.24, cy + Math.cos(a) * 0.24, cz + 0.002);
    t.rotation.z = -a;
    root.add(t);
  }
  const hand = (len, w, ang) => {
    const h = new THREE.Mesh(new THREE.PlaneGeometry(w, len), ink);
    h.geometry.translate(0, len / 2, 0);
    h.position.set(0, cy, cz + 0.004);
    h.rotation.z = -ang;
    root.add(h);
  };
  hand(0.14, 0.018, (10 / 12) * Math.PI * 2 + 0.1);   // ~10:10
  hand(0.21, 0.01, (2 / 12) * Math.PI * 2);
  const cap = new THREE.Mesh(new THREE.CircleGeometry(0.015, 16), brass);
  cap.position.set(0, cy, cz + 0.006);
  root.add(cap);
  return root;
}
