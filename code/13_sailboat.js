// Prompt 13: "A small wooden sloop sailboat with a curved hull, a single mast, a triangular mainsail and jib, and a boom."
export const meta = { id: '13', name: 'Wooden Sloop', prompt: 'A small wooden sloop sailboat with a curved hull, a single mast, a triangular mainsail and jib, and a boom.' };

export function build(THREE) {
  const root = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x1f3b5c, roughness: 0.5, side: THREE.DoubleSide });
  const deckMat = new THREE.MeshStandardMaterial({ color: 0xc89b62, roughness: 0.7 });
  const spar = new THREE.MeshStandardMaterial({ color: 0x8a5a33, roughness: 0.6 });
  const canvas = new THREE.MeshStandardMaterial({ color: 0xf6f1e4, roughness: 0.9, side: THREE.DoubleSide });

  // Hull: parametric surface. u = along length (bow->stern), v = around section (port->keel->starboard)
  const L = 3.2, B = 0.55, D = 0.55;
  const segU = 40, segV = 16;
  const pos = [];
  const idx = [];
  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    const x = (u - 0.5) * L;
    const beam = B * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15)), 0.6) + 0.02; // pointed bow, fuller stern
    const depth = D * (0.4 + 0.6 * Math.sin(Math.PI * u));
    for (let j = 0; j <= segV; j++) {
      const a = Math.PI * (j / segV); // 0..PI
      pos.push(x, -Math.sin(a) * depth, Math.cos(a) * beam);
    }
  }
  for (let i = 0; i < segU; i++) for (let j = 0; j < segV; j++) {
    const a = i * (segV + 1) + j, b = a + segV + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const hg = new THREE.BufferGeometry();
  hg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  hg.setIndex(idx);
  hg.computeVertexNormals();
  root.add(new THREE.Mesh(hg, hullMat));

  // Deck: top outline of the hull
  const deckShape = new THREE.Shape();
  for (let i = 0; i <= segU; i++) {
    const u = i / segU, x = (u - 0.5) * L;
    const beam = B * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15)), 0.6) + 0.02;
    i === 0 ? deckShape.moveTo(x, beam) : deckShape.lineTo(x, beam);
  }
  for (let i = segU; i >= 0; i--) {
    const u = i / segU, x = (u - 0.5) * L;
    const beam = B * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15)), 0.6) + 0.02;
    deckShape.lineTo(x, -beam);
  }
  const deck = new THREE.Mesh(new THREE.ShapeGeometry(deckShape), deckMat);
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = -0.01;
  root.add(deck);

  // Mast + boom
  const mastX = -0.35, mastH = 3.4;
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, mastH, 10), spar);
  mast.position.set(mastX, mastH / 2, 0);
  root.add(mast);
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.7, 8), spar);
  boom.rotation.z = Math.PI / 2;
  boom.position.set(mastX + 0.85, 0.45, 0);
  root.add(boom);

  // Sails: triangles as ShapeGeometry in the XY plane
  const tri = (pts) => { const s = new THREE.Shape(); s.moveTo(...pts[0]); s.lineTo(...pts[1]); s.lineTo(...pts[2]); s.closePath(); return new THREE.ShapeGeometry(s); };
  const main = new THREE.Mesh(tri([[mastX + 0.05, 0.5], [mastX + 1.65, 0.5], [mastX + 0.05, mastH - 0.1]]), canvas);
  root.add(main);
  const jib = new THREE.Mesh(tri([[mastX - 0.08, 0.35], [-1.55, 0.2], [mastX - 0.08, mastH - 0.5]]), canvas);
  root.add(jib);
  // Forestay
  root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.6, 0.05, 0), new THREE.Vector3(mastX, mastH - 0.3, 0)]),
    new THREE.LineBasicMaterial({ color: 0x333333 })));

  root.position.y = 0.55;
  return root;
}
