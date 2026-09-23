// Prompt 23: "A round porcelain teapot with blue bands, a curved spout, a loop handle, and a lid with a knob, on a saucer."
export const meta = { id: '23', name: 'Porcelain Teapot', prompt: 'A round porcelain teapot with blue bands, a curved spout, a loop handle, and a lid with a knob, on a saucer.' };

export function build(THREE) {
  const root = new THREE.Group();
  const porcelain = new THREE.MeshPhysicalMaterial({ color: 0xf7f5f0, roughness: 0.2, clearcoat: 0.9 });
  const blue = new THREE.MeshPhysicalMaterial({ color: 0x1f4e9c, roughness: 0.25, clearcoat: 0.9 });

  // Body: lathe of a squashed sphere with a foot ring and a neck
  const prof = [new THREE.Vector2(0.001, 0.1), new THREE.Vector2(0.45, 0.1), new THREE.Vector2(0.48, 0.14)];
  for (let i = 1; i < 20; i++) {
    const a = -Math.PI / 2 + (i / 20) * Math.PI;
    prof.push(new THREE.Vector2(Math.cos(a) * 0.85, 0.72 + Math.sin(a) * 0.58));
  }
  prof.push(new THREE.Vector2(0.4, 1.3), new THREE.Vector2(0.42, 1.34), new THREE.Vector2(0.001, 1.34));
  root.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 48), porcelain));

  // Decorative bands
  for (const [y, r] of [[0.42, 0.78], [1.02, 0.78]]) {
    const b = new THREE.Mesh(new THREE.TorusGeometry(r, 0.025, 8, 64), blue);
    b.rotation.x = Math.PI / 2;
    b.position.y = y;
    root.add(b);
  }

  // Lid dome + knob
  const lid = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), porcelain);
  lid.scale.y = 0.45;
  lid.position.y = 1.34;
  root.add(lid);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), blue);
  knob.position.y = 1.58;
  root.add(knob);

  // Spout: tapered tube along a curve
  const spoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.7, 0.55, 0), new THREE.Vector3(1.0, 0.7, 0), new THREE.Vector3(1.15, 1.0, 0), new THREE.Vector3(1.3, 1.22, 0),
  ]);
  const spout = new THREE.TubeGeometry(spoutCurve, 30, 0.1, 16, false);
  const p = spout.attributes.position;
  // taper: shrink ring radius toward the tip by pulling vertices toward curve points
  for (let i = 0; i <= 30; i++) {
    const c = spoutCurve.getPointAt(i / 30), k = 1 - 0.55 * (i / 30);
    for (let j = 0; j <= 16; j++) {
      const idx = i * 17 + j;
      p.setXYZ(idx, c.x + (p.getX(idx) - c.x) * k, c.y + (p.getY(idx) - c.y) * k, c.z + (p.getZ(idx) - c.z) * k);
    }
  }
  spout.computeVertexNormals();
  root.add(new THREE.Mesh(spout, porcelain));

  // Handle: C-shaped tube
  const handle = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.72, 1.05, 0), new THREE.Vector3(-1.05, 1.05, 0), new THREE.Vector3(-1.12, 0.75, 0), new THREE.Vector3(-0.95, 0.45, 0), new THREE.Vector3(-0.74, 0.4, 0),
  ]);
  root.add(new THREE.Mesh(new THREE.TubeGeometry(handle, 30, 0.055, 10, false), porcelain));

  // Saucer
  const sp = [[0.001, 0], [0.5, 0], [0.55, 0.02], [1.1, 0.08], [1.2, 0.12], [1.15, 0.13], [0.001, 0.05]].map(([x, y]) => new THREE.Vector2(x, y));
  const saucer = new THREE.Mesh(new THREE.LatheGeometry(sp, 64), porcelain);
  saucer.position.y = 0.02;
  root.add(saucer);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.015, 6, 64), blue);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.14;
  root.add(rim);
  return root;
}
