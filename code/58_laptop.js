// Prompt 58: "An open laptop with a keyboard, trackpad, and a glowing screen."
export const meta = { id: '58', name: 'Open Laptop', prompt: 'An open laptop with a keyboard, trackpad, and a glowing screen.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const alu = new THREE.MeshStandardMaterial({ color: 0xb9bcc2, metalness: 0.9, roughness: 0.3 });
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x222326, roughness: 0.6 });
  const W = 2.4, D = 1.6;
  const base = new THREE.Mesh(new THREE.BoxGeometry(W, 0.08, D), alu);
  base.position.y = 0.04;
  root.add(base);
  // Keyboard: 5 rows x 14 keys, plus spacebar
  const kw = 0.13, gap = 0.02;
  const keyGeo = new THREE.BoxGeometry(kw, 0.02, kw);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) {
    const k = new THREE.Mesh(keyGeo, keyMat);
    k.position.set(-((14 * (kw + gap)) / 2) + (kw + gap) * (c + 0.5), 0.09, -0.62 + r * (kw + gap));
    root.add(k);
  }
  const space = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, kw), keyMat);
  space.position.set(0, 0.09, -0.62 + 5 * (kw + gap));
  root.add(space);
  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.005, 0.45), new THREE.MeshStandardMaterial({ color: 0xa6a9ae, metalness: 0.6, roughness: 0.2 }));
  pad.position.set(0, 0.082, 0.5);
  root.add(pad);
  // Lid hinged at the back edge, opened ~105°
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.08, -D / 2);
  hinge.rotation.x = -0.28;
  root.add(hinge);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(W, D, 0.05), alu);
  lid.position.set(0, D / 2, -0.025);
  hinge.add(lid);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.1, D - 0.1), new THREE.MeshStandardMaterial({ color: 0x0c0c0e }));
  bezel.position.set(0, D / 2, 0.001);
  hinge.add(bezel);
  // Screen with a simple gradient "wallpaper" via vertex colors
  const sg = new THREE.PlaneGeometry(W - 0.25, D - 0.3, 1, 8);
  const cols = [], p = sg.attributes.position;
  for (let i = 0; i < p.count; i++) { const t = (p.getY(i) + (D - 0.3) / 2) / (D - 0.3); const c = new THREE.Color(0x1e3c72).lerp(new THREE.Color(0x7fd3e8), t); cols.push(c.r, c.g, c.b); }
  sg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const screen = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ vertexColors: true }));
  screen.position.set(0, D / 2 + 0.03, 0.003);
  hinge.add(screen);
  return root;
}
