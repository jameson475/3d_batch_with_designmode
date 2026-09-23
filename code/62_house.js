// Prompt 62: "A small house."
export const meta = { id: '62', name: 'Small House', prompt: 'A small house.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const wall = new THREE.MeshStandardMaterial({ color: 0xf1e3c6, roughness: 0.9 });
  const roofM = new THREE.MeshStandardMaterial({ color: 0x9e3b2e, roughness: 0.8 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x3e5a7a, roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(2, 1.3, 1.6), wall);
  body.position.y = 0.65;
  root.add(body);
  // Gable roof: triangular prism
  const tri = new THREE.Shape();
  tri.moveTo(-1.15, 0); tri.lineTo(1.15, 0); tri.lineTo(0, 0.9); tri.closePath();
  const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 1.8, bevelEnabled: false }), roofM);
  roof.position.set(0, 1.3, -0.9);
  root.add(roof);
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.6, 0.22), new THREE.MeshStandardMaterial({ color: 0x8a4b3a }));
  chimney.position.set(0.55, 1.9, -0.3);
  root.add(chimney);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.7, 0.04), trim);
  door.position.set(0, 0.35, 0.81);
  root.add(door);
  for (const x of [-0.6, 0.6]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.04), new THREE.MeshStandardMaterial({ color: 0xbfe0f2, roughness: 0.1 }));
    win.position.set(x, 0.8, 0.81);
    root.add(win);
    const sill = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.08), trim);
    sill.position.set(x, 0.6, 0.83);
    root.add(sill);
  }
  return root;
}
