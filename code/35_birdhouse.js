// Prompt 35: "A painted wooden birdhouse on a post, with a pitched shingled roof, a round entrance hole, a perch dowel, and a small bird sitting on the roof."
export const meta = { id: '35', name: 'Birdhouse', prompt: 'A painted wooden birdhouse on a post, with a pitched shingled roof, a round entrance hole, a perch dowel, and a small bird sitting on the roof.' };

export function build(THREE) {
  const root = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color: 0x6fa3b8, roughness: 0.8 });
  const trim = new THREE.MeshStandardMaterial({ color: 0xf2eee4, roughness: 0.8 });
  const shingle = new THREE.MeshStandardMaterial({ color: 0x9c4a32, roughness: 0.9, flatShading: true });
  const post = new THREE.MeshStandardMaterial({ color: 0x6b5238, roughness: 0.95 });

  // Post + mounting plate
  const p = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.0, 0.16), post);
  p.position.y = 1.0;
  root.add(p);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.7), trim);
  plate.position.y = 2.02;
  root.add(plate);

  // House body: pentagon (square + gable) extruded, with an entrance hole
  const w = 0.7, h = 0.7, gable = 0.35;
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(0, h + gable); s.lineTo(-w / 2, h); s.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, h * 0.62, 0.09, 0, Math.PI * 2, true);
  s.holes.push(hole);
  const bodyGeo = new THREE.ExtrudeGeometry(s, { depth: 0.6, bevelEnabled: false, curveSegments: 24 });
  bodyGeo.translate(0, 0, -0.3);
  const body = new THREE.Mesh(bodyGeo, paint);
  body.position.y = 2.045;
  root.add(body);
  const dark = new THREE.Mesh(new THREE.CircleGeometry(0.09, 24), new THREE.MeshBasicMaterial({ color: 0x120c08 }));
  dark.position.set(0, 2.045 + h * 0.62, 0.2);
  root.add(dark);
  const perch = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), trim);
  perch.rotation.x = Math.PI / 2;
  perch.position.set(0, 2.045 + h * 0.4, 0.38);
  root.add(perch);

  // Roof: two panels covered with overlapping shingle rows
  const slope = Math.atan2(gable, w / 2);
  const panelLen = Math.hypot(w / 2, gable) + 0.1;
  for (const side of [-1, 1]) {
    const panel = new THREE.Group();
    panel.position.set(0, 2.045 + h + gable + 0.02, 0);
    panel.rotation.z = side * -slope;
    root.add(panel);
    const rows = 5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < 6; c++) {
        const sh = new THREE.Mesh(new THREE.BoxGeometry(panelLen / rows + 0.03, 0.025, 0.14), shingle);
        const along = (r + 0.5) * (panelLen / rows);
        sh.position.set(side * along, -0.01 * r, -0.36 + c * 0.145 + (r % 2) * 0.07);
        sh.rotation.z = side * 0.05;
        panel.add(sh);
      }
    }
  }
  const ridge = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), trim);
  ridge.rotation.x = Math.PI / 2;
  ridge.position.y = 2.045 + h + gable + 0.04;
  root.add(ridge);

  // Small bird on the ridge
  const bird = new THREE.Group();
  bird.position.set(0, 2.045 + h + gable + 0.12, 0.15);
  bird.rotation.y = 0.6;
  root.add(bird);
  const feather = new THREE.MeshStandardMaterial({ color: 0xd9582b, roughness: 0.7 });
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), feather);
  b.scale.set(1.3, 1, 1);
  bird.add(b);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), feather);
  head.position.set(0.09, 0.06, 0);
  bird.add(head);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.05, 8), new THREE.MeshStandardMaterial({ color: 0xe8b43a }));
  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.15, 0.06, 0);
  bird.add(beak);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.01, 0.05), feather);
  tail.position.set(-0.13, 0.03, 0);
  tail.rotation.z = 0.4;
  bird.add(tail);
  return root;
}
