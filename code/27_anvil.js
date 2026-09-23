// Prompt 27: "A blacksmith's anvil with a tapered horn, a flat face with a hardy hole, a waisted body, mounted on a tree-stump block with a hammer resting on it."
export const meta = { id: '27', name: 'Anvil on Stump', prompt: "A blacksmith's anvil with a tapered horn, a flat face with a hardy hole, a waisted body, mounted on a tree-stump block with a hammer resting on it." };

export function build(THREE) {
  const root = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0x3a3c40, metalness: 0.85, roughness: 0.4 });
  const face = new THREE.MeshStandardMaterial({ color: 0x8d9096, metalness: 1, roughness: 0.2 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a5534, roughness: 0.95 });
  const endGrain = new THREE.MeshStandardMaterial({ color: 0xc8a676, roughness: 0.9 });

  // Stump (slightly irregular cylinder) + end-grain rings
  const stumpGeo = new THREE.CylinderGeometry(0.7, 0.78, 1.0, 24, 4);
  const sp = stumpGeo.attributes.position;
  for (let i = 0; i < sp.count; i++) {
    const a = Math.atan2(sp.getZ(i), sp.getX(i));
    const k = 1 + 0.04 * Math.sin(a * 5) + 0.03 * Math.sin(a * 11);
    sp.setX(i, sp.getX(i) * k); sp.setZ(i, sp.getZ(i) * k);
  }
  stumpGeo.computeVertexNormals();
  const stump = new THREE.Mesh(stumpGeo, wood);
  stump.position.y = 0.5;
  root.add(stump);
  for (let r = 0.15; r < 0.7; r += 0.15) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.012, 40), endGrain);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 1.001;
    root.add(ring);
  }

  // Anvil side profile (XY), extruded along Z
  const s = new THREE.Shape();
  s.moveTo(-0.45, 0);            // foot
  s.lineTo(0.45, 0);
  s.lineTo(0.4, 0.1);
  s.quadraticCurveTo(0.2, 0.18, 0.2, 0.32);   // waist
  s.lineTo(0.55, 0.42);
  s.lineTo(0.62, 0.62);          // heel
  s.lineTo(-0.5, 0.62);          // face top
  s.quadraticCurveTo(-1.05, 0.62, -1.15, 0.56); // horn top
  s.quadraticCurveTo(-0.8, 0.44, -0.4, 0.42);   // horn underside
  s.quadraticCurveTo(-0.2, 0.2, -0.4, 0.1);
  s.lineTo(-0.45, 0);
  const anvilGeo = new THREE.ExtrudeGeometry(s, { depth: 0.36, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, curveSegments: 16 });
  anvilGeo.translate(0, 0, -0.18);
  const anvil = new THREE.Mesh(anvilGeo, steel);
  anvil.position.y = 1.0;
  root.add(anvil);
  // Polished face plate + hardy / pritchel holes
  const plate = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.015, 0.36), face);
  plate.position.set(0.06, 1.63, 0);
  root.add(plate);
  const hardy = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, 0.07), new THREE.MeshStandardMaterial({ color: 0x000000 }));
  hardy.position.set(0.45, 1.635, 0);
  root.add(hardy);
  const pritchel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12), hardy.material);
  pritchel.position.set(0.3, 1.635, 0);
  root.add(pritchel);

  // Hammer lying across the face
  const hammer = new THREE.Group();
  hammer.position.set(0.05, 1.7, 0.02);
  hammer.rotation.y = 0.6;
  root.add(hammer);
  const headM = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.34), steel);
  hammer.add(headM);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.9, 12), new THREE.MeshStandardMaterial({ color: 0xa87a4a, roughness: 0.7 }));
  handle.rotation.z = Math.PI / 2;
  handle.position.x = 0.5;
  hammer.add(handle);
  return root;
}
