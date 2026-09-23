// Prompt 09: "A cast-iron spiral staircase with 20 wedge-shaped treads around a central pole and a helical handrail."
export const meta = { id: '09', name: 'Spiral Staircase', prompt: 'A cast-iron spiral staircase with 20 wedge-shaped treads around a central pole and a helical handrail.' };

export function build(THREE) {
  const root = new THREE.Group();
  const iron = new THREE.MeshStandardMaterial({ color: 0x3a3d42, metalness: 0.75, roughness: 0.45 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x8a5a36, roughness: 0.7 });

  const steps = 20, rise = 0.18, turn = (Math.PI * 2 * 1.25) / steps, R = 1.1;
  const H = steps * rise;

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, H + 0.6, 20), iron);
  pole.position.y = (H + 0.6) / 2;
  root.add(pole);

  // Wedge tread: a pie-slice shape extruded
  const wedge = new THREE.Shape();
  wedge.moveTo(0, 0);
  wedge.absarc(0, 0, R, -turn * 0.55, turn * 0.55, false);
  wedge.lineTo(0, 0);
  const treadGeo = new THREE.ExtrudeGeometry(wedge, { depth: 0.05, bevelEnabled: false });
  treadGeo.rotateX(-Math.PI / 2);

  const railPts = [];
  const balGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.9, 6);
  for (let i = 0; i < steps; i++) {
    const a = i * turn, y = (i + 1) * rise;
    const t = new THREE.Mesh(treadGeo, wood);
    t.rotation.y = a;
    t.position.y = y;
    root.add(t);

    // Baluster at outer edge
    const bx = Math.cos(a) * (R - 0.05), bz = -Math.sin(a) * (R - 0.05);
    const bal = new THREE.Mesh(balGeo, iron);
    bal.position.set(bx, y + 0.45, bz);
    root.add(bal);
    railPts.push(new THREE.Vector3(bx, y + 0.9, bz));
  }

  // Helical handrail through baluster tops
  const curve = new THREE.CatmullRomCurve3(railPts);
  const rail = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.03, 8, false), iron);
  root.add(rail);

  // Floor plate
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 24), iron);
  plate.position.y = 0.02;
  root.add(plate);

  return root;
}
