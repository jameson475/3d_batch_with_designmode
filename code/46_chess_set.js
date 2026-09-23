// Prompt 46: "A corner of a wooden chessboard with a Staunton-style king, queen, rook, bishop, and pawn in ivory and ebony, all turned on a lathe."
export const meta = { id: '46', name: 'Staunton Chess Pieces', prompt: 'A corner of a wooden chessboard with a Staunton-style king, queen, rook, bishop, and pawn in ivory and ebony, all turned on a lathe.' };

export function build(THREE) {
  const root = new THREE.Group();
  const ivory = new THREE.MeshPhysicalMaterial({ color: 0xf1e6cf, roughness: 0.3, clearcoat: 0.6 });
  const ebony = new THREE.MeshPhysicalMaterial({ color: 0x1c1512, roughness: 0.3, clearcoat: 0.6 });
  const sq = 0.5;

  // 4x4 board corner
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(sq, 0.06, sq), new THREE.MeshStandardMaterial({ color: (i + j) % 2 ? 0x6b4226 : 0xd8b27a, roughness: 0.6 }));
    t.position.set((i - 1.5) * sq, -0.03, (j - 1.5) * sq);
    root.add(t);
  }

  // Shared base + collar profiles; each piece adds its own body/top
  const base = [[0.001, 0], [0.2, 0], [0.2, 0.04], [0.17, 0.06], [0.18, 0.08], [0.13, 0.12]];
  const lathe = (pts) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(Math.max(x, 0.001), y)), 40);
  const profiles = {
    pawn: [...base, [0.08, 0.28], [0.12, 0.3], [0.06, 0.33], ...arc(0.09, 0.42, 10)],
    rook: [...base, [0.11, 0.4], [0.14, 0.42], [0.14, 0.52], [0.1, 0.52], [0.1, 0.48], [0.001, 0.48]],
    bishop: [...base, [0.07, 0.42], [0.12, 0.44], [0.06, 0.47], [0.09, 0.53], [0.1, 0.58], [0.07, 0.66], [0.02, 0.7], [0.03, 0.72], [0.001, 0.74]],
    queen: [...base, [0.07, 0.5], [0.14, 0.53], [0.07, 0.56], [0.08, 0.6], [0.13, 0.7], [0.1, 0.72], [0.06, 0.74], [0.04, 0.78], [0.001, 0.8]],
    king: [...base, [0.08, 0.55], [0.15, 0.58], [0.08, 0.61], [0.09, 0.65], [0.13, 0.75], [0.08, 0.78], [0.001, 0.79]],
  };
  function arc(r, cy, n) {
    const out = [];
    for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI; out.push([Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return out;
  }
  const piece = (kind, mat, x, z) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(lathe(profiles[kind]), mat));
    if (kind === 'rook') {        // crenellations
      for (let k = 0; k < 5; k++) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.06), mat);
        const a = (k / 5) * Math.PI * 2;
        c.position.set(Math.cos(a) * 0.12, 0.545, Math.sin(a) * 0.12);
        c.rotation.y = -a;
        g.add(c);
      }
    }
    if (kind === 'bishop') {      // mitre slit
      const slit = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.012, 0.02), mat === ivory ? ebony : ivory);
      slit.position.y = 0.6; slit.rotation.z = 0.7; slit.position.z = 0.07;
      g.add(slit);
    }
    if (kind === 'queen') {       // coronet balls
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), mat);
        b.position.set(Math.cos(a) * 0.1, 0.735, Math.sin(a) * 0.1);
        g.add(b);
      }
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), mat);
      top.position.y = 0.82;
      g.add(top);
    }
    if (kind === 'king') {        // cross
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.035), mat);
      v.position.y = 0.87;
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.035, 0.035), mat);
      h.position.y = 0.89;
      g.add(v, h);
    }
    g.position.set(x, 0, z);
    root.add(g);
  };
  piece('king', ivory, -0.25, 0.75);
  piece('queen', ebony, 0.25, 0.75);
  piece('rook', ivory, -0.75, 0.75);
  piece('bishop', ebony, 0.75, 0.25);
  piece('pawn', ivory, -0.25, 0.25);
  piece('pawn', ebony, 0.25, -0.25);
  piece('rook', ebony, 0.75, -0.75);
  return root;
}
