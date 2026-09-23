// Prompt 66: "A round glass fishbowl with water, gravel, a plant, and a goldfish."
export const meta = { id: '66', name: 'Goldfish Bowl', prompt: 'A round glass fishbowl with water, gravel, a plant, and a goldfish.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(66);
  const R = 1.0, cy = 0.95;
  // Bowl: sphere cut at the top and flattened at the bottom (lathe)
  const prof = [];
  for (let i = 0; i <= 30; i++) { const a = -Math.PI / 2 + 0.35 + (i / 30) * (Math.PI - 0.35 - 0.6); prof.push(new THREE.Vector2(Math.cos(a) * R, cy + Math.sin(a) * R)); }
  prof.unshift(new THREE.Vector2(0.001, prof[0].y));
  root.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 48), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.03, transmission: 0.95, thickness: 0.05, transparent: true, opacity: 0.25, side: THREE.DoubleSide })));
  // Water volume up to ~70%
  const wy = cy + 0.4;
  const wp = prof.filter(v => v.y <= wy).map(v => new THREE.Vector2(Math.max(0.001, v.x - 0.02), v.y));
  wp.push(new THREE.Vector2(Math.sqrt(R * R - (wy - cy) ** 2) - 0.02, wy), new THREE.Vector2(0.001, wy));
  root.add(new THREE.Mesh(new THREE.LatheGeometry(wp, 48), new THREE.MeshPhysicalMaterial({ color: 0x7cc6e8, roughness: 0.1, transmission: 0.7, transparent: true, opacity: 0.35 })));
  // Gravel
  for (let i = 0; i < 60; i++) {
    const a = rng() * Math.PI * 2, d = rng() * 0.7;
    const g = new THREE.Mesh(new THREE.IcosahedronGeometry(0.05 + rng() * 0.04, 0), new THREE.MeshStandardMaterial({ color: [0xd9c7a3, 0x9aa4ad, 0xc47b56][i % 3], flatShading: true }));
    g.position.set(Math.cos(a) * d, prof[0].y + 0.05 + rng() * 0.05, Math.sin(a) * d);
    root.add(g);
  }
  // Plant: a few curving blades
  for (let k = 0; k < 5; k++) {
    const pts = []; const ph = rng() * 6;
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(new THREE.Vector3(-0.35 + Math.sin(t * 3 + ph) * 0.08 + k * 0.04, prof[0].y + t * 0.9, -0.2 + Math.cos(t * 2 + ph) * 0.05)); }
    root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.025, 5), new THREE.MeshStandardMaterial({ color: 0x3f9a4a })));
  }
  // Goldfish: body + tail fin
  const fish = new THREE.Group();
  fish.position.set(0.2, cy + 0.05, 0.15);
  fish.rotation.y = 0.5;
  root.add(fish);
  const gold = new THREE.MeshStandardMaterial({ color: 0xff8c1a, roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 14), gold);
  body.scale.set(1.5, 1, 0.6);
  fish.add(body);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 3), new THREE.MeshStandardMaterial({ color: 0xffb04a, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
  tail.rotation.z = -Math.PI / 2;
  tail.scale.z = 0.2;
  tail.position.x = -0.28;
  fish.add(tail);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  eye.position.set(0.15, 0.04, 0.07);
  fish.add(eye);
  return root;
}
