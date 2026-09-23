// Prompt 63: "An old key."
export const meta = { id: '63', name: 'Skeleton Key', prompt: 'An old key.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({ color: 0xa8843c, metalness: 1, roughness: 0.4 });
  // Bow: ring with a trefoil of small rings
  const bow = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.07, 12, 40), brass);
  bow.position.x = -1.3;
  root.add(bow);
  for (let k = 0; k < 3; k++) {
    const a = Math.PI + (k - 1) * 0.9;
    const lobe = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 8, 24), brass);
    lobe.position.set(-1.3 + Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0);
    root.add(lobe);
  }
  // Shank with collar rings
  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 16), brass);
  shank.rotation.z = Math.PI / 2;
  shank.position.x = -0.05;
  root.add(shank);
  for (const x of [-0.85, -0.7]) {
    const c = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.025, 8, 20), brass);
    c.rotation.y = Math.PI / 2;
    c.position.x = x;
    root.add(c);
  }
  // Bit: notched plate
  const bit = new THREE.Shape();
  bit.moveTo(0, 0); bit.lineTo(0.45, 0); bit.lineTo(0.45, -0.35); bit.lineTo(0.35, -0.35); bit.lineTo(0.35, -0.2);
  bit.lineTo(0.22, -0.2); bit.lineTo(0.22, -0.4); bit.lineTo(0.1, -0.4); bit.lineTo(0.1, -0.25); bit.lineTo(0, -0.25); bit.closePath();
  const b = new THREE.Mesh(new THREE.ExtrudeGeometry(bit, { depth: 0.06, bevelEnabled: false }), brass);
  b.position.set(0.4, 0.02, -0.03);
  root.add(b);
  root.rotation.x = -1.2;
  root.position.y = 0.3;
  return root;
}
