// Prompt 89: "A bell."
export const meta = { id: '89', name: 'Bronze Bell', prompt: 'A bell.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const bronze = new THREE.MeshStandardMaterial({ color: 0xb5873a, metalness: 1, roughness: 0.3, side: THREE.DoubleSide });
  // Classic bell profile (outer surface) as a lathe, open at the mouth
  const prof = [[0.95, 0], [0.9, 0.08], [0.78, 0.3], [0.62, 0.7], [0.56, 1.1], [0.52, 1.4], [0.4, 1.55], [0.001, 1.6]].map(([x, y]) => new THREE.Vector2(x, y));
  root.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 64), bronze));
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.93, 0.05, 10, 64), bronze);
  lip.rotation.x = Math.PI / 2;
  root.add(lip);
  const crown = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 10, 24), bronze);
  crown.position.y = 1.72;
  root.add(crown);
  const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 14), new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.8, roughness: 0.5 }));
  clapper.position.set(0.12, 0.15, 0);
  root.add(clapper);
  root.position.y = 0.1;
  return root;
}
