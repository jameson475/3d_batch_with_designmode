// Prompt 100: "An antique gramophone: a square mahogany cabinet with a side winding crank, a turntable with a black shellac record showing grooves and a red label, a curved tonearm with a soundbox and needle, and a large flared brass horn."
export const meta = { id: '100', name: 'Gramophone', prompt: 'An antique gramophone: a square mahogany cabinet with a side winding crank, a turntable with a black shellac record showing grooves and a red label, a curved tonearm with a soundbox and needle, and a large flared brass horn.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const wood = new THREE.MeshPhysicalMaterial({ color: 0x5a2415, roughness: 0.35, clearcoat: 0.8 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xd4a84a, metalness: 1, roughness: 0.22, side: THREE.DoubleSide });
  // Cabinet with molding band and feet
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 1.4), wood);
  cab.position.y = 0.4;
  root.add(cab);
  const mold = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.06, 1.48), wood);
  mold.position.y = 0.72;
  root.add(mold);
  for (const [x, z] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), brass);
    f.position.set(x, 0.07, z);
    root.add(f);
  }
  // Winding crank on the right side
  const crank = new THREE.CatmullRomCurve3([new THREE.Vector3(0.7, 0.4, 0), new THREE.Vector3(0.9, 0.4, 0), new THREE.Vector3(0.92, 0.2, 0.05)]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(crank, 12, 0.02, 6), brass));
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 12), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0.92, 0.2, 0.1);
  root.add(knob);
  // Turntable + record with groove rings and a label
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.04, 48), new THREE.MeshStandardMaterial({ color: 0x3a2a1e, roughness: 0.9 }));
  platter.position.set(-0.05, 0.77, 0.05);
  root.add(platter);
  const record = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.012, 64), new THREE.MeshPhysicalMaterial({ color: 0x0c0c0c, roughness: 0.2, clearcoat: 1 }));
  record.position.set(-0.05, 0.796, 0.05);
  root.add(record);
  for (let r = 0.2; r < 0.54; r += 0.03) {
    const groove = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.004, 64), new THREE.MeshBasicMaterial({ color: 0x2a2a2a }));
    groove.rotation.x = -Math.PI / 2;
    groove.position.set(-0.05, 0.803, 0.05);
    root.add(groove);
  }
  const label = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32), new THREE.MeshStandardMaterial({ color: 0xa8231d, roughness: 0.6 }));
  label.rotation.x = -Math.PI / 2;
  label.position.set(-0.05, 0.804, 0.05);
  root.add(label);
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), brass);
  spindle.position.set(-0.05, 0.82, 0.05);
  root.add(spindle);
  // Tonearm base at the back-right, curving to the soundbox resting on the record
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.12, 20), brass);
  base.position.set(0.5, 0.82, -0.5);
  root.add(base);
  const armCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.5, 0.88, -0.5), new THREE.Vector3(0.45, 0.98, -0.25), new THREE.Vector3(0.3, 0.95, 0.0), new THREE.Vector3(0.2, 0.9, 0.15)]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(armCurve, 20, 0.03, 10), brass));
  const soundbox = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 24), brass);
  soundbox.rotation.x = Math.PI / 2;
  soundbox.position.set(0.2, 0.89, 0.2);
  root.add(soundbox);
  const needle = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.07, 6), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1 }));
  needle.rotation.x = Math.PI;
  needle.position.set(0.2, 0.83, 0.23);
  root.add(needle);
  // Horn: flared lathe (exponential flare) bent up and forward on a curved neck
  const neck = new THREE.CatmullRomCurve3([new THREE.Vector3(0.5, 0.95, -0.5), new THREE.Vector3(0.45, 1.3, -0.65), new THREE.Vector3(0.25, 1.55, -0.55)]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(neck, 20, 0.05, 12), brass));
  const hp = [];
  for (let i = 0; i <= 30; i++) { const t = i / 30; hp.push(new THREE.Vector2(0.05 * Math.exp(t * 2.9) + 0.001, t * 1.1)); }
  const hornGeo = new THREE.LatheGeometry(hp, 48);
  // Scallop the bell edge (petal horn look): 8 lobes near the mouth
  const q = hornGeo.attributes.position;
  for (let i = 0; i < q.count; i++) {
    const y = q.getY(i), a = Math.atan2(q.getZ(i), q.getX(i));
    const k = 1 + 0.06 * Math.pow(y / 1.1, 3) * Math.cos(a * 8);
    q.setX(i, q.getX(i) * k); q.setZ(i, q.getZ(i) * k);
  }
  hornGeo.computeVertexNormals();
  const horn = new THREE.Mesh(hornGeo, brass);
  horn.position.set(0.25, 1.55, -0.55);
  horn.rotation.set(1.15, 0, -0.25);
  root.add(horn);
  return root;
}
