// Prompt 74: "A retro chrome two-slice toaster with toast popping out."
export const meta = { id: '74', name: 'Retro Toaster', prompt: 'A retro chrome two-slice toaster with toast popping out.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const chrome = new THREE.MeshStandardMaterial({ color: 0xe3e5e8, metalness: 1, roughness: 0.12 });
  const black = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
  // Body: rounded rectangle side profile (XY) extruded across z
  const w = 1.6, h = 1.0, r = 0.3;
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h - r); s.quadraticCurveTo(w / 2, h, w / 2 - r, h);
  s.lineTo(-w / 2 + r, h); s.quadraticCurveTo(-w / 2, h, -w / 2, h - r); s.closePath();
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.9, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4, curveSegments: 16 }), chrome);
  body.position.set(0, 0.1, -0.45);
  root.add(body);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.1, 1.05), black);
  foot.position.y = 0.05;
  root.add(foot);
  // Slots + toast slices poking out
  for (const z of [-0.18, 0.18]) {
    const slot = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 0.14), black);
    slot.position.set(0, h + 0.16, z);
    root.add(slot);
    const toast = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.9, 0.1), new THREE.MeshStandardMaterial({ color: 0xc98a45, roughness: 1 }));
    toast.position.set(0, h + 0.25, z);
    root.add(toast);
    const crust = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.1, 24, 1, false, -Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: 0x8a5424, roughness: 1 }));
    crust.rotation.x = Math.PI / 2;
    crust.scale.y = 1;
    crust.position.set(0, h + 0.7, z);
    root.add(crust);
  }
  // Lever + browning dial on the side
  const lever = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.12), black);
  lever.position.set(w / 2 + 0.12, 0.7, 0);
  root.add(lever);
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 20), black);
  dial.rotation.z = Math.PI / 2;
  dial.position.set(w / 2 + 0.07, 0.35, 0);
  root.add(dial);
  return root;
}
