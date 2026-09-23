// Prompt 26: "A dark green wine bottle with a cork and label beside a stemmed wine glass half-filled with red wine."
export const meta = { id: '26', name: 'Wine Bottle & Glass', prompt: 'A dark green wine bottle with a cork and label beside a stemmed wine glass half-filled with red wine.' };

export function build(THREE) {
  const root = new THREE.Group();
  const bottleGlass = new THREE.MeshPhysicalMaterial({ color: 0x1f4a2a, roughness: 0.08, transmission: 0.4, thickness: 0.3, clearcoat: 1 });
  const clear = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.03, transmission: 0.95, thickness: 0.05, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
  const wine = new THREE.MeshPhysicalMaterial({ color: 0x6b0f1a, roughness: 0.1, clearcoat: 1 });

  // Bordeaux bottle profile
  const bp = [[0.001, 0], [0.34, 0], [0.36, 0.03], [0.36, 1.6], [0.33, 1.8], [0.18, 2.05], [0.12, 2.3], [0.12, 2.65], [0.14, 2.68], [0.14, 2.75], [0.001, 2.75]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const bottle = new THREE.Mesh(new THREE.LatheGeometry(bp, 48), bottleGlass);
  bottle.position.x = -0.55;
  root.add(bottle);
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0xb58a5a, roughness: 1 }));
  cork.position.set(-0.55, 2.8, 0);
  root.add(cork);
  const foil = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.13, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0x7a1020, metalness: 0.7, roughness: 0.3 }));
  foil.position.set(-0.55, 2.6, 0);
  root.add(foil);
  // Label: open cylinder segment facing the viewer
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.365, 0.365, 0.6, 32, 1, true, -Math.PI / 2.2, Math.PI / 1.1),
    new THREE.MeshStandardMaterial({ color: 0xefe6d2, roughness: 0.9, side: THREE.DoubleSide }));
  label.position.set(-0.55, 0.85, 0);
  root.add(label);
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.367, 0.367, 0.06, 32, 1, true, -Math.PI / 2.2, Math.PI / 1.1),
    new THREE.MeshStandardMaterial({ color: 0x7a1020, side: THREE.DoubleSide }));
  stripe.position.set(-0.55, 0.95, 0);
  root.add(stripe);

  // Wine glass: foot, stem, tulip bowl (thin-walled lathe)
  const bowl = (y) => 0.3 * Math.sin(Math.PI * Math.min(1, (y / 0.7) * 0.75 + 0.05));
  const gp = [[0.001, 0], [0.28, 0], [0.28, 0.015], [0.04, 0.03], [0.025, 0.1], [0.025, 0.85]].map(([x, y]) => new THREE.Vector2(x, y));
  for (let i = 1; i <= 20; i++) { const y = (i / 20) * 0.7; gp.push(new THREE.Vector2(bowl(y) + 0.005, 0.85 + y)); }
  for (let i = 20; i >= 1; i--) { const y = (i / 20) * 0.7; gp.push(new THREE.Vector2(bowl(y) - 0.005, 0.85 + y)); }
  const glassMesh = new THREE.Mesh(new THREE.LatheGeometry(gp, 48), clear);
  glassMesh.position.x = 0.5;
  root.add(glassMesh);
  // Wine: solid lathe filling the bowl to 45%
  const wp = [new THREE.Vector2(0.001, 0.87)];
  for (let i = 1; i <= 12; i++) { const y = (i / 12) * 0.32; wp.push(new THREE.Vector2(bowl(y) - 0.012, 0.85 + y)); }
  wp.push(new THREE.Vector2(0.001, 0.85 + 0.32));
  const w = new THREE.Mesh(new THREE.LatheGeometry(wp, 40), wine);
  w.position.x = 0.5;
  root.add(w);
  return root;
}
