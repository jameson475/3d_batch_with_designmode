// Prompt 06: "A red-and-white striped lighthouse on a rocky base, with a gallery railing and a glowing lantern room."
export const meta = { id: '06', name: 'Striped Lighthouse', prompt: 'A red-and-white striped lighthouse on a rocky base, with a gallery railing and a glowing lantern room.' };

export function build(THREE) {
  const root = new THREE.Group();
  const rock = new THREE.MeshStandardMaterial({ color: 0x6d6a66, roughness: 1, flatShading: true });
  const white = new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.6 });
  const red = new THREE.MeshStandardMaterial({ color: 0xb8322a, roughness: 0.6 });
  const iron = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.4 });

  // Rocky base: jittered icosahedron boulders
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);
  for (let i = 0; i < 9; i++) {
    const g = new THREE.IcosahedronGeometry(0.4 + rng() * 0.4, 0);
    const p = g.attributes.position;
    for (let v = 0; v < p.count; v++) p.setXYZ(v, p.getX(v) * (0.8 + rng() * 0.4), p.getY(v) * 0.6, p.getZ(v) * (0.8 + rng() * 0.4));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, rock);
    const a = (i / 9) * Math.PI * 2;
    m.position.set(Math.cos(a) * 0.9, 0.2, Math.sin(a) * 0.9);
    root.add(m);
  }

  // Tower: 6 alternating tapered bands
  const bands = 6, H = 3.6, r0 = 0.7, r1 = 0.45;
  for (let b = 0; b < bands; b++) {
    const y0 = b / bands, y1 = (b + 1) / bands;
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(r0 + (r1 - r0) * y1, r0 + (r1 - r0) * y0, H / bands, 40),
      b % 2 ? red : white
    );
    seg.position.y = 0.4 + H * (y0 + y1) / 2;
    root.add(seg);
  }
  const top = 0.4 + H;

  // Gallery deck + railing posts
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 40), iron);
  deck.position.y = top;
  root.add(deck);
  const rail = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.015, 6, 48), iron);
  rail.rotation.x = Math.PI / 2;
  rail.position.y = top + 0.3;
  root.add(rail);
  for (let i = 0; i < 16; i++) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), iron);
    const a = (i / 16) * Math.PI * 2;
    post.position.set(Math.cos(a) * 0.68, top + 0.15, Math.sin(a) * 0.68);
    root.add(post);
  }

  // Lantern room: glowing glass + dome
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.55, 24),
    new THREE.MeshStandardMaterial({ color: 0xfff6c8, emissive: 0xffd24a, emissiveIntensity: 1.6, transparent: true, opacity: 0.85 }));
  lamp.position.y = top + 0.32;
  root.add(lamp);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), red);
  dome.position.y = top + 0.6;
  root.add(dome);
  const beacon = new THREE.PointLight(0xffd98a, 4, 8);
  beacon.position.y = top + 0.32;
  root.add(beacon);

  return root;
}
