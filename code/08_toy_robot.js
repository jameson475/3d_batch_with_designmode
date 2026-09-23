// Prompt 08: "A boxy tin toy robot with antenna, glowing eyes, chest dial panel, jointed arms with claw hands, and wind-up key."
export const meta = { id: '08', name: 'Tin Toy Robot', prompt: 'A boxy tin toy robot with antenna, glowing eyes, chest dial panel, jointed arms with claw hands, and wind-up key.' };

export function build(THREE) {
  const root = new THREE.Group();
  const tin = new THREE.MeshStandardMaterial({ color: 0x8fa3ad, metalness: 0.8, roughness: 0.3 });
  const accent = new THREE.MeshStandardMaterial({ color: 0xe0a526, metalness: 0.5, roughness: 0.35 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2b2f33, metalness: 0.6, roughness: 0.5 });
  const glow = new THREE.MeshStandardMaterial({ color: 0x9ff3ff, emissive: 0x33d6ff, emissiveIntensity: 2 });
  const box = (w, h, d, mat, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    root.add(m);
    return m;
  };

  // Legs + feet
  for (const s of [-1, 1]) {
    box(0.32, 0.9, 0.36, tin, s * 0.3, 0.55, 0);
    box(0.42, 0.14, 0.6, dark, s * 0.3, 0.07, 0.08);
  }
  // Torso + chest panel with dials
  box(1.2, 1.2, 0.8, tin, 0, 1.6, 0);
  box(0.7, 0.5, 0.04, dark, 0, 1.7, 0.41);
  for (let i = 0; i < 3; i++) {
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 20), [accent, glow, accent][i]);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(-0.2 + i * 0.2, 1.75, 0.44);
    root.add(dial);
  }
  // Head, eyes, mouth grille, antenna
  box(0.8, 0.62, 0.66, tin, 0, 2.55, 0);
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), glow);
    eye.position.set(s * 0.18, 2.62, 0.34);
    root.add(eye);
  }
  for (let i = 0; i < 4; i++) box(0.05, 0.12, 0.03, dark, -0.12 + i * 0.08, 2.4, 0.34);
  box(0.03, 0.4, 0.03, dark, 0, 3.05, 0);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), accent);
  tip.position.set(0, 3.28, 0);
  root.add(tip);

  // Jointed arms with claws
  for (const s of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(s * 0.72, 2.05, 0);
    shoulder.rotation.z = s * 0.25;
    root.add(shoulder);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), accent);
    shoulder.add(ball);
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.6, 12), tin);
    upper.position.y = -0.35;
    shoulder.add(upper);
    const elbow = new THREE.Group();
    elbow.position.y = -0.68;
    elbow.rotation.x = -0.7;
    shoulder.add(elbow);
    const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12), tin);
    fore.position.y = -0.28;
    elbow.add(fore);
    for (const c of [-1, 1]) {
      const claw = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.08), dark);
      claw.position.set(c * 0.07, -0.6, 0);
      claw.rotation.z = c * 0.3;
      elbow.add(claw);
    }
  }

  // Wind-up key on back
  box(0.05, 0.05, 0.3, accent, 0, 1.6, -0.55);
  const key = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 8, 24), accent);
  key.position.set(0, 1.6, -0.72);
  root.add(key);

  return root;
}
