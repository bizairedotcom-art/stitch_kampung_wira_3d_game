import * as THREE from 'three';
import type { AvatarConfig } from '@/types/user';

export type AvatarAnimState =
  | 'idle'
  | 'blink'
  | 'wave'
  | 'walk'
  | 'run'
  | 'jump'
  | 'think'
  | 'celebrate'
  | 'encourage';

const SKIN_HEX: Record<AvatarConfig['skinTone'], string> = {
  cerah: '#FFE0BD',
  kuning_langsat: '#F5CBA7',
  sawo_matang: '#D49B6A',
  coklat_manis: '#A66A3E',
  gelap_hangat: '#6E4228',
};

const OUTFIT_HEX: Record<AvatarConfig['outfit'], { primary: string; trim: string }> = {
  baju_melayu_zamrud: { primary: '#0D9668', trim: '#F59E0B' },
  baju_kurung_pelangi: { primary: '#E11D48', trim: '#FDE047' },
  jaket_pengembara: { primary: '#0284C7', trim: '#F59E0B' },
  pakaian_sukan_wira: { primary: '#7C3AED', trim: '#22D3EE' },
  baju_batik_emas: { primary: '#D97706', trim: '#7C3AED' },
};

export interface ArticulatedAvatarRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  headGroup: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftEye: THREE.Mesh;
  rightEye: THREE.Mesh;
  updateAnimation: (state: AvatarAnimState, elapsed: number) => void;
}

