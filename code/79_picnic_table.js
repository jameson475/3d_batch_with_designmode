// Prompt 79: "A wooden picnic table with attached benches and a checkered tablecloth."
export const meta = { id: '79', name: 'Picnic Table', prompt: 'A wooden picnic table with attached benches and a checkered tablecloth.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0xa87b4f, roughness: 0.85 });
  const L = 2.6;
  // Tabletop planks
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(L, 0.06, 0.17), wood);
    p.position.set(0, 0.95, -0.36 + i * 0.18);
    root.add(p);
  }
  // Bench planks on both sides
  for (const s of [-1, 1]) for (const dz of [0, 0.18]) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(L, 0.05, 0.16), wood);
    b.position.set(0, 0.55, s * (0.8 + dz));
    root.add(b);
  }
  // A-frame legs crossing from bench rails to the top
  for (const x of [-1.0, 1.0]) {
    for (const s of [-1, 1]) {
      const a = new THREE.Vector3(x, 0.92, s * 0.25), b = new THREE.Vector3(x, 0, s * 0.95);
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, a.distanceTo(b), 0.12), wood);
      leg.position.copy(a).lerp(b, 0.5);
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.clone().sub(b).normalize());
      root.add(leg);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.1), wood);
    rail.position.set(x, 0.5, 0);
    root.add(rail);
  }
  // Checkered tablecloth draped slightly over the edges (vertex-colored subdivided plane)
  const cg = new THREE.PlaneGeometry(1.8, 1.1, 36, 22);
  cg.rotateX(-Math.PI / 2);
  const p = cg.attributes.position, cols = [];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const over = Math.max(0, Math.abs(z) - 0.45);
    p.setY(i, -over * 1.8);
    p.setZ(i, Math.sign(z) * Math.min(Math.abs(z), 0.45 + over * 0.3));
    const c = new THREE.Color((Math.floor((x + 0.9) / 0.15) + Math.floor((z + 0.55) / 0.15)) % 2 ? 0xd62828 : 0xffffff);
    cols.push(c.r, c.g, c.b);
  }
  cg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  cg.computeVertexNormals();
  const cloth = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide }));
  cloth.position.y = 0.985;
  cloth.rotation.y = 0.08;
  root.add(cloth);
  return root;
}
