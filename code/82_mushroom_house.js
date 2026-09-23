// Prompt 82: "A fairy-tale mushroom house with a round door, windows, and a chimney."
export const meta = { id: '82', name: 'Mushroom House', prompt: 'A fairy-tale mushroom house with a round door, windows, and a chimney.', detail: 'medium' };

export function build(THREE) {
  const root = new THREE.Group();
  const stem = new THREE.MeshStandardMaterial({ color: 0xf0e4c8, roughness: 0.9 });
  const cap = new THREE.MeshStandardMaterial({ color: 0xd2452f, roughness: 0.6 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8 });
  const warm = new THREE.MeshStandardMaterial({ color: 0xffe3a1, emissive: 0xffb84a, emissiveIntensity: 1.2 });
  // Stem: bulging lathe
  const sp = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; sp.push(new THREE.Vector2(0.75 + 0.15 * Math.sin(t * Math.PI) - 0.1 * t, t * 1.5)); }
  root.add(new THREE.Mesh(new THREE.LatheGeometry(sp, 40), stem));
  // Cap: dome with a curled-under rim, plus white spots
  const cp = [];
  for (let i = 0; i <= 20; i++) { const a = (i / 20) * Math.PI / 2; cp.push(new THREE.Vector2(Math.cos(a) * 1.5 + 0.001, Math.sin(a) * 1.0)); }
  cp.unshift(new THREE.Vector2(1.3, -0.12));
  const capM = new THREE.Mesh(new THREE.LatheGeometry(cp.reverse(), 48), cap);
  capM.material = cap.clone(); capM.material.side = THREE.DoubleSide;
  capM.position.y = 1.45;
  root.add(capM);
  const spot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
  for (let i = 0; i < 12; i++) {
    const th = i * 2.4, ph = 0.35 + (i % 4) * 0.25;
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.1 + (i % 3) * 0.03, 12, 8), spot);
    s.position.set(Math.sin(ph) * Math.cos(th) * 1.5, 1.45 + Math.cos(ph) * 1.0, Math.sin(ph) * Math.sin(th) * 1.5);
    s.scale.y = 0.35;
    s.lookAt(0, 1.45, 0);
    root.add(s);
  }
  // Round door + frame, glowing windows, chimney
  const door = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 32), wood);
  door.rotation.x = Math.PI / 2;
  door.position.set(0, 0.35, 0.82);
  root.add(door);
  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.04, 8, 32), new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 1 }));
  frame.position.set(0, 0.35, 0.84);
  root.add(frame);
  for (const [a, y] of [[0.9, 1.0], [-1.0, 0.8]]) {
    const w = new THREE.Mesh(new THREE.CircleGeometry(0.13, 20), warm);
    const r = 0.84;
    w.position.set(Math.sin(a) * r, y, Math.cos(a) * r);
    w.rotation.y = a;
    root.add(w);
  }
  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0x8a7b6a, roughness: 1 }));
  chimney.position.set(0.6, 2.45, -0.3);
  chimney.rotation.z = -0.15;
  root.add(chimney);
  return root;
}
