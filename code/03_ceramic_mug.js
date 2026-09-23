// Prompt 03: "A glazed ceramic coffee mug with a curved handle, a thick rim, and dark coffee inside."
export const meta = { id: '03', name: 'Ceramic Coffee Mug', prompt: 'A glazed ceramic coffee mug with a curved handle, a thick rim, and dark coffee inside.' };

export function build(THREE) {
  const root = new THREE.Group();
  const glaze = new THREE.MeshPhysicalMaterial({ color: 0xd9674a, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.15, side: THREE.DoubleSide });

  // Lathe profile: outer wall -> rim -> inner wall -> floor
  const pts = [
    [0.0, 0.0], [0.55, 0.0], [0.62, 0.05], [0.66, 0.3], [0.68, 1.3],
    [0.66, 1.36], [0.6, 1.36], [0.59, 1.3], [0.57, 0.3], [0.5, 0.14], [0.0, 0.14],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), glaze);
  root.add(body);

  // Coffee surface
  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.585, 48),
    new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.15 })
  );
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 1.12;
  root.add(coffee);

  // Handle: half torus, flattened slightly
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.075, 16, 40, Math.PI), glaze);
  handle.rotation.z = -Math.PI / 2;
  handle.scale.set(1, 1.1, 0.8);
  handle.position.set(0.66, 0.72, 0);
  root.add(handle);

  return root;
}
