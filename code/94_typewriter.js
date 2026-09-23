// Prompt 94: "A 1920s manual typewriter in black enamel: four staggered rows of round glass-topped keys with chrome rims, a semicircular basket of typebars, a platen roller with knobs and a sheet of paper, a carriage return lever, and gold lettering."
export const meta = { id: '94', name: 'Manual Typewriter', prompt: 'A 1920s manual typewriter in black enamel: four staggered rows of round glass-topped keys with chrome rims, a semicircular basket of typebars, a platen roller with knobs and a sheet of paper, a carriage return lever, and gold lettering.', detail: 'detailed' };

export function build(THREE) {
  const root = new THREE.Group();
  const enamel = new THREE.MeshPhysicalMaterial({ color: 0x121214, roughness: 0.25, clearcoat: 1 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe2e6, metalness: 1, roughness: 0.15 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.3 });
  // Body: side profile (sloping front) extruded across x
  const s = new THREE.Shape();
  s.moveTo(-0.9, 0); s.lineTo(0.6, 0); s.lineTo(0.6, 0.55); s.lineTo(0.2, 0.7); s.lineTo(-0.2, 0.62); s.lineTo(-0.9, 0.2); s.closePath();
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 1.9, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 }), enamel);
  body.rotation.y = Math.PI / 2;
  body.position.set(-0.95, 0, 0);
  root.add(body);
  // Keys: 4 staggered rows on stems down the sloped front (z toward viewer)
  const counts = [10, 10, 9, 8];
  const keyCap = new THREE.CylinderGeometry(0.065, 0.065, 0.03, 20);
  const rim = new THREE.TorusGeometry(0.068, 0.01, 6, 20);
  const stem = new THREE.CylinderGeometry(0.008, 0.008, 0.2, 4);
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x0c0c0c, roughness: 0.05, clearcoat: 1 });
  const legend = new THREE.MeshBasicMaterial({ color: 0xf2eee4 });
  counts.forEach((n, r) => {
    const z = 0.95 - r * 0.17, y = 0.3 + r * 0.09;
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * 0.17 + (r % 2) * 0.05;
      const cap = new THREE.Mesh(keyCap, glass);
      cap.position.set(x, y, z);
      root.add(cap);
      const rr = new THREE.Mesh(rim, chrome);
      rr.rotation.x = Math.PI / 2;
      rr.position.set(x, y + 0.01, z);
      root.add(rr);
      const st = new THREE.Mesh(stem, chrome);
      st.position.set(x, y - 0.1, z - 0.03);
      st.rotation.x = -0.3;
      root.add(st);
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.018, 6), legend);
      dot.rotation.x = -Math.PI / 2;
      dot.position.set(x, y + 0.017, z);
      root.add(dot);
    }
  });
  const space = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 0.06), chrome);
  space.position.set(0, 0.24, 1.08);
  root.add(space);
  // Typebar basket: fan of thin bars in a semicircle behind the keys
  for (let i = 0; i < 36; i++) {
    const a = Math.PI * (i / 35);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.35), chrome);
    bar.position.set(Math.cos(a) * 0.35, 0.68, 0.2 - Math.sin(a) * 0.18);
    bar.rotation.y = -(a - Math.PI / 2) * 0.8;
    bar.rotation.x = -0.4;
    root.add(bar);
  }
  // Carriage: platen roller + knobs + paper + return lever
  const platen = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 2.1, 32), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 }));
  platen.rotation.z = Math.PI / 2;
  platen.position.set(0, 0.85, -0.35);
  root.add(platen);
  for (const s2 of [-1, 1]) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 24), enamel);
    knob.rotation.z = Math.PI / 2;
    knob.position.set(s2 * 1.1, 0.85, -0.35);
    root.add(knob);
  }
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.1, 1, 6), new THREE.MeshStandardMaterial({ color: 0xf7f4ec, roughness: 1, side: THREE.DoubleSide }));
  const pp = paper.geometry.attributes.position;
  for (let i = 0; i < pp.count; i++) pp.setZ(i, -0.08 * Math.pow((pp.getY(i) + 0.55) / 1.1, 2));
  paper.geometry.computeVertexNormals();
  paper.position.set(0, 1.35, -0.45);
  paper.rotation.x = -0.15;
  root.add(paper);
  const lever = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-1.05, 0.9, -0.3), new THREE.Vector3(-1.2, 1.0, -0.1), new THREE.Vector3(-1.3, 1.02, 0.15)]), 12, 0.018, 6), chrome);
  root.add(lever);
  // Gold lettering band on the front panel
  for (let i = 0; i < 9; i++) {
    const letter = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.005), gold);
    letter.position.set(-0.36 + i * 0.09, 0.62, 0.26);
    letter.rotation.x = -0.2;
    root.add(letter);
  }
  return root;
}
