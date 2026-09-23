// Prompt 69: "A mailbox."
export const meta = { id: '69', name: 'Rural Mailbox', prompt: 'A mailbox.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x3d5a80, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide });
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.2, 0.14), new THREE.MeshStandardMaterial({ color: 0x7a5a3a, roughness: 1 }));
  post.position.y = 0.6;
  root.add(post);
  // Classic tunnel shape: box bottom + half-cylinder top, extruded along z
  const s = new THREE.Shape();
  s.moveTo(-0.22, 0); s.lineTo(0.22, 0); s.lineTo(0.22, 0.2); s.absarc(0, 0.2, 0.22, 0, Math.PI, false); s.closePath();
  const box = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.8, bevelEnabled: false, curveSegments: 24 }), metal);
  box.position.set(0, 1.2, -0.4);
  root.add(box);
  // Flag (raised) on the side
  const flag = new THREE.Group();
  flag.position.set(0.23, 1.35, -0.1);
  flag.rotation.x = -0.1;
  root.add(flag);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.4, 0.03), new THREE.MeshStandardMaterial({ color: 0xc62828 }));
  arm.position.y = 0.2;
  flag.add(arm);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.16), arm.material);
  plate.position.set(0, 0.35, -0.08);
  flag.add(plate);
  return root;
}
