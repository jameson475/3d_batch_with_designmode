// Prompt 70: "A skateboard with a concave deck, kicktails, trucks, and colorful wheels."
export const meta = { id: '70', name: 'Skateboard', prompt: 'A skateboard with a concave deck, kicktails, trucks, and colorful wheels.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const L = 2.6, W = 0.65;
  // Deck: subdivided rounded plate; bend ends up (kicktails) and the middle into a concave
  const s = new THREE.Shape();
  s.moveTo(-L / 2 + W / 2, -W / 2); s.lineTo(L / 2 - W / 2, -W / 2); s.absarc(L / 2 - W / 2, 0, W / 2, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(-L / 2 + W / 2, W / 2); s.absarc(-L / 2 + W / 2, 0, W / 2, Math.PI / 2, Math.PI * 1.5, false);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false, curveSegments: 20, steps: 1 });
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const tail = Math.max(0, Math.abs(x) - (L / 2 - 0.45));
    const lift = 0.9 * tail * tail + 0.35 * tail;
    const concave = 0.06 * Math.pow((2 * y) / W, 2);
    p.setZ(i, p.getZ(i) + lift + concave);
  }
  g.computeVertexNormals();
  g.rotateX(-Math.PI / 2);
  // Deck with a colorful grip underside: two materials via groups (top black grip, sides/bottom maple)
  const deck = new THREE.Mesh(g, [new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 1 }), new THREE.MeshStandardMaterial({ color: 0xd9b27a, roughness: 0.6 })]);
  deck.position.y = 0.38;
  root.add(deck);
  // Trucks + wheels
  const metal = new THREE.MeshStandardMaterial({ color: 0xbfc3c8, metalness: 1, roughness: 0.3 });
  const wheelCols = [0x2ec4b6, 0xff9f1c, 0xe71d36, 0x7b2cbf];
  [-0.8, 0.8].forEach((x, ti) => {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.18), metal);
    base.position.set(x, 0.33, 0);
    root.add(base);
    const hanger = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.55), metal);
    hanger.position.set(x, 0.24, 0);
    root.add(hanger);
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 8), metal);
    axle.rotation.x = Math.PI / 2;
    axle.position.set(x, 0.22, 0);
    root.add(axle);
    for (const z of [-0.34, 0.34]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.1, 24), new THREE.MeshStandardMaterial({ color: wheelCols[ti * 2 + (z > 0 ? 1 : 0)], roughness: 0.4 }));
      w.rotation.x = Math.PI / 2;
      w.position.set(x, 0.12, z);
      root.add(w);
    }
  });
  return root;
}
