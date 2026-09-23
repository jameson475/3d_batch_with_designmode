// Prompt 16: "A cluster of five fly-agaric mushrooms of different sizes growing from a mossy log, red caps with white spots."
export const meta = { id: '16', name: 'Mushroom Cluster', prompt: 'A cluster of five fly-agaric mushrooms of different sizes growing from a mossy log, red caps with white spots.' };

export function build(THREE) {
  const root = new THREE.Group();
  const bark = new THREE.MeshStandardMaterial({ color: 0x5b4330, roughness: 1 });
  const moss = new THREE.MeshStandardMaterial({ color: 0x5d7f36, roughness: 1, flatShading: true });
  const stem = new THREE.MeshStandardMaterial({ color: 0xf1eadb, roughness: 0.8 });
  const cap = new THREE.MeshStandardMaterial({ color: 0xc8261b, roughness: 0.35 });
  const spot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(11);

  // Log lying on its side
  const log = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 3.0, 20), bark);
  log.rotation.z = Math.PI / 2;
  log.position.y = 0.45;
  root.add(log);
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18 + rng() * 0.12, 0), moss);
    m.position.set((rng() - 0.5) * 2.6, 0.82 + rng() * 0.06, (rng() - 0.5) * 0.4);
    m.scale.y = 0.4;
    root.add(m);
  }

  // Mushroom: lathe stem with a slight flare + dome cap + spots scattered on the dome
  function mushroom(s, x, z, lean) {
    const g = new THREE.Group();
    const h = 1.1 * s;
    const prof = [[0.16, 0], [0.12, h * 0.2], [0.1, h * 0.7], [0.13, h]].map(([r, y]) => new THREE.Vector2(r * s, y));
    g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 16), stem));
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * s, 0.17 * s, 0.06 * s, 16, 1, true), stem);
    ring.position.y = h * 0.72;
    g.add(ring);
    const R = 0.5 * s;
    const c = new THREE.Mesh(new THREE.SphereGeometry(R, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), cap);
    c.scale.y = 0.75;
    c.position.y = h - 0.05 * s;
    g.add(c);
    for (let k = 0; k < 9; k++) {
      const th = rng() * Math.PI * 2, ph = 0.15 + rng() * 1.2;
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.045 * s, 8, 6), spot);
      d.position.set(Math.sin(ph) * Math.cos(th) * R, Math.cos(ph) * R * 0.75 + h - 0.05 * s, Math.sin(ph) * Math.sin(th) * R);
      d.scale.y = 0.5;
      g.add(d);
    }
    g.position.set(x, 0.8, z);
    g.rotation.z = lean;
    return g;
  }
  [[1.0, -0.2, 0.05, 0.1], [0.75, 0.55, -0.1, -0.2], [0.55, -0.9, 0.15, 0.3], [0.4, 1.05, 0.2, -0.35], [0.3, -0.4, 0.3, 0.2]]
    .forEach(([s, x, z, l]) => root.add(mushroom(s, x, z, l)));
  return root;
}
