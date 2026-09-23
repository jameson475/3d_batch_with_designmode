// Prompt 88: "An antique black cast-iron sewing machine with gold decals, a curved arm and head, a hand wheel, a needle bar and presser foot above a chrome bed plate, a thread spool on a pin, mounted on a wooden base."
export const meta = { id: '88', name: 'Antique Sewing Machine', prompt: 'An antique black cast-iron sewing machine with gold decals, a curved arm and head, a hand wheel, a needle bar and presser foot above a chrome bed plate, a thread spool on a pin, mounted on a wooden base.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const black = new THREE.MeshPhysicalMaterial({ color: 0x111113, roughness: 0.25, clearcoat: 1 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd9b04a, metalness: 1, roughness: 0.3 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe2e6, metalness: 1, roughness: 0.15 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b3a1e, roughness: 0.5 });
  // Wooden base with a routed edge
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 1.2), wood);
  base.position.y = 0.1;
  root.add(base);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.06, 1.3), wood);
  lip.position.y = 0.03;
  root.add(lip);
  // Bed plate
  const bed = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 0.9), black);
  bed.position.y = 0.26;
  root.add(bed);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.01, 0.4), chrome);
  plate.position.set(-0.75, 0.325, 0.05);
  root.add(plate);
  // Arm silhouette: pillar on the right, arm across the top, head drops on the left (profile extruded)
  const s = new THREE.Shape();
  s.moveTo(0.55, 0); s.lineTo(0.95, 0);
  s.bezierCurveTo(0.95, 0.6, 0.9, 1.05, 0.7, 1.15);
  s.lineTo(-0.7, 1.2);
  s.bezierCurveTo(-0.95, 1.2, -1.0, 1.0, -1.0, 0.85);
  s.lineTo(-1.0, 0.45); s.lineTo(-0.55, 0.45); s.lineTo(-0.55, 0.8);
  s.lineTo(0.5, 0.78);
  s.bezierCurveTo(0.58, 0.7, 0.58, 0.4, 0.55, 0);
  const arm = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.36, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4, curveSegments: 24 }), black);
  arm.position.set(0, 0.32, -0.18);
  root.add(arm);
  // Gold decals: scroll curves on the front face of the arm
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push(new THREE.Vector3(-0.4 + k * 0.35 + t * 0.3, 1.3 + Math.sin(t * Math.PI * 2) * 0.06 * (1 - t), 0.235)); }
    root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, 0.008, 4), gold));
  }
  const badge = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), gold);
  badge.position.set(0.75, 0.75, 0.236);
  root.add(badge);
  // Needle bar + needle + presser foot under the head
  const needleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 10), chrome);
  needleBar.position.set(-0.8, 0.6, 0.05);
  root.add(needleBar);
  const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.18, 6), chrome);
  needle.position.set(-0.8, 0.38, 0.05);
  root.add(needle);
  const presser = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.1), chrome);
  presser.position.set(-0.72, 0.34, 0.05);
  root.add(presser);
  const pbar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.35, 8), chrome);
  pbar.position.set(-0.72, 0.52, 0.05);
  root.add(pbar);
  // Hand wheel on the right end
  const wheel = new THREE.Group();
  wheel.position.set(1.33, 1.05, 0);
  wheel.rotation.z = Math.PI / 2;
  root.add(wheel);
  wheel.add(new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.045, 10, 40), chrome));
  for (let k = 0; k < 5; k++) {
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.03), chrome);
    const a = (k / 5) * Math.PI * 2;
    sp.position.set(Math.cos(a) * 0.15, 0, Math.sin(a) * 0.15);
    sp.rotation.set(Math.PI / 2, 0, -a + Math.PI / 2);
    sp.rotation.order = 'YXZ';
    sp.lookAt(0, 0, 0);
    wheel.add(sp);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 16), chrome);
  wheel.add(hub);
  // Thread spool on a pin on top of the arm
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.25, 6), chrome);
  pin.position.set(0.2, 1.62, 0);
  root.add(pin);
  const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 20), new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.8 }));
  spool.position.set(0.2, 1.64, 0);
  root.add(spool);
  for (const dy of [-0.09, 0.09]) {
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 20), wood);
    flange.position.set(0.2, 1.64 + dy, 0);
    root.add(flange);
  }
  // Thread line from spool down to the needle
  root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.2, 1.64, 0.08), new THREE.Vector3(-0.3, 1.58, 0.2), new THREE.Vector3(-0.85, 1.35, 0.2), new THREE.Vector3(-0.8, 0.42, 0.06)]), new THREE.LineBasicMaterial({ color: 0xc0392b })));
  return root;
}
