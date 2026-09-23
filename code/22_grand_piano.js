// Prompt 22: "A glossy black grand piano with a curved case, a propped-open lid, 52 white and 36 black keys, three legs, and pedals."
export const meta = { id: '22', name: 'Grand Piano', prompt: 'A glossy black grand piano with a curved case, a propped-open lid, 52 white and 36 black keys, three legs, and pedals.' };

export function build(THREE) {
  const root = new THREE.Group();
  const lacquer = new THREE.MeshPhysicalMaterial({ color: 0x0c0c0e, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05 });
  const ivory = new THREE.MeshStandardMaterial({ color: 0xf6f2e8, roughness: 0.4 });
  const ebony = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a44a, metalness: 1, roughness: 0.3 });

  // Case outline (top view): straight keyboard edge, straight bass side, curved treble "bentside"
  const s = new THREE.Shape();
  s.moveTo(-0.75, 0); s.lineTo(0.75, 0); s.lineTo(0.75, 0.4);
  s.bezierCurveTo(0.7, 1.0, 0.1, 1.1, 0.05, 1.7);
  s.bezierCurveTo(0.0, 2.1, -0.45, 2.25, -0.75, 2.0);
  s.lineTo(-0.75, 0);
  const caseGeo = new THREE.ExtrudeGeometry(s, { depth: 0.35, bevelEnabled: false, curveSegments: 24 });
  const body = new THREE.Mesh(caseGeo, lacquer);
  body.rotation.x = -Math.PI / 2;
  body.position.y = 0.72;
  root.add(body);

  // Lid hinged on the bass (-x) side, propped ~35°
  const lidPivot = new THREE.Group();
  lidPivot.position.set(-0.75, 1.07, 0);
  lidPivot.rotation.z = 0.6;
  root.add(lidPivot);
  const lid = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.025, bevelEnabled: false, curveSegments: 24 }), lacquer);
  lid.rotation.x = -Math.PI / 2;
  lid.position.x = 0.75;
  lidPivot.add(lid);
  const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.75, 6), lacquer);
  prop.position.set(0.55, 1.4, -0.9);
  root.add(prop);

  // Keybed in front (keys run along -z)
  const keybed = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.3), lacquer);
  keybed.position.set(0, 0.8, 0.15);
  root.add(keybed);
  const nW = 52, kw = 1.44 / nW;
  const white = new THREE.BoxGeometry(kw * 0.92, 0.025, 0.22);
  const black = new THREE.BoxGeometry(kw * 0.55, 0.03, 0.13);
  const hasBlack = [1, 1, 0, 1, 1, 1, 0]; // A,B,C,D,E,F,G pattern starting from A0
  for (let i = 0; i < nW; i++) {
    const x = -0.72 + kw * (i + 0.5);
    const k = new THREE.Mesh(white, ivory);
    k.position.set(x, 0.855, 0.18);
    root.add(k);
    if (i < nW - 1 && hasBlack[i % 7]) {
      const b = new THREE.Mesh(black, ebony);
      b.position.set(x + kw / 2, 0.875, 0.13);
      root.add(b);
    }
  }
  // Cheek blocks + music desk
  for (const x of [-0.78, 0.78]) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.3), lacquer);
    c.position.set(x, 0.86, 0.15);
    root.add(c);
  }
  const desk = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.02), lacquer);
  desk.position.set(0, 1.2, -0.12);
  desk.rotation.x = -0.25;
  root.add(desk);

  // Three turned legs + lyre with pedals
  const legGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.72, 16);
  for (const [x, z] of [[-0.6, -0.12], [0.62, -0.25], [-0.45, -1.85]]) {
    const leg = new THREE.Mesh(legGeo, lacquer);
    leg.position.set(x, 0.36, z);
    root.add(leg);
  }
  const lyre = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.62, 0.05), ebony);
  lyre.position.set(0, 0.4, -0.3);
  root.add(lyre);
  for (let p = -1; p <= 1; p++) {
    const ped = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.015, 0.12), brass);
    ped.position.set(p * 0.06, 0.1, -0.22);
    root.add(ped);
  }
  return root;
}
