// Prompt 44: "A cupcake in a pleated paper liner topped with a swirled pink frosting spiral, rainbow sprinkles, and a cherry with a stem."
export const meta = { id: '44', name: 'Frosted Cupcake', prompt: 'A cupcake in a pleated paper liner topped with a swirled pink frosting spiral, rainbow sprinkles, and a cherry with a stem.' };

export function build(THREE) {
  const root = new THREE.Group();
  const liner = new THREE.MeshStandardMaterial({ color: 0x7ec8c8, roughness: 0.7, side: THREE.DoubleSide });
  const cake = new THREE.MeshStandardMaterial({ color: 0xc88a4a, roughness: 0.95 });
  const frosting = new THREE.MeshStandardMaterial({ color: 0xf4a6c1, roughness: 0.45 });
  const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(44);

  // Pleated liner: lathe then modulate radius with a high-frequency cosine around the circumference
  const lp = [new THREE.Vector2(0.45, 0), new THREE.Vector2(0.62, 0.7)];
  const lg = new THREE.LatheGeometry(lp, 120);
  const p = lg.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x);
    const k = 1 + 0.035 * Math.cos(a * 36);
    p.setX(i, x * k); p.setZ(i, z * k);
  }
  lg.computeVertexNormals();
  root.add(new THREE.Mesh(lg, liner));
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.45, 40), liner);
  bottom.rotation.x = -Math.PI / 2;
  root.add(bottom);

  // Cake dome peeking above the liner
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), cake);
  dome.scale.y = 0.35;
  dome.position.y = 0.68;
  root.add(dome);

  // Frosting: a tube swept along a conical spiral with shrinking radius
  const turns = 3.2, pts = [];
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const a = t * turns * Math.PI * 2;
    const r = 0.5 * (1 - t) + 0.02;
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0.78 + t * 0.62, Math.sin(a) * r));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const fg = new THREE.TubeGeometry(curve, 300, 0.15, 12, false);
  // taper the tube radius toward the tip
  const fp = fg.attributes.position;
  for (let i = 0; i <= 300; i++) {
    const c = curve.getPointAt(i / 300), k = 1 - 0.55 * Math.pow(i / 300, 1.5);
    for (let j = 0; j <= 12; j++) {
      const idx = i * 13 + j;
      fp.setXYZ(idx, c.x + (fp.getX(idx) - c.x) * k, c.y + (fp.getY(idx) - c.y) * k, c.z + (fp.getZ(idx) - c.z) * k);
    }
  }
  fg.computeVertexNormals();
  root.add(new THREE.Mesh(fg, frosting));

  // Sprinkles: shared capsule geometry, random colors, placed on the spiral surface
  const sprGeo = new THREE.CapsuleGeometry(0.012, 0.05, 2, 6);
  const cols = [0xff4d4d, 0xffd93d, 0x6bcB77, 0x4d96ff, 0xffffff, 0xb983ff];
  for (let i = 0; i < 90; i++) {
    const t = rng() * 0.9;
    const c = curve.getPointAt(t);
    const n = new THREE.Vector3(c.x, 0.5, c.z).normalize();
    const s = new THREE.Mesh(sprGeo, new THREE.MeshStandardMaterial({ color: cols[i % cols.length], roughness: 0.4 }));
    s.position.copy(c).addScaledVector(n, 0.13 * (1 - 0.55 * Math.pow(t, 1.5)));
    s.rotation.set(rng() * 3, rng() * 3, rng() * 3);
    root.add(s);
  }

  // Cherry + stem
  const cherry = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), new THREE.MeshPhysicalMaterial({ color: 0xb3001b, roughness: 0.15, clearcoat: 1 }));
  cherry.position.y = 1.5;
  root.add(cherry);
  const stem = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.58, 0), new THREE.Vector3(0.04, 1.72, 0), new THREE.Vector3(0.12, 1.82, 0)]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(stem, 10, 0.008, 5), new THREE.MeshStandardMaterial({ color: 0x4d6b2a })));
  return root;
}
