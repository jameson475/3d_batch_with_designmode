// Prompt 54: "A rubber duck."
export const meta = { id: '54', name: 'Rubber Duck', prompt: 'A rubber duck.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const yellow = new THREE.MeshPhysicalMaterial({ color: 0xffd23f, roughness: 0.3, clearcoat: 0.6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 24), yellow);
  body.scale.set(1.25, 0.8, 0.95);
  body.position.y = 0.55;
  root.add(body);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.45, 20), yellow);
  tail.rotation.z = 1.1;
  tail.position.set(-0.85, 0.85, 0);
  root.add(tail);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 24), yellow);
  head.position.set(0.45, 1.3, 0);
  root.add(head);
  const beak = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 12), new THREE.MeshPhysicalMaterial({ color: 0xff7f11, roughness: 0.3, clearcoat: 0.6 }));
  beak.scale.set(1.3, 0.45, 0.9);
  beak.position.set(0.9, 1.22, 0);
  root.add(beak);
  for (const z of [-0.2, 0.2]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }));
    eye.position.set(0.78, 1.42, z);
    root.add(eye);
  }
  const wing = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 12), yellow);
  wing.scale.set(1.2, 0.5, 0.3);
  wing.position.set(-0.1, 0.7, 0.62);
  root.add(wing);
  return root;
}
