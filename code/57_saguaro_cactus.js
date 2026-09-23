// Prompt 57: "A saguaro cactus with two arms in a clay pot, with ribbed stems and spines."
export const meta = { id: '57', name: 'Potted Saguaro', prompt: 'A saguaro cactus with two arms in a clay pot, with ribbed stems and spines.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const green = new THREE.MeshStandardMaterial({ color: 0x4f8a4a, roughness: 0.7 });
  const spineMat = new THREE.MeshBasicMaterial({ color: 0xf2ead0 });
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.42, 0.7, 32), new THREE.MeshStandardMaterial({ color: 0xc46a42, roughness: 0.9 }));
  pot.position.y = 0.35;
  root.add(pot);
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.52, 32), new THREE.MeshStandardMaterial({ color: 0xcdb58a, roughness: 1 }));
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 0.68;
  root.add(soil);

  // Ribbed stem: capsule with radius modulated by cos(8a), plus spines on rib crests
  const ribbed = (r, h) => {
    const g = new THREE.CapsuleGeometry(r, h, 8, 32);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const a = Math.atan2(p.getZ(i), p.getX(i)), k = 1 + 0.08 * Math.cos(a * 8);
      p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k);
    }
    g.computeVertexNormals();
    const m = new THREE.Group();
    m.add(new THREE.Mesh(g, green));
    for (let j = 0; j < 8; j++) for (let y = -h / 2; y <= h / 2; y += 0.18) {
      const a = (j / 8) * Math.PI * 2;
      const s = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.07, 3), spineMat);
      s.position.set(Math.cos(a) * r * 1.1, y, Math.sin(a) * r * 1.1);
      s.rotation.z = -Math.PI / 2; s.rotation.y = -a;
      m.add(s);
    }
    return m;
  };
  const trunk = ribbed(0.22, 1.8);
  trunk.position.y = 0.68 + 1.1;
  root.add(trunk);
  for (const [s, y, h] of [[1, 1.4, 0.7], [-1, 1.8, 0.5]]) {
    const elbow = ribbed(0.13, 0.35);
    elbow.rotation.z = s * -Math.PI / 2;
    elbow.position.set(s * 0.35, y, 0);
    root.add(elbow);
    const arm = ribbed(0.14, h);
    arm.position.set(s * 0.55, y + h / 2 + 0.05, 0);
    root.add(arm);
  }
  return root;
}
