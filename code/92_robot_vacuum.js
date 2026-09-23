// Prompt 92: "A robot vacuum."
export const meta = { id: '92', name: 'Robot Vacuum', prompt: 'A robot vacuum.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 64), new THREE.MeshPhysicalMaterial({ color: 0x1f2226, roughness: 0.2, clearcoat: 1 }));
  body.position.y = 0.2;
  root.add(body);
  const bumper = new THREE.Mesh(new THREE.CylinderGeometry(1.01, 1.01, 0.12, 64, 1, true, -Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide }));
  bumper.position.y = 0.15;
  root.add(bumper);
  const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 32), new THREE.MeshStandardMaterial({ color: 0x2c3036, roughness: 0.5 }));
  turret.position.set(0, 0.4, -0.35);
  root.add(turret);
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 24), new THREE.MeshStandardMaterial({ color: 0x3ad6ff, emissive: 0x1aa6d6, emissiveIntensity: 1.2 }));
  button.position.set(0, 0.36, 0.25);
  root.add(button);
  // Side brush
  for (let k = 0; k < 3; k++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.01, 0.02), new THREE.MeshStandardMaterial({ color: 0x777777 }));
    b.geometry.translate(0.175, 0, 0);
    b.position.set(0.7, 0.04, 0.55);
    b.rotation.y = (k / 3) * Math.PI * 2;
    root.add(b);
  }
  return root;
}
