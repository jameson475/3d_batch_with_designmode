// Prompt 02: "A simple Scandinavian wooden dining chair with four tapered legs, a slatted backrest, and a light oak finish."
export const meta = { id: '02', name: 'Scandinavian Wooden Chair', prompt: 'A simple Scandinavian wooden dining chair with four tapered legs, a slatted backrest, and a light oak finish.' };

export function build(THREE) {
  const root = new THREE.Group();
  const oak = new THREE.MeshStandardMaterial({ color: 0xd2a86e, roughness: 0.7 });
  const dark = new THREE.MeshStandardMaterial({ color: 0xb88a52, roughness: 0.75 });

  const seatH = 1.0, w = 1.0, d = 0.95;

  // Seat
  const seat = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), oak);
  seat.position.y = seatH;
  root.add(seat);

  // Tapered legs (cylinders with different top/bottom radius)
  const legGeo = new THREE.CylinderGeometry(0.045, 0.03, seatH, 12);
  const backLegGeo = new THREE.CylinderGeometry(0.045, 0.03, seatH + 1.0, 12);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const isBack = z < 0;
    const leg = new THREE.Mesh(isBack ? backLegGeo : legGeo, dark);
    const h = isBack ? seatH + 1.0 : seatH;
    leg.position.set(x * (w / 2 - 0.07), h / 2, z * (d / 2 - 0.07));
    root.add(leg);
  }

  // Stretchers between legs
  const stretcher = new THREE.BoxGeometry(w - 0.14, 0.04, 0.04);
  for (const z of [-1, 1]) {
    const s = new THREE.Mesh(stretcher, dark);
    s.position.set(0, 0.35, z * (d / 2 - 0.07));
    root.add(s);
  }

  // Slatted backrest
  const top = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.16, 0.05), oak);
  top.position.set(0, seatH + 0.92, -(d / 2 - 0.07));
  root.add(top);
  const slatGeo = new THREE.BoxGeometry(0.07, 0.8, 0.03);
  for (let i = -2; i <= 2; i++) {
    const slat = new THREE.Mesh(slatGeo, oak);
    slat.position.set(i * 0.16, seatH + 0.45, -(d / 2 - 0.07));
    root.add(slat);
  }

  return root;
}
