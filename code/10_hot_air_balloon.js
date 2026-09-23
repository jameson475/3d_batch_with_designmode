// Prompt 10: "A hot air balloon with a teardrop envelope in alternating colored gores, suspension ropes, a burner, and a wicker basket."
export const meta = { id: '10', name: 'Hot Air Balloon', prompt: 'A hot air balloon with a teardrop envelope in alternating colored gores, suspension ropes, a burner, and a wicker basket.' };

export function build(THREE) {
  const root = new THREE.Group();
  const colors = [0xe4572e, 0xf3a712, 0x29335c, 0xf0ece2];
  const gores = 12;

  // Teardrop profile (lathe), split into gores by angular segment
  const prof = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;                       // 0 = bottom mouth, 1 = crown
    const y = 1.6 + t * 2.6;
    const r = t < 0.6
      ? 0.35 + (1.25 - 0.35) * Math.sin((t / 0.6) * Math.PI / 2)
      : 1.25 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.6) / 0.4, 2)));
    prof.push(new THREE.Vector2(Math.max(r, 0.001), y));
  }
  const seg = (Math.PI * 2) / gores;
  for (let g = 0; g < gores; g++) {
    const m = new THREE.Mesh(
      new THREE.LatheGeometry(prof, 6, g * seg, seg),
      new THREE.MeshStandardMaterial({ color: colors[g % colors.length], roughness: 0.6, side: THREE.DoubleSide })
    );
    root.add(m);
  }

  // Basket with wicker-ish rim
  const wicker = new THREE.MeshStandardMaterial({ color: 0x9c6b3c, roughness: 0.95 });
  const basket = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.6), wicker);
  basket.position.y = 0.225;
  root.add(basket);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 4), new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9 }));
  rim.rotation.set(Math.PI / 2, 0, Math.PI / 4);
  rim.position.y = 0.46;
  root.add(rim);

  // Burner
  const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.18, 16),
    new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.3 }));
  burner.position.y = 1.05;
  root.add(burner);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 12),
    new THREE.MeshStandardMaterial({ color: 0x7fb8ff, emissive: 0xff8c1a, emissiveIntensity: 2 }));
  flame.position.y = 1.3;
  root.add(flame);

  // Ropes: basket corners -> envelope mouth
  const ropeMat = new THREE.LineBasicMaterial({ color: 0x3b2a1a });
  for (let c = 0; c < 4; c++) {
    const a = Math.PI / 4 + c * Math.PI / 2;
    const from = new THREE.Vector3(Math.cos(a) * 0.4, 0.46, Math.sin(a) * 0.4);
    const to = new THREE.Vector3(Math.cos(a) * 0.36, 1.62, Math.sin(a) * 0.36);
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, to]), ropeMat));
    const toBurner = new THREE.Vector3(Math.cos(a) * 0.12, 1.05, Math.sin(a) * 0.12);
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([to, toBurner]), ropeMat));
  }

  return root;
}
