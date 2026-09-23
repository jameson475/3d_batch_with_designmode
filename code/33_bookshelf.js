// Prompt 33: "A wooden bookshelf with four shelves filled with books of varied heights, thicknesses and colors, some leaning, plus a small plant on top."
export const meta = { id: '33', name: 'Filled Bookshelf', prompt: 'A wooden bookshelf with four shelves filled with books of varied heights, thicknesses and colors, some leaning, plus a small plant on top.' };

export function build(THREE) {
  const root = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x9a6a3e, roughness: 0.7 });
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(21);
  const W = 2.0, H = 2.6, D = 0.5, t = 0.05;
  const palette = [0x8c2f39, 0x2d4a6b, 0x3f6b4a, 0xd9a441, 0x5a3e6b, 0xc25b3a, 0x2b2b2b, 0xe8dcc0, 0x4f7c8a];

  const box = (w, h, d, x, y, z, m = wood) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); root.add(b); return b; };
  box(t, H, D, -W / 2 + t / 2, H / 2, 0);
  box(t, H, D, W / 2 - t / 2, H / 2, 0);
  box(W, t, D, 0, H - t / 2, 0);
  box(W, 0.08, D, 0, 0.04, 0);
  box(W, H, 0.02, 0, H / 2, -D / 2 + 0.01, new THREE.MeshStandardMaterial({ color: 0x7a5230, roughness: 0.8 }));

  const shelfYs = [0.08, 0.7, 1.32, 1.94];
  for (const y of shelfYs.slice(1)) box(W - 2 * t, t, D, 0, y, 0);

  // Fill each shelf left-to-right with books; occasionally leave a gap and lean the next book into it
  const bookGeo = new THREE.BoxGeometry(1, 1, 1);
  for (let s = 0; s < shelfYs.length; s++) {
    const base = shelfYs[s] + (s === 0 ? 0 : t / 2);
    const maxH = 0.55;
    let x = -W / 2 + t + 0.02;
    const end = W / 2 - t - 0.02;
    while (x < end - 0.05) {
      const bw = 0.04 + rng() * 0.07, bh = 0.32 + rng() * (maxH - 0.32), bd = 0.28 + rng() * 0.12;
      if (x + bw > end) break;
      const mat = new THREE.MeshStandardMaterial({ color: palette[Math.floor(rng() * palette.length)], roughness: 0.6 });
      const b = new THREE.Mesh(bookGeo, mat);
      b.scale.set(bw, bh, bd);
      if (rng() < 0.08 && x + bw + bh * 0.4 < end) {
        // leaning book: pivot on its bottom-left corner
        const lean = 0.35;
        b.rotation.z = -lean;
        b.position.set(x + (bh / 2) * Math.sin(lean) + (bw / 2) * Math.cos(lean), base + (bh / 2) * Math.cos(lean), D / 2 - bd / 2 - 0.03);
        x += bh * Math.sin(lean) + bw + 0.02;
      } else {
        b.position.set(x + bw / 2, base + bh / 2, D / 2 - bd / 2 - 0.03);
        x += bw + 0.004;
      }
      root.add(b);
      // spine band
      if (rng() < 0.5) {
        const band = new THREE.Mesh(new THREE.BoxGeometry(bw * 1.01, 0.02, 0.005), new THREE.MeshStandardMaterial({ color: 0xd4b15a, metalness: 0.8, roughness: 0.3 }));
        band.position.copy(b.position).setZ(D / 2 - 0.03 + 0.001);
        band.position.y += bh * 0.3;
        band.rotation.z = b.rotation.z;
        root.add(band);
      }
    }
  }

  // Plant on top: pot + leafy sphere cluster
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.22, 20), new THREE.MeshStandardMaterial({ color: 0xe4ddd0, roughness: 0.6 }));
  pot.position.set(0.55, H + 0.11, 0);
  root.add(pot);
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4d8a4a, roughness: 0.7, flatShading: true });
  for (let i = 0; i < 7; i++) {
    const l = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1 + rng() * 0.06, 0), leaf);
    l.position.set(0.55 + (rng() - 0.5) * 0.25, H + 0.32 + rng() * 0.15, (rng() - 0.5) * 0.25);
    root.add(l);
  }
  return root;
}
