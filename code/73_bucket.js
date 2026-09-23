// Prompt 73: "A metal bucket."
export const meta = { id: '73', name: 'Galvanized Bucket', prompt: 'A metal bucket.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const zinc = new THREE.MeshStandardMaterial({ color: 0xaab2b8, metalness: 0.9, roughness: 0.45, side: THREE.DoubleSide });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.55, 1.1, 40, 1, true), zinc);
  body.position.y = 0.55;
  root.add(body);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.55, 40), zinc);
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = 0.01;
  root.add(bottom);
  for (const [y, r] of [[1.1, 0.76], [0.75, 0.69], [0.3, 0.61]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.025, 8, 48), zinc);
    ring.rotation.x = Math.PI / 2; ring.position.y = y;
    root.add(ring);
  }
  const bail = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.015, 6, 40, Math.PI), zinc);
  bail.position.y = 1.0;
  bail.rotation.y = 0.4;
  bail.rotation.x = -0.35;
  root.add(bail);
  return root;
}
