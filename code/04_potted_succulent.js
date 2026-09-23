// Prompt 04: "A small terracotta pot holding an echeveria succulent with rosette leaves arranged in a golden-angle spiral."
export const meta = { id: '04', name: 'Potted Succulent', prompt: 'A small terracotta pot holding an echeveria succulent with rosette leaves arranged in a golden-angle spiral.' };

export function build(THREE) {
  const root = new THREE.Group();
  const clay = new THREE.MeshStandardMaterial({ color: 0xc0643c, roughness: 0.9 });

  // Pot (tapered) + rim
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.55, 1.0, 40), clay);
  pot.position.y = 0.5;
  root.add(pot);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.8, 0.18, 40), clay);
  rim.position.y = 1.0;
  root.add(rim);
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.74, 32), new THREE.MeshStandardMaterial({ color: 0x4a3222, roughness: 1 }));
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 1.06;
  root.add(soil);

  // Rosette: leaves on a golden-angle spiral, inner leaves smaller and more upright
  const golden = Math.PI * (3 - Math.sqrt(5));
  const leafGeo = new THREE.SphereGeometry(1, 16, 12);
  const N = 34;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);            // 0 = center, 1 = outermost
    const size = 0.12 + 0.28 * t;
    const leaf = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.36 - 0.06 * t, 0.35, 0.55 - 0.12 * t), roughness: 0.55,
    }));
    leaf.scale.set(size * 0.45, size * 0.12, size);
    const pivot = new THREE.Group();
    pivot.rotation.y = i * golden;
    leaf.position.z = size * 0.8;
    leaf.rotation.x = -(1.1 - 0.9 * t);  // tilt: upright at center, flat at edge
    pivot.add(leaf);
    pivot.position.y = 1.1 + 0.15 * (1 - t);
    root.add(pivot);
  }

  return root;
}
