// Prompt 07: "A bonsai tree in a shallow rectangular tray, with a recursively branching trunk and clustered foliage pads."
export const meta = { id: '07', name: 'Recursive Bonsai', prompt: 'A bonsai tree in a shallow rectangular tray, with a recursively branching trunk and clustered foliage pads.' };

export function build(THREE) {
  const root = new THREE.Group();
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a3e2b, roughness: 0.95 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3f7a3a, roughness: 0.8, flatShading: true });
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(42);

  // Tray
  const tray = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 1.5), new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.5 }));
  tray.position.y = 0.15;
  root.add(tray);
  const moss = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.02, 1.3), new THREE.MeshStandardMaterial({ color: 0x5f7f3a, roughness: 1 }));
  moss.position.y = 0.31;
  root.add(moss);

  const up = new THREE.Vector3(0, 1, 0);
  function branch(start, dir, len, radius, depth) {
    const end = start.clone().addScaledVector(dir, len);
    const geo = new THREE.CylinderGeometry(radius * 0.7, radius, len, 8);
    const m = new THREE.Mesh(geo, bark);
    m.position.copy(start).lerp(end, 0.5);
    m.quaternion.setFromUnitVectors(up, dir.clone().normalize());
    root.add(m);

    if (depth === 0) {
      // foliage pad: flattened cluster of low-poly spheres
      for (let i = 0; i < 5; i++) {
        const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22 + rng() * 0.12, 0), leaf);
        s.position.copy(end).add(new THREE.Vector3((rng() - 0.5) * 0.5, rng() * 0.12, (rng() - 0.5) * 0.5));
        s.scale.y = 0.55;
        root.add(s);
      }
      return;
    }
    const kids = depth > 2 ? 2 : 3;
    for (let k = 0; k < kids; k++) {
      const d = dir.clone()
        .applyAxisAngle(new THREE.Vector3(1, 0, 0), (rng() - 0.5) * 1.2)
        .applyAxisAngle(new THREE.Vector3(0, 0, 1), (rng() - 0.5) * 1.4)
        .normalize();
      d.y = Math.max(d.y, 0.15);
      branch(end, d.normalize(), len * (0.62 + rng() * 0.15), radius * 0.68, depth - 1);
    }
  }
  branch(new THREE.Vector3(0.2, 0.3, 0), new THREE.Vector3(-0.3, 1, 0.1).normalize(), 0.9, 0.16, 4);

  return root;
}
