// Prompt 61: "A tree."
export const meta = { id: '61', name: 'Tree', prompt: 'A tree.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(61);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 1.6, 12), new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 1 }));
  trunk.position.y = 0.8;
  root.add(trunk);
  // Canopy: cluster of low-poly blobs of slightly different greens
  for (let i = 0; i < 12; i++) {
    const r = 0.45 + rng() * 0.3;
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.28 + rng() * 0.05, 0.45, 0.35 + rng() * 0.1), roughness: 0.9, flatShading: true }));
    const a = rng() * Math.PI * 2, d = rng() * 0.7;
    blob.position.set(Math.cos(a) * d, 1.9 + rng() * 0.9, Math.sin(a) * d);
    root.add(blob);
  }
  return root;
}
