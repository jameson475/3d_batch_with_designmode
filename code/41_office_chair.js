// Prompt 41: "An ergonomic office swivel chair with a five-star base on casters, a gas-lift column, a padded seat, a curved mesh backrest, and armrests."
export const meta = { id: '41', name: 'Office Swivel Chair', prompt: 'An ergonomic office swivel chair with a five-star base on casters, a gas-lift column, a padded seat, a curved mesh backrest, and armrests.' };

export function build(THREE) {
  const root = new THREE.Group();
  const plastic = new THREE.MeshStandardMaterial({ color: 0x222428, roughness: 0.5 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xcfd2d6, metalness: 1, roughness: 0.2 });
  const fabric = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.95 });
  const mesh = new THREE.MeshStandardMaterial({ color: 0x1b1d20, roughness: 0.8, transparent: true, opacity: 0.85, side: THREE.DoubleSide });

  // Five-star base with casters
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    const arm = new THREE.Group();
    arm.rotation.y = a;
    root.add(arm);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.08), chrome);
    leg.position.set(0.31, 0.18, 0);
    leg.rotation.z = 0.08;
    arm.add(leg);
    const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8), plastic);
    fork.position.set(0.6, 0.12, 0);
    arm.add(fork);
    const caster = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.05, 16), plastic);
    caster.rotation.x = Math.PI / 2;
    caster.position.set(0.63, 0.055, 0);
    arm.add(caster);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.1, 20), plastic);
  hub.position.y = 0.2;
  root.add(hub);
  const gas = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.35, 16), chrome);
  gas.position.y = 0.42;
  root.add(gas);
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16), plastic);
  sleeve.position.y = 0.32;
  root.add(sleeve);

  // Seat: rounded cushion (flattened box with rounded extrude)
  const r = 0.08, w = 0.52, d = 0.5;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -d / 2); s.lineTo(w / 2 - r, -d / 2); s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
  s.lineTo(w / 2, d / 2 - r); s.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2); s.lineTo(-w / 2 + r, d / 2);
  s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r); s.lineTo(-w / 2, -d / 2 + r); s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
  const seat = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 4 }), fabric);
  seat.rotation.x = -Math.PI / 2;
  seat.position.y = 0.62;
  root.add(seat);
  const pan = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.36), plastic);
  pan.position.y = 0.6;
  root.add(pan);

  // Backrest: curved mesh panel (cylinder segment) on a spine
  const back = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.62, 24, 1, true, Math.PI - 0.45, 0.9), mesh);
  back.position.set(0, 1.08, 0.33);
  back.rotation.x = -0.12;
  root.add(back);
  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.015, 6, 24, 0.9), plastic);
  frame.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.45 + Math.PI / 2 * 0 + 1.12);
  frame.position.set(0, 1.39, 0.33);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.03), plastic);
  spine.position.set(0, 0.78, -0.3);
  spine.rotation.x = -0.35;
  root.add(spine);
  const lumbar = new THREE.Mesh(new THREE.CylinderGeometry(0.605, 0.605, 0.08, 24, 1, true, Math.PI - 0.4, 0.8), plastic);
  lumbar.material = plastic.clone(); lumbar.material.side = THREE.DoubleSide;
  lumbar.position.set(0, 0.92, 0.33);
  root.add(lumbar);

  // Armrests: L-shaped posts with pads
  for (const sgn of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.06), plastic);
    post.position.set(sgn * 0.3, 0.78, 0);
    root.add(post);
    const link = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.06), plastic);
    link.position.set(sgn * 0.25, 0.66, 0);
    root.add(link);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.035, 0.26), plastic);
    pad.position.set(sgn * 0.3, 0.92, 0.02);
    root.add(pad);
  }
  root.rotation.y = Math.PI;
  return root;
}
