// Prompt 64: "A Victorian cast-iron street lamp with a lantern head and a fluted post."
export const meta = { id: '64', name: 'Victorian Street Lamp', prompt: 'A Victorian cast-iron street lamp with a lantern head and a fluted post.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const iron = new THREE.MeshStandardMaterial({ color: 0x1f2a24, metalness: 0.7, roughness: 0.45 });
  const glow = new THREE.MeshStandardMaterial({ color: 0xfff1c4, emissive: 0xffc861, emissiveIntensity: 1.6, transparent: true, opacity: 0.85 });
  // Base + fluted post (radius modulated by cos(12a))
  const bp = [[0.001, 0], [0.4, 0], [0.4, 0.1], [0.3, 0.2], [0.3, 0.45], [0.18, 0.6], [0.13, 0.7], [0.001, 0.7]].map(([x, y]) => new THREE.Vector2(x, y));
  root.add(new THREE.Mesh(new THREE.LatheGeometry(bp, 32), iron));
  const pg = new THREE.CylinderGeometry(0.08, 0.11, 3.0, 48, 20);
  const p = pg.attributes.position;
  for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getZ(i), p.getX(i)), k = 1 + 0.08 * Math.cos(a * 12); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); }
  pg.computeVertexNormals();
  const post = new THREE.Mesh(pg, iron);
  post.position.y = 2.2;
  root.add(post);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 8, 24), iron);
  collar.rotation.x = Math.PI / 2; collar.position.y = 3.7;
  root.add(collar);
  // Ladder bar
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), iron);
  bar.rotation.z = Math.PI / 2; bar.position.y = 3.5;
  root.add(bar);
  // Lantern head: tapered 4-sided glass box with iron frame, roof and finial
  const Y = 3.75;
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.22, 0.6, 4), glow);
  lamp.rotation.y = Math.PI / 4;
  lamp.position.y = Y + 0.3;
  root.add(lamp);
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    const e = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.62, 6), iron);
    e.position.set(Math.cos(a) * 0.29, Y + 0.3, Math.sin(a) * 0.29);
    e.rotation.set(Math.sin(a) * 0.2, 0, -Math.cos(a) * 0.2);
    root.add(e);
  }
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.35, 4), iron);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = Y + 0.78;
  root.add(roof);
  const fin = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), iron);
  fin.position.y = Y + 1.0;
  root.add(fin);
  const light = new THREE.PointLight(0xffd08a, 3, 6);
  light.position.y = Y + 0.3;
  root.add(light);
  return root;
}
