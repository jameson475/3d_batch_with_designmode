// Prompt 99: "A pumpkin."
export const meta = { id: '99', name: 'Pumpkin', prompt: 'A pumpkin.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  // Squashed sphere with deep ribs: radius modulated by |cos(5a)| and pinched at the poles
  const g = new THREE.SphereGeometry(1, 64, 40);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = Math.atan2(z, x);
    const rib = 1 - 0.08 * Math.pow(Math.abs(Math.sin(a * 5)), 0.6);
    const k = rib * (1 - 0.25 * Math.pow(Math.abs(y), 3));
    p.setXYZ(i, x * k * 1.15, y * 0.75, z * k * 1.15);
  }
  g.computeVertexNormals();
  const pumpkin = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0xe8741e, roughness: 0.55 }));
  pumpkin.position.y = 0.72;
  root.add(pumpkin);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.4, 6), new THREE.MeshStandardMaterial({ color: 0x5b6b2a, roughness: 0.9, flatShading: true }));
  stem.position.set(0.02, 1.5, 0);
  stem.rotation.z = -0.25;
  root.add(stem);
  return root;
}
