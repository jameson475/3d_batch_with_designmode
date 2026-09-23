// Prompt 38: "An oak wine barrel built from individual bulging staves held by four iron hoops, with a round head and a bung hole, lying on a wooden cradle."
export const meta = { id: '38', name: 'Oak Barrel', prompt: 'An oak wine barrel built from individual bulging staves held by four iron hoops, with a round head and a bung hole, lying on a wooden cradle.' };

export function build(THREE) {
  const root = new THREE.Group();
  const iron = new THREE.MeshStandardMaterial({ color: 0x2f2f2f, metalness: 0.8, roughness: 0.5 });
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(5);
  const L = 1.6, Rend = 0.5, Rmid = 0.62, staves = 22;
  const radius = (y) => Rend + (Rmid - Rend) * (1 - Math.pow((2 * y) / L, 2)); // parabolic bilge

  const barrel = new THREE.Group();
  root.add(barrel);

  // Each stave: a narrow curved strip — lathe segment with its own slightly varied tone
  const prof = [];
  for (let i = 0; i <= 16; i++) { const y = -L / 2 + (i / 16) * L; prof.push(new THREE.Vector2(radius(y), y)); }
  const gap = 0.012;
  for (let s = 0; s < staves; s++) {
    const a0 = (s / staves) * Math.PI * 2;
    const len = (Math.PI * 2) / staves - gap;
    const tone = new THREE.Color(0x9a6a3a).offsetHSL(0, 0, (rng() - 0.5) * 0.08);
    const st = new THREE.Mesh(new THREE.LatheGeometry(prof, 3, a0, len), new THREE.MeshStandardMaterial({ color: tone, roughness: 0.8, side: THREE.DoubleSide }));
    barrel.add(st);
  }
  // Dark interior fill so gaps read as seams
  const core = new THREE.Mesh(new THREE.LatheGeometry(prof.map(v => new THREE.Vector2(v.x - 0.02, v.y)), 32), new THREE.MeshStandardMaterial({ color: 0x2a1a0e }));
  barrel.add(core);

  // Heads (ends) inset slightly, with a chime lip
  for (const s of [-1, 1]) {
    const head = new THREE.Mesh(new THREE.CircleGeometry(Rend - 0.03, 40), new THREE.MeshStandardMaterial({ color: 0xb58456, roughness: 0.8, side: THREE.DoubleSide }));
    head.rotation.x = s * Math.PI / 2;
    head.position.y = s * (L / 2 - 0.04);
    barrel.add(head);
    // head boards seams
    for (const x of [-0.15, 0.15]) {
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.005, (Rend - 0.05) * 1.9), new THREE.MeshBasicMaterial({ color: 0x4a3018 }));
      seam.position.set(x, s * (L / 2 - 0.035), 0);
      barrel.add(seam);
    }
  }

  // Hoops at the quarter points, sized to the local radius
  for (const y of [-0.72, -0.45, 0.45, 0.72]) {
    const hoop = new THREE.Mesh(new THREE.CylinderGeometry(radius(y) + 0.012, radius(y) + 0.012, 0.07, 48, 1, true), iron);
    hoop.material.side = THREE.DoubleSide;
    hoop.position.y = y;
    barrel.add(hoop);
  }
  // Bung hole + plug on the bilge
  const bung = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16), new THREE.MeshStandardMaterial({ color: 0x5a3a1c }));
  bung.position.set(0, 0, Rmid + 0.005);
  bung.rotation.x = Math.PI / 2;
  barrel.add(bung);

  // Lay the barrel on its side on a cradle
  barrel.rotation.z = Math.PI / 2;
  barrel.rotation.x = Math.PI / 2 - 0.2;
  barrel.position.y = Rmid + 0.18;
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b4a2c, roughness: 0.9 });
  for (const x of [-0.5, 0.5]) {
    const saddle = new THREE.Shape();
    saddle.moveTo(-0.55, 0); saddle.lineTo(0.55, 0); saddle.lineTo(0.55, 0.45);
    saddle.absarc(0, Rmid + 0.18, Rmid - 0.04, -0.3, -Math.PI + 0.3, true);
    saddle.lineTo(-0.55, 0.45); saddle.closePath();
    const c = new THREE.Mesh(new THREE.ExtrudeGeometry(saddle, { depth: 0.1, bevelEnabled: false }), wood);
    c.rotation.y = Math.PI / 2;
    c.position.set(x, 0, 0);
    root.add(c);
  }
  return root;
}
