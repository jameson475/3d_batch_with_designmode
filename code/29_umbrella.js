// Prompt 29: "An open umbrella with an eight-panel canopy in alternating colors, visible ribs, a finial tip, and a curved wooden J-handle, tilted as if held."
export const meta = { id: '29', name: 'Open Umbrella', prompt: 'An open umbrella with an eight-panel canopy in alternating colors, visible ribs, a finial tip, and a curved wooden J-handle, tilted as if held.' };

export function build(THREE) {
  const root = new THREE.Group();
  const cols = [0x2b4c7e, 0xf2c14e];
  const rib = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.4 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.5 });
  const panels = 8, R = 1.4, H = 0.55;

  // Canopy height profile: sagging between ribs (scalloped) — each panel is its own BufferGeometry
  const height = (r) => H * (1 - Math.pow(r / R, 1.6));
  for (let p = 0; p < panels; p++) {
    const a0 = (p / panels) * Math.PI * 2, a1 = ((p + 1) / panels) * Math.PI * 2;
    const pos = [], idx = [];
    const nr = 10, na = 8;
    for (let i = 0; i <= nr; i++) {
      const r = (i / nr) * R;
      for (let j = 0; j <= na; j++) {
        const t = j / na, a = a0 + (a1 - a0) * t;
        const sag = 0.12 * Math.sin(Math.PI * t) * (r / R);  // fabric droops between ribs
        pos.push(Math.cos(a) * r, height(r) - sag, Math.sin(a) * r);
      }
    }
    for (let i = 0; i < nr; i++) for (let j = 0; j < na; j++) {
      const a = i * (na + 1) + j, b = a + na + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    root.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: cols[p % 2], roughness: 0.7, side: THREE.DoubleSide })));

    // Rib along the panel edge + stretcher back to the runner
    const pts = [];
    for (let i = 0; i <= 12; i++) { const r = (i / 12) * R; pts.push(new THREE.Vector3(Math.cos(a0) * r, height(r) - 0.01, Math.sin(a0) * r)); }
    root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.008, 4), rib));
    const mid = new THREE.Vector3(Math.cos(a0) * R * 0.5, height(R * 0.5) - 0.02, Math.sin(a0) * R * 0.5);
    const runner = new THREE.Vector3(0, -0.6, 0);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, mid.distanceTo(runner), 4), rib);
    st.position.copy(mid).lerp(runner, 0.5);
    st.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), mid.clone().sub(runner).normalize());
    root.add(st);
    // tip cap
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), rib);
    tip.position.set(Math.cos(a0) * R, height(R) - 0.01, Math.sin(a0) * R);
    root.add(tip);
  }

  // Shaft, finial, runner, J-handle
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.1, 8), rib);
  shaft.position.y = -0.45;
  root.add(shaft);
  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.2, 12), rib);
  finial.position.y = H + 0.12;
  root.add(finial);
  const runnerM = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.1, 12), rib);
  runnerM.position.y = -0.6;
  root.add(runnerM);
  const jPts = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    if (t < 0.5) jPts.push(new THREE.Vector3(0, -1.5 - t * 0.5, 0));
    else { const a = ((t - 0.5) / 0.5) * Math.PI; jPts.push(new THREE.Vector3(0.14 - Math.cos(a) * 0.14, -1.75 - Math.sin(a) * 0.14, 0)); }
  }
  root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(jPts), 30, 0.035, 10), wood));

  root.rotation.z = 0.25;
  root.position.y = 1.9;
  return root;
}
