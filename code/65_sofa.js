// Prompt 65: "A three-seat fabric sofa with rounded arms, seat cushions, and throw pillows."
export const meta = { id: '65', name: 'Three-Seat Sofa', prompt: 'A three-seat fabric sofa with rounded arms, seat cushions, and throw pillows.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const fabric = new THREE.MeshStandardMaterial({ color: 0x5b7c6a, roughness: 0.95 });
  const legM = new THREE.MeshStandardMaterial({ color: 0x3b2718, roughness: 0.5 });
  const W = 2.8, D = 1.0;
  // Rounded box helper (extruded rounded rectangle)
  const rbox = (w, h, d, r, mat) => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const g = new THREE.ExtrudeGeometry(s, { depth: d - 0.08, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 4 });
    g.translate(0, 0, -(d - 0.08) / 2);
    return new THREE.Mesh(g, mat);
  };
  const base = rbox(W, 0.35, D, 0.05, fabric);
  base.position.y = 0.35;
  root.add(base);
  const back = rbox(W, 0.7, 0.25, 0.1, fabric);
  back.position.set(0, 0.85, -D / 2 + 0.12);
  root.add(back);
  for (const s of [-1, 1]) {
    const arm = rbox(0.28, 0.5, D, 0.13, fabric);
    arm.position.set(s * (W / 2 - 0.1), 0.65, 0);
    root.add(arm);
  }
  // Three seat cushions + back cushions
  const cw = (W - 0.56) / 3;
  for (let i = 0; i < 3; i++) {
    const x = -((W - 0.56) / 2) + cw * (i + 0.5);
    const c = rbox(cw - 0.03, 0.16, D - 0.3, 0.06, fabric);
    c.position.set(x, 0.62, 0.1);
    root.add(c);
    const bc = rbox(cw - 0.03, 0.45, 0.18, 0.08, fabric);
    bc.position.set(x, 0.95, -D / 2 + 0.32);
    bc.rotation.x = -0.12;
    root.add(bc);
  }
  // Throw pillows (squashed spheres)
  for (const [x, col] of [[-0.85, 0xe0b04a], [0.85, 0xc8573e]]) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 14), new THREE.MeshStandardMaterial({ color: col, roughness: 0.9 }));
    p.scale.set(1, 1, 0.4);
    p.position.set(x, 0.95, -0.12);
    p.rotation.set(-0.3, x > 0 ? -0.2 : 0.2, x > 0 ? 0.3 : -0.3);
    root.add(p);
  }
  for (const [x, z] of [[-1.25, -0.4], [1.25, -0.4], [-1.25, 0.4], [1.25, 0.4]]) {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.18, 10), legM);
    l.position.set(x, 0.09, z);
    root.add(l);
  }
  return root;
}
