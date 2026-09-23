// Prompt 90: "A kite."
export const meta = { id: '90', name: 'Diamond Kite', prompt: 'A kite.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const cols = [0xe63946, 0xf1c40f, 0x2a9d8f, 0x1d3557];
  const top = new THREE.Vector3(0, 2.6, 0), bottom = new THREE.Vector3(0, 0.9, 0), l = new THREE.Vector3(-0.7, 2.1, 0), r = new THREE.Vector3(0.7, 2.1, 0), c = new THREE.Vector3(0, 2.1, 0.08);
  // Four triangular sail panels
  [[top, l], [top, r], [bottom, l], [bottom, r]].forEach(([a, b], i) => {
    const g = new THREE.BufferGeometry().setFromPoints([a, b, c]);
    g.computeVertexNormals();
    root.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: cols[i], roughness: 0.7, side: THREE.DoubleSide })));
  });
  const stick = (a, b) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, a.distanceTo(b), 6), new THREE.MeshStandardMaterial({ color: 0x8a5a2b }));
    m.position.copy(a).lerp(b, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    root.add(m);
  };
  stick(top, bottom); stick(l, r);
  // Tail: wavy string with bows
  const pts = [];
  for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push(new THREE.Vector3(Math.sin(t * 8) * 0.2 * t + t * 0.4, 0.9 - t * 1.6, Math.cos(t * 5) * 0.1)); }
  root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x333333 })));
  for (let k = 1; k < 5; k++) {
    const p = pts[k * 6];
    const bow = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 3), new THREE.MeshStandardMaterial({ color: cols[k % 4] }));
    bow.position.copy(p);
    bow.rotation.z = Math.PI / 2;
    root.add(bow);
  }
  root.rotation.set(-0.15, 0.4, 0.2);
  root.position.y = 0.8;
  return root;
}
