// Prompt 60: "A space shuttle orbiter stacked for launch: the white orbiter with black heat-shield underside and delta wings, mounted on a large orange external fuel tank flanked by two white solid rocket boosters, standing on a launch platform."
export const meta = { id: '60', name: 'Space Shuttle Stack', prompt: 'A space shuttle orbiter stacked for launch: the white orbiter with black heat-shield underside and delta wings, mounted on a large orange external fuel tank flanked by two white solid rocket boosters, standing on a launch platform.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: 0xf0f0ee, roughness: 0.5 });
  const black = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.7 });
  const orange = new THREE.MeshStandardMaterial({ color: 0xc8641e, roughness: 0.8 });
  const grey = new THREE.MeshStandardMaterial({ color: 0x6d6f72, metalness: 0.5, roughness: 0.6 });
  const base = 0.5;

  // Launch platform
  const pad = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.4, 2.4), grey);
  pad.position.y = 0.2;
  root.add(pad);

  // External tank: lathe with ogive nose
  const T = 4.6, R = 0.42;
  const tp = [[0.001, 0], [R, 0.05]];
  for (let i = 0; i <= 12; i++) { const t = i / 12; tp.push([R, 0.05 + t * T * 0.72]); }
  for (let i = 1; i <= 14; i++) { const t = i / 14; tp.push([R * Math.cos(t * Math.PI / 2) ** 0.7, T * 0.72 + t * T * 0.28]); }
  const tank = new THREE.Mesh(new THREE.LatheGeometry(tp.map(([x, y]) => new THREE.Vector2(Math.max(x, 0.001), y)), 40), orange);
  tank.position.y = base;
  root.add(tank);

  // Solid rocket boosters on each side
  const srb = () => {
    const g = new THREE.Group();
    const bp = [[0.001, 0], [0.2, 0], [0.16, 0.25], [0.18, 0.3], [0.18, 3.6], [0.12, 3.9], [0.001, 4.05]];
    g.add(new THREE.Mesh(new THREE.LatheGeometry(bp.map(([x, y]) => new THREE.Vector2(x, y)), 32), white));
    for (const y of [1.2, 2.4]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.182, 0.012, 6, 32), black);
      ring.rotation.x = Math.PI / 2; ring.position.y = y;
      g.add(ring);
    }
    return g;
  };
  for (const s of [-1, 1]) { const b = srb(); b.position.set(s * 0.64, base, 0); root.add(b); }

  // Orbiter: fuselage (box + nose), mounted on the +z side of the tank, nose up
  const orb = new THREE.Group();
  orb.position.set(0, base + 0.5, R + 0.3);
  root.add(orb);
  const fus = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 2.6, 24), white);
  fus.scale.z = 0.85;
  fus.position.y = 1.4;
  orb.add(fus);
  const noseProf = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; noseProf.push(new THREE.Vector2(0.26 * Math.sqrt(1 - t * t) + 0.001, t * 0.6)); }
  const nose = new THREE.Mesh(new THREE.LatheGeometry(noseProf, 24), white);
  nose.scale.z = 0.85;
  nose.position.y = 2.7;
  orb.add(nose);
  const noseCap = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), black);
  noseCap.position.set(0, 3.25, 0.02);
  orb.add(noseCap);
  // Heat-shield belly (the face touching the tank = -z side)
  const belly = new THREE.Mesh(new THREE.BoxGeometry(0.46, 2.9, 0.02), black);
  belly.position.set(0, 1.5, -0.22);
  orb.add(belly);
  // Cockpit windows
  for (const x of [-0.1, 0, 0.1]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.06), black);
    w.position.set(x, 2.78, 0.2);
    w.rotation.x = -0.35;
    orb.add(w);
  }
  // Delta wings: extruded double-delta planform in the XY plane (thin in z), black leading edges
  const wing = new THREE.Shape();
  wing.moveTo(0.2, 0.1); wing.lineTo(1.05, 0.1); wing.lineTo(0.95, 0.5); wing.lineTo(0.35, 1.5); wing.lineTo(0.2, 2.0); wing.closePath();
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.ExtrudeGeometry(wing, { depth: 0.06, bevelEnabled: false }), white);
    w.scale.x = s;
    w.position.z = -0.2;
    orb.add(w);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.2, 0.07), black);
    edge.position.set(s * 0.7, 1.05, -0.17);
    edge.rotation.z = s * 0.62;
    orb.add(edge);
  }
  // Vertical tail and main engines
  const tail = new THREE.Shape();
  tail.moveTo(0, 0); tail.lineTo(0.7, 0); tail.lineTo(0.55, 0.9); tail.lineTo(0.2, 0.9); tail.closePath();
  const t = new THREE.Mesh(new THREE.ExtrudeGeometry(tail, { depth: 0.05, bevelEnabled: false }), white);
  t.rotation.y = -Math.PI / 2;
  t.rotation.z = Math.PI / 2;
  t.position.set(0.025, 0.1, 0.2);
  orb.add(t);
  for (const [x, z] of [[-0.12, 0.05], [0.12, 0.05], [0, -0.1]]) {
    const e = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.22, 16, 1, true), grey);
    e.material = grey.clone(); e.material.side = THREE.DoubleSide;
    e.position.set(x, -0.08, z);
    orb.add(e);
  }
  // Attachment struts orbiter <-> tank
  for (const y of [0.5, 2.4]) {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), grey);
    st.rotation.x = Math.PI / 2;
    st.position.set(0, base + 0.5 + y, R + 0.1);
    root.add(st);
  }
  return root;
}
