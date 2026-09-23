// Prompt 56: "A classic twin-bell alarm clock with a hammer between the bells and little feet."
export const meta = { id: '56', name: 'Twin-Bell Alarm Clock', prompt: 'A classic twin-bell alarm clock with a hammer between the bells and little feet.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({ color: 0xc8322b, metalness: 0.5, roughness: 0.3 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd6d8dc, metalness: 1, roughness: 0.2 });
  const ink = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const Y = 0.95;
  const bodyM = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.35, 48), red);
  bodyM.rotation.x = Math.PI / 2;
  bodyM.position.y = Y;
  root.add(bodyM);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.6, 48), new THREE.MeshStandardMaterial({ color: 0xfaf6ea }));
  face.position.set(0, Y, 0.176);
  root.add(face);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.63, 0.04, 8, 48), chrome);
  bezel.position.set(0, Y, 0.18);
  root.add(bezel);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const t = new THREE.Mesh(new THREE.PlaneGeometry(0.03, i % 3 ? 0.06 : 0.12), ink);
    t.position.set(Math.sin(a) * 0.5, Y + Math.cos(a) * 0.5, 0.178);
    t.rotation.z = -a;
    root.add(t);
  }
  const hand = (len, w, a) => { const h = new THREE.Mesh(new THREE.PlaneGeometry(w, len), ink); h.geometry.translate(0, len / 2, 0); h.position.set(0, Y, 0.18); h.rotation.z = -a; root.add(h); };
  hand(0.3, 0.035, 5.2); hand(0.45, 0.02, 0.5);
  // Bells + hammer
  for (const s of [-1, 1]) {
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), chrome);
    bell.position.set(s * 0.38, Y + 0.72, -0.02);
    bell.rotation.z = s * -0.45;
    root.add(bell);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.22, 12), chrome);
    leg.position.set(s * 0.45, Y - 0.78, 0);
    leg.rotation.z = s * 0.35;
    root.add(leg);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), chrome);
    foot.position.set(s * 0.5, 0.06, 0);
    root.add(foot);
  }
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8), chrome);
  post.position.set(0, Y + 0.78, -0.02);
  root.add(post);
  const hammer = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), chrome);
  hammer.position.set(0, Y + 0.9, -0.02);
  root.add(hammer);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 24, Math.PI), chrome);
  handle.position.set(0, Y + 0.68, -0.12);
  root.add(handle);
  return root;
}
