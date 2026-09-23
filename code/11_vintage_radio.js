// Prompt 11: "A 1940s tabletop tube radio with a rounded-top walnut cabinet, a fabric speaker grille, a glowing tuning dial, and two knobs."
export const meta = { id: '11', name: 'Vintage Tube Radio', prompt: 'A 1940s tabletop tube radio with a rounded-top walnut cabinet, a fabric speaker grille, a glowing tuning dial, and two knobs.' };

export function build(THREE) {
  const root = new THREE.Group();
  const walnut = new THREE.MeshStandardMaterial({ color: 0x6b3f22, roughness: 0.45 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a34f, metalness: 0.85, roughness: 0.3 });
  const cloth = new THREE.MeshStandardMaterial({ color: 0xcdb892, roughness: 1 });

  // Cabinet silhouette: box with a semicircular top, extruded with bevel
  const W = 2.0, H = 1.2, R = W / 2;
  const s = new THREE.Shape();
  s.moveTo(-R, 0); s.lineTo(R, 0); s.lineTo(R, H); s.absarc(0, H, R, 0, Math.PI, false); s.lineTo(-R, 0);
  const cab = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.9, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4, curveSegments: 32 }), walnut);
  cab.position.z = -0.45;
  root.add(cab);

  // Arched grille inset on the front
  const g = new THREE.Shape();
  const gr = 0.62;
  g.moveTo(-gr, 0); g.lineTo(gr, 0); g.lineTo(gr, 0.5); g.absarc(0, 0.5, gr, 0, Math.PI, false); g.lineTo(-gr, 0);
  const grille = new THREE.Mesh(new THREE.ShapeGeometry(g, 32), cloth);
  grille.position.set(0, 0.95, 0.505);
  root.add(grille);
  // Vertical brass grille bars
  for (let i = -4; i <= 4; i++) {
    const x = i * 0.13;
    const h = 0.5 + Math.sqrt(Math.max(0, gr * gr - x * x));
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.03, h, 0.02), brass);
    bar.position.set(x, 0.95 + h / 2, 0.52);
    root.add(bar);
  }

  // Tuning dial (glowing) below grille
  const dial = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.26, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xffe2a0, emissive: 0xffb347, emissiveIntensity: 1.2 }));
  dial.position.set(0, 0.55, 0.51);
  root.add(dial);
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.22, 0.01), new THREE.MeshStandardMaterial({ color: 0xaa2222 }));
  needle.position.set(0.18, 0.55, 0.525);
  root.add(needle);

  // Knobs
  for (const x of [-0.7, 0.7]) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.12, 24), brass);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(x, 0.3, 0.56);
    root.add(knob);
  }

  // Feet
  for (const x of [-0.8, 0.8]) for (const z of [-0.3, 0.3]) {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12), brass);
    f.position.set(x, -0.04, z);
    root.add(f);
  }
  root.position.y = 0.08;
  return root;
}
