// Prompt 12: "A Dutch windmill with an octagonal tapered tower, a thatched cap, four lattice sails, and a wraparound balcony."
export const meta = { id: '12', name: 'Dutch Windmill', prompt: 'A Dutch windmill with an octagonal tapered tower, a thatched cap, four lattice sails, and a wraparound balcony.' };

export function build(THREE) {
  const root = new THREE.Group();
  const brick = new THREE.MeshStandardMaterial({ color: 0x7d3b2b, roughness: 0.9, flatShading: true });
  const board = new THREE.MeshStandardMaterial({ color: 0x3e5a4a, roughness: 0.8, flatShading: true });
  const thatch = new THREE.MeshStandardMaterial({ color: 0xa88a52, roughness: 1, flatShading: true });
  const wood = new THREE.MeshStandardMaterial({ color: 0xe8e1d0, roughness: 0.7 });
  const sailCloth = new THREE.MeshStandardMaterial({ color: 0xf4efe2, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });

  // Octagonal tower: brick base + tapered boarded upper
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 1.0, 8), brick);
  base.position.y = 0.5;
  root.add(base);
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.15, 2.8, 8), board);
  tower.position.y = 1.0 + 1.4;
  root.add(tower);

  // Balcony (stage) at the base/tower join
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.06, 8), wood);
  deck.position.y = 1.05;
  root.add(deck);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.04), wood);
    p.position.set(Math.cos(a) * 1.55, 1.25, Math.sin(a) * 1.55);
    root.add(p);
  }
  const rail = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.02, 4, 8), wood);
  rail.rotation.set(Math.PI / 2, 0, Math.PI / 8);
  rail.position.y = 1.42;
  root.add(rail);

  // Thatched cap
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.9, 0.9, 8), thatch);
  cap.position.y = 3.8 + 0.45;
  root.add(cap);

  // Sails on a hub, tilted slightly back
  const hub = new THREE.Group();
  hub.position.set(0, 3.95, 0.85);
  hub.rotation.set(-0.1, 0, 0.35);
  root.add(hub);
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 12), wood);
  axle.rotation.x = Math.PI / 2;
  hub.add(axle);
  for (let k = 0; k < 4; k++) {
    const arm = new THREE.Group();
    arm.rotation.z = k * Math.PI / 2;
    hub.add(arm);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 0.06), wood);
    stock.position.y = 1.25;
    arm.add(stock);
    // lattice: crossbars + cloth
    for (let j = 0; j < 8; j++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.025, 0.025), wood);
      bar.position.set(0.3, 0.4 + j * 0.27, 0.03);
      arm.add(bar);
    }
    const sail = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.9), sailCloth);
    sail.position.set(0.3, 1.35, 0.05);
    arm.add(sail);
  }

  // Door
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.05), wood);
  door.position.set(0, 0.35, 1.26);
  root.add(door);
  return root;
}
