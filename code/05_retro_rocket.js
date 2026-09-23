// Prompt 05: "A 1950s retro rocket ship with a pointed nose cone, porthole window, three swept fins, and a flame exhaust."
export const meta = { id: '05', name: 'Retro Rocket', prompt: 'A 1950s retro rocket ship with a pointed nose cone, porthole window, three swept fins, and a flame exhaust.' };

export function build(THREE) {
  const root = new THREE.Group();
  const hull = new THREE.MeshStandardMaterial({ color: 0xe9e4d8, metalness: 0.4, roughness: 0.35 });
  const red = new THREE.MeshStandardMaterial({ color: 0xc23b2e, metalness: 0.3, roughness: 0.4 });

  // Body via lathe: bulbous fuselage tapering to nose
  const prof = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const y = t * 3.2;
    const r = 0.55 * Math.sin(Math.PI * Math.pow(t, 0.8)) + 0.18 * (1 - t);
    prof.push(new THREE.Vector2(Math.max(r, 0.001), y));
  }
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), hull);
  body.position.y = 0.6;
  root.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 32), red);
  nose.position.y = 0.6 + 3.2 + 0.1;
  root.add(nose);

  // Porthole
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 12, 32), red);
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32),
    new THREE.MeshPhysicalMaterial({ color: 0x6ec6e8, roughness: 0.05, metalness: 0.2, clearcoat: 1 }));
  const port = new THREE.Group();
  port.add(ring, glass);
  port.position.set(0, 2.5, 0.57);
  root.add(port);

  // Three swept fins (extruded shape)
  const fin = new THREE.Shape();
  fin.moveTo(0, 0); fin.lineTo(0.8, -0.35); fin.lineTo(0.75, 0.1); fin.lineTo(0, 1.1); fin.closePath();
  const finGeo = new THREE.ExtrudeGeometry(fin, { depth: 0.06, bevelEnabled: false });
  finGeo.translate(0, 0, -0.03);
  for (let k = 0; k < 3; k++) {
    const f = new THREE.Mesh(finGeo, red);
    const g = new THREE.Group();
    f.position.set(0.3, 0.7, 0);
    g.add(f);
    g.rotation.y = (k * 2 * Math.PI) / 3;
    root.add(g);
  }

  // Nozzle + flame
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.25, 32), red);
  nozzle.position.y = 0.5;
  root.add(nozzle);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 24),
    new THREE.MeshStandardMaterial({ color: 0xffa230, emissive: 0xff6a00, emissiveIntensity: 1.8, transparent: true, opacity: 0.9 }));
  flame.rotation.x = Math.PI;
  flame.position.y = 0.0;
  root.add(flame);

  root.position.y = 0.45;
  return root;
}
