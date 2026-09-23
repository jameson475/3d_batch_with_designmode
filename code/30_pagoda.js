// Prompt 30: "A five-tiered East Asian pagoda on a stone plinth, each tier with red columns and upturned curved eaves, topped by a bronze spire with rings."
export const meta = { id: '30', name: 'Five-Tier Pagoda', prompt: 'A five-tiered East Asian pagoda on a stone plinth, each tier with red columns and upturned curved eaves, topped by a bronze spire with rings.' };

export function build(THREE) {
  const root = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: 0xb8b2a6, roughness: 0.95 });
  const red = new THREE.MeshStandardMaterial({ color: 0xa3281d, roughness: 0.6 });
  const roof = new THREE.MeshStandardMaterial({ color: 0x2f3a36, roughness: 0.7, side: THREE.DoubleSide });
  const bronze = new THREE.MeshStandardMaterial({ color: 0xb08d57, metalness: 0.9, roughness: 0.35 });
  const wall = new THREE.MeshStandardMaterial({ color: 0xf1e9d8, roughness: 0.8 });

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 2.6), stone);
  plinth.position.y = 0.15;
  root.add(plinth);

  // Upturned eave: square "hip roof" whose corners curl upward — built by displacing a subdivided plane
  function eave(half, y) {
    const g = new THREE.PlaneGeometry(half * 2, half * 2, 16, 16);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const m = Math.max(Math.abs(x), Math.abs(z)) / half;     // 0 center -> 1 edge
      const corner = Math.pow(Math.abs(x * z) / (half * half), 2); // 1 at corners
      p.setY(i, 0.35 * (1 - m) + 0.18 * corner * m);           // pyramid slope + corner lift
    }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, roof);
    m.position.y = y;
    return m;
  }

  let y = 0.3, w = 1.7;
  for (let t = 0; t < 5; t++) {
    const h = 0.55 - t * 0.04;
    const body = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, h, w * 0.72), wall);
    body.position.y = y + h / 2;
    root.add(body);
    // Columns on each face (4 per side, shared corners)
    const n = 4, half = w * 0.38;
    for (let i = 0; i < n; i++) {
      const u = -half + (i / (n - 1)) * half * 2;
      for (const [cx, cz] of [[u, half], [u, -half], [half, u], [-half, u]]) {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, h, 8), red);
        c.position.set(cx, y + h / 2, cz);
        root.add(c);
      }
    }
    // Railing band + eave
    const band = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, 0.06, w * 0.8), red);
    band.position.y = y + h;
    root.add(band);
    root.add(eave(w * 0.75, y + h + 0.02));
    y += h + 0.3;
    w *= 0.84;
  }

  // Spire (sorin) with nine rings
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 1.0, 8), bronze);
  spire.position.y = y + 0.4;
  root.add(spire);
  for (let i = 0; i < 9; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12 - i * 0.008, 0.015, 6, 20), bronze);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y + 0.05 + i * 0.07;
    root.add(ring);
  }
  const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), bronze);
  jewel.position.y = y + 0.95;
  root.add(jewel);
  return root;
}
