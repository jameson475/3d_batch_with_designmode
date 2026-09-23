// Prompt 77: "A fairground carousel with a striped conical canopy with scalloped valance, a central mirrored column, twisted brass poles, eight horses at alternating heights, a round wooden platform, and bulbs around the canopy edge."
export const meta = { id: '77', name: 'Carousel', prompt: 'A fairground carousel with a striped conical canopy with scalloped valance, a central mirrored column, twisted brass poles, eight horses at alternating heights, a round wooden platform, and bulbs around the canopy edge.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({ color: 0xd6ad4c, metalness: 1, roughness: 0.25 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x8a5a36, roughness: 0.7 });
  const R = 1.9, H = 2.2;
  // Platform + step ring
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.18, 48), wood);
  plat.position.y = 0.2;
  root.add(plat);
  const step = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.2, R + 0.25, 0.12, 48), new THREE.MeshStandardMaterial({ color: 0x6b2f2f, roughness: 0.8 }));
  step.position.y = 0.06;
  root.add(step);
  // Central mirrored column (octagonal)
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, H, 8), new THREE.MeshStandardMaterial({ color: 0xe6edf2, metalness: 1, roughness: 0.05, flatShading: true }));
  col.position.y = 0.29 + H / 2;
  root.add(col);
  // Canopy: striped cone built from 16 wedge segments + scalloped valance
  const seg = 16;
  for (let i = 0; i < seg; i++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(R + 0.3, 0.9, 4, 1, true, (i / seg) * Math.PI * 2, (Math.PI * 2) / seg),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0xf5efe0 : 0xc0392b, roughness: 0.7, side: THREE.DoubleSide }));
    c.position.y = 0.29 + H + 0.45;
    root.add(c);
    const flap = new THREE.Mesh(new THREE.CircleGeometry(0.38, 12, Math.PI, Math.PI),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0xc0392b : 0xf5efe0, side: THREE.DoubleSide }));
    const a = ((i + 0.5) / seg) * Math.PI * 2;
    flap.position.set(Math.sin(a) * (R + 0.3), 0.29 + H, Math.cos(a) * (R + 0.3));
    flap.rotation.y = a;
    root.add(flap);
  }
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), brass);
  finial.position.y = 0.29 + H + 0.95;
  root.add(finial);
  // Bulbs along the canopy rim
  const bulbGeo = new THREE.SphereGeometry(0.035, 8, 6);
  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff3c0, emissive: 0xffc94a, emissiveIntensity: 1.6 });
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const b = new THREE.Mesh(bulbGeo, bulbMat);
    b.position.set(Math.sin(a) * (R + 0.32), 0.29 + H + 0.02, Math.cos(a) * (R + 0.32));
    root.add(b);
  }

  // Horse: simple stylized figure from primitives
  const horse = (color) => {
    const g = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.4, 6, 12), m);
    body.rotation.z = Math.PI / 2;
    g.add(body);
    const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.22, 4, 8), m);
    neck.position.set(0.3, 0.16, 0); neck.rotation.z = -0.6;
    g.add(neck);
    const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.16, 4, 8), m);
    head.position.set(0.42, 0.28, 0); head.rotation.z = Math.PI / 2 + 0.5;
    g.add(head);
    for (const [x, rot] of [[0.2, -0.8], [-0.2, 0.7]]) for (const z of [-0.07, 0.07]) {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.26, 3, 6), m);
      leg.position.set(x + Math.sin(rot) * 0.1, -0.2, z); leg.rotation.z = rot;
      g.add(leg);
    }
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.3), new THREE.MeshStandardMaterial({ color: 0x1f4e8c }));
    saddle.position.y = 0.15;
    g.add(saddle);
    const mane = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.03), brass);
    mane.position.set(0.28, 0.24, 0); mane.rotation.z = -0.6;
    g.add(mane);
    return g;
  };
  const cols = [0xf4f1ea, 0x3b2a20, 0xd9b27a, 0x9b9b9b];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const x = Math.cos(a) * (R - 0.45), z = Math.sin(a) * (R - 0.45);
    // Twisted pole: tube swept along a tight helix
    const pts = [];
    for (let k = 0; k <= 60; k++) { const t = k / 60; pts.push(new THREE.Vector3(x + Math.cos(t * 40) * 0.012, 0.29 + t * H, z + Math.sin(t * 40) * 0.012)); }
    root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.022, 6), brass));
    const h = horse(cols[i % 4]);
    h.position.set(x, 0.29 + (i % 2 ? 0.9 : 1.25), z);
    h.rotation.y = -a - Math.PI / 2;   // facing tangent (counter-clockwise ride)
    root.add(h);
  }
  return root;
}
