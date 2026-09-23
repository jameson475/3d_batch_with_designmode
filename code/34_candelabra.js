// Prompt 34: "An ornate silver five-arm candelabra with S-curved arms, drip cups, lit white candles with flames, and a turned base."
export const meta = { id: '34', name: 'Silver Candelabra', prompt: 'An ornate silver five-arm candelabra with S-curved arms, drip cups, lit white candles with flames, and a turned base.' };

export function build(THREE) {
  const root = new THREE.Group();
  const silver = new THREE.MeshStandardMaterial({ color: 0xdadde2, metalness: 1, roughness: 0.18 });
  const wax = new THREE.MeshStandardMaterial({ color: 0xf8f4ea, roughness: 0.6 });
  const flameMat = new THREE.MeshStandardMaterial({ color: 0xffe08a, emissive: 0xffa11a, emissiveIntensity: 2.2, transparent: true, opacity: 0.95 });

  // Turned base + stem
  const prof = [[0.001, 0], [0.55, 0], [0.56, 0.04], [0.45, 0.1], [0.2, 0.2], [0.12, 0.3], [0.18, 0.4], [0.08, 0.5], [0.07, 0.9], [0.14, 1.0], [0.1, 1.05], [0.06, 1.1], [0.06, 1.5], [0.001, 1.5]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  root.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 40), silver));

  const cupProf = [[0.001, 0], [0.05, 0], [0.12, 0.04], [0.14, 0.07], [0.08, 0.08], [0.07, 0.15], [0.001, 0.15]].map(([x, y]) => new THREE.Vector2(x, y));
  const cupGeo = new THREE.LatheGeometry(cupProf, 24);

  function candle(pos, h) {
    const cup = new THREE.Mesh(cupGeo, silver);
    cup.position.copy(pos);
    root.add(cup);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, h, 16), wax);
    c.position.set(pos.x, pos.y + 0.15 + h / 2, pos.z);
    root.add(c);
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.04, 4), new THREE.MeshBasicMaterial({ color: 0x111111 }));
    wick.position.set(pos.x, pos.y + 0.15 + h + 0.02, pos.z);
    root.add(wick);
    // Flame: teardrop lathe
    const fp = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; fp.push(new THREE.Vector2(0.035 * Math.sin(Math.PI * Math.pow(t, 0.6)) + 0.0005, t * 0.16)); }
    const f = new THREE.Mesh(new THREE.LatheGeometry(fp, 16), flameMat);
    f.position.set(pos.x, pos.y + 0.15 + h + 0.03, pos.z);
    root.add(f);
  }
  // Center candle
  candle(new THREE.Vector3(0, 1.5, 0), 0.6);

  // Four S-curved arms (two tiers) sweeping out then up
  const arms = [[0, 0.62, 1.15], [Math.PI, 0.62, 1.15], [Math.PI / 2, 0.42, 1.3], [-Math.PI / 2, 0.42, 1.3]];
  for (const [a, reach, rise] of arms) {
    const dir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const base = new THREE.Vector3(0, 1.05, 0);
    const pts = [
      base.clone(),
      base.clone().addScaledVector(dir, reach * 0.3).add(new THREE.Vector3(0, -0.12, 0)),
      base.clone().addScaledVector(dir, reach * 0.75).add(new THREE.Vector3(0, -0.02, 0)),
      base.clone().addScaledVector(dir, reach).add(new THREE.Vector3(0, rise - 1.05 - 0.05, 0)),
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.028, 10), silver));
    // Decorative scroll at the arm's elbow
    const scroll = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 20, Math.PI * 1.5), silver);
    scroll.position.copy(pts[1]).add(new THREE.Vector3(0, -0.06, 0));
    scroll.rotation.y = -a;
    root.add(scroll);
    const top = pts[3];
    candle(new THREE.Vector3(top.x, rise, top.z), 0.45);
  }
  const glow = new THREE.PointLight(0xffb45a, 2.5, 5);
  glow.position.y = 2.2;
  root.add(glow);
  return root;
}
