import gsap from 'gsap';
import * as THREE from 'three';
import type { ThreeSceneContext } from '@/components/three/ThreeViewport';
import type { VillageBuilding, VillageState } from '@/types/village';

export interface VillageSceneController {
  focusBuilding: (buildingId: string) => void;
  resetCamera: () => void;
  setDayNight: (time: VillageState['timeOfDay']) => void;
}

function createBuildingMesh(bld: VillageBuilding): THREE.Group {
  const g = new THREE.Group();
  const isBuilt = bld.status === 'built';
  const wallMat = new THREE.MeshStandardMaterial({
    color: isBuilt ? bld.wallColor : '#CBD5E1',
    roughness: 0.55,
    transparent: !isBuilt,
    opacity: isBuilt ? 1 : 0.65,
  });
  const roofMat = new THREE.MeshStandardMaterial({
    color: isBuilt ? bld.roofColor : '#94A3B8',
    roughness: 0.4,
    metalness: 0.12,
  });
  const woodMat = new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.65 });
  const goldMat = new THREE.MeshStandardMaterial({
    color: '#F59E0B',
    metalness: 0.65,
    roughness: 0.25,
    emissive: '#F59E0B',
    emissiveIntensity: isBuilt ? 0.18 : 0,
  });

  // Foundation plinth
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.65, 0.35, 8), woodMat);
  base.position.y = 0.18;
  base.receiveShadow = true;
  base.castShadow = true;
  g.add(base);

  if (bld.styleVariant === 'tower') {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.15, 2.6 + bld.level * 0.25, 10), wallMat);
    body.position.y = 1.6;
    body.castShadow = true;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.35, 10), roofMat);
    roof.position.y = 3.45 + bld.level * 0.25;
    roof.castShadow = true;
    const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), goldMat);
    finial.position.y = 4.35 + bld.level * 0.25;
    g.add(body, roof, finial);
  } else if (bld.styleVariant === 'lab' || bld.styleVariant === 'bay') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.5, 1.8), wallMat);
    body.position.y = 1.1;
    body.castShadow = true;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.05, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), roofMat);
    dome.position.y = 1.85;
    g.add(body, dome);
  } else {
    // Traditional Nusantara stilts + Bumbung Limas
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.35, 1.7), wallMat);
    body.position.y = 1.2;
    body.castShadow = true;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.65, 1.15, 4), roofMat);
    roof.position.y = 2.45;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    g.add(body, roof);
  }

  // Glowing door sign
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.72, 0.12), goldMat);
  door.position.set(0, 0.75, 0.92);
  g.add(door);

  // Level stars indicator
  for (let s = 0; s < bld.level; s++) {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), goldMat);
    star.position.set((s - (bld.level - 1) / 2) * 0.36, 0.48, 1.12);
    g.add(star);
  }

  g.position.set(bld.gridX, 0, bld.gridZ);
  g.rotation.y = bld.rotation;
  g.userData = { buildingId: bld.id };
  return g;
}

