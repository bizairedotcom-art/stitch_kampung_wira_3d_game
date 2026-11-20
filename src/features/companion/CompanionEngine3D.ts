import * as THREE from 'three';
import type { ThreeSceneContext } from '@/components/three/ThreeViewport';
import type { CompanionId } from '@/types/user';

function buildCompanionMesh(id: CompanionId): THREE.Group {
  const group = new THREE.Group();
  const palette: Record<CompanionId, { main: string; belly: string; accent: string }> = {
    rimau: { main: '#F59E0B', belly: '#FEF3C7', accent: '#351000' },
    kancil: { main: '#B45309', belly: '#FFFBEB', accent: '#0D9668' },
    enggang: { main: '#1E293B', belly: '#FFFFFF', accent: '#F59E0B' },
    utan: { main: '#C2410C', belly: '#FDE68A', accent: '#06B6D4' },
    badak: { main: '#64748B', belly: '#CBD5E1', accent: '#E11D48' },
  };
  const colors = palette[id];
  const mainMat = new THREE.MeshStandardMaterial({ color: colors.main, roughness: 0.5 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: colors.belly, roughness: 0.6 });
  const accentMat = new THREE.MeshStandardMaterial({ color: colors.accent, roughness: 0.35, metalness: 0.2 });

  // Body & Head
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 20), mainMat);
  body.scale.set(1, 1.08, 0.92);
  body.position.y = 0.72;
  body.castShadow = true;
  group.add(body);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), bellyMat);
  belly.position.set(0, 0.68, 0.32);
  belly.scale.set(0.85, 0.95, 0.5);
  group.add(belly);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 22, 22), mainMat);
  head.position.y = 1.55;
  head.castShadow = true;
  group.add(head);

  // Eyes
  const eyeMat = new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.1 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), eyeMat);
  eyeL.position.set(-0.2, 1.62, 0.48);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.2;
  group.add(eyeL, eyeR);

  // Species traits
  if (id === 'rimau') {
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), mainMat);
    earL.position.set(-0.42, 2.0, 0);
    const earR = earL.clone();
    earR.position.x = 0.42;
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.12), accentMat);
    stripe.position.set(0, 1.85, 0.46);
    group.add(earL, earR, stripe);
  } else if (id === 'kancil') {
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.42, 12), mainMat);
    earL.position.set(-0.32, 2.1, 0);
    earL.rotation.z = 0.25;
    const earR = earL.clone();
    earR.position.x = 0.32;
    earR.rotation.z = -0.25;
    const tanjak = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.32, 4), accentMat);
    tanjak.position.set(0, 2.15, 0.05);
    group.add(earL, earR, tanjak);
  } else if (id === 'enggang') {
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.65, 12), accentMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 1.5, 0.72);
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.65, 0.5), mainMat);
    wingL.position.set(-0.68, 0.85, 0);
    wingL.rotation.z = 0.3;
    const wingR = wingL.clone();
    wingR.position.x = 0.68;
    wingR.rotation.z = -0.3;
    group.add(beak, wingL, wingR);
  } else if (id === 'utan') {
    const gogglesL = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 8, 16), accentMat);
    gogglesL.position.set(-0.18, 1.82, 0.44);
    const gogglesR = gogglesL.clone();
    gogglesR.position.x = 0.18;
    group.add(gogglesL, gogglesR);
  } else if (id === 'badak') {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.34, 12), bellyMat);
    horn.position.set(0, 1.58, 0.6);
    horn.rotation.x = 0.8;
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.06, 8, 24), accentMat);
    band.rotation.x = Math.PI / 2;
    band.position.y = 1.85;
    group.add(horn, band);
  }

  return group;
}

export function createCompanionScene(ctx: ThreeSceneContext, companionId: CompanionId) {
  const { scene, camera } = ctx;
  scene.background = new THREE.Color('#E8F8F0');
  camera.position.set(0, 2.1, 4.8);
  camera.lookAt(0, 1.1, 0);

  scene.add(new THREE.HemisphereLight('#FFFBEB', '#065F46', 1.0));
  const dir = new THREE.DirectionalLight('#FFF7ED', 1.6);
  dir.position.set(4, 6, 4);
  dir.castShadow = true;
  scene.add(dir);

  const grassPlatform = new THREE.Mesh(
    new THREE.CylinderGeometry(1.7, 1.9, 0.4, 28),
    new THREE.MeshStandardMaterial({ color: '#10B981', roughness: 0.7 }),
  );
  grassPlatform.position.y = -0.2;
  grassPlatform.receiveShadow = true;
  scene.add(grassPlatform);

  const mesh = buildCompanionMesh(companionId);
  scene.add(mesh);

  ctx.onFrame((_dt, elapsed) => {
    mesh.rotation.y = Math.sin(elapsed * 0.9) * 0.45;
    mesh.position.y = Math.abs(Math.sin(elapsed * 2.6)) * 0.14;
  });
}
