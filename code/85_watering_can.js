// Prompt 85: "A green metal watering can with a long spout and a sprinkler rose."
export const meta = { id: '85', name: 'Watering Can', prompt: 'A green metal watering can with a long spout and a sprinkler rose.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const green = new THREE.MeshStandardMaterial({ color: 0x4a7c59, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a44a, metalness: 1, roughness: 0.3, side: THREE.DoubleSide });
  // Body: slightly oval drum with domed top
  const bp = [[0.001, 0], [0.6, 0], [0.62, 0.05], [0.62, 0.85], [0.5, 1.0], [0.25, 1.08], [0.001, 1.1]].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(bp, 48), green);
  body.scale.z = 0.8;
  root.add(body);
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.15, 24, 1, true), green);
  fill.position.set(-0.15, 1.13, 0);
  root.add(fill);
  // Long spout from the lower front, angled upward
  const a = new THREE.Vector3(0.55, 0.2, 0), b = new THREE.Vector3(1.55, 1.2, 0);
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, a.distanceTo(b), 16, 1, true), green);
  spout.position.copy(a).lerp(b, 0.5);
  spout.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  root.add(spout);
  const stay = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.55, 6), green);
  stay.position.set(0.85, 0.85, 0);
  stay.rotation.z = 0.4;
  root.add(stay);
  // Rose: cone + perforated face
  const rose = new THREE.Group();
  rose.position.copy(b);
  rose.quaternion.copy(spout.quaternion);
  root.add(rose);
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.06, 0.2, 24, 1, true), brass);
  cone.position.y = 0.08;
  rose.add(cone);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), brass);
  face.rotation.x = -Math.PI / 2;
  face.position.y = 0.18;
  rose.add(face);
  for (let r = 0.05; r < 0.18; r += 0.05) for (let k = 0; k < Math.round(r * 60); k++) {
    const t = (k / Math.round(r * 60)) * Math.PI * 2;
    const h = new THREE.Mesh(new THREE.CircleGeometry(0.012, 6), new THREE.MeshBasicMaterial({ color: 0x2a2010 }));
    h.rotation.x = -Math.PI / 2;
    h.position.set(Math.cos(t) * r, 0.182, Math.sin(t) * r);
    rose.add(h);
  }
  // Handle arching over the top to the back
  const hc = new THREE.CatmullRomCurve3([new THREE.Vector3(0.25, 1.05, 0), new THREE.Vector3(-0.1, 1.55, 0), new THREE.Vector3(-0.6, 1.3, 0), new THREE.Vector3(-0.64, 0.6, 0)]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(hc, 30, 0.04, 10), green));
  return root;
}
