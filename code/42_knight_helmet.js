// Prompt 42: "A medieval knight's great helm on a display stand: a steel bucket helmet with a riveted cross reinforcement, eye slits, breathing holes, and a red plume."
export const meta = { id: '42', name: "Knight's Great Helm", prompt: "A medieval knight's great helm on a display stand: a steel bucket helmet with a riveted cross reinforcement, eye slits, breathing holes, and a red plume." };

export function build(THREE) {
  const root = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0xa9adb3, metalness: 1, roughness: 0.28 });
  const dark = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x4a2f1b, roughness: 0.6 });
  const plumeMat = new THREE.MeshStandardMaterial({ color: 0xa3171b, roughness: 0.9, flatShading: true });
  const H0 = 1.1; // helmet bottom height on the stand

  // Stand: base + post
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.12, 32), wood);
  base.position.y = 0.06;
  root.add(base);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, H0 + 0.2, 12), wood);
  post.position.y = (H0 + 0.2) / 2;
  root.add(post);

  // Helmet shell: lathe of a flat-topped cylinder with a slight taper and rounded crown
  const prof = [[0.46, 0], [0.47, 0.3], [0.46, 0.7], [0.44, 0.85], [0.38, 0.95], [0.25, 1.0], [0.001, 1.02]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const shell = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), steel);
  shell.material = steel.clone(); shell.material.side = THREE.DoubleSide;
  shell.position.y = H0;
  shell.scale.z = 1.08;
  root.add(shell);

  // Cross reinforcement on the face (+z): vertical and horizontal straps with rivets
  const strapV = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.95, 0.03), steel);
  strapV.position.set(0, H0 + 0.5, 0.5);
  root.add(strapV);
  const strapH = new THREE.Mesh(new THREE.CylinderGeometry(0.485, 0.485, 0.1, 48, 1, true, -1.1, 2.2), steel);
  strapH.material = steel.clone(); strapH.material.side = THREE.DoubleSide;
  strapH.scale.z = 1.08;
  strapH.position.y = H0 + 0.62;
  root.add(strapH);
  for (let i = 0; i < 6; i++) {
    const rv = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), steel);
    rv.position.set(0, H0 + 0.1 + i * 0.15, 0.52);
    root.add(rv);
  }

  // Eye slits: two dark boxes above the horizontal strap, curved onto the face
  for (const s of [-1, 1]) {
    const a = s * 0.35;
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.03), dark);
    slit.position.set(Math.sin(a) * 0.5, H0 + 0.72, Math.cos(a) * 0.5 * 1.08);
    slit.rotation.y = a;
    root.add(slit);
  }
  // Breathing holes: a grid on the lower right cheek
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const a = 0.35 + c * 0.16;
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.018, 8), dark);
    hole.position.set(Math.sin(a) * 0.473, H0 + 0.2 + r * 0.1, Math.cos(a) * 0.473 * 1.08 + 0.003);
    hole.rotation.y = a;
    root.add(hole);
  }

  // Plume: a fan of feather-like stretched icosahedra from the crown
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 1), plumeMat);
    f.scale.set(0.5, 3.5, 0.9);
    const ang = -0.8 + t * 1.3;
    f.position.set(0, H0 + 1.05 + Math.cos(ang) * 0.25, -Math.sin(ang) * 0.25 - 0.05);
    f.rotation.x = ang;
    root.add(f);
  }
  const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.12, 16), steel);
  holder.position.y = H0 + 1.06;
  root.add(holder);
  return root;
}
