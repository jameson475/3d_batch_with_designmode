// Prompt 01: "An articulated desk lamp with a weighted round base, two arm segments joined by hinges, and a cone shade with a glowing bulb."
export const meta = { id: '01', name: 'Articulated Desk Lamp', prompt: 'An articulated desk lamp with a weighted round base, two arm segments joined by hinges, and a cone shade with a glowing bulb.' };

export function build(THREE) {
  const root = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x2f5d8a, metalness: 0.6, roughness: 0.35 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xb8bcc2, metalness: 0.9, roughness: 0.25 });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.18, 48), metal);
  base.position.y = 0.09;
  root.add(base);

  const hinge = (r = 0.12) => {
    const h = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.26, 24), steel);
    h.rotation.x = Math.PI / 2;
    return h;
  };

  // Lower arm pivots on the base
  const lower = new THREE.Group();
  lower.position.y = 0.25;
  lower.rotation.z = -0.35;
  lower.add(hinge());
  const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 16);
  const arm1 = new THREE.Mesh(armGeo, metal);
  arm1.position.y = 0.9;
  lower.add(arm1);
  root.add(lower);

  // Upper arm pivots at top of lower arm
  const upper = new THREE.Group();
  upper.position.y = 1.8;
  upper.rotation.z = 1.35;
  upper.add(hinge(0.1));
  const arm2 = new THREE.Mesh(armGeo, metal);
  arm2.position.y = 0.9;
  upper.add(arm2);
  lower.add(upper);

  // Shade at end of upper arm
  const head = new THREE.Group();
  head.position.y = 1.8;
  head.rotation.z = 0.9;
  head.add(hinge(0.09));
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 0.6, 40, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x2f5d8a, metalness: 0.5, roughness: 0.4, side: THREE.DoubleSide })
  );
  shade.position.y = -0.3;
  head.add(shade);
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 24, 16),
    new THREE.MeshStandardMaterial({ color: 0xfff3c4, emissive: 0xffd66b, emissiveIntensity: 2 })
  );
  bulb.position.y = -0.5;
  head.add(bulb);
  const light = new THREE.PointLight(0xffd98a, 3, 6);
  light.position.y = -0.7;
  head.add(light);
  upper.add(head);

  return root;
}