export function createVillageScene(
  ctx: ThreeSceneContext,
  village: VillageState,
  onSelectBuilding: (building: VillageBuilding) => void,
  onSelectGroundTile?: (x: number, z: number) => void,
  onReady?: (ctrl: VillageSceneController) => void,
) {
  const { scene, camera } = ctx;

  const skyPalette = {
    morning: '#C7F0FE',
    afternoon: '#FFE6C7',
    evening: '#1E293B',
  };
  scene.background = new THREE.Color(skyPalette[village.timeOfDay]);

  camera.position.set(16, 16, 20);
  camera.lookAt(0, 0, 0);

  const hemi = new THREE.HemisphereLight('#FFFBEB', '#065F46', village.timeOfDay === 'evening' ? 0.55 : 1.05);
  const sun = new THREE.DirectionalLight(village.timeOfDay === 'evening' ? '#FDBA74' : '#FFF7ED', 1.65);
  sun.position.set(14, 22, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -18;
  sun.shadow.camera.right = 18;
  sun.shadow.camera.top = 18;
  sun.shadow.camera.bottom = -18;
  scene.add(hemi, sun);

  // Main Kampung Island
  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(17.5, 19.2, 1.4, 36),
    new THREE.MeshStandardMaterial({ color: '#10B981', roughness: 0.85 }),
  );
  ground.position.y = -0.7;
  ground.receiveShadow = true;
  scene.add(ground);

  // Inner Padi / Songket Terrace
  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(5.5, 5.8, 0.22, 24),
    new THREE.MeshStandardMaterial({ color: '#FDE68A', roughness: 0.8 }),
  );
  plaza.position.y = 0.05;
  plaza.receiveShadow = true;
  scene.add(plaza);

  // Turquoise River Strip
  const riverMat = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    roughness: 0.18,
    metalness: 0.25,
    emissive: '#0891B2',
    emissiveIntensity: 0.15,
  });
  const river = new THREE.Mesh(new THREE.BoxGeometry(32, 0.16, 3.1), riverMat);
  river.position.set(0, 0.03, 0);
  scene.add(river);

  // Chengal Bridge
  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.32, 3.6),
    new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.65 }),
  );
  bridge.position.set(0, 0.24, 0);
  bridge.castShadow = true;
  scene.add(bridge);

  // Instanced Coconut Palm Trunks & Crowns
  const palmPositions = [
    [-12, -3], [-8, 9], [9, 9], [13, -4], [-13, 8], [12, 3], [-2, -12], [6, -12],
  ];
  const trunkInst = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.16, 0.24, 2.8, 8),
    new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.8 }),
    palmPositions.length,
  );
  const crownInst = new THREE.InstancedMesh(
    new THREE.ConeGeometry(1.2, 0.9, 6),
    new THREE.MeshStandardMaterial({ color: '#059669', roughness: 0.6 }),
    palmPositions.length,
  );
  const dummy = new THREE.Object3D();
  palmPositions.forEach(([x, z], idx) => {
    dummy.position.set(x, 1.4, z);
    dummy.rotation.set(0, idx * 0.6, 0.06);
    dummy.updateMatrix();
    trunkInst.setMatrixAt(idx, dummy.matrix);

    dummy.position.set(x + 0.1, 2.9, z);
    dummy.rotation.set(0, idx * 0.8, 0);
    dummy.updateMatrix();
    crownInst.setMatrixAt(idx, dummy.matrix);
  });
  trunkInst.castShadow = true;
  crownInst.castShadow = true;
  scene.add(trunkInst, crownInst);

  // Animated Sampan Boat on River
  const sampan = new THREE.Group();
  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.32, 0.72),
    new THREE.MeshStandardMaterial({ color: '#D97706', roughness: 0.5 }),
  );
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 0.6, 4),
    new THREE.MeshStandardMaterial({ color: '#0D9668' }),
  );
  roof.position.y = 0.45;
  sampan.add(hull, roof);
  sampan.position.set(-7, 0.25, 0.5);
  scene.add(sampan);

  // Animated Hornbill overhead
  const bird = new THREE.Group();
  const birdBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 10, 10),
    new THREE.MeshStandardMaterial({ color: '#1E293B' }),
  );
  const birdBeak = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: '#F59E0B' }),
  );
  birdBeak.rotation.x = Math.PI / 2;
  birdBeak.position.z = 0.32;
  bird.add(birdBody, birdBeak);
  scene.add(bird);

  // Buildings
  const buildingMeshes = new Map<string, THREE.Group>();
  const interactiveMeshes: THREE.Object3D[] = [];
  for (const bld of village.buildings) {
    const mesh = createBuildingMesh(bld);
    buildingMeshes.set(bld.id, mesh);
    interactiveMeshes.push(mesh);
    scene.add(mesh);
  }

  // User Decorations
  for (const dec of village.decorations) {
    const decGroup = new THREE.Group();
    const color = dec.category === 'lampu' ? '#F59E0B' : dec.category === 'bunga' ? '#E11D48' : '#059669';
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 1.1, 8),
      new THREE.MeshStandardMaterial({ color: '#78350F' }),
    );
    post.position.y = 0.55;
    const top = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 10, 10),
      new THREE.MeshStandardMaterial({
        color,
        emissive: dec.category === 'lampu' ? '#F59E0B' : '#000000',
        emissiveIntensity: 0.4,
      }),
    );
    top.position.y = 1.25;
    decGroup.add(post, top);
    decGroup.position.set(dec.gridX, 0, dec.gridZ);
    scene.add(decGroup);
  }

  // Selection ring
  const selectRing = new THREE.Mesh(
    new THREE.RingGeometry(1.75, 2.05, 32),
    new THREE.MeshBasicMaterial({ color: '#F59E0B', side: THREE.DoubleSide }),
  );
  selectRing.rotation.x = -Math.PI / 2;
  selectRing.position.y = 0.08;
  selectRing.visible = false;
  scene.add(selectRing);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const lookTarget = new THREE.Vector3(0, 0, 0);

  const focusBuilding = (buildingId: string) => {
    const bld = village.buildings.find((b) => b.id === buildingId);
    if (!bld) return;
    selectRing.position.set(bld.gridX, 0.08, bld.gridZ);
    selectRing.visible = true;
    gsap.to(camera.position, {
      x: bld.gridX + 6.5,
      y: 7.5,
      z: bld.gridZ + 8.5,
      duration: 0.75,
      ease: 'power2.out',
    });
    gsap.to(lookTarget, {
      x: bld.gridX,
      y: 1.0,
      z: bld.gridZ,
      duration: 0.75,
      ease: 'power2.out',
    });
  };

  const resetCamera = () => {
    selectRing.visible = false;
    gsap.to(camera.position, { x: 16, y: 16, z: 20, duration: 0.8, ease: 'power2.out' });
    gsap.to(lookTarget, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'power2.out' });
  };

  const setDayNight = (time: VillageState['timeOfDay']) => {
    scene.background = new THREE.Color(skyPalette[time]);
    hemi.intensity = time === 'evening' ? 0.55 : 1.05;
    sun.color.set(time === 'evening' ? '#FDBA74' : '#FFF7ED');
  };

  onReady?.({ focusBuilding, resetCamera, setDayNight });

  ctx.onPointerDown((ndcX, ndcY) => {
    pointer.set(ndcX, ndcY);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactiveMeshes, true);
    if (hits.length > 0) {
      let cur: THREE.Object3D | null = hits[0].object;
      while (cur && !cur.userData.buildingId) cur = cur.parent;
      const bId = cur?.userData.buildingId as string | undefined;
      const bld = village.buildings.find((b) => b.id === bId);
      if (bld) {
        focusBuilding(bld.id);
        onSelectBuilding(bld);
        return;
      }
    }
    const groundHits = raycaster.intersectObject(ground);
    if (groundHits.length > 0 && onSelectGroundTile) {
      const pt = groundHits[0].point;
      onSelectGroundTile(Math.round(pt.x), Math.round(pt.z));
    }
  });

  ctx.onFrame((_dt, elapsed) => {
    camera.lookAt(lookTarget);
    // Boat sails smoothly avoiding the bridge center
    const boatX = Math.sin(elapsed * 0.28) * 11;
    sampan.position.x = boatX;
    sampan.position.z = boatX > -2.5 && boatX < 2.5 ? 1.0 : 0.45;
    sampan.position.y = 0.22 + Math.sin(elapsed * 3) * 0.04;

    // Hornbill circles canopy
    bird.position.set(Math.cos(elapsed * 0.55) * 9, 6.2 + Math.sin(elapsed * 2) * 0.35, Math.sin(elapsed * 0.55) * 9);
    bird.rotation.y = -elapsed * 0.55;

    if (selectRing.visible) {
      const s = 1 + Math.sin(elapsed * 4) * 0.08;
      selectRing.scale.set(s, s, 1);
    }
  });
}
