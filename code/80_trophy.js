// Prompt 80: "A gold trophy cup with two handles on a marble base."
export const meta = { id: '80', name: 'Trophy Cup', prompt: 'A gold trophy cup with two handles on a marble base.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({ color: 0xf2c14e, metalness: 1, roughness: 0.18, side: THREE.DoubleSide });
  // Marble plinth: stepped boxes with veined vertex colors
  const marble = (w, h, y) => {
    const g = new THREE.BoxGeometry(w, h, w, 12, 4, 12);
    const p = g.attributes.position, cols = [];
    for (let i = 0; i < p.count; i++) {
      const v = Math.sin(p.getX(i) * 9 + p.getY(i) * 5 + Math.sin(p.getZ(i) * 7) * 2);
      const c = new THREE.Color(0xf3f1ec).lerp(new THREE.Color(0x8e9196), Math.pow(Math.max(0, v), 12)); cols.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.2, clearcoat: 0.8 }));
    m.position.y = y;
    root.add(m);
  };
  marble(1.1, 0.25, 0.125);
  marble(0.85, 0.3, 0.4);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.14), gold);
  plate.position.set(0, 0.4, 0.426);
  root.add(plate);
  // Cup: foot, stem with knop, bowl (lathe)
  const prof = [[0.001, 0.55], [0.3, 0.55], [0.28, 0.6], [0.1, 0.68], [0.07, 0.85], [0.12, 0.9], [0.07, 0.95], [0.08, 1.05]];
  for (let i = 0; i <= 16; i++) { const t = i / 16; prof.push([0.1 + 0.42 * Math.sin((t * Math.PI) / 2), 1.05 + t * 0.85]); }
  prof.push([0.55, 1.92], [0.5, 1.92]);
  root.add(new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 48), gold));
  // Handles: S-curves on both sides
  for (const s of [-1, 1]) {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(s * 0.5, 1.8, 0), new THREE.Vector3(s * 0.82, 1.78, 0), new THREE.Vector3(s * 0.85, 1.5, 0), new THREE.Vector3(s * 0.6, 1.3, 0), new THREE.Vector3(s * 0.3, 1.15, 0),
    ]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(c, 30, 0.035, 10), gold));
  }
  return root;
}
