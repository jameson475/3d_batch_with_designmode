// Prompt 81: "A cloud."
export const meta = { id: '81', name: 'Puffy Cloud', prompt: 'A cloud.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
  const puffs = [[0, 0, 0, 0.8], [0.8, -0.1, 0.1, 0.6], [-0.8, -0.15, 0, 0.6], [0.35, 0.45, -0.1, 0.55], [-0.35, 0.35, 0.15, 0.5], [1.35, -0.25, 0, 0.4], [-1.3, -0.3, 0.05, 0.38]];
  for (const [x, y, z, r] of puffs) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), mat);
    m.position.set(x, y + 1.2, z);
    root.add(m);
  }
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32), mat);
  base.scale.z = 0.5;
  base.position.y = 0.85;
  root.add(base);
  return root;
}
