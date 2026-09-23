// Prompt 20: "A pirate treasure chest with a half-cylinder lid propped open, iron bands and rivets, a padlock hasp, and gold coins spilling out."
export const meta = { id: '20', name: 'Treasure Chest', prompt: 'A pirate treasure chest with a half-cylinder lid propped open, iron bands and rivets, a padlock hasp, and gold coins spilling out.' };

export function build(THREE) {
  const root = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a4a26, roughness: 0.85 });
  const iron = new THREE.MeshStandardMaterial({ color: 0x3b3b3b, metalness: 0.8, roughness: 0.45 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xf2c14e, metalness: 1, roughness: 0.25, emissive: 0x3a2800 });
  const W = 2.0, D = 1.2, H = 0.9;
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(99);

  // Box body (open top) built from 5 slabs
  const t = 0.08;
  const slab = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wood); m.position.set(x, y, z); root.add(m); };
  slab(W, t, D, 0, t / 2, 0);
  slab(W, H, t, 0, H / 2, D / 2 - t / 2);
  slab(W, H, t, 0, H / 2, -D / 2 + t / 2);
  slab(t, H, D, W / 2 - t / 2, H / 2, 0);
  slab(t, H, D, -W / 2 + t / 2, H / 2, 0);

  // Iron bands wrapping the body, with rivets
  for (const x of [-0.7, 0, 0.7]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.12, H + 0.01, D + 0.02), iron);
    band.position.set(x, H / 2, 0);
    root.add(band);
    for (const y of [0.15, 0.45, 0.75]) {
      const rv = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), iron);
      rv.position.set(x, y, D / 2 + 0.015);
      root.add(rv);
    }
  }

  // Lid: half-cylinder shell hinged at the back edge, opened ~110°
  const hinge = new THREE.Group();
  hinge.position.set(0, H, -D / 2);
  hinge.rotation.x = -1.9;
  root.add(hinge);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(D / 2, D / 2, W, 24, 1, true, 0, Math.PI), wood);
  lid.material = wood.clone(); lid.material.side = THREE.DoubleSide;
  lid.rotation.z = Math.PI / 2;
  lid.position.z = D / 2;
  hinge.add(lid);
  for (const x of [-0.7, 0, 0.7]) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(D / 2 + 0.01, D / 2 + 0.01, 0.12, 24, 1, true, 0, Math.PI), iron);
    b.material = iron.clone(); b.material.side = THREE.DoubleSide;
    b.rotation.z = Math.PI / 2;
    b.position.set(x, 0, D / 2);
    hinge.add(b);
  }

  // Hasp + padlock hanging on the front
  const hasp = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.26, 0.03), iron);
  hasp.position.set(0, H - 0.12, D / 2 + 0.03);
  root.add(hasp);
  const lock = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.08), gold);
  lock.position.set(0, H - 0.34, D / 2 + 0.06);
  root.add(lock);
  const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16, Math.PI), iron);
  shackle.position.set(0, H - 0.26, D / 2 + 0.06);
  root.add(shackle);

  // Coins: a heaped pile inside plus a spill in front (shared geometry)
  const coinGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.015, 16);
  const coin = (x, y, z) => { const c = new THREE.Mesh(coinGeo, gold); c.position.set(x, y, z); c.rotation.set((rng() - 0.5) * 1.2, rng() * 3, (rng() - 0.5) * 1.2); root.add(c); };
  for (let i = 0; i < 140; i++) {
    const x = (rng() - 0.5) * (W - 0.25), z = (rng() - 0.5) * (D - 0.25);
    const heap = 0.25 * (1 - (x * x) / 1.0 - (z * z) / 0.4);
    coin(x, H - 0.05 + Math.max(0, heap) * rng(), z);
  }
  for (let i = 0; i < 30; i++) {
    const a = rng() * Math.PI - Math.PI, r = 0.2 + rng() * 0.6;
    coin(Math.cos(a) * r * 1.3, 0.01, D / 2 + 0.15 + Math.abs(Math.sin(a)) * r * 0.5);
  }
  return root;
}