export function buildAvatarCharacterMesh(config: AvatarConfig): ArticulatedAvatarRig {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  const skinMat = new THREE.MeshStandardMaterial({
    color: SKIN_HEX[config.skinTone] || '#D49B6A',
    roughness: 0.55,
    metalness: 0.04,
  });
  const outfitInfo = OUTFIT_HEX[config.outfit] || { primary: '#0D9668', trim: '#F59E0B' };
  const outfitColor = config.outfitColor || outfitInfo.primary;
  const outfitMat = new THREE.MeshStandardMaterial({
    color: outfitColor,
    roughness: 0.45,
    metalness: 0.08,
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: outfitInfo.trim,
    roughness: 0.3,
    metalness: 0.45,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: config.hairColor || '#2a1700',
    roughness: 0.65,
  });

  // Torso (rounded toy proportions)
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.95, 20), outfitMat);
  torso.position.y = 1.25;
  torso.castShadow = true;
  bodyGroup.add(torso);

  // Songket / Sampin waist sash
  const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.49, 0.34, 20), trimMat);
  sash.position.y = 0.92;
  bodyGroup.add(sash);

  // Legs
  const buildLeg = (x: number) => {
    const leg = new THREE.Group();
    leg.position.set(x, 0.78, 0);
    const pant = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.14, 0.38, 8, 12),
      new THREE.MeshStandardMaterial({ color: '#351000', roughness: 0.6 }),
    );
    pant.position.y = -0.28;
    pant.castShadow = true;
    leg.add(pant);

    const shoeColor =
      config.footwear === 'but_rimba'
        ? '#78350F'
        : config.footwear === 'capal_tradisi'
          ? '#B45309'
          : config.footwear === 'kasut_sukan'
            ? '#E11D48'
            : '#1E293B';
    const shoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.16, 0.4),
      new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.4 }),
    );
    shoe.position.set(0, -0.62, 0.06);
    shoe.castShadow = true;
    leg.add(shoe);
    return leg;
  };

  const leftLeg = buildLeg(-0.2);
  const rightLeg = buildLeg(0.2);
  bodyGroup.add(leftLeg, rightLeg);

  // Arms
  const buildArm = (x: number) => {
    const arm = new THREE.Group();
    arm.position.set(x, 1.58, 0);
    const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.42, 8, 12), outfitMat);
    sleeve.position.y = -0.25;
    sleeve.castShadow = true;
    arm.add(sleeve);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), skinMat);
    hand.position.y = -0.54;
    arm.add(hand);
    return arm;
  };

  const leftArm = buildArm(-0.56);
  const rightArm = buildArm(0.56);
  bodyGroup.add(leftArm, rightArm);

  // Head group
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.25, 0);
  bodyGroup.add(headGroup);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 24), skinMat);
  head.castShadow = true;
  headGroup.add(head);

  // Rosy cheeks
  const cheekMat = new THREE.MeshStandardMaterial({ color: '#FB7185', roughness: 0.7 });
  const leftCheek = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), cheekMat);
  leftCheek.position.set(-0.3, -0.08, 0.44);
  leftCheek.scale.set(1.2, 0.7, 0.4);
  const rightCheek = leftCheek.clone();
  rightCheek.position.x = 0.3;
  headGroup.add(leftCheek, rightCheek);

  // Eyes
  const eyeMat = new THREE.MeshStandardMaterial({ color: '#1C1917', roughness: 0.15, metalness: 0.2 });
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), eyeMat);
  leftEye.position.set(-0.2, 0.06, 0.49);
  const rightEye = leftEye.clone();
  rightEye.position.x = 0.2;
  headGroup.add(leftEye, rightEye);

  // Eye shine
  const shineMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
  const lShine = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), shineMat);
  lShine.position.set(-0.18, 0.085, 0.55);
  const rShine = lShine.clone();
  rShine.position.x = 0.22;
  headGroup.add(lShine, rShine);

  // Smile
  const smileGeo = new THREE.TorusGeometry(0.13, 0.025, 8, 18, Math.PI);
  const smileMat = new THREE.MeshStandardMaterial({ color: '#78350F' });
  const smile = new THREE.Mesh(smileGeo, smileMat);
  smile.position.set(0, -0.14, 0.51);
  smile.rotation.z = Math.PI;
  headGroup.add(smile);

  // Hair base
  if (config.headwear !== 'hijab_merdeka') {
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.585, 22, 18, 0, Math.PI * 2, 0, Math.PI * 0.56),
      hairMat,
    );
    hairCap.rotation.x = -0.2;
    headGroup.add(hairCap);

    if (config.hairStyle === 'tocang_dua') {
      const bunL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), hairMat);
      bunL.position.set(-0.55, 0.2, -0.1);
      const bunR = bunL.clone();
      bunR.position.x = 0.55;
      headGroup.add(bunL, bunR);
    }
  }

  // Headwear
  const hwMat = new THREE.MeshStandardMaterial({
    color: config.headwearColor || '#006947',
    roughness: 0.42,
  });
  if (config.headwear === 'songkok') {
    const songkok = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 0.34, 24), hwMat);
    songkok.position.set(0, 0.54, -0.02);
    const goldBand = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.025, 8, 24), trimMat);
    goldBand.rotation.x = Math.PI / 2;
    goldBand.position.y = 0.4;
    headGroup.add(songkok, goldBand);
  } else if (config.headwear === 'hijab_merdeka') {
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.61, 22, 22), hwMat);
    hood.position.set(0, 0.04, -0.07);
    const drape = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.52, 0.45, 20), hwMat);
    drape.position.set(0, -0.45, -0.04);
    headGroup.add(hood, drape);
  } else if (config.headwear === 'tengkolok') {
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.44, 5), trimMat);
    crown.position.set(0, 0.58, 0);
    crown.rotation.y = 0.3;
    headGroup.add(crown);
  } else if (config.headwear === 'topi_rimba') {
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.06, 24), hwMat);
    brim.position.y = 0.45;
    const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 0.28, 20), hwMat);
    dome.position.y = 0.58;
    headGroup.add(brim, dome);
  }

  // Accessories
  if (config.accessory === 'beg_rotan') {
    const pack = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.62, 0.28),
      new THREE.MeshStandardMaterial({ color: '#B45309', roughness: 0.7 }),
    );
    pack.position.set(0, 1.28, -0.48);
    pack.castShadow = true;
    bodyGroup.add(pack);
  } else if (config.accessory === 'cermin_mata') {
    const frameMat = new THREE.MeshStandardMaterial({ color: '#F59E0B', metalness: 0.6, roughness: 0.2 });
    const ringL = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.022, 8, 20), frameMat);
    ringL.position.set(-0.2, 0.06, 0.54);
    const ringR = ringL.clone();
    ringR.position.x = 0.2;
    headGroup.add(ringL, ringR);
  } else if (config.accessory === 'lencana_bintang') {
    const badge = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), trimMat);
    badge.position.set(-0.22, 1.46, 0.44);
    bodyGroup.add(badge);
  } else if (config.accessory === 'selendang_songket') {
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.09, 10, 22), trimMat);
    scarf.rotation.x = Math.PI / 2;
    scarf.position.y = 1.72;
    bodyGroup.add(scarf);
  }

  const updateAnimation = (state: AvatarAnimState, t: number) => {
    // Reset defaults cleanly
    bodyGroup.position.y = 0;
    bodyGroup.rotation.set(0, 0, 0);
    headGroup.rotation.set(0, 0, 0);
    leftArm.rotation.set(0, 0, 0.15);
    rightArm.rotation.set(0, 0, -0.15);
    leftLeg.rotation.set(0, 0, 0);
    rightLeg.rotation.set(0, 0, 0);
    const blinkCycle = Math.sin(t * 2.2) > 0.96;
    const eyeScaleY = state === 'blink' || blinkCycle ? 0.15 : 1;
    leftEye.scale.y = eyeScaleY;
    rightEye.scale.y = eyeScaleY;

    switch (state) {
      case 'idle':
        bodyGroup.position.y = Math.sin(t * 2.5) * 0.04;
        leftArm.rotation.z = 0.16 + Math.sin(t * 2.5) * 0.05;
        rightArm.rotation.z = -0.16 - Math.sin(t * 2.5) * 0.05;
        break;
      case 'wave':
        bodyGroup.position.y = Math.sin(t * 3) * 0.04;
        rightArm.rotation.z = -2.4 + Math.sin(t * 9) * 0.35;
        headGroup.rotation.z = 0.08;
        break;
      case 'walk':
        bodyGroup.position.y = Math.abs(Math.sin(t * 7)) * 0.07;
        leftLeg.rotation.x = Math.sin(t * 7) * 0.55;
        rightLeg.rotation.x = -Math.sin(t * 7) * 0.55;
        leftArm.rotation.x = -Math.sin(t * 7) * 0.45;
        rightArm.rotation.x = Math.sin(t * 7) * 0.45;
        break;
      case 'run':
        bodyGroup.position.y = Math.abs(Math.sin(t * 12)) * 0.12;
        bodyGroup.rotation.x = 0.14;
        leftLeg.rotation.x = Math.sin(t * 12) * 0.85;
        rightLeg.rotation.x = -Math.sin(t * 12) * 0.85;
        leftArm.rotation.x = -Math.sin(t * 12) * 0.75;
        rightArm.rotation.x = Math.sin(t * 12) * 0.75;
        break;
      case 'jump':
        bodyGroup.position.y = Math.abs(Math.sin(t * 4.5)) * 0.65;
        leftArm.rotation.z = 2.1;
        rightArm.rotation.z = -2.1;
        break;
      case 'think':
        headGroup.rotation.z = 0.14;
        headGroup.rotation.y = Math.sin(t * 1.5) * 0.18;
        rightArm.rotation.x = -1.2;
        rightArm.rotation.z = -0.6;
        break;
      case 'celebrate':
        bodyGroup.position.y = Math.abs(Math.sin(t * 7)) * 0.38;
        bodyGroup.rotation.y = Math.sin(t * 3.5) * 0.4;
        leftArm.rotation.z = 2.45 + Math.sin(t * 10) * 0.2;
        rightArm.rotation.z = -2.45 - Math.sin(t * 10) * 0.2;
        break;
      case 'encourage':
        bodyGroup.position.y = Math.sin(t * 4) * 0.05;
        leftArm.rotation.z = 1.1 + Math.sin(t * 6) * 0.2;
        rightArm.rotation.z = -1.1 - Math.sin(t * 6) * 0.2;
        headGroup.rotation.x = Math.sin(t * 5) * 0.1;
        break;
      case 'blink':
        break;
    }
  };

  return {
    root,
    bodyGroup,
    headGroup,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    leftEye,
    rightEye,
    updateAnimation,
  };
}
