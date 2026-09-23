// Prompt 15: "A classic park bench with cast-iron scrolled side frames, wooden slat seat and curved backrest, and armrests."
export const meta = { id: '15', name: 'Cast-Iron Park Bench', prompt: 'A classic park bench with cast-iron scrolled side frames, wooden slat seat and curved backrest, and armrests.' };

export function build(THREE) {
  const root = new THREE.Group();
  const iron = new THREE.MeshStandardMaterial({ color: 0x1e2a24, metalness: 0.6, roughness: 0.5 });
  const wood = new THREE.MeshStandardMaterial({ color: 0xa0683a, roughness: 0.75 });
  const L = 3.0;

  // Side frame: a tube swept along a 2D curve (leg -> seat support -> backrest), plus a scroll armrest
  function sideFrame(x) {
    const g = new THREE.Group();
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0.55), new THREE.Vector3(0, 0.45, 0.45), new THREE.Vector3(0, 0.8, 0.35),
      new THREE.Vector3(0, 0.82, -0.2), new THREE.Vector3(0, 0.9, -0.4), new THREE.Vector3(0, 1.4, -0.55), new THREE.Vector3(0, 1.75, -0.62),
    ]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(path, 60, 0.045, 8), iron));
    const back = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, -0.5), new THREE.Vector3(0, 0.45, -0.42), new THREE.Vector3(0, 0.82, -0.2),
    ]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(back, 30, 0.045, 8), iron));
    // Armrest with a spiral scroll at its front end
    const arm = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      if (t < 0.6) arm.push(new THREE.Vector3(0, 1.15, -0.45 + (t / 0.6) * 0.95));
      else {
        const a = ((t - 0.6) / 0.4) * Math.PI * 3, r = 0.12 * (1 - (t - 0.6) / 0.5);
        arm.push(new THREE.Vector3(0, 1.03 + Math.cos(a) * r, 0.5 + Math.sin(a) * r));
      }
    }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arm), 80, 0.035, 8), iron));
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), iron);
    post.position.set(0, 0.98, 0.38);
    g.add(post);
    g.position.x = x;
    return g;
  }
  root.add(sideFrame(-L / 2 + 0.1), sideFrame(L / 2 - 0.1));

  // Seat slats
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(L, 0.04, 0.12), wood);
    s.position.set(0, 0.85, 0.38 - i * 0.14);
    root.add(s);
  }
  // Backrest slats following the curve
  const backPts = [[0.95, -0.42], [1.12, -0.48], [1.29, -0.53], [1.46, -0.57], [1.63, -0.6]];
  for (const [y, z] of backPts) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(L, 0.12, 0.04), wood);
    s.position.set(0, y, z + 0.05);
    s.rotation.x = -0.25;
    root.add(s);
  }
  return root;
}
