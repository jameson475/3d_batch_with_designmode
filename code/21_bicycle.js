// Prompt 21: "A classic city bicycle with spoked wheels, a diamond steel frame, a leather saddle, curved handlebars, and a front basket."
export const meta = { id: '21', name: 'City Bicycle', prompt: 'A classic city bicycle with spoked wheels, a diamond steel frame, a leather saddle, curved handlebars, and a front basket.' };

export function build(THREE) {
  const root = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2e6b5e, metalness: 0.6, roughness: 0.35 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 1, roughness: 0.2 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
  const leather = new THREE.MeshStandardMaterial({ color: 0x6b3a1e, roughness: 0.6 });
  const R = 0.65;
  const rear = new THREE.Vector3(-1.0, R, 0), front = new THREE.Vector3(1.05, R, 0);

  function wheel(c) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.04, 10, 48), rubber));
    g.add(new THREE.Mesh(new THREE.TorusGeometry(R - 0.05, 0.015, 6, 48), chrome));
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, R - 0.06, 4), chrome);
      s.position.set(Math.cos(a) * (R - 0.06) / 2, Math.sin(a) * (R - 0.06) / 2, (i % 2 ? 1 : -1) * 0.02);
      s.rotation.z = a - Math.PI / 2;
      g.add(s);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12), chrome);
    hub.rotation.x = Math.PI / 2;
    g.add(hub);
    g.position.copy(c);
    return g;
  }
  root.add(wheel(rear), wheel(front));

  // Tube between two points
  const tube = (a, b, r = 0.025, m = frameMat) => {
    const m1 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), 10), m);
    m1.position.copy(a).lerp(b, 0.5);
    m1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    root.add(m1);
  };
  const bb = new THREE.Vector3(-0.05, 0.42, 0);        // bottom bracket
  const seatTop = new THREE.Vector3(-0.3, 1.25, 0);
  const headTop = new THREE.Vector3(0.75, 1.3, 0), headBot = new THREE.Vector3(0.82, 1.08, 0);
  tube(bb, seatTop); tube(seatTop, headTop); tube(bb, headBot); tube(headTop, headBot, 0.03);
  for (const z of [-0.06, 0.06]) {
    tube(new THREE.Vector3(rear.x, rear.y, z), new THREE.Vector3(bb.x, bb.y, z), 0.015);
    tube(new THREE.Vector3(rear.x, rear.y, z), new THREE.Vector3(seatTop.x, seatTop.y - 0.05, z), 0.015);
    tube(new THREE.Vector3(front.x, front.y, z), new THREE.Vector3(headBot.x, headBot.y, z), 0.018, chrome);
  }
  // Crank + chainring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.012, 6, 32), chrome);
  ring.position.copy(bb).setZ(0.08);
  root.add(ring);
  // Seat post + saddle
  tube(seatTop, new THREE.Vector3(-0.35, 1.45, 0), 0.018, chrome);
  const saddle = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 10), leather);
  saddle.scale.set(1.4, 0.35, 0.8);
  saddle.position.set(-0.35, 1.5, 0);
  root.add(saddle);
  // Stem + swept handlebar
  tube(headTop, new THREE.Vector3(0.72, 1.5, 0), 0.02, chrome);
  const bar = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.45, 1.55, -0.32), new THREE.Vector3(0.68, 1.52, -0.22), new THREE.Vector3(0.72, 1.5, 0),
    new THREE.Vector3(0.68, 1.52, 0.22), new THREE.Vector3(0.45, 1.55, 0.32),
  ]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(bar, 30, 0.018, 8), chrome));
  // Front basket (wire box)
  const basket = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.28, 0.45, 5, 3, 5),
    new THREE.MeshStandardMaterial({ color: 0x8a5a2b, wireframe: true }));
  basket.position.set(1.02, 1.35, 0);
  root.add(basket);
  return root;
}
