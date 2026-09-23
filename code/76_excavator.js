// Prompt 76: "A yellow hydraulic excavator on steel crawler tracks, with a rotating cab with windows, a counterweight, and an articulated boom, stick, and toothed bucket driven by hydraulic cylinders, digging pose."
export const meta = { id: '76', name: 'Hydraulic Excavator', prompt: 'A yellow hydraulic excavator on steel crawler tracks, with a rotating cab with windows, a counterweight, and an articulated boom, stick, and toothed bucket driven by hydraulic cylinders, digging pose.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const yellow = new THREE.MeshStandardMaterial({ color: 0xf2b51b, metalness: 0.3, roughness: 0.45 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.6, roughness: 0.6 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd8dade, metalness: 1, roughness: 0.2 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x33485c, metalness: 0.4, roughness: 0.1 });

  // Crawler tracks: stadium-shaped belt (extruded ring) with grouser plates, plus rollers
  const track = (z) => {
    const g = new THREE.Group();
    g.position.z = z;
    const L = 2.4, r = 0.32;
    const outer = new THREE.Shape();
    outer.moveTo(-L / 2, -r); outer.lineTo(L / 2, -r); outer.absarc(L / 2, 0, r, -Math.PI / 2, Math.PI / 2, false);
    outer.lineTo(-L / 2, r); outer.absarc(-L / 2, 0, r, Math.PI / 2, Math.PI * 1.5, false);
    const hole = new THREE.Path();
    hole.moveTo(-L / 2, -r + 0.07); hole.absarc(-L / 2, 0, r - 0.07, Math.PI * 1.5, Math.PI / 2, true);
    hole.lineTo(L / 2, r - 0.07); hole.absarc(L / 2, 0, r - 0.07, Math.PI / 2, -Math.PI / 2, true); hole.closePath();
    outer.holes.push(hole);
    const belt = new THREE.Mesh(new THREE.ExtrudeGeometry(outer, { depth: 0.45, bevelEnabled: false, curveSegments: 16 }), dark);
    belt.position.z = -0.225;
    g.add(belt);
    for (let i = 0; i < 18; i++) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.47), dark);
      plate.position.set(-L / 2 + (i / 17) * L, -r - 0.01, 0);
      g.add(plate);
    }
    for (const x of [-1.2, -0.6, 0, 0.6, 1.2]) {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(x === -1.2 || x === 1.2 ? 0.24 : 0.12, x === -1.2 || x === 1.2 ? 0.24 : 0.12, 0.3, 20), yellow);
      roller.rotation.x = Math.PI / 2;
      roller.position.set(x, x === -1.2 || x === 1.2 ? 0 : -0.14, 0);
      g.add(roller);
    }
    g.position.y = 0.33;
    root.add(g);
  };
  track(-0.72); track(0.72);
  const carbody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 1.0), dark);
  carbody.position.y = 0.55;
  root.add(carbody);

  // Upper structure (rotated slightly) on a slewing ring
  const upper = new THREE.Group();
  upper.position.y = 0.75;
  upper.rotation.y = -0.4;
  root.add(upper);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32), dark);
  upper.add(ring);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 1.5), yellow);
  deck.position.set(-0.3, 0.3, 0);
  upper.add(deck);
  const cw = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.5, 24, 1, false, Math.PI, Math.PI), dark);
  cw.rotation.x = Math.PI / 2;
  cw.scale.set(0.5, 1, 0.9);
  cw.position.set(-1.4, 0.35, 0);
  upper.add(cw);
  // Cab on the left front with windows
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.65), yellow);
  cab.position.set(0.45, 1.0, 0.38);
  upper.add(cab);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.7), glass);
  front.rotation.y = Math.PI / 2;
  front.position.set(0.855, 1.02, 0.38);
  upper.add(front);
  const side = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.55), glass);
  side.position.set(0.45, 1.08, 0.706);
  upper.add(side);
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 10), chrome);
  exhaust.position.set(-0.9, 0.72, -0.45);
  upper.add(exhaust);

  // Arm chain: boom -> stick -> bucket, each a Group pivot so angles compose
  const cyl = (parent, a, b) => {   // hydraulic cylinder = barrel + chrome rod between two local points
    const mid = a.clone().lerp(b, 0.55);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, a.distanceTo(mid), 12), yellow);
    barrel.position.copy(a).lerp(mid, 0.5); barrel.quaternion.copy(q); parent.add(barrel);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, mid.distanceTo(b), 10), chrome);
    rod.position.copy(mid).lerp(b, 0.5); rod.quaternion.copy(q); parent.add(rod);
  };
  const boom = new THREE.Group();
  boom.position.set(0.55, 0.55, -0.15);
  boom.rotation.z = 0.75;
  upper.add(boom);
  const boomShape = new THREE.Shape();
  boomShape.moveTo(0, -0.12); boomShape.lineTo(1.3, -0.1); boomShape.lineTo(2.3, -0.35); boomShape.lineTo(2.3, -0.1); boomShape.lineTo(1.3, 0.14); boomShape.lineTo(0, 0.12); boomShape.closePath();
  const boomM = new THREE.Mesh(new THREE.ExtrudeGeometry(boomShape, { depth: 0.24, bevelEnabled: false }), yellow);
  boomM.position.z = -0.12;
  boom.add(boomM);
  cyl(upper, new THREE.Vector3(0.75, 0.4, -0.15), new THREE.Vector3(0.55 + Math.cos(0.75) * 1.0, 0.55 + Math.sin(0.75) * 1.0 - 0.15, -0.15));
  const stick = new THREE.Group();
  stick.position.set(2.3, -0.22, 0);
  stick.rotation.z = -2.1;
  boom.add(stick);
  const stickM = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.2), yellow);
  stickM.position.x = 0.75;
  stick.add(stickM);
  cyl(boom, new THREE.Vector3(1.2, 0.2, 0), new THREE.Vector3(2.4, 0.15, 0));
  // Bucket: curved scoop from a partial cylinder + side plates + teeth
  const bucket = new THREE.Group();
  bucket.position.set(1.5, 0, 0);
  bucket.rotation.z = -0.9;
  stick.add(bucket);
  const scoop = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 20, 1, true, 0, Math.PI * 1.1), dark);
  scoop.material = dark.clone(); scoop.material.side = THREE.DoubleSide;
  scoop.rotation.x = Math.PI / 2;
  scoop.position.set(0.25, -0.2, 0);
  bucket.add(scoop);
  for (let k = 0; k < 5; k++) {
    const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 4), chrome);
    tooth.position.set(0.6, -0.25, -0.24 + k * 0.12);
    tooth.rotation.z = -Math.PI / 2;
    bucket.add(tooth);
  }
  cyl(stick, new THREE.Vector3(0.2, 0.2, 0), new THREE.Vector3(1.35, 0.25, 0));
  return root;
}
