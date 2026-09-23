// Prompt 47: "A garden wheelbarrow with a deep green steel tray, a single pneumatic front wheel, tubular handles with rubber grips, rear legs, and a load of soil."
export const meta = { id: '47', name: 'Garden Wheelbarrow', prompt: 'A garden wheelbarrow with a deep green steel tray, a single pneumatic front wheel, tubular handles with rubber grips, rear legs, and a load of soil.' };

export function build(THREE) {
  const root = new THREE.Group();
  const green = new THREE.MeshStandardMaterial({ color: 0x2f6b3a, metalness: 0.5, roughness: 0.4, side: THREE.DoubleSide });
  const steel = new THREE.MeshStandardMaterial({ color: 0x777b80, metalness: 0.9, roughness: 0.35 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.9 });
  const soil = new THREE.MeshStandardMaterial({ color: 0x4a3322, roughness: 1, flatShading: true });

  // Tray: open box whose walls flare outward; built as a loft between a small bottom rectangle and a larger top rectangle
  const bot = [[-0.35, -0.25], [0.35, -0.25], [0.35, 0.25], [-0.35, 0.25]];
  const top = [[-0.7, -0.45], [0.75, -0.45], [0.75, 0.45], [-0.7, 0.45]];
  const yb = 0.55, yt = 0.95;
  const pos = [], idx = [];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    const b0 = [bot[i][0] + 0.15, yb, bot[i][1]], b1 = [bot[j][0] + 0.15, yb, bot[j][1]];
    const t0 = [top[i][0], yt, top[i][1]], t1 = [top[j][0], yt, top[j][1]];
    const k = pos.length / 3;
    pos.push(...b0, ...b1, ...t1, ...t0);
    idx.push(k, k + 1, k + 2, k, k + 2, k + 3);
  }
  const k = pos.length / 3;
  pos.push(0.15 - 0.35, yb, -0.25, 0.15 + 0.35, yb, -0.25, 0.15 + 0.35, yb, 0.25, 0.15 - 0.35, yb, 0.25);
  idx.push(k, k + 2, k + 1, k, k + 3, k + 2);
  const tg = new THREE.BufferGeometry();
  tg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  tg.setIndex(idx);
  tg.computeVertexNormals();
  root.add(new THREE.Mesh(tg, green));
  // Rolled rim
  const rimPts = top.map(([x, z]) => new THREE.Vector3(x, yt, z));
  rimPts.push(rimPts[0].clone());
  root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPts, false, 'catmullrom', 0), 40, 0.02, 6), green));

  // Soil heap: flattened jittered dome
  const heapGeo = new THREE.SphereGeometry(0.6, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  const hp = heapGeo.attributes.position;
  for (let i = 0; i < hp.count; i++) hp.setY(i, hp.getY(i) * (0.4 + 0.1 * Math.sin(hp.getX(i) * 9) * Math.cos(hp.getZ(i) * 7)));
  heapGeo.computeVertexNormals();
  const heap = new THREE.Mesh(heapGeo, soil);
  heap.scale.set(1.15, 1, 0.7);
  heap.position.set(0.05, 0.85, 0);
  root.add(heap);

  // Handles: two tubes from the wheel axle, under the tray, out the back, with grips
  for (const z of [-0.3, 0.3]) {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.05, 0.3, z * 0.5), new THREE.Vector3(0.7, 0.5, z * 0.9), new THREE.Vector3(-0.2, 0.52, z), new THREE.Vector3(-1.1, 0.72, z * 1.05), new THREE.Vector3(-1.45, 0.8, z * 1.05),
    ]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.025, 8), steel));
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 12), rubber);
    grip.rotation.z = Math.PI / 2 - 0.2;
    grip.position.set(-1.35, 0.78, z * 1.05);
    root.add(grip);
    // Rear leg
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), steel);
    leg.position.set(-0.55, 0.3, z);
    leg.rotation.z = -0.15;
    root.add(leg);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.05), steel);
    foot.position.set(-0.52, 0.04, z);
    root.add(foot);
  }
  // Wheel: tire torus + rim + hub
  const wheel = new THREE.Group();
  wheel.position.set(1.05, 0.3, 0);
  root.add(wheel);
  wheel.add(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 16, 40), rubber));
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 24), new THREE.MeshStandardMaterial({ color: 0xc92a2a, metalness: 0.5, roughness: 0.4 }));
  rim.rotation.x = Math.PI / 2;
  wheel.add(rim);
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), steel);
  axle.rotation.x = Math.PI / 2;
  wheel.add(axle);
  return root;
}
