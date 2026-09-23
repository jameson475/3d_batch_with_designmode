// Prompt 72: "A blue gemstone."
export const meta = { id: '72', name: 'Cut Gemstone', prompt: 'A blue gemstone.', detail: 'simple' };

export function build(THREE) {
  const root = new THREE.Group();
  // Brilliant cut: table (top), crown ring, girdle, pavilion point — lathe with few segments gives facets
  const prof = [[0.001, 1.25], [0.55, 1.25], [1.0, 0.95], [1.0, 0.88], [0.001, 0]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(prof, 16).toNonIndexed();
  g.computeVertexNormals();
  root.add(new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: 0x1f5fd6, roughness: 0.02, metalness: 0.1, transmission: 0.6, thickness: 1, ior: 2.4, clearcoat: 1, flatShading: true })));
  return root;
}
