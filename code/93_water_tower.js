// Prompt 93: "A rooftop wooden water tower on a steel stand with a conical roof and a ladder."
export const meta = { id: '93', name: 'Rooftop Water Tower', prompt: 'A rooftop wooden water tower on a steel stand with a conical roof and a ladder.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0x3b3f44, metalness: 0.7, roughness: 0.5 });
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(93);
  const tankY = 1.6, R = 0.9, H = 1.4;
  // Steel stand: 4 legs + cross bracing + platform
  const legs = [[-0.7, -0.7], [0.7, -0.7], [0.7, 0.7], [-0.7, 0.7]];
  for (const [x, z] of legs) {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, tankY, 0.08), steel);
    l.position.set(x, tankY / 2, z);
    root.add(l);
  }
  for (let i = 0; i < 4; i++) {
    const [x0, z0] = legs[i], [x1, z1] = legs[(i + 1) % 4];
    for (const [ya, yb] of [[0.1, tankY - 0.1], [tankY - 0.1, 0.1]]) {
      const a = new THREE.Vector3(x0, ya, z0), b = new THREE.Vector3(x1, yb, z1);
      const br = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, a.distanceTo(b), 4), steel);
      br.position.copy(a).lerp(b, 0.5);
      br.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      root.add(br);
    }
  }
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.15, R + 0.15, 0.08, 32), steel);
  platform.position.y = tankY;
  root.add(platform);
  // Wooden tank: vertical staves with iron hoops
  const staves = 28;
  for (let i = 0; i < staves; i++) {
    const a = (i / staves) * Math.PI * 2;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.2, H, 0.06), new THREE.MeshStandardMaterial({ color: new THREE.Color(0x8a6a4a).offsetHSL(0, 0, (rng() - 0.5) * 0.06), roughness: 0.95 }));
    s.position.set(Math.cos(a) * R, tankY + H / 2 + 0.04, Math.sin(a) * R);
    s.rotation.y = -a + Math.PI / 2;
    root.add(s);
  }
  for (let k = 0; k < 5; k++) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(R + 0.04, 0.015, 6, 48), steel);
    hoop.rotation.x = Math.PI / 2;
    hoop.position.y = tankY + 0.15 + k * 0.28;
    root.add(hoop);
  }
  // Conical roof with finial
  const roof = new THREE.Mesh(new THREE.ConeGeometry(R + 0.12, 0.7, 32), new THREE.MeshStandardMaterial({ color: 0x5a4632, roughness: 0.9 }));
  roof.position.y = tankY + H + 0.39;
  root.add(roof);
  const fin = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), steel);
  fin.position.y = tankY + H + 0.78;
  root.add(fin);
  // Ladder up the side
  const lx = R + 0.18;
  for (const z of [-0.15, 0.15]) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, tankY + H, 6), steel);
    rail.position.set(lx, (tankY + H) / 2, z);
    root.add(rail);
  }
  for (let y = 0.2; y < tankY + H; y += 0.2) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), steel);
    rung.rotation.x = Math.PI / 2;
    rung.position.set(lx, y, 0);
    root.add(rung);
  }
  // Rooftop slab it stands on
  const slab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 2.6), new THREE.MeshStandardMaterial({ color: 0x7d7a74, roughness: 1 }));
  slab.position.y = -0.05;
  root.add(slab);
  return root;
}
