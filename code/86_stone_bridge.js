// Prompt 86: "A medieval stone arch bridge with three semicircular arches of individual voussoir stones, cutwater piers, a paved deck, and low parapet walls, spanning a stream."
export const meta = { id: '86', name: 'Stone Arch Bridge', prompt: 'A medieval stone arch bridge with three semicircular arches of individual voussoir stones, cutwater piers, a paved deck, and low parapet walls, spanning a stream.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(86);
  const stone = () => new THREE.MeshStandardMaterial({ color: new THREE.Color(0x9a9186).offsetHSL(0, 0, (rng() - 0.5) * 0.08), roughness: 0.95 });
  const baseStone = new THREE.MeshStandardMaterial({ color: 0x8f877c, roughness: 0.95 });
  const W = 1.0;                 // bridge width (z)
  const spans = [[-1.6, 0.6], [0, 0.75], [1.6, 0.6]]; // [center x, radius]
  const deckY = 1.35;
  // Spandrel wall: long slab with arch holes, extruded across z
  const wall = new THREE.Shape();
  wall.moveTo(-2.6, 0); wall.lineTo(-2.3, 0);
  for (const [cx, r] of spans) { wall.lineTo(cx - r, 0); wall.absarc(cx, 0, r, Math.PI, 0, true); }
  wall.lineTo(2.3, 0); wall.lineTo(2.6, 0); wall.lineTo(2.6, deckY); wall.lineTo(-2.6, deckY); wall.closePath();
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(wall, { depth: W, bevelEnabled: false, curveSegments: 24 }), baseStone);
  body.position.z = -W / 2;
  body.position.y = 0.25;
  root.add(body);
  // Voussoirs: wedge stones ringing each arch on both faces
  for (const [cx, r] of spans) {
    const n = Math.round(r * 18);
    for (let i = 0; i < n; i++) {
      const a0 = Math.PI * (i / n), a1 = Math.PI * ((i + 1) / n);
      const s = new THREE.Shape();
      s.moveTo(Math.cos(a0) * r, Math.sin(a0) * r); s.lineTo(Math.cos(a0) * (r + 0.22), Math.sin(a0) * (r + 0.22));
      s.lineTo(Math.cos(a1) * (r + 0.22), Math.sin(a1) * (r + 0.22)); s.lineTo(Math.cos(a1) * r, Math.sin(a1) * r); s.closePath();
      const g = new THREE.ExtrudeGeometry(s, { depth: W + 0.06, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 1 });
      const m = new THREE.Mesh(g, stone());
      m.scale.setScalar(0.985);
      m.position.set(cx, 0.25, -W / 2 - 0.03);
      root.add(m);
    }
  }
  // Piers with pointed cutwaters (triangular prisms) upstream and downstream
  for (const x of [-0.8, 0.8]) {
    const cw = new THREE.Shape();
    cw.moveTo(-0.25, 0); cw.lineTo(0.25, 0); cw.lineTo(0, 0.45); cw.closePath();
    for (const s of [-1, 1]) {
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(cw, { depth: 0.9, bevelEnabled: false }), baseStone);
      m.rotation.x = s * -Math.PI / 2;
      m.position.set(x, -0.2, s * W / 2);
      root.add(m);
    }
  }
  // Deck paving (random setts) + parapets with coping
  for (let i = 0; i < 26; i++) for (let j = 0; j < 5; j++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.04, 0.17), stone());
    p.position.set(-2.5 + i * 0.2 + (j % 2) * 0.1, deckY + 0.27, -0.36 + j * 0.18);
    root.add(p);
  }
  for (const s of [-1, 1]) {
    const par = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 0.12), baseStone);
    par.position.set(0, deckY + 0.43, s * (W / 2 - 0.06));
    root.add(par);
    const cope = new THREE.Mesh(new THREE.BoxGeometry(5.25, 0.05, 0.16), stone());
    cope.position.set(0, deckY + 0.63, s * (W / 2 - 0.06));
    root.add(cope);
  }
  // Stream: flat water plane + banks
  const water = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), new THREE.MeshPhysicalMaterial({ color: 0x3f7f9a, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.85 }));
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.05;
  root.add(water);
  for (const s of [-1, 1]) {
    const bank = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 3), new THREE.MeshStandardMaterial({ color: 0x5f7f3a, roughness: 1 }));
    bank.position.set(s * 2.9, 0.25, 0);
    root.add(bank);
  }
  return root;
}
