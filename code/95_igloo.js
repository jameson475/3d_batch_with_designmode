// Prompt 95: "An igloo."
export const meta = { id: '95', name: 'Igloo', prompt: 'An igloo.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const R = 1.3;
  // Snow blocks: rings of boxes on a hemisphere, each row offset by half a block
  const rows = 7;
  for (let r = 0; r < rows; r++) {
    const phi = (r / rows) * (Math.PI / 2), phi2 = ((r + 1) / rows) * (Math.PI / 2);
    const ringR = R * Math.cos((phi + phi2) / 2), y = R * Math.sin((phi + phi2) / 2);
    const n = Math.max(3, Math.round((2 * Math.PI * ringR) / 0.45));
    for (let i = 0; i < n; i++) {
      const a = ((i + (r % 2) * 0.5) / n) * Math.PI * 2;
      if (r < 2 && Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 0.3) continue; // leave room for the tunnel
      const b = new THREE.Mesh(new THREE.BoxGeometry((2 * Math.PI * ringR) / n - 0.02, R * (phi2 - phi) - 0.02, 0.22), new THREE.MeshStandardMaterial({ color: 0xf4f8fc, roughness: 0.9 }));
      b.position.set(Math.cos(a) * ringR, y, Math.sin(a) * ringR);
      b.lookAt(0, 0, 0);
      root.add(b);
    }
  }
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xf4f8fc }));
  cap.position.y = R * Math.sin(((rows - 0.5) / rows) * (Math.PI / 2)) - 0.1;
  root.add(cap);
  // Entrance tunnel along +x
  const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.9, 20, 1, true, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0xe8eef4, roughness: 0.9, side: THREE.DoubleSide }));
  tunnel.rotation.set(0, 0, Math.PI / 2);
  tunnel.rotation.order = 'ZYX';
  tunnel.position.set(R + 0.1, 0, 0);
  root.add(tunnel);
  const door = new THREE.Mesh(new THREE.CircleGeometry(0.4, 20, 0, Math.PI), new THREE.MeshBasicMaterial({ color: 0x1a2530, side: THREE.DoubleSide }));
  door.rotation.y = Math.PI / 2;
  door.position.set(R + 0.54, 0, 0);
  root.add(door);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(2.3, 40), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  root.add(ground);
  return root;
}
