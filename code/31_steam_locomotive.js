// Prompt 31: "A toy-scale steam locomotive with a cylindrical boiler, smokestack, steam dome, cab with windows, cowcatcher, and six red driving wheels linked by coupling rods."
export const meta = { id: '31', name: 'Steam Locomotive', prompt: 'A toy-scale steam locomotive with a cylindrical boiler, smokestack, steam dome, cab with windows, cowcatcher, and six red driving wheels linked by coupling rods.' };

export function build(THREE) {
  const root = new THREE.Group();
  const black = new THREE.MeshStandardMaterial({ color: 0x1d1f22, metalness: 0.6, roughness: 0.4 });
  const red = new THREE.MeshStandardMaterial({ color: 0xa4231c, metalness: 0.3, roughness: 0.45 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xcaa24a, metalness: 1, roughness: 0.3 });
  const green = new THREE.MeshStandardMaterial({ color: 0x1f4d3a, metalness: 0.4, roughness: 0.4 });
  const glass = new THREE.MeshStandardMaterial({ color: 0xbfd9e6, roughness: 0.1 });

  // Frame (running board)
  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.0), black);
  frame.position.set(0, 0.62, 0);
  root.add(frame);

  // Boiler along x, with brass bands
  const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.0, 32), green);
  boiler.rotation.z = Math.PI / 2;
  boiler.position.set(0.35, 1.1, 0);
  root.add(boiler);
  for (const x of [-0.4, 0.2, 0.8]) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.425, 0.02, 6, 32), brass);
    band.rotation.y = Math.PI / 2;
    band.position.set(x, 1.1, 0);
    root.add(band);
  }
  const smokebox = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.35, 32), black);
  smokebox.rotation.z = Math.PI / 2;
  smokebox.position.set(1.5, 1.1, 0);
  root.add(smokebox);
  const door = new THREE.Mesh(new THREE.CircleGeometry(0.38, 32), black);
  door.rotation.y = Math.PI / 2;
  door.position.set(1.68, 1.1, 0);
  root.add(door);
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 16), brass);
  lamp.rotation.z = Math.PI / 2;
  lamp.position.set(1.72, 1.58, 0);
  root.add(lamp);

  // Stack (flared lathe), dome, whistle
  const sp = [[0.12, 0], [0.1, 0.3], [0.2, 0.5], [0.22, 0.55], [0.001, 0.55]].map(([x, y]) => new THREE.Vector2(x, y));
  const stack = new THREE.Mesh(new THREE.LatheGeometry(sp, 24), black);
  stack.position.set(1.4, 1.45, 0);
  root.add(stack);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), brass);
  dome.scale.y = 1.2;
  dome.position.set(0.5, 1.5, 0);
  root.add(dome);
  const whistle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.2, 10), brass);
  whistle.position.set(-0.4, 1.6, 0);
  root.add(whistle);

  // Cab with windows and roof
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 1.0), red);
  cab.position.set(-1.1, 1.18, 0);
  root.add(cab);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 1.15), black);
  roof.position.set(-1.1, 1.72, 0);
  root.add(roof);
  for (const z of [-0.505, 0.505]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.3), glass);
    w.position.set(-1.1, 1.38, z);
    if (z < 0) w.rotation.y = Math.PI;
    root.add(w);
  }

  // Cowcatcher (pilot) — wedge from an extruded triangle
  const cc = new THREE.Shape();
  cc.moveTo(0, 0); cc.lineTo(0.4, 0); cc.lineTo(0, 0.35); cc.closePath();
  const catcher = new THREE.Mesh(new THREE.ExtrudeGeometry(cc, { depth: 0.9, bevelEnabled: false }), red);
  catcher.position.set(1.6, 0.25, -0.45);
  root.add(catcher);

  // Driving wheels + coupling rods (both sides)
  const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 32);
  const xs = [-0.55, 0.15, 0.85];
  for (const z of [-0.52, 0.52]) {
    for (const x of xs) {
      const w = new THREE.Mesh(wheelGeo, red);
      w.rotation.x = Math.PI / 2;
      w.position.set(x, 0.3, z);
      root.add(w);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12), brass);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(x, 0.3, z * 1.02);
      root.add(hub);
    }
    const rod = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.05, 0.03), brass);
    rod.position.set(0.15, 0.42, z * 1.1);
    root.add(rod);
  }
  // Rails
  for (const z of [-0.52, 0.52]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(4, 0.05, 0.06), black);
    rail.position.set(0, -0.02, z);
    root.add(rail);
  }
  return root;
}
