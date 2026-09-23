// Prompt 71: "A gold star."
export const meta = { id: '71', name: 'Gold Star', prompt: 'A gold star.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i / 10) * Math.PI * 2, r = i % 2 ? 0.45 : 1.1;
    i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  const star = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.12, bevelSegments: 2 }),
    new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 1, roughness: 0.25 }));
  star.position.set(0, 1.2, -0.1);
  star.rotation.y = 0.35;
  root.add(star);
  return root;
}
