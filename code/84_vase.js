// Prompt 84: "A vase."
export const meta = { id: '84', name: 'Ceramic Vase', prompt: 'A vase.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const prof = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const r = 0.25 + 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.25)) * (1 - t * 0.3) + (t > 0.85 ? (t - 0.85) * 1.2 : 0);
    prof.push(new THREE.Vector2(Math.max(r, 0.12), t * 2.2));
  }
  prof.unshift(new THREE.Vector2(0.001, 0));
  const g = new THREE.LatheGeometry(prof, 64);
  // Glaze: vertical gradient from deep teal to cream at the lip
  const p = g.attributes.position, cols = [];
  for (let i = 0; i < p.count; i++) { const c = new THREE.Color(0x1f5f6b).lerp(new THREE.Color(0xe8dcc0), Math.pow(p.getY(i) / 2.2, 3)); cols.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  root.add(new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.25, clearcoat: 0.8, side: THREE.DoubleSide })));
  return root;
}
