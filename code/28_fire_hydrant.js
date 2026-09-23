// Prompt 28: "A red cast-iron fire hydrant with a domed bonnet, a pentagonal operating nut, two side hose outlets with chained caps, and a flanged base bolted to the sidewalk."
export const meta = { id: '28', name: 'Fire Hydrant', prompt: 'A red cast-iron fire hydrant with a domed bonnet, a pentagonal operating nut, two side hose outlets with chained caps, and a flanged base bolted to the sidewalk.' };

export function build(THREE) {
  const root = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({ color: 0xb0201b, metalness: 0.4, roughness: 0.45 });
  const cap = new THREE.MeshStandardMaterial({ color: 0xd9b23a, metalness: 0.6, roughness: 0.35 });
  const iron = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.4 });
  const concrete = new THREE.MeshStandardMaterial({ color: 0xa9a59c, roughness: 1 });

  // Sidewalk slab
  const slab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 2.2), concrete);
  slab.position.y = -0.06;
  root.add(slab);

  // Body via lathe: flange, barrel, collar, dome
  const prof = [[0.001, 0], [0.5, 0], [0.5, 0.08], [0.36, 0.1], [0.34, 0.14], [0.3, 0.16], [0.3, 0.95],
    [0.36, 0.97], [0.36, 1.05], [0.3, 1.07]];
  for (let i = 1; i <= 10; i++) { const a = (i / 10) * Math.PI / 2; prof.push([0.3 * Math.cos(a), 1.07 + 0.22 * Math.sin(a)]); }
  root.add(new THREE.Mesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(Math.max(x, 0.001), y)), 40), red));

  // Flange bolts
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 6), iron);
    b.position.set(Math.cos(a) * 0.43, 0.1, Math.sin(a) * 0.43);
    root.add(b);
  }
  // Pentagonal operating nut (5-sided cylinder)
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.12, 5), cap);
  nut.position.y = 1.34;
  root.add(nut);

  // Side outlets (nozzle + cap + chain), plus a larger front pumper outlet
  const outlet = (angle, r, len) => {
    const g = new THREE.Group();
    g.rotation.y = angle;
    g.position.y = 0.72;
    root.add(g);
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.1, len, 24), red);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.x = 0.3 + len / 2 - 0.05;
    g.add(nozzle);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.15, r * 1.15, 0.08, 6), cap);
    c.rotation.z = Math.PI / 2;
    c.position.x = 0.3 + len;
    g.add(c);
    // chain: small torus links hanging below
    for (let k = 0; k < 5; k++) {
      const link = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.005, 4, 10), iron);
      link.position.set(0.32 + len - k * 0.02, -r - 0.02 - k * 0.03, 0);
      link.rotation.y = k % 2 ? Math.PI / 2 : 0;
      g.add(link);
    }
  };
  outlet(0, 0.09, 0.18);
  outlet(Math.PI, 0.09, 0.18);
  outlet(-Math.PI / 2, 0.13, 0.16);
  return root;
}
