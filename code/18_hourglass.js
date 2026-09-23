// Prompt 18: "An antique hourglass with a turned wooden frame, three spindle posts, a glass double bulb, and sand mid-flow."
export const meta = { id: '18', name: 'Antique Hourglass', prompt: 'An antique hourglass with a turned wooden frame, three spindle posts, a glass double bulb, and sand mid-flow.' };

export function build(THREE) {
  const root = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x5e3a20, roughness: 0.5 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 0.9, thickness: 0.05, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xe0b877, roughness: 1 });
  const H = 2.4, half = H / 2;

  // Glass: lathe of a double bulb (radius as function of height)
  const bulbR = (y) => 0.05 + 0.5 * Math.pow(Math.sin(Math.PI * Math.abs(y) / half), 0.9) * (Math.abs(y) < half ? 1 : 0);
  const prof = [];
  for (let i = 0; i <= 60; i++) {
    const y = -half + (i / 60) * H;
    prof.push(new THREE.Vector2(Math.max(bulbR(y), 0.04), y));
  }
  const g = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), glass);
  g.position.y = half + 0.2;
  root.add(g);

  // Sand: bottom mound (lathe clipped to bulb), top remainder (inverted cone), falling stream
  const bottom = [];
  const fillH = 0.55;
  for (let i = 0; i <= 20; i++) {
    const y = -half + 0.02 + (i / 20) * fillH;
    const r = Math.max(bulbR(y) - 0.03, 0.01) * (1 - Math.pow(i / 20, 3) * 0.9);
    bottom.push(new THREE.Vector2(r, y));
  }
  bottom.unshift(new THREE.Vector2(0.001, -half + 0.02));
  bottom.push(new THREE.Vector2(0.001, -half + 0.02 + fillH + 0.04));
  const sb = new THREE.Mesh(new THREE.LatheGeometry(bottom, 32), sandMat);
  sb.position.y = half + 0.2;
  root.add(sb);
  const top = new THREE.Mesh(new THREE.ConeGeometry(0.33, 0.45, 32), sandMat);
  top.rotation.x = Math.PI;
  top.position.y = half + 0.2 + 0.35;
  root.add(top);
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, half - 0.1, 6), sandMat);
  stream.position.y = half + 0.2 - (half - 0.1) / 2 + 0.1;
  root.add(stream);

  // Turned end plates
  for (const y of [0.1, H + 0.3]) {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 40), wood);
    plate.position.y = y;
    root.add(plate);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 8, 40), wood);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = y;
    root.add(lip);
  }

  // Three turned spindles (lathe with bead profile)
  const sp = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    sp.push(new THREE.Vector2(0.05 + 0.025 * Math.abs(Math.sin(t * Math.PI * 5)), t * H));
  }
  const spGeo = new THREE.LatheGeometry(sp, 12);
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + Math.PI / 6;
    const s = new THREE.Mesh(spGeo, wood);
    s.position.set(Math.cos(a) * 0.66, 0.2, Math.sin(a) * 0.66);
    root.add(s);
  }
  return root;
}
