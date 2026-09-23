// Prompt 87: "Toy blocks."
export const meta = { id: '87', name: 'Toy Blocks', prompt: 'Toy blocks.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const cols = [0xe63946, 0x457b9d, 0xf4a261, 0x2a9d8f, 0xe9c46a, 0x8338ec];
  const s = 0.6;
  // Bevelled cube with a raised letter-like square on each face
  const block = (x, y, z, rot, c) => {
    const g = new THREE.Group();
    const shape = new THREE.Shape();
    shape.moveTo(-s / 2 + 0.05, -s / 2); shape.lineTo(s / 2 - 0.05, -s / 2); shape.lineTo(s / 2, -s / 2 + 0.05); shape.lineTo(s / 2, s / 2 - 0.05);
    shape.lineTo(s / 2 - 0.05, s / 2); shape.lineTo(-s / 2 + 0.05, s / 2); shape.lineTo(-s / 2, s / 2 - 0.05); shape.lineTo(-s / 2, -s / 2 + 0.05); shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: s - 0.1, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.05, bevelSegments: 2 });
    geo.translate(0, 0, -(s - 0.1) / 2);
    g.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xf1e0c2, roughness: 0.7 })));
    const inset = new THREE.MeshStandardMaterial({ color: cols[c], roughness: 0.5 });
    for (const [ax, sign] of [['x', 1], ['x', -1], ['y', 1], ['z', 1], ['z', -1]]) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(ax === 'x' ? 0.02 : 0.36, ax === 'y' ? 0.02 : 0.36, ax === 'z' ? 0.02 : 0.36), inset);
      f.position[ax] = sign * (s / 2 + 0.005);
      g.add(f);
    }
    g.position.set(x, y + s / 2, z);
    g.rotation.y = rot;
    root.add(g);
  };
  block(-0.35, 0, 0, 0.1, 0); block(0.35, 0, 0.05, -0.15, 1); block(0, s, 0.02, 0.3, 2);
  block(0.9, 0, 0.7, 0.6, 3); block(-0.8, 0, 0.8, -0.4, 4); block(0.05, s * 2, 0, -0.2, 5);
  return root;
}
