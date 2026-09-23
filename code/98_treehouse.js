// Prompt 98: "A treehouse built into a large oak: a thick trunk with branching limbs and leafy canopy clusters, a plank platform with railings resting on the branches, a small cabin with a shingled roof and a window, a rope ladder hanging to the ground, and a tire swing on another branch."
export const meta = { id: '98', name: 'Oak Treehouse', prompt: 'A treehouse built into a large oak: a thick trunk with branching limbs and leafy canopy clusters, a plank platform with railings resting on the branches, a small cabin with a shingled roof and a window, a rope ladder hanging to the ground, and a tire swing on another branch.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a3e2b, roughness: 1 });
  const plank = new THREE.MeshStandardMaterial({ color: 0xb08050, roughness: 0.85 });
  const rope = new THREE.MeshStandardMaterial({ color: 0xc8b07a, roughness: 1 });
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(98);
  const limb = (a, b, r0, r1) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, a.distanceTo(b), 10), bark);
    m.position.copy(a).lerp(b, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    root.add(m);
  };
  // Trunk with flared roots
  limb(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.05, 2.2, 0), 0.5, 0.35);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    limb(new THREE.Vector3(Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7), new THREE.Vector3(Math.cos(a) * 0.2, 0.5, Math.sin(a) * 0.2), 0.08, 0.2);
  }
  // Main limbs fanning out above the platform
  const tips = [];
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + 0.3;
    const start = new THREE.Vector3(0.05, 2.0 + (k % 2) * 0.4, 0);
    const end = new THREE.Vector3(Math.cos(a) * (1.4 + rng() * 0.5), 3.4 + rng() * 0.8, Math.sin(a) * (1.4 + rng() * 0.5));
    limb(start, end, 0.2, 0.08);
    tips.push(end);
  }
  limb(new THREE.Vector3(0.05, 2.2, 0), new THREE.Vector3(0.1, 4.2, 0.1), 0.3, 0.12);
  tips.push(new THREE.Vector3(0.1, 4.3, 0.1));
  // Canopy clusters at limb tips
  for (const t of tips) for (let i = 0; i < 4; i++) {
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 + rng() * 0.3, 1), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.26 + rng() * 0.05, 0.45, 0.3 + rng() * 0.08), roughness: 0.9, flatShading: true }));
    c.position.copy(t).add(new THREE.Vector3((rng() - 0.5) * 0.8, (rng() - 0.2) * 0.5, (rng() - 0.5) * 0.8));
    root.add(c);
  }
  // Platform around the trunk at y=2.0 + railings
  const PY = 2.0, PS = 2.2;
  for (let i = 0; i < 11; i++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(PS, 0.06, 0.18), plank);
    p.position.set(0.3, PY, -PS / 2 + 0.1 + i * 0.2);
    root.add(p);
  }
  for (const [x, z, w, d] of [[0.3, -PS / 2, PS, 0.05], [0.3 + PS / 2, 0, 0.05, PS], [0.3, PS / 2, PS * 0.55, 0.05]]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), plank);
    rail.position.set(z === PS / 2 ? 0.3 + PS * 0.22 : x, PY + 0.5, z);
    root.add(rail);
  }
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    for (const [x, z] of [[0.3 - PS / 2 + t * PS, -PS / 2], [0.3 + PS / 2, -PS / 2 + t * PS]]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.05), plank);
      post.position.set(x, PY + 0.25, z);
      root.add(post);
    }
  }
  // Cabin on the platform: walls, window, shingle roof
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 1.0), new THREE.MeshStandardMaterial({ color: 0x9b6a3c, roughness: 0.9 }));
  cab.position.set(0.8, PY + 0.48, -0.45);
  root.add(cab);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshStandardMaterial({ color: 0xffe0a0, emissive: 0xffb040, emissiveIntensity: 0.6 }));
  win.position.set(0.8, PY + 0.55, 0.051);
  root.add(win);
  for (const s of [-1, 1]) for (let r = 0; r < 4; r++) {
    const sh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.2), new THREE.MeshStandardMaterial({ color: 0x7a3b2a, roughness: 0.9 }));
    sh.position.set(0.8, PY + 1.3 - r * 0.12, -0.45 + s * (0.1 + r * 0.16));
    sh.rotation.x = s * 0.65;
    root.add(sh);
  }
  // Rope ladder from the platform edge to the ground
  for (const z of [0.55, 0.85]) {
    root.add(new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, PY, 6), rope).translateX(-0.8).translateY(PY / 2).translateZ(z));
  }
  for (let y = 0.25; y < PY; y += 0.25) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.34, 8), plank);
    rung.rotation.x = Math.PI / 2;
    rung.position.set(-0.8, y, 0.7);
    root.add(rung);
  }
  // Tire swing hanging from a low limb
  limb(new THREE.Vector3(0, 1.6, 0), new THREE.Vector3(-1.7, 2.3, -0.8), 0.14, 0.07);
  root.add(new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.55, 6), rope).translateX(-1.35).translateY(1.35).translateZ(-0.63));
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.1, 12, 24), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 }));
  tire.position.set(-1.35, 0.5, -0.63);
  root.add(tire);
  return root;
}
