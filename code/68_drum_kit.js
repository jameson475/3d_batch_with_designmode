// Prompt 68: "A five-piece rock drum kit: a bass drum with a logo head and pedal, a snare on a stand, two rack toms mounted on the bass drum, a floor tom on legs, a hi-hat, and two cymbals on boom stands, all with sparkle-red wraps and chrome hoops."
export const meta = { id: '68', name: 'Drum Kit', prompt: 'A five-piece rock drum kit: a bass drum with a logo head and pedal, a snare on a stand, two rack toms mounted on the bass drum, a floor tom on legs, a hi-hat, and two cymbals on boom stands, all with sparkle-red wraps and chrome hoops.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const wrap = new THREE.MeshPhysicalMaterial({ color: 0xa3121b, metalness: 0.6, roughness: 0.3, clearcoat: 1 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe2e6, metalness: 1, roughness: 0.15 });
  const head = new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.7 });
  const bronze = new THREE.MeshStandardMaterial({ color: 0xd4a84a, metalness: 1, roughness: 0.3, side: THREE.DoubleSide });

  // Generic drum: shell + two heads + two hoops + lugs; axis along local Y
  const drum = (r, depth) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, depth, 40, 1, true), wrap));
    for (const s of [-1, 1]) {
      const h = new THREE.Mesh(new THREE.CircleGeometry(r, 40), head);
      h.rotation.x = s * -Math.PI / 2; h.position.y = s * depth / 2;
      g.add(h);
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(r + 0.01, 0.015, 6, 40), chrome);
      hoop.rotation.x = Math.PI / 2; hoop.position.y = s * depth / 2;
      g.add(hoop);
    }
    const lugs = Math.round(r * 16);
    for (let i = 0; i < lugs; i++) {
      const a = (i / lugs) * Math.PI * 2;
      const lug = new THREE.Mesh(new THREE.BoxGeometry(0.03, depth * 0.35, 0.03), chrome);
      lug.position.set(Math.cos(a) * (r + 0.015), 0, Math.sin(a) * (r + 0.015));
      g.add(lug);
    }
    return g;
  };
  const stand = (x, z, h) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, h, 8), chrome);
    pole.position.y = h / 2; g.add(pole);
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.4, 6), chrome);
      leg.position.set(Math.cos(a) * 0.15, 0.15, Math.sin(a) * 0.15);
      leg.rotation.set(Math.sin(a) * 0.8, 0, -Math.cos(a) * 0.8);
      g.add(leg);
    }
    root.add(g);
    return g;
  };
  const cymbal = (r) => {
    const cp = [[0.001, 0.04], [0.06, 0.035], [0.08, 0.015], [r, -0.02]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.Mesh(new THREE.LatheGeometry(cp, 40), bronze);
  };

  // Bass drum lying on its side, facing +z, with a logo circle and a pedal
  const bass = drum(0.55, 0.45);
  bass.rotation.x = Math.PI / 2;
  bass.position.set(0, 0.57, 0);
  root.add(bass);
  const logo = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.24, 40), new THREE.MeshStandardMaterial({ color: 0x111111 }));
  logo.position.set(0, 0.57, 0.231);
  root.add(logo);
  const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.3), chrome);
  pedal.position.set(0, 0.05, -0.45);
  pedal.rotation.x = 0.2;
  root.add(pedal);
  const beater = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 6), chrome);
  beater.position.set(0, 0.35, -0.3);
  beater.rotation.x = -0.4;
  root.add(beater);

  // Rack toms mounted on top of the bass drum, tilted toward the drummer (-z)
  for (const [x, r] of [[-0.25, 0.2], [0.25, 0.23]]) {
    const t = drum(r, 0.22);
    t.position.set(x, 1.3, -0.05);
    t.rotation.x = -0.35;
    root.add(t);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.25, 6), chrome);
    arm.position.set(x * 0.6, 1.1, 0);
    arm.rotation.z = x > 0 ? -0.5 : 0.5;
    root.add(arm);
  }
  // Floor tom on three legs
  const ft = drum(0.3, 0.4);
  ft.position.set(0.95, 0.65, -0.55);
  root.add(ft);
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.7, 6), chrome);
    leg.position.set(0.95 + Math.cos(a) * 0.34, 0.35, -0.55 + Math.sin(a) * 0.34);
    root.add(leg);
  }
  // Snare on a stand
  stand(-0.6, -0.6, 0.62);
  const snare = drum(0.2, 0.14);
  snare.position.set(-0.6, 0.7, -0.6);
  root.add(snare);
  // Hi-hat: two cymbals on a stand
  stand(-1.05, -0.4, 0.95);
  for (const y of [0.92, 0.96]) {
    const c = cymbal(0.2);
    c.position.set(-1.05, y, -0.4);
    if (y > 0.93) c.rotation.x = Math.PI;
    root.add(c);
  }
  // Two cymbals on boom stands
  for (const [x, z, h, r, tilt] of [[-0.8, 0.35, 1.55, 0.3, 0.25], [0.95, 0.3, 1.65, 0.35, -0.3]]) {
    stand(x, z, h);
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), chrome);
    boom.position.set(x - Math.sign(x) * 0.15, h + 0.1, z - 0.1);
    boom.rotation.z = Math.sign(x) * 0.9;
    root.add(boom);
    const c = cymbal(r);
    c.position.set(x - Math.sign(x) * 0.3, h + 0.25, z - 0.15);
    c.rotation.z = tilt;
    root.add(c);
  }
  // Drum throne
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 24), new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.8 }));
  seat.position.set(0, 0.55, -1.05);
  root.add(seat);
  stand(0, -1.05, 0.5);
  root.rotation.y = Math.PI + 0.3;
  return root;
}
