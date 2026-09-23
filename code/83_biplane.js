// Prompt 83: "A 1930s biplane with fabric-covered upper and lower wings joined by struts and bracing wires, an open cockpit with a windscreen, a radial engine with a two-blade wooden propeller, a tail with rudder and elevators, and fixed landing gear with spoked wheels."
export const meta = { id: '83', name: 'Vintage Biplane', prompt: 'A 1930s biplane with fabric-covered upper and lower wings joined by struts and bracing wires, an open cockpit with a windscreen, a radial engine with a two-blade wooden propeller, a tail with rudder and elevators, and fixed landing gear with spoked wheels.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const fabric = new THREE.MeshStandardMaterial({ color: 0xe8b83a, roughness: 0.7 });
  const red = new THREE.MeshStandardMaterial({ color: 0xa8231d, roughness: 0.6 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x777b80, metalness: 0.9, roughness: 0.35 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.5 });
  const wire = new THREE.LineBasicMaterial({ color: 0x333333 });
  const Y = 1.0;
  // Fuselage along +x (nose) — lathe tapering to the tail, laid horizontal
  const fp = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20; fp.push(new THREE.Vector2(0.001 + 0.32 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.15 + t * 0.95)), 0.6) * (1 - 0.75 * t), t * 3.4)); }
  const fus = new THREE.Mesh(new THREE.LatheGeometry(fp, 24), red);
  fus.rotation.z = Math.PI / 2;
  fus.position.set(1.2, Y, 0);
  root.add(fus);
  // Wings: flat rounded-tip boxes, upper and lower, with rib stripes
  const wing = (y, span, chord, x) => {
    const w = new THREE.Mesh(new THREE.BoxGeometry(chord, 0.06, span), fabric);
    w.position.set(x, y, 0);
    root.add(w);
    for (let i = -6; i <= 6; i++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(chord, 0.065, 0.02), new THREE.MeshStandardMaterial({ color: 0xd2a32c }));
      rib.position.set(x, y, i * (span / 13));
      root.add(rib);
    }
    for (const s of [-1, 1]) {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(chord / 2, chord / 2, 0.06, 16, 1, false, 0, Math.PI), fabric);
      tip.rotation.y = s > 0 ? 0 : Math.PI;
      tip.position.set(x, y, s * span / 2);
      root.add(tip);
    }
  };
  wing(Y + 0.85, 4.2, 0.75, 0.75);
  wing(Y - 0.25, 3.8, 0.7, 0.55);
  // Interplane struts + cabane struts + bracing wires
  for (const s of [-1, 1]) {
    for (const dx of [-0.25, 0.25]) {
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 8), wood);
      strut.position.set(0.65 + dx, Y + 0.3, s * 1.5);
      root.add(strut);
    }
    const cab = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), metal);
    cab.position.set(0.8, Y + 0.55, s * 0.25);
    cab.rotation.x = s * -0.3;
    root.add(cab);
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.65, Y - 0.22, s * 0.3), new THREE.Vector3(0.65, Y + 0.82, s * 1.5)]), wire));
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.65, Y + 0.82, s * 0.3), new THREE.Vector3(0.65, Y - 0.22, s * 1.5)]), wire));
  }
  // Cockpit opening + windscreen
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.2, 20), new THREE.MeshBasicMaterial({ color: 0x111111 }));
  hole.rotation.x = -Math.PI / 2;
  hole.position.set(0.05, Y + 0.3, 0);
  root.add(hole);
  const ws = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.18), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
  ws.rotation.set(0, Math.PI / 2, 0.4);
  ws.position.set(0.32, Y + 0.38, 0);
  root.add(ws);
  // Radial engine: cowling ring + 7 cylinders + propeller
  const cowl = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 10, 32), metal);
  cowl.rotation.y = Math.PI / 2;
  cowl.position.set(1.25, Y, 0);
  root.add(cowl);
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2;
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.2, 10), metal);
    c.position.set(1.25, Y + Math.cos(a) * 0.25, Math.sin(a) * 0.25);
    c.rotation.x = a;
    root.add(c);
  }
  const hub = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 16), red);
  hub.rotation.z = -Math.PI / 2;
  hub.position.set(1.4, Y, 0);
  root.add(hub);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 0.12), wood);
  blade.position.set(1.36, Y, 0);
  blade.rotation.x = 0.5;
  root.add(blade);
  // Tail: fin + rudder, horizontal stabilizers
  const fin = new THREE.Shape();
  fin.moveTo(0, 0); fin.lineTo(0.5, 0); fin.lineTo(0.15, 0.55); fin.lineTo(0, 0.55); fin.closePath();
  const finM = new THREE.Mesh(new THREE.ExtrudeGeometry(fin, { depth: 0.03, bevelEnabled: false }), red);
  finM.position.set(-2.2, Y + 0.05, -0.015);
  root.add(finM);
  const stab = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.03, 1.3), fabric);
  stab.position.set(-2.0, Y + 0.05, 0);
  root.add(stab);
  // Landing gear: V-struts, axle, spoked wheels, tail skid
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), metal);
    leg.position.set(0.75, Y - 0.55, s * 0.3);
    leg.rotation.x = s * 0.35;
    root.add(leg);
    const w = new THREE.Group();
    w.position.set(0.75, 0.25, s * 0.45);
    root.add(w);
    w.add(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 10, 32), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })));
    for (let k = 0; k < 12; k++) {
      const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.2, 4), metal);
      const a = (k / 12) * Math.PI * 2;
      sp.position.set(Math.cos(a) * 0.1, Math.sin(a) * 0.1, 0);
      sp.rotation.z = a - Math.PI / 2;
      w.add(sp);
    }
  }
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6), metal);
  axle.rotation.x = Math.PI / 2;
  axle.position.set(0.75, 0.25, 0);
  root.add(axle);
  const skid = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), metal);
  skid.position.set(-2.05, Y - 0.25, 0);
  skid.rotation.z = 0.5;
  root.add(skid);
  return root;
}
