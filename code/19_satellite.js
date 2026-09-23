// Prompt 19: "A communications satellite with a gold-foil bus, two deployable solar panel wings, a parabolic dish antenna, and thruster nozzles."
export const meta = { id: '19', name: 'Comms Satellite', prompt: 'A communications satellite with a gold-foil bus, two deployable solar panel wings, a parabolic dish antenna, and thruster nozzles.' };

export function build(THREE) {
  const root = new THREE.Group();
  const foil = new THREE.MeshStandardMaterial({ color: 0xd4a73a, metalness: 1, roughness: 0.35, flatShading: true });
  const white = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.5 });
  const cell = new THREE.MeshStandardMaterial({ color: 0x1b2f6b, metalness: 0.4, roughness: 0.3 });
  const frame = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 0.8, roughness: 0.3 });

  // Bus: box with slightly crumpled foil (vertex jitter on a subdivided box)
  const busGeo = new THREE.BoxGeometry(1.0, 1.2, 1.0, 6, 6, 6);
  const p = busGeo.attributes.position;
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(3);
  for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * (1 + (rng() - 0.5) * 0.03), p.getY(i), p.getZ(i) * (1 + (rng() - 0.5) * 0.03));
  busGeo.computeVertexNormals();
  root.add(new THREE.Mesh(busGeo, foil));
  const topDeck = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.05, 1.05), white);
  topDeck.position.y = 0.62;
  root.add(topDeck);

  // Solar wings: yoke + 3 panels each, grid of cells via a thin frame lattice
  for (const s of [-1, 1]) {
    const yoke = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), frame);
    yoke.rotation.z = Math.PI / 2;
    yoke.position.x = s * 0.8;
    root.add(yoke);
    for (let k = 0; k < 3; k++) {
      const cx = s * (1.35 + k * 0.92);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.02, 1.1), cell);
      panel.position.set(cx, 0, 0);
      root.add(panel);
      for (let g = -2; g <= 2; g++) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.025, 0.01), frame);
        line.position.set(cx, 0, g * 0.22);
        root.add(line);
      }
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.025, 1.1), frame);
      edge.position.set(cx + 0.44, 0, 0);
      root.add(edge);
    }
  }

  // Parabolic dish: lathe of y = x^2 / (4f)
  const f = 0.35, prof = [];
  for (let i = 0; i <= 20; i++) { const r = (i / 20) * 0.6; prof.push(new THREE.Vector2(r, (r * r) / (4 * f))); }
  const dish = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.4, side: THREE.DoubleSide }));
  const dishG = new THREE.Group();
  dishG.add(dish);
  // feed horn at focal point on three struts
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 12), frame);
  horn.position.y = f;
  horn.rotation.x = Math.PI;
  dishG.add(horn);
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2;
    const from = new THREE.Vector3(Math.cos(a) * 0.55, 0.22, Math.sin(a) * 0.55), to = new THREE.Vector3(0, f, 0);
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, from.distanceTo(to), 4), frame);
    strut.position.copy(from).lerp(to, 0.5);
    strut.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
    dishG.add(strut);
  }
  dishG.position.set(0, 0.2, 0.52);
  dishG.rotation.x = Math.PI / 2 - 0.3;
  root.add(dishG);

  // Thrusters under the bus
  for (const [x, z] of [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]]) {
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.14, 12, 1, true), frame);
    n.position.set(x, -0.67, z);
    root.add(n);
  }
  root.rotation.set(0.25, -0.3, 0.1);
  return root;
}
