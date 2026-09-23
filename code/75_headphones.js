// Prompt 75: "Over-ear headphones with a padded headband and cushioned ear cups."
export const meta = { id: '75', name: 'Over-Ear Headphones', prompt: 'Over-ear headphones with a padded headband and cushioned ear cups.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: 0x2b2d31, metalness: 0.3, roughness: 0.4 });
  const pad = new THREE.MeshStandardMaterial({ color: 0x151517, roughness: 0.95 });
  const accent = new THREE.MeshStandardMaterial({ color: 0xd9a441, metalness: 1, roughness: 0.3 });
  const R = 0.95, cy = 1.1;
  // Headband: half torus + padded inner arc
  const band = new THREE.Mesh(new THREE.TorusGeometry(R, 0.06, 12, 48, Math.PI), shell);
  band.position.y = cy;
  band.scale.z = 1.8;
  root.add(band);
  const cushion = new THREE.Mesh(new THREE.TorusGeometry(R - 0.08, 0.07, 12, 32, Math.PI * 0.6), pad);
  cushion.position.y = cy;
  cushion.rotation.z = Math.PI * 0.2;
  cushion.scale.z = 2.2;
  root.add(cushion);
  for (const s of [-1, 1]) {
    // Slider arm + yoke
    const slider = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.1), accent);
    slider.position.set(s * R, cy - 0.15, 0);
    root.add(slider);
    const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 8, 24, Math.PI), accent);
    yoke.rotation.set(0, Math.PI / 2, Math.PI);
    yoke.position.set(s * R, cy - 0.38, 0);
    root.add(yoke);
    // Ear cup: oval capsule with cushion ring on the inner face
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.22, 40), shell);
    cup.rotation.z = Math.PI / 2;
    cup.scale.set(1, 1, 1.25);
    cup.position.set(s * (R + 0.02), cy - 0.8, 0);
    root.add(cup);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.1, 12, 40), pad);
    ring.rotation.y = Math.PI / 2;
    ring.scale.set(1, 1.25, 1);
    ring.position.set(s * (R - 0.12), cy - 0.8, 0);
    root.add(ring);
    const logo = new THREE.Mesh(new THREE.CircleGeometry(0.12, 24), accent);
    logo.rotation.y = s * Math.PI / 2;
    logo.position.set(s * (R + 0.135), cy - 0.8, 0);
    root.add(logo);
  }
  root.rotation.y = 0.5;
  return root;
}
