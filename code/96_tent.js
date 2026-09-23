// Prompt 96: "A camping tent."
export const meta = { id: '96', name: 'Camping Tent', prompt: 'A camping tent.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  // A-frame tent: triangular prism with an open flap
  const tri = new THREE.Shape();
  tri.moveTo(-1, 0); tri.lineTo(1, 0); tri.lineTo(0, 1.3); tri.closePath();
  const door = new THREE.Path();
  door.moveTo(-0.35, 0); door.lineTo(0.35, 0); door.lineTo(0, 0.9); door.closePath();
  tri.holes.push(door);
  const tent = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 2.2, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0xe07a2f, roughness: 0.8, side: THREE.DoubleSide }));
  tent.position.z = -1.1;
  root.add(tent);
  const inside = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.9), new THREE.MeshBasicMaterial({ color: 0x2a1a10 }));
  inside.position.set(0, 0.35, 0.9);
  root.add(inside);
  const flap = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.9, 1.1), new THREE.Vector3(0.35, 0, 1.1), new THREE.Vector3(0.75, 0.1, 1.5)]), new THREE.MeshStandardMaterial({ color: 0xc9621f, side: THREE.DoubleSide }));
  flap.geometry.computeVertexNormals();
  root.add(flap);
  // Guy lines + pegs
  for (const z of [-1.1, 1.1]) {
    const top = new THREE.Vector3(0, 1.3, z), peg = new THREE.Vector3(0, 0, z + Math.sign(z) * 0.8);
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([top, peg]), new THREE.LineBasicMaterial({ color: 0xdddddd })));
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.01, 0.15, 6), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    p.position.copy(peg).setY(0.05);
    root.add(p);
  }
  const ground = new THREE.Mesh(new THREE.CircleGeometry(2.4, 32), new THREE.MeshStandardMaterial({ color: 0x6f8f3f, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  root.add(ground);
  return root;
}
