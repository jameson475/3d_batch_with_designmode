// Prompt 78: "An ice cream cone."
export const meta = { id: '78', name: 'Ice Cream Cone', prompt: 'An ice cream cone.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  // Waffle cone: cone with a diamond grid baked into vertex colors
  const cg = new THREE.ConeGeometry(0.5, 1.8, 48, 24, true);
  const p = cg.attributes.position, cols = [];
  for (let i = 0; i < p.count; i++) {
    const a = Math.atan2(p.getZ(i), p.getX(i)), y = p.getY(i);
    const u = a * 4 + y * 6, v = a * 4 - y * 6;
    const line = Math.min(Math.abs(Math.sin(u * 1.5)), Math.abs(Math.sin(v * 1.5))) < 0.2;
    const c = new THREE.Color(line ? 0xb07a3c : 0xdcaa62); cols.push(c.r, c.g, c.b);
  }
  cg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const cone = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide }));
  cone.rotation.x = Math.PI;
  cone.position.y = 0.9;
  root.add(cone);
  // Two scoops
  const scoop = (color, y, r) => {
    const g = new THREE.SphereGeometry(r, 32, 24);
    const q = g.attributes.position;
    for (let i = 0; i < q.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(q, i); const k = 1 + 0.04 * Math.sin(v.x * 12) * Math.sin(v.z * 11); q.setXYZ(i, v.x * k, v.y * k, v.z * k); }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.6 }));
    m.position.y = y;
    root.add(m);
  };
  scoop(0xf6d6e0, 1.95, 0.52);
  scoop(0x6b3e26, 2.55, 0.45);
  return root;
}
