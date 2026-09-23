// Prompt 52: "A donut with pink icing and sprinkles."
export const meta = { id: '52', name: 'Iced Donut', prompt: 'A donut with pink icing and sprinkles.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(52);
  const dough = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.36, 24, 48), new THREE.MeshStandardMaterial({ color: 0xd9a066, roughness: 0.8 }));
  dough.rotation.x = Math.PI / 2;
  dough.scale.z = 0.85;
  root.add(dough);
  // Icing: upper half of a slightly larger torus with a wavy lower edge
  const ig = new THREE.TorusGeometry(0.7, 0.375, 24, 96);
  const p = ig.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = Math.atan2(y, x);
    const edge = -0.05 + 0.06 * Math.sin(a * 9);
    if (z < edge) p.setZ(i, edge);   // flatten the underside onto the drip line
  }
  ig.computeVertexNormals();
  const icing = new THREE.Mesh(ig, new THREE.MeshPhysicalMaterial({ color: 0xf28bb3, roughness: 0.3, clearcoat: 0.5 }));
  icing.rotation.x = -Math.PI / 2;
  icing.scale.z = 0.88;
  root.add(icing);
  const sg = new THREE.CapsuleGeometry(0.015, 0.06, 2, 6);
  const cols = [0xffffff, 0xffd93d, 0x4d96ff, 0x6bcb77, 0xff6b6b];
  for (let i = 0; i < 70; i++) {
    const a = rng() * Math.PI * 2, b = rng() * Math.PI * 0.8 - 0.4;
    const s = new THREE.Mesh(sg, new THREE.MeshStandardMaterial({ color: cols[i % 5] }));
    s.position.set(Math.cos(a) * (0.7 + Math.sin(b) * 0.37), Math.cos(b) * 0.33, Math.sin(a) * (0.7 + Math.sin(b) * 0.37));
    s.rotation.set(rng() * 3, rng() * 3, rng() * 3);
    root.add(s);
  }
  root.position.y = 0.32;
  return root;
}
