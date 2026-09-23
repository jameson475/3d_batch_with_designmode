// Prompt 39: "A hanging wind chime with a round wooden top disk, six aluminum tubes of graded lengths on strings, a central striker, and a sail."
export const meta = { id: '39', name: 'Wind Chime', prompt: 'A hanging wind chime with a round wooden top disk, six aluminum tubes of graded lengths on strings, a central striker, and a sail.' };

export function build(THREE) {
  const root = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x8a5d34, roughness: 0.6 });
  const alu = new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: 1, roughness: 0.2 });
  const cord = new THREE.LineBasicMaterial({ color: 0x3a3a3a });
  const line = (a, b) => root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), cord));
  const topY = 3.0;

  // Hanging ring + suspension cords to the disk
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 24), alu);
  ring.position.y = topY + 0.55;
  root.add(ring);
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2;
    line(new THREE.Vector3(0, topY + 0.47, 0), new THREE.Vector3(Math.cos(a) * 0.35, topY + 0.04, Math.sin(a) * 0.35));
  }
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 40), wood);
  disk.position.y = topY;
  root.add(disk);

  // Six tubes on a circle, lengths from the pentatonic-ish series (length ∝ 1/sqrt(freq))
  const ratios = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2];
  const base = 1.4, R = 0.3;
  ratios.forEach((r, i) => {
    const len = base / Math.sqrt(r);
    const a = (i / 6) * Math.PI * 2 + 0.2;
    const x = Math.cos(a) * R, z = Math.sin(a) * R;
    const hang = 0.25 + (1 - len / base) * 0.3;
    const yTop = topY - hang;
    line(new THREE.Vector3(x, topY - 0.03, z), new THREE.Vector3(x, yTop, z));
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, len, 20, 1, true), alu);
    tube.material.side = THREE.DoubleSide;
    tube.position.set(x, yTop - len / 2, z);
    tube.rotation.z = (i % 2 ? 1 : -1) * 0.02; // slight sway
    root.add(tube);
  });

  // Central striker disk at mid-tube height, then the sail below
  const strikerY = topY - 1.0;
  line(new THREE.Vector3(0, topY - 0.03, 0), new THREE.Vector3(0, strikerY - 1.1, 0));
  const striker = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 32), wood);
  striker.position.y = strikerY;
  root.add(striker);
  const sailShape = new THREE.Shape();
  sailShape.moveTo(0, 0); sailShape.lineTo(0.18, -0.25); sailShape.lineTo(0, -0.6); sailShape.lineTo(-0.18, -0.25); sailShape.closePath();
  const sail = new THREE.Mesh(new THREE.ExtrudeGeometry(sailShape, { depth: 0.015, bevelEnabled: false }), wood);
  sail.position.set(0, strikerY - 1.1, -0.0075);
  sail.rotation.y = 0.5;
  root.add(sail);
  root.position.y = -0.2;
  return root;
}
