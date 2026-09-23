// Prompt 97: "A yellow cartoon submarine with portholes, a periscope, and a propeller."
export const meta = { id: '97', name: 'Yellow Submarine', prompt: 'A yellow cartoon submarine with portholes, a periscope, and a propeller.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const yellow = new THREE.MeshPhysicalMaterial({ color: 0xf6c11b, roughness: 0.35, clearcoat: 0.6 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x8a8f96, metalness: 0.9, roughness: 0.3 });
  const Y = 1.0;
  // Hull: lathe with a round nose and tapered tail, laid along x
  const prof = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const r = t < 0.2 ? 0.7 * Math.sqrt(1 - Math.pow(1 - t / 0.2, 2)) : 0.7 * (1 - Math.pow((t - 0.2) / 0.8, 2) * 0.75);
    prof.push(new THREE.Vector2(Math.max(r, 0.001), t * 3.2));
  }
  const hull = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), yellow);
  hull.rotation.z = -Math.PI / 2;
  hull.position.set(-1.6, Y, 0);
  root.add(hull);
  // Conning tower + periscope
  const tower = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.4, 6, 16), yellow);
  tower.rotation.z = Math.PI / 2;
  tower.scale.set(1.3, 1, 0.8);
  tower.position.set(-0.4, Y + 0.72, 0);
  root.add(tower);
  const scope = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.3, Y + 0.9, 0), new THREE.Vector3(-0.3, Y + 1.45, 0), new THREE.Vector3(-0.15, Y + 1.5, 0)]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(scope, 16, 0.04, 8), metal));
  // Portholes along both sides
  for (const z of [-1, 1]) for (let i = 0; i < 4; i++) {
    const x = -1.0 + i * 0.5;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 8, 20), metal);
    const zz = z * 0.66;
    ring.position.set(x, Y + 0.08, zz);
    root.add(ring);
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), new THREE.MeshStandardMaterial({ color: 0x7fd0f0, emissive: 0x2a7fa0, emissiveIntensity: 0.4 }));
    glass.position.set(x, Y + 0.08, zz + z * 0.01);
    if (z < 0) glass.rotation.y = Math.PI;
    root.add(glass);
  }
  // Tail fins + propeller
  for (const [rx, ry] of [[0, 0], [Math.PI / 2, 0]]) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.9), yellow);
    fin.rotation.x = rx;
    fin.position.set(1.35, Y, 0);
    root.add(fin);
  }
  const prop = new THREE.Group();
  prop.position.set(1.7, Y, 0);
  root.add(prop);
  for (let k = 0; k < 3; k++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), metal);
    b.scale.set(0.15, 1, 0.45);
    b.position.set(0, Math.cos((k / 3) * Math.PI * 2) * 0.2, Math.sin((k / 3) * Math.PI * 2) * 0.2);
    b.rotation.x = (k / 3) * Math.PI * 2;
    prop.add(b);
  }
  return root;
}
