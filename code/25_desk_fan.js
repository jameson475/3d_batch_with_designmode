// Prompt 25: "A retro oscillating desk fan with a round wire cage, four curved blades, a motor housing, a tilting neck, and a heavy base."
export const meta = { id: '25', name: 'Retro Desk Fan', prompt: 'A retro oscillating desk fan with a round wire cage, four curved blades, a motor housing, a tilting neck, and a heavy base.' };

export function build(THREE) {
  const root = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color: 0x7fb7a4, metalness: 0.3, roughness: 0.35 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd6d6d6, metalness: 1, roughness: 0.2 });
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xb9d8cc, metalness: 0.4, roughness: 0.3, side: THREE.DoubleSide });

  // Base: lathe dome
  const bp = [[0.001, 0], [0.7, 0], [0.72, 0.05], [0.6, 0.18], [0.25, 0.28], [0.12, 0.3], [0.001, 0.3]].map(([x, y]) => new THREE.Vector2(x, y));
  root.add(new THREE.Mesh(new THREE.LatheGeometry(bp, 48), paint));
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.9, 16), paint);
  stem.position.y = 0.72;
  root.add(stem);

  // Head tilts on a yoke at the top of the stem
  const head = new THREE.Group();
  head.position.set(0, 1.2, 0);
  head.rotation.x = -0.15;
  root.add(head);
  const motor = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 20), paint);
  motor.scale.z = 1.3;
  motor.position.z = -0.15;
  head.add(motor);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 12), chrome);
  knob.position.set(0, 0.28, -0.3);
  head.add(knob);

  // Blades: each a flat shape bent by twisting vertices around the radial axis
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0.05, -0.05);
  bladeShape.bezierCurveTo(0.35, -0.22, 0.62, -0.12, 0.6, 0.05);
  bladeShape.bezierCurveTo(0.55, 0.2, 0.3, 0.18, 0.05, 0.05);
  const bg = new THREE.ShapeGeometry(bladeShape, 16);
  const p = bg.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const twist = 0.5 * x;
    p.setXYZ(i, x, y * Math.cos(twist), y * Math.sin(twist));
  }
  bg.computeVertexNormals();
  const rotor = new THREE.Group();
  rotor.position.z = 0.25;
  rotor.rotation.z = 0.3;
  head.add(rotor);
  for (let k = 0; k < 4; k++) {
    const b = new THREE.Mesh(bg, bladeMat);
    b.rotation.z = (k * Math.PI) / 2;
    rotor.add(b);
  }
  const spinner = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), chrome);
  spinner.position.z = 0.28;
  head.add(spinner);

  // Cage: rings + radial wires front and back
  const cage = new THREE.Group();
  cage.position.z = 0.25;
  head.add(cage);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.02, 8, 64), chrome);
  cage.add(rim);
  for (const [r, z] of [[0.3, 0.16], [0.52, 0.12], [0.3, -0.12], [0.52, -0.09]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 4, 48), chrome);
    ring.position.z = z;
    cage.add(ring);
  }
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    for (const sgn of [1, -1]) {
      const pts = [];
      for (let t = 0; t <= 8; t++) {
        const rr = 0.72 * (t / 8);
        pts.push(new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, sgn * 0.18 * Math.cos((t / 8) * Math.PI / 2)));
      }
      cage.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, 0.005, 4), chrome));
    }
  }
  const badge = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), paint);
  badge.position.z = 0.185;
  cage.add(badge);
  return root;
}
