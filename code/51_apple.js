// Prompt 51: "A red apple."
export const meta = { id: '51', name: 'Apple', prompt: 'A red apple.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  // Apple profile: lathe with dimples at top and bottom
  const pts = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32, a = -Math.PI / 2 + t * Math.PI;
    let r = Math.cos(a) * (0.9 + 0.12 * Math.sin(a + 0.6));
    let y = Math.sin(a) * 0.85 + 0.85;
    if (t < 0.08 || t > 0.92) y += (t < 0.5 ? 0.08 : -0.12) * (1 - Math.abs(t - (t < 0.5 ? 0 : 1)) / 0.08);
    pts.push(new THREE.Vector2(Math.max(r, 0.001), y));
  }
  root.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 48), new THREE.MeshPhysicalMaterial({ color: 0xc0171e, roughness: 0.35, clearcoat: 0.6 })));
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.35, 8), new THREE.MeshStandardMaterial({ color: 0x5a3a1e }));
  stem.position.set(0.03, 1.72, 0);
  stem.rotation.z = -0.2;
  root.add(stem);
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), new THREE.MeshStandardMaterial({ color: 0x3f8a2e, roughness: 0.6 }));
  leaf.scale.set(1, 0.12, 0.45);
  leaf.position.set(0.2, 1.78, 0);
  leaf.rotation.z = 0.4;
  root.add(leaf);
  return root;
}
