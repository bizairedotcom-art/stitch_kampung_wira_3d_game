import * as THREE from 'three';
import type { ThreeSceneContext } from '@/components/three/ThreeViewport';
import type { SubjectId } from '@/types/curriculum';

export function createSubjectInteriorScene(ctx: ThreeSceneContext, subjectId: SubjectId) {
  const { scene, camera } = ctx;
  camera.position.set(0, 3.2, 7.2);
  camera.lookAt(0, 1.2, 0);

  scene.add(new THREE.HemisphereLight('#FFFBEB', '#78350F', 1.0));
  const dir = new THREE.DirectionalLight('#FFF7ED', 1.5);
  dir.position.set(5, 8, 6);
  dir.castShadow = true;
  scene.add(dir);

  const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(4.2, 4.5, 0.35, 32),
    new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.7 }),
  );
  floor.position.y = -0.2;
  floor.receiveShadow = true;
  scene.add(floor);

  const goldMat = new THREE.MeshStandardMaterial({ color: '#F59E0B', metalness: 0.65, roughness: 0.25 });
  const emeraldMat = new THREE.MeshStandardMaterial({ color: '#0D9668', roughness: 0.4 });
  const aquaMat = new THREE.MeshStandardMaterial({ color: '#06B6D4', roughness: 0.25 });
  const coralMat = new THREE.MeshStandardMaterial({ color: '#E11D48', roughness: 0.35 });

  const animatedNodes: { mesh: THREE.Object3D; speed: number; axis: 'y' | 'z' | 'bob' }[] = [];

  if (subjectId === 'matematik') {
    scene.background = new THREE.Color('#E0F2FE');
    const gear1 = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.22, 10, 12), goldMat);
    gear1.position.set(-0.9, 1.7, 0);
    const gear2 = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.18, 10, 10), aquaMat);
    gear2.position.set(0.95, 1.35, 0.2);
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), goldMat);
    crystal.position.set(0, 2.7, 0);
    scene.add(gear1, gear2, crystal);
    animatedNodes.push(
      { mesh: gear1, speed: 0.9, axis: 'z' },
      { mesh: gear2, speed: -1.4, axis: 'z' },
      { mesh: crystal, speed: 1.5, axis: 'y' },
    );
  } else if (subjectId === 'sains') {
    scene.background = new THREE.Color('#DCFCE7');
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.8, 12), emeraldMat);
    stem.position.y = 0.9;
    const flower = new THREE.Mesh(new THREE.TorusKnotGeometry(0.45, 0.14, 48, 8, 2, 3), coralMat);
    flower.position.y = 2.1;
    const magnet = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.15, 12, 24, Math.PI), coralMat);
    magnet.position.set(1.6, 1.5, 0);
    scene.add(stem, flower, magnet);
    animatedNodes.push(
      { mesh: flower, speed: 0.8, axis: 'y' },
      { mesh: magnet, speed: 2.2, axis: 'bob' },
    );
  } else if (subjectId === 'bahasa-inggeris') {
    scene.background = new THREE.Color('#E0F7FA');
    const water = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 0.15, 32), aquaMat);
    water.position.y = 0.05;
    const boat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 1.0), goldMat);
    boat.position.set(0, 0.45, 0);
    const sail = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.8, 3), emeraldMat);
    sail.position.set(0, 1.55, 0);
    scene.add(water, boat, sail);
    animatedNodes.push(
      { mesh: boat, speed: 2.0, axis: 'bob' },
      { mesh: sail, speed: 2.0, axis: 'bob' },
    );
  } else {
    scene.background = new THREE.Color('#FEF3C7');
    const pillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.4, 12), goldMat);
    pillarL.position.set(-1.3, 1.2, 0);
    const pillarR = pillarL.clone();
    pillarR.position.x = 1.3;
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.18, 10, 24, Math.PI), emeraldMat);
    arch.position.y = 2.2;
    const book = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 0.8), coralMat);
    book.position.set(0, 1.25, 0);
    scene.add(pillarL, pillarR, arch, book);
    animatedNodes.push({ mesh: book, speed: 1.2, axis: 'y' });
  }

  ctx.onFrame((_dt, elapsed) => {
    for (const n of animatedNodes) {
      if (n.axis === 'z') n.mesh.rotation.z = elapsed * n.speed;
      else if (n.axis === 'y') n.mesh.rotation.y = elapsed * n.speed;
      else n.mesh.position.y = 1.1 + Math.sin(elapsed * n.speed) * 0.22;
    }
  });
}
