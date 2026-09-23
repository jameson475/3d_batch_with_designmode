// Prompt 59: "A sunburst electric guitar with an offset double-cutaway solid body, a white pickguard, three single-coil pickups, volume and tone knobs, a whammy bar, a maple neck with dot inlays, and a six-in-line headstock."
export const meta = { id: '59', name: 'Electric Guitar', prompt: 'A sunburst electric guitar with an offset double-cutaway solid body, a white pickguard, three single-coil pickups, volume and tone knobs, a whammy bar, a maple neck with dot inlays, and a six-in-line headstock.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const maple = new THREE.MeshStandardMaterial({ color: 0xe8c48a, roughness: 0.4 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe2e6, metalness: 1, roughness: 0.2 });
  const white = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.4 });

  // Body outline: double cutaway via cubic curves
  const s = new THREE.Shape();
  s.moveTo(0, -1.05);
  s.bezierCurveTo(0.75, -1.05, 0.85, -0.45, 0.62, -0.1);
  s.bezierCurveTo(0.55, 0.05, 0.62, 0.3, 0.7, 0.55);   // treble horn
  s.bezierCurveTo(0.72, 0.8, 0.45, 0.78, 0.35, 0.45);
  s.bezierCurveTo(0.3, 0.3, -0.25, 0.3, -0.35, 0.55);
  s.bezierCurveTo(-0.45, 0.95, -0.8, 0.9, -0.72, 0.5);  // bass horn (longer = offset)
  s.bezierCurveTo(-0.65, 0.2, -0.55, 0.0, -0.62, -0.15);
  s.bezierCurveTo(-0.85, -0.5, -0.75, -1.05, 0, -1.05);
  const bg = new THREE.ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, curveSegments: 24 });
  // Sunburst: vertex colors by distance from body center
  const p = bg.attributes.position, cols = [];
  const amber = new THREE.Color(0xf2b134), dark = new THREE.Color(0x2a0f05);
  for (let i = 0; i < p.count; i++) {
    const d = Math.min(1, Math.hypot(p.getX(i) / 0.75, (p.getY(i) + 0.25) / 0.85));
    const c = amber.clone().lerp(dark, Math.pow(d, 3)); cols.push(c.r, c.g, c.b);
  }
  bg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  root.add(new THREE.Mesh(bg, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.15, clearcoat: 1 })));

  // Pickguard (smaller scaled copy of the outline)
  const pg = new THREE.Mesh(new THREE.ShapeGeometry(s, 24), white);
  pg.scale.set(0.72, 0.62, 1);
  pg.position.set(-0.05, 0.05, 0.215);
  root.add(pg);
  // Three single-coil pickups, slanted bridge pickup
  for (const [y, rot] of [[0.2, 0], [-0.08, 0], [-0.38, 0.15]]) {
    const pu = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.03), white);
    pu.position.set(0, y, 0.23);
    pu.rotation.z = rot;
    root.add(pu);
    for (let k = 0; k < 6; k++) {
      const pole = new THREE.Mesh(new THREE.CircleGeometry(0.012, 8), chrome);
      pole.position.set(-0.125 + k * 0.05, y + Math.sin(rot) * (-0.125 + k * 0.05), 0.246);
      root.add(pole);
    }
  }
  // Bridge + whammy bar, knobs, jack
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.04), chrome);
  bridge.position.set(0, -0.62, 0.23);
  root.add(bridge);
  const bar = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.17, -0.62, 0.25), new THREE.Vector3(0.3, -0.62, 0.35), new THREE.Vector3(0.55, -0.5, 0.4)]), 12, 0.012, 6), chrome);
  root.add(bar);
  for (const [x, y] of [[0.38, -0.55], [0.3, -0.72], [0.18, -0.85]]) {
    const k = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.07, 20), white);
    k.rotation.x = Math.PI / 2;
    k.position.set(x, y, 0.25);
    root.add(k);
  }
  const sw = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.05), white);
  sw.position.set(0.45, -0.25, 0.24);
  sw.rotation.z = 0.5;
  root.add(sw);

  // Neck + fretboard with frets and dot inlays
  const neckLen = 2.1, neckBase = 0.35;
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.2, neckLen, 0.08), maple);
  neck.position.set(0, neckBase + neckLen / 2, 0.19);
  root.add(neck);
  const scale = 2.9;
  for (let f = 1; f <= 21; f++) {
    const d = scale * (1 - Math.pow(2, -f / 12));
    const y = neckBase + neckLen - d;
    if (y < neckBase) break;
    const fret = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.008, 0.012), chrome);
    fret.position.set(0, y, 0.235);
    root.add(fret);
    if ([3, 5, 7, 9, 15, 17, 19].includes(f) || f === 12) {
      const prev = neckBase + neckLen - scale * (1 - Math.pow(2, -(f - 1) / 12));
      for (const x of f === 12 ? [-0.04, 0.04] : [0]) {
        const dot = new THREE.Mesh(new THREE.CircleGeometry(0.018, 12), new THREE.MeshBasicMaterial({ color: 0x1a1a1a }));
        dot.position.set(x, (y + prev) / 2, 0.232);
        root.add(dot);
      }
    }
  }
  // Six-in-line headstock with tuners
  const hs = new THREE.Shape();
  hs.moveTo(-0.1, 0); hs.lineTo(0.1, 0); hs.bezierCurveTo(0.12, 0.2, 0.3, 0.3, 0.28, 0.55);
  hs.bezierCurveTo(0.26, 0.7, 0.05, 0.72, -0.05, 0.62); hs.lineTo(-0.1, 0);
  const head = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.05, bevelEnabled: false }), maple);
  head.position.set(0, neckBase + neckLen, 0.15);
  root.add(head);
  for (let k = 0; k < 6; k++) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 10), chrome);
    t.rotation.x = Math.PI / 2;
    t.position.set(-0.04 + k * 0.05, neckBase + neckLen + 0.1 + k * 0.08, 0.23);
    root.add(t);
  }
  // Strings: bridge -> nut
  const strMat = new THREE.LineBasicMaterial({ color: 0xeeeeee });
  for (let k = 0; k < 6; k++) {
    const x = -0.065 + k * 0.026;
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x * 1.3, -0.62, 0.26), new THREE.Vector3(x, neckBase + neckLen, 0.24)]), strMat));
  }
  root.rotation.z = -0.55;
  root.position.y = 1.3;
  return root;
}
