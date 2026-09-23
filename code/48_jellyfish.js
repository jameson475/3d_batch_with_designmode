// Prompt 48: "A translucent glowing jellyfish with a scalloped bell, frilly oral arms, and long trailing tentacles that wave in sine curves."
export const meta = { id: '48', name: 'Glowing Jellyfish', prompt: 'A translucent glowing jellyfish with a scalloped bell, frilly oral arms, and long trailing tentacles that wave in sine curves.' };

export function build(THREE) {
  const root = new THREE.Group();
  const bellMat = new THREE.MeshPhysicalMaterial({ color: 0xc9a6ff, emissive: 0x6b3fd1, emissiveIntensity: 0.6, roughness: 0.2, transmission: 0.6, thickness: 0.4, transparent: true, opacity: 0.75, side: THREE.DoubleSide });
  const innerMat = new THREE.MeshStandardMaterial({ color: 0xff8ad8, emissive: 0xff4fbf, emissiveIntensity: 1.1, transparent: true, opacity: 0.8 });
  const tentMat = new THREE.MeshStandardMaterial({ color: 0xe6d5ff, emissive: 0x9b6bff, emissiveIntensity: 0.9, transparent: true, opacity: 0.7 });
  const Y = 2.6;

  // Bell: lathe dome, then scallop the rim by modulating the lower vertices around the circumference
  const prof = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, a = t * Math.PI * 0.55;
    prof.push(new THREE.Vector2(Math.sin(a) * 0.9 + 0.001, Math.cos(a) * 0.65));
  }
  const bg = new THREE.LatheGeometry(prof.reverse(), 96);
  const p = bg.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const rimness = Math.max(0, 1 - y / 0.3);
    const a = Math.atan2(z, x);
    const k = 1 + 0.06 * rimness * Math.cos(a * 16);
    p.setXYZ(i, x * k, y - 0.05 * rimness * (1 + Math.cos(a * 16)), z * k);
  }
  bg.computeVertexNormals();
  const bell = new THREE.Mesh(bg, bellMat);
  bell.position.y = Y;
  root.add(bell);
  // Gonads: four glowing loops inside the bell
  for (let k = 0; k < 4; k++) {
    const g = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 8, 24), innerMat);
    const a = (k / 4) * Math.PI * 2;
    g.position.set(Math.cos(a) * 0.25, Y + 0.3, Math.sin(a) * 0.25);
    g.rotation.x = Math.PI / 2;
    root.add(g);
  }

  // Oral arms: 4 wide ribbon-like tubes that spiral down with a frilly (radius-modulated) profile
  for (let k = 0; k < 4; k++) {
    const a0 = (k / 4) * Math.PI * 2 + 0.4;
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push(new THREE.Vector3(Math.cos(a0 + t * 2) * (0.15 + 0.1 * t), Y + 0.05 - t * 1.6, Math.sin(a0 + t * 2) * (0.15 + 0.1 * t)));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const g = new THREE.TubeGeometry(curve, 80, 0.09, 10, false);
    const gp = g.attributes.position;
    for (let i = 0; i <= 80; i++) {
      const c = curve.getPointAt(i / 80), k2 = (1 - 0.6 * (i / 80)) * (1 + 0.35 * Math.sin(i * 1.3));
      for (let j = 0; j <= 10; j++) {
        const idx = i * 11 + j;
        gp.setXYZ(idx, c.x + (gp.getX(idx) - c.x) * k2, c.y + (gp.getY(idx) - c.y) * k2, c.z + (gp.getZ(idx) - c.z) * k2);
      }
    }
    g.computeVertexNormals();
    root.add(new THREE.Mesh(g, innerMat));
  }

  // Tentacles: 16 thin tubes from the rim, trailing down in phase-shifted sine waves
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const pts = [];
    const len = 2.2 + (k % 3) * 0.3;
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const wave = 0.18 * t * Math.sin(t * 9 + k);
      const r = 0.85 - 0.15 * t;
      pts.push(new THREE.Vector3(Math.cos(a) * r + wave * Math.cos(a + 1.5), Y - t * len, Math.sin(a) * r + wave * Math.sin(a + 1.5)));
    }
    root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.012, 5), tentMat));
  }
  const glow = new THREE.PointLight(0xb88bff, 2.5, 5);
  glow.position.y = Y + 0.2;
  root.add(glow);
  return root;
}
