// Prompt 55: "A yellow pencil."
export const meta = { id: '55', name: 'Pencil', prompt: 'A yellow pencil.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const L = 3.2, r = 0.12;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 6), new THREE.MeshStandardMaterial({ color: 0xf6c90e, roughness: 0.5, flatShading: true }));
  root.add(body);
  const wood = new THREE.Mesh(new THREE.ConeGeometry(r, 0.4, 6), new THREE.MeshStandardMaterial({ color: 0xe8c9a0, roughness: 0.8, flatShading: true }));
  wood.position.y = L / 2 + 0.2;
  root.add(wood);
  const lead = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 12), new THREE.MeshStandardMaterial({ color: 0x333333 }));
  lead.position.y = L / 2 + 0.345;
  root.add(lead);
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.05, r * 1.05, 0.25, 24), new THREE.MeshStandardMaterial({ color: 0xc0c4c8, metalness: 1, roughness: 0.3 }));
  ferrule.position.y = -L / 2 - 0.12;
  root.add(ferrule);
  const eraser = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.22, 24), new THREE.MeshStandardMaterial({ color: 0xf28b9b, roughness: 0.9 }));
  eraser.position.y = -L / 2 - 0.35;
  root.add(eraser);
  root.rotation.z = Math.PI / 2 - 0.15;
  root.position.y = 0.4;
  return root;
}
