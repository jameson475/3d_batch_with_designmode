// Prompt 91: "A garden snail with a spiral shell and eye stalks."
export const meta = { id: '91', name: 'Garden Snail', prompt: 'A garden snail with a spiral shell and eye stalks.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xb7a58a, roughness: 0.6 });
  // Body: tapered capsule stretched along x
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 1.4, 8, 20), skin);
  body.rotation.z = Math.PI / 2;
  body.scale.set(0.7, 1, 1);
  body.position.set(0, 0.18, 0);
  root.add(body);
  // Shell: tube swept along a logarithmic spiral whose radius shrinks inward (in the XY plane)
  const pts = [], radii = [];
  const turns = 3.2, N = 120;
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = t * turns * Math.PI * 2;
    const r = 0.55 * Math.exp(-0.45 * a / Math.PI);
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, t * 0.15));
    radii.push(0.3 * Math.exp(-0.45 * a / Math.PI) + 0.01);
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const g = new THREE.TubeGeometry(curve, N, 1, 16, false);
  const p = g.attributes.position;
  for (let i = 0; i <= N; i++) {
    const c = curve.getPointAt(i / N), k = radii[i];
    for (let j = 0; j <= 16; j++) { const idx = i * 17 + j; p.setXYZ(idx, c.x + (p.getX(idx) - c.x) * k, c.y + (p.getY(idx) - c.y) * k, c.z + (p.getZ(idx) - c.z) * k); }
  }
  // Banded coloring along the spiral
  const cols = [];
  for (let i = 0; i <= N; i++) for (let j = 0; j <= 16; j++) { const c = new THREE.Color(Math.sin(i * 0.9) > 0.3 ? 0x6b3e1f : 0xc88a4a); cols.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  g.computeVertexNormals();
  const shell = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.35, clearcoat: 0.6 }));
  shell.position.set(-0.15, 0.68, 0);
  root.add(shell);
  // Eye stalks + tentacles
  for (const [z, len] of [[-0.1, 0.5], [0.1, 0.5], [-0.12, 0.2], [0.12, 0.2]]) {
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.035, len, 8), skin);
    stalk.position.set(0.85, 0.3 + len / 2, z);
    stalk.rotation.set(z * 2, 0, -0.35);
    root.add(stalk);
    if (len > 0.3) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), new THREE.MeshStandardMaterial({ color: 0x2a2018 }));
      eye.position.set(0.85 + Math.sin(0.35) * len / 2, 0.3 + len / 2 + Math.cos(0.35) * len / 2, z + Math.sin(z * 2) * len / 2 * -1);
      root.add(eye);
    }
  }
  return root;
}
