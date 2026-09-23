// Prompt 50: "A carnival Ferris wheel with a double-rim spoked wheel, twelve colorful gondolas hanging level, an A-frame support tower, and light bulbs along the rim."
export const meta = { id: '50', name: 'Ferris Wheel', prompt: 'A carnival Ferris wheel with a double-rim spoked wheel, twelve colorful gondolas hanging level, an A-frame support tower, and light bulbs along the rim.' };

export function build(THREE) {
  const root = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, metalness: 0.6, roughness: 0.35 });
  const frame = new THREE.MeshStandardMaterial({ color: 0x3b4a6b, metalness: 0.5, roughness: 0.4 });
  const bulb = new THREE.MeshStandardMaterial({ color: 0xfff1b8, emissive: 0xffc94a, emissiveIntensity: 1.8 });
  const cols = [0xe63946, 0xf4a261, 0x2a9d8f, 0x457b9d, 0xe9c46a, 0x9b5de5];
  const R = 2.0, hubY = 2.5, gap = 0.35;

  // Base platform
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.4), new THREE.MeshStandardMaterial({ color: 0x8d8579, roughness: 0.9 }));
  base.position.y = 0.06;
  root.add(base);

  // A-frame towers on both sides of the wheel
  const beam = (a, b, r, m) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), 8), m);
    c.position.copy(a).lerp(b, 0.5);
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    root.add(c);
  };
  const hub = new THREE.Vector3(0, hubY, 0);
  for (const z of [-0.5, 0.5]) {
    const top = new THREE.Vector3(0, hubY, z);
    beam(new THREE.Vector3(-1.1, 0.12, z * 1.3), top, 0.05, frame);
    beam(new THREE.Vector3(1.1, 0.12, z * 1.3), top, 0.05, frame);
    beam(new THREE.Vector3(-0.6, 1.2, z * 1.15), new THREE.Vector3(0.6, 1.2, z * 1.15), 0.03, frame);
  }
  beam(new THREE.Vector3(0, hubY, -0.55), new THREE.Vector3(0, hubY, 0.55), 0.06, frame);

  // Wheel: two rims + spokes + cross ties
  const wheel = new THREE.Group();
  wheel.position.copy(hub);
  root.add(wheel);
  const n = 12;
  for (const z of [-gap / 2, gap / 2]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.03, 8, 96), steel);
    rim.position.z = z;
    wheel.add(rim);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(R * 0.6, 0.02, 6, 72), steel);
    inner.position.z = z;
    wheel.add(inner);
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2;
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, R, 4), steel);
      s.position.set(Math.cos(a) * R / 2, Math.sin(a) * R / 2, z);
      s.rotation.z = a - Math.PI / 2;
      wheel.add(s);
    }
  }
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const tie = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, gap + 0.1, 6), steel);
    tie.rotation.x = Math.PI / 2;
    tie.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
    wheel.add(tie);
  }
  // Rim bulbs (shared geometry)
  const bulbGeo = new THREE.SphereGeometry(0.03, 8, 6);
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    for (const z of [-gap / 2, gap / 2]) {
      const b = new THREE.Mesh(bulbGeo, bulb);
      b.position.set(Math.cos(a) * (R + 0.05), Math.sin(a) * (R + 0.05), z);
      wheel.add(b);
    }
  }

  // Gondolas hang level from each tie (added to root so they don't inherit wheel rotation)
  const cabinProf = [[0.001, -0.35], [0.18, -0.35], [0.24, -0.25], [0.24, 0], [0.2, 0.02], [0.001, 0.02]].map(([x, y]) => new THREE.Vector2(x, y));
  const cabinGeo = new THREE.LatheGeometry(cabinProf, 20);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const px = Math.cos(a) * R, py = hubY + Math.sin(a) * R;
    const g = new THREE.Group();
    g.position.set(px, py, 0);
    root.add(g);
    const cab = new THREE.Mesh(cabinGeo, new THREE.MeshStandardMaterial({ color: cols[i % cols.length], metalness: 0.3, roughness: 0.4, side: THREE.DoubleSide }));
    cab.position.y = -0.1;
    g.add(cab);
    const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.14, 20), cab.material);
    canopy.position.y = 0.2;
    g.add(canopy);
    for (const s of [-1, 1]) {
      const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.25, 4), steel);
      hanger.position.set(s * 0.12, 0.05, 0);
      g.add(hanger);
    }
  }
  root.add(new THREE.PointLight(0xffd27a, 2, 6));
  return root;
}
