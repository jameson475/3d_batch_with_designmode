// Prompt 53: "A mid-century modern coffee table with a walnut oval top and splayed legs."
export const meta = { id: '53', name: 'Mid-Century Coffee Table', prompt: 'A mid-century modern coffee table with a walnut oval top and splayed legs.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const walnut = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.4 });
  const top = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.07, 64), walnut);
  top.scale.set(1.4, 1, 0.75);
  top.position.y = 0.72;
  root.add(top);
  const edge = new THREE.Mesh(new THREE.TorusGeometry(1, 0.035, 8, 64), walnut);
  edge.rotation.x = Math.PI / 2;
  edge.scale.set(1.4, 0.75, 1);
  edge.position.y = 0.72;
  root.add(edge);
  // Splayed tapered legs: foot pushed outward from the attach point
  for (const [x, z] of [[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]]) {
    const a = new THREE.Vector3(x * 0.8, 0.69, z * 0.8), b = new THREE.Vector3(x * 1.05, 0, z * 1.15);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.025, a.distanceTo(b), 12), walnut);
    leg.position.copy(a).lerp(b, 0.5);
    leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.clone().sub(b).normalize());
    root.add(leg);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.027, 0.04, 12), new THREE.MeshStandardMaterial({ color: 0xc9a44a, metalness: 1, roughness: 0.3 }));
    cap.position.copy(b).setY(0.02);
    root.add(cap);
  }
  return root;
}
