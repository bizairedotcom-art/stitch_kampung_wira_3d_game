import * as THREE from 'three';
import type { ThreeSceneContext } from '@/components/three/ThreeViewport';
import type { AvatarConfig } from '@/types/user';
import { buildAvatarCharacterMesh, type AvatarAnimState } from './AvatarCharacterMesh';

export interface AvatarSceneController {
  rotateBy: (deltaRad: number) => void;
  spin360: () => void;
  setAnimState: (state: AvatarAnimState) => void;
  setZoom: (distance: number) => void;
}

export function createAvatarStudioScene(
  ctx: ThreeSceneContext,
  config: AvatarConfig,
  initialAnim: AvatarAnimState,
  onReady?: (ctrl: AvatarSceneController) => void,
) {
  const { scene, camera } = ctx;
  scene.background = new THREE.Color('#FFF1EB');

  camera.position.set(0, 2.2, 5.2);
  camera.lookAt(0, 1.35, 0);

  // Studio Lighting
  const hemi = new THREE.HemisphereLight('#FFFBEB', '#855300', 0.9);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight('#FFF7ED', 1.7);
  keyLight.position.set(4, 7, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight('#4CD7F6', 0.8);
  rimLight.position.set(-4, 4, -4);
  scene.add(rimLight);

  // Carved Chengal Pedestal
  const pedestalGroup = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.45, metalness: 0.1 });
  const brassMat = new THREE.MeshStandardMaterial({ color: '#F59E0B', roughness: 0.25, metalness: 0.75 });
  const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.75, 0.35, 32), woodMat);
  baseDisc.position.y = -0.18;
  baseDisc.receiveShadow = true;
  const trimRing = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.05, 10, 36), brassMat);
  trimRing.rotation.x = Math.PI / 2;
  trimRing.position.y = 0.01;
  pedestalGroup.add(baseDisc, trimRing);
  scene.add(pedestalGroup);

  // Decorative floating ukiran orbs
  const orbGeo = new THREE.OctahedronGeometry(0.11, 0);
  const orbMat = new THREE.MeshStandardMaterial({
    color: '#F59E0B',
    emissive: '#F59E0B',
    emissiveIntensity: 0.35,
    metalness: 0.5,
  });
  const orbs: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const orb = new THREE.Mesh(orbGeo, orbMat);
    const angle = (i / 6) * Math.PI * 2;
    orb.position.set(Math.cos(angle) * 2.1, 1.2 + (i % 2) * 0.5, Math.sin(angle) * 2.1);
    orbs.push(orb);
    scene.add(orb);
  }

  const rig = buildAvatarCharacterMesh(config);
  scene.add(rig.root);

  let targetYaw = 0.2;
  let currentYaw = 0.2;
  let targetZ = 5.2;
  let animState: AvatarAnimState = initialAnim;

  onReady?.({
    rotateBy: (d) => {
      targetYaw += d;
    },
    spin360: () => {
      targetYaw += Math.PI * 2;
    },
    setAnimState: (st) => {
      animState = st;
    },
    setZoom: (z) => {
      targetZ = THREE.MathUtils.clamp(z, 3.4, 7.5);
    },
  });

  ctx.onFrame((dt, elapsed) => {
    currentYaw = THREE.MathUtils.lerp(currentYaw, targetYaw, Math.min(1, dt * 8));
    rig.root.rotation.y = currentYaw;
    pedestalGroup.rotation.y = currentYaw * 0.4;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, Math.min(1, dt * 6));
    rig.updateAnimation(animState, elapsed);

    for (let i = 0; i < orbs.length; i++) {
      const a = (i / orbs.length) * Math.PI * 2 + elapsed * 0.6;
      orbs[i].position.set(Math.cos(a) * 2.1, 1.3 + Math.sin(elapsed * 2 + i) * 0.25, Math.sin(a) * 2.1);
      orbs[i].rotation.y = elapsed * 1.4;
    }
  });
}
