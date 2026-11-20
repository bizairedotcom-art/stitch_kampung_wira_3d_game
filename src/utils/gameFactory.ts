import type { SubjectId } from '@/types/curriculum';
import type {
  AchievementBadge,
  ActivityCompletionPayload,
  InventoryItem,
  MasteryStatus,
  MissionProgress,
  RewardTransaction,
  SubtopicProgress,
} from '@/types/game';
import type { AvatarConfig, CompanionId, CompanionProfile, LearnerProfile } from '@/types/user';
import type { VillageBuilding, VillageState } from '@/types/village';

export const COMPANIONS: Record<CompanionId, CompanionProfile> = {
  rimau: {
    id: 'rimau',
    name: 'Rimau',
    species: 'Harimau Malaya Muda',
    role: 'Ketua Pasukan & Penjaga Semangat',
    personality: 'Berani, ceria, setia dan suka mengira bintang.',
    specialAbility: 'Petunjuk Pantas Matematik & Kiraan',
    primaryColor: '#F59E0B',
    accentColor: '#78350F',
    portraitImage: '/assets/stitch/remote-646325e079ef8c04.jpg',
    greeting: '“Ayuh Wira! Mari kita bina kampung sambil belajar bersama!”',
  },
  kancil: {
    id: 'kancil',
    name: 'Kancil',
    species: 'Pelanduk Pintar Nusantara',
    role: 'Pakar Bahasa & Cerita Rakyat',
    personality: 'Pintar, petah berkata-kata dan bijak menyelesaikan teka-teki.',
    specialAbility: 'Pembantu Suku Kata & Membaca',
    primaryColor: '#0D9668',
    accentColor: '#F59E0B',
    portraitImage: '/assets/generated/companion_kancil_1795172998081.jpg',
    greeting: '“Setiap buku ada cerita ajaib. Jom baca bersama Kancil!”',
  },
  enggang: {
    id: 'enggang',
    name: 'Enggang',
    species: 'Burung Kenyalang Sarawak',
    role: 'Pemandu Bahasa Inggeris & Muzik',
    personality: 'Suka menyanyi, terbang tinggi dan gemar warna pelangi.',
    specialAbility: 'Sebutan Phonics & Irama Lagu',
    primaryColor: '#06B6D4',
    accentColor: '#E11D48',
    portraitImage: '/assets/generated/companion_enggang_1795172998389.jpg',
    greeting: '“Hello friend! Let us explore Adventure Bay and sing together!”',
  },
  utan: {
    id: 'utan',
    name: 'Utan',
    species: 'Orangutan Borneo',
    role: 'Saintis Rimba & Pencipta Kraf',
    personality: 'Ingin tahu, rajin memerhati dan suka eksperimen alam.',
    specialAbility: 'Petunjuk Eksperimen Sains & Reka Cipta',
    primaryColor: '#D97706',
    accentColor: '#0D9668',
    portraitImage: '/assets/generated/companion_utan_1795172999257.jpg',
    greeting: '“Wah, lihat magnet dan daun teratai ini! Jom uji bersama Utan!”',
  },
  badak: {
    id: 'badak',
    name: 'Badak',
    species: 'Badak Sumbu Sumatera',
    role: 'Juara Kesihatan, Adab & Nilai Murni',
    personality: 'Tenang, penyayang, kuat bersukan dan sentiasa bersopan.',
    specialAbility: 'Penggalak Tenaga PJPK & Adab Harmoni',
    primaryColor: '#7C3AED',
    accentColor: '#0D9668',
    portraitImage: '/assets/generated/companion_badak_1795173003810.jpg',
    greeting: '“Badan cergas, hati mulia! Jom ke Arena Wira dan Taman Harmoni!”',
  },
};

export function createDefaultAvatar(): AvatarConfig {
  return {
    skinTone: 'sawo_matang',
    hairStyle: 'pendek_kemas',
    hairColor: '#2a1700',
    headwear: 'songkok',
    headwearColor: '#006947',
    outfit: 'baju_melayu_zamrud',
    outfitColor: '#0D9668',
    accessory: 'beg_rotan',
    footwear: 'kasut_sekolah',
    expression: 'ceria',
  };
}

export function createInitialBuildings(): VillageBuilding[] {
  return [
    {
      id: 'bld-matematik',
      subjectId: 'matematik',
      name: 'Menara Nombor',
      plotId: 'plot-1',
      gridX: -6,
      gridZ: -4,
      rotation: 0.2,
      level: 1,
      maxLevel: 3,
      status: 'built',
      buildCostCoins: 0,
      upgradeCostCoins: 80,
      styleVariant: 'tower',
      roofColor: '#006577',
      wallColor: '#F59E0B',
      previewImage: '/assets/stitch/remote-9b25d19e5c0a8319.jpg',
    },
    {
      id: 'bld-bahasa-melayu',
      subjectId: 'bahasa-melayu',
      name: 'Pustaka Rimba',
      plotId: 'plot-2',
      gridX: 0,
      gridZ: -6,
      rotation: 0,
      level: 1,
      maxLevel: 3,
      status: 'built',
      buildCostCoins: 0,
      upgradeCostCoins: 80,
      styleVariant: 'library',
      roofColor: '#0D9668',
      wallColor: '#D97706',
      previewImage: '/assets/stitch/remote-f9c54ba6b6063fb7.jpg',
    },
    {
      id: 'bld-sains',
      subjectId: 'sains',
      name: 'Makmal Alam',
      plotId: 'plot-3',
      gridX: 6,
      gridZ: -4,
      rotation: -0.25,
      level: 1,
      maxLevel: 3,
      status: 'built',
      buildCostCoins: 0,
      upgradeCostCoins: 80,
      styleVariant: 'lab',
      roofColor: '#06B6D4',
      wallColor: '#FFFBEB',
      previewImage: '/assets/stitch/remote-72f7c78e078956a1.jpg',
    },
    {
      id: 'bld-bahasa-inggeris',
      subjectId: 'bahasa-inggeris',
      name: 'Adventure Bay',
      plotId: 'plot-4',
      gridX: 7,
      gridZ: 3,
      rotation: -0.6,
      level: 1,
      maxLevel: 3,
      status: 'built',
      buildCostCoins: 0,
      upgradeCostCoins: 80,
      styleVariant: 'bay',
      roofColor: '#0284C7',
      wallColor: '#FEF3C7',
      previewImage: '/assets/stitch/remote-dc19548e6a70ad4d.jpg',
    },
    {
      id: 'bld-pendidikan-islam',
      subjectId: 'pendidikan-islam',
      name: 'Taman Harmoni (Surau & Wakaf)',
      plotId: 'plot-5',
      gridX: -6,
      gridZ: 3,
      rotation: 0.4,
      level: 1,
      maxLevel: 3,
      status: 'built',
      buildCostCoins: 0,
      upgradeCostCoins: 75,
      styleVariant: 'pavilion',
      roofColor: '#0D9668',
      wallColor: '#FFF8F6',
      previewImage: '/assets/stitch/remote-e80adb34a679c42b.jpg',
    },
    {
      id: 'bld-pendidikan-moral',
      subjectId: 'pendidikan-moral',
      name: 'Wakaf Teduhan Kasih',
      plotId: 'plot-6',
      gridX: -2,
      gridZ: 6,
      rotation: 0.1,
      level: 1,
      maxLevel: 3,
      status: 'built',
      buildCostCoins: 0,
      upgradeCostCoins: 75,
      styleVariant: 'wakaf',
      roofColor: '#7C3AED',
      wallColor: '#FDE68A',
      previewImage: '/assets/stitch/remote-285072b40e76e62a.jpg',
    },
    {
      id: 'bld-psv',
      subjectId: 'pendidikan-seni-visual',
      name: 'Galeri Batik Pelangi',
      plotId: 'plot-7',
      gridX: 3,
      gridZ: 6,
      rotation: -0.2,
      level: 1,
      maxLevel: 3,
      status: 'available',
      buildCostCoins: 40,
      upgradeCostCoins: 90,
      styleVariant: 'gallery',
      roofColor: '#E11D48',
      wallColor: '#FEF3C7',
      previewImage: '/assets/stitch/remote-b61a77e63e8fa775.jpg',
    },
    {
      id: 'bld-muzik',
      subjectId: 'pendidikan-muzik',
      name: 'Pentas Irama Nusantara',
      plotId: 'plot-8',
      gridX: -10,
      gridZ: 0,
      rotation: 0.5,
      level: 1,
      maxLevel: 3,
      status: 'available',
      buildCostCoins: 40,
      upgradeCostCoins: 90,
      styleVariant: 'stage',
      roofColor: '#F59E0B',
      wallColor: '#78350F',
      previewImage: '/assets/generated/building_pentas_irama_1795173003999.jpg',
    },
    {
      id: 'bld-pjpk',
      subjectId: 'pjpk',
      name: 'Arena Wira Cergas',
      plotId: 'plot-9',
      gridX: 10,
      gridZ: -1,
      rotation: -0.5,
      level: 1,
      maxLevel: 3,
      status: 'available',
      buildCostCoins: 40,
      upgradeCostCoins: 90,
      styleVariant: 'arena',
      roofColor: '#0D9668',
      wallColor: '#F59E0B',
      previewImage: '/assets/generated/building_arena_wira_1795173003436.jpg',
    },
    {
      id: 'bld-bahasa-arab',
      subjectId: 'bahasa-arab',
      name: 'Balai Bahasa Arab',
      plotId: 'plot-10',
      gridX: -10,
      gridZ: -6,
      rotation: 0.35,
      level: 1,
      maxLevel: 3,
      status: 'available',
      buildCostCoins: 30,
      upgradeCostCoins: 70,
      styleVariant: 'wakaf',
      roofColor: '#006947',
      wallColor: '#FEF3C7',
      previewImage: '/assets/stitch/remote-e80adb34a679c42b.jpg',
    },
    {
      id: 'bld-bahasa-cina',
      subjectId: 'bahasa-cina-sk',
      name: 'Astaka Bahasa Cina (SK)',
      plotId: 'plot-11',
      gridX: 10,
      gridZ: -7,
      rotation: -0.35,
      level: 1,
      maxLevel: 3,
      status: 'available',
      buildCostCoins: 30,
      upgradeCostCoins: 70,
      styleVariant: 'pavilion',
      roofColor: '#E11D48',
      wallColor: '#FFFBEB',
      previewImage: '/assets/stitch/remote-b61a77e63e8fa775.jpg',
    },
    {
      id: 'bld-bahasa-tamil',
      subjectId: 'bahasa-tamil-sk',
      name: 'Mandapam Bahasa Tamil (SK)',
      plotId: 'plot-12',
      gridX: -10,
      gridZ: 6,
      rotation: 0.45,
      level: 1,
      maxLevel: 3,
      status: 'available',
      buildCostCoins: 30,
      upgradeCostCoins: 70,
      styleVariant: 'pavilion',
      roofColor: '#F59E0B',
      wallColor: '#FFF8F6',
      previewImage: '/assets/stitch/remote-f9c54ba6b6063fb7.jpg',
    },
    {
      id: 'bld-bahasa-iban',
      subjectId: 'bahasa-iban',
      name: 'Ruai Bahasa Iban',
      plotId: 'plot-13',
      gridX: 10,
      gridZ: 6,
      rotation: -0.45,
      level: 1,
      maxLevel: 3,
      status: 'available',
      buildCostCoins: 30,
      upgradeCostCoins: 70,
      styleVariant: 'library',
      roofColor: '#78350F',
      wallColor: '#FDE68A',
      previewImage: '/assets/stitch/remote-dc19548e6a70ad4d.jpg',
    },
    {
      id: 'bld-bahasa-kadazandusun',
      subjectId: 'bahasa-kadazandusun',
      name: 'Sulap Kadazandusun',
      plotId: 'plot-14',
      gridX: -4,
      gridZ: -10,
      rotation: 0.15,
      level: 1,
      maxLevel: 3,
      status: 'available',
      buildCostCoins: 30,
      upgradeCostCoins: 70,
      styleVariant: 'wakaf',
      roofColor: '#0D9668',
      wallColor: '#FDE68A',
      previewImage: '/assets/stitch/remote-72f7c78e078956a1.jpg',
    },
    {
      id: 'bld-bahasa-semai',
      subjectId: 'bahasa-semai',
      name: 'Pondok Bahasa Semai',
      plotId: 'plot-15',
      gridX: 4,
      gridZ: -10,
      rotation: -0.15,
      level: 1,
      maxLevel: 3,
      status: 'available',
      buildCostCoins: 30,
      upgradeCostCoins: 70,
      styleVariant: 'wakaf',
      roofColor: '#06B6D4',
      wallColor: '#FDE68A',
      previewImage: '/assets/stitch/remote-72f7c78e078956a1.jpg',
    },
  ];
}

export const DECORATION_CATALOG = [
  { catalogId: 'pokok-kelapa', name: 'Pokok Kelapa Melambai', category: 'pokok' as const, costCoins: 20, icon: 'park' },
  { catalogId: 'lampu-pelita', name: 'Pelita Buluh Tradisi', category: 'lampu' as const, costCoins: 25, icon: 'light' },
  { catalogId: 'bunga-raya', name: 'Taman Bunga Raya', category: 'bunga' as const, costCoins: 20, icon: 'local_florist' },
  { catalogId: 'wau-bulan', name: 'Tiang Wau Bulan', category: 'kraf' as const, costCoins: 35, icon: 'air' },
  { catalogId: 'papan-ilmu', name: 'Papan Tanda Ukiran', category: 'papan_tanda' as const, costCoins: 15, icon: 'signpost' },
];

export function createInitialMissions(): MissionProgress[] {
  return [
    {
      id: 'mis-1',
      title: 'Penjelajah Nombor Asas',
      description: 'Selesaikan 1 aktiviti di Menara Nombor (Matematik).',
      subjectId: 'matematik',
      targetCount: 1,
      currentCount: 0,
      rewardCoins: 30,
      rewardStars: 3,
      claimed: false,
      type: 'daily',
    },
    {
      id: 'mis-2',
      title: 'Pembaca Pustaka Rimba',
      description: 'Lengkapkan 1 latihan Bahasa Melayu Tahun 1.',
      subjectId: 'bahasa-melayu',
      targetCount: 1,
      currentCount: 0,
      rewardCoins: 30,
      rewardStars: 3,
      claimed: false,
      type: 'daily',
    },
    {
      id: 'mis-3',
      title: 'Saintis Muda Alam',
      description: 'Jalankan 1 eksperimen atau penilaian Sains.',
      subjectId: 'sains',
      targetCount: 1,
      currentCount: 0,
      rewardCoins: 35,
      rewardStars: 4,
      claimed: false,
      type: 'daily',
    },
    {
      id: 'mis-4',
      title: 'Pembangun Kampung Wira',
      description: 'Bina atau naik taraf 1 bangunan di peta desa.',
      targetCount: 1,
      currentCount: 0,
      rewardCoins: 45,
      rewardStars: 5,
      claimed: false,
      type: 'story',
    },
  ];
}

export function createInitialAchievements(): AchievementBadge[] {
  return [
    {
      id: 'ach-first-step',
      title: 'Langkah Pertama Wira',
      description: 'Berjaya melengkapkan aktiviti pembelajaran pertama.',
      icon: 'military_tech',
      category: 'akademik',
    },
    {
      id: 'ach-math-master',
      title: 'Kunci Emas Menara',
      description: 'Capai ketepatan 80%+ dalam penilaian Matematik.',
      icon: 'vpn_key',
      category: 'akademik',
    },
    {
      id: 'ach-builder',
      title: 'Arkitek Nusantara',
      description: 'Membina bangunan baharu dalam Kampung Wira.',
      icon: 'castle',
      category: 'desa',
    },
    {
      id: 'ach-artist',
      title: 'Pelukis Batik Pelangi',
      description: 'Menghasilkan dan menyimpan karya batik sendiri.',
      icon: 'palette',
      category: 'kreatif',
    },
    {
      id: 'ach-bond',
      title: 'Sahabat Sejati',
      description: 'Tingkatkan tahap ikatan dengan sahabat rimba.',
      icon: 'pets',
      category: 'sahabat',
    },
  ];
}

export function createInitialInventory(): InventoryItem[] {
  return [
    {
      id: 'inv-pelita',
      name: 'Pelita Buluh',
      category: 'hiasan',
      description: 'Hiasan lampu tradisi untuk diletakkan di kampung.',
      quantity: 1,
      costCoins: 25,
      icon: 'light',
    },
    {
      id: 'inv-wau',
      name: 'Wau Bulan Mini',
      category: 'kraf',
      description: 'Kraf tradisional Melayu untuk mercu tanda desa.',
      quantity: 1,
      costCoins: 35,
      icon: 'air',
    },
  ];
}

export function createInitialVillage(learnerId: string): VillageState {
  const buildings = createInitialBuildings();
  return {
    learnerId,
    villageName: 'Kampung Wira Harmoni',
    timeOfDay: 'morning',
    buildings,
    decorations: [
      {
        id: 'dec-init-1',
        catalogId: 'pokok-kelapa',
        name: 'Pokok Kelapa Melambai',
        category: 'pokok',
        gridX: -3,
        gridZ: -2,
        rotation: 0.4,
        costCoins: 0,
      },
      {
        id: 'dec-init-2',
        catalogId: 'lampu-pelita',
        name: 'Pelita Buluh Tradisi',
        category: 'lampu',
        gridX: 2,
        gridZ: 1,
        rotation: 0,
        costCoins: 0,
      },
    ],
    unlockedPlots: buildings.map((b) => b.plotId),
    celebrationsSeen: [],
  };
}

export function createNewLearner(params: {
  id: string;
  parentId: string;
  name: string;
  age?: number;
  className?: string;
  companionId?: CompanionId;
  avatar?: AvatarConfig;
  onboardingCompleted?: boolean;
}): LearnerProfile {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: params.id,
    parentId: params.parentId,
    name: params.name.trim() || 'Wira Muda',
    age: params.age ?? 7,
    className: params.className?.trim() || 'Tahun 1 Cerdik',
    avatar: params.avatar ?? createDefaultAvatar(),
    companionId: params.companionId ?? 'rimau',
    companionLevel: 1,
    companionBondXp: 0,
    xp: 0,
    level: 1,
    coins: 60, // Starter coins so child can test building 1 plot after 1 lesson
    stars: 0,
    gems: 5,
    energy: 100,
    streakDays: 1,
    lastActiveDate: today,
    onboardingCompleted: params.onboardingCompleted ?? false,
    createdAt: new Date().toISOString(),
  };
}

export function calculateLevelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function computeMastery(existing: SubtopicProgress | undefined, payload: ActivityCompletionPayload): SubtopicProgress {
  const lessonDone = Boolean(existing?.lessonCompleted || payload.mode === 'lesson');
  const practiceDone = Boolean(existing?.practiceCompleted || payload.mode === 'practice' || payload.mode === 'minigame');
  const bestAccuracy = Math.max(existing?.bestAccuracy ?? 0, Math.round(payload.accuracy));
  const assessmentScore =
    payload.mode === 'assessment'
      ? Math.max(existing?.assessmentScore ?? 0, Math.round(payload.accuracy))
      : existing?.assessmentScore ?? 0;

  let masteryPercent = 0;
  if (lessonDone) masteryPercent += 30;
  if (practiceDone) masteryPercent += 25;
  masteryPercent += Math.round((Math.max(bestAccuracy, assessmentScore) / 100) * 45);
  masteryPercent = Math.min(100, masteryPercent);

  let status: MasteryStatus = 'learning';
  if (masteryPercent >= 80 && assessmentScore >= 70) {
    status = 'mastered';
  } else if (payload.mode === 'assessment' && payload.accuracy < 60) {
    status = 'needs_revision';
  } else if (practiceDone || lessonDone) {
    status = 'practicing';
  }

  const nextRevisionDays = status === 'mastered' ? 7 : status === 'needs_revision' ? 1 : 3;
  const nextRevisionAt = new Date(Date.now() + nextRevisionDays * 86400000).toISOString();

  const starsEarned = Math.max(
    existing?.starsEarned ?? 0,
    payload.accuracy >= 90 ? 3 : payload.accuracy >= 70 ? 2 : payload.accuracy >= 40 ? 1 : 0,
  );

  return {
    subtopicId: payload.subtopicId,
    subjectId: payload.subjectId,
    chapterId: payload.chapterId,
    lessonCompleted: lessonDone,
    practiceCompleted: practiceDone,
    assessmentScore,
    attempts: (existing?.attempts ?? 0) + 1,
    bestAccuracy,
    starsEarned,
    masteryPercent,
    status,
    lastPlayedAt: new Date().toISOString(),
    nextRevisionAt,
    weakTopics: payload.weakAreas,
  };
}

export function applyIdempotentActivityReward(params: {
  learner: LearnerProfile;
  progressMap: Record<string, SubtopicProgress>;
  transactions: RewardTransaction[];
  missions: MissionProgress[];
  achievements: AchievementBadge[];
  payload: ActivityCompletionPayload;
}): {
  applied: boolean;
  learner: LearnerProfile;
  progressMap: Record<string, SubtopicProgress>;
  transactions: RewardTransaction[];
  missions: MissionProgress[];
  achievements: AchievementBadge[];
} {
  const { learner, progressMap, transactions, missions, achievements, payload } = params;

  if (transactions.some((t) => t.transactionId === payload.transactionId)) {
    return { applied: false, learner, progressMap, transactions, missions, achievements };
  }

  const nextProgress = {
    ...progressMap,
    [payload.subtopicId]: computeMastery(progressMap[payload.subtopicId], payload),
  };

  const nextXp = learner.xp + payload.xpEarned;
  const nextBondXp = learner.companionBondXp + Math.max(5, Math.round(payload.xpEarned / 2));
  const nextLearner: LearnerProfile = {
    ...learner,
    coins: learner.coins + payload.coinsEarned,
    stars: learner.stars + payload.starsEarned,
    xp: nextXp,
    level: calculateLevelFromXp(nextXp),
    companionBondXp: nextBondXp,
    companionLevel: Math.max(1, Math.floor(nextBondXp / 60) + 1),
    lastActiveDate: new Date().toISOString().slice(0, 10),
  };

  const tx: RewardTransaction = {
    transactionId: payload.transactionId,
    learnerId: learner.id,
    sourceType: payload.mode === 'minigame' ? 'minigame' : payload.mode,
    sourceId: payload.subtopicId,
    coinsDelta: payload.coinsEarned,
    starsDelta: payload.starsEarned,
    xpDelta: payload.xpEarned,
    gemsDelta: payload.starsEarned >= 3 ? 1 : 0,
    createdAt: new Date().toISOString(),
  };

  if (tx.gemsDelta > 0) {
    nextLearner.gems += tx.gemsDelta;
  }

  const nextMissions = missions.map((m) => {
    if (m.subjectId && m.subjectId === payload.subjectId && m.currentCount < m.targetCount) {
      return { ...m, currentCount: m.currentCount + 1 };
    }
    return m;
  });

  const nowIso = new Date().toISOString();
  const nextAchievements = achievements.map((a) => {
    if (a.unlockedAt) return a;
    if (a.id === 'ach-first-step') return { ...a, unlockedAt: nowIso };
    if (
      a.id === 'ach-math-master' &&
      payload.subjectId === 'matematik' &&
      payload.mode === 'assessment' &&
      payload.accuracy >= 80
    ) {
      return { ...a, unlockedAt: nowIso };
    }
    if (a.id === 'ach-bond' && nextLearner.companionLevel >= 2) {
      return { ...a, unlockedAt: nowIso };
    }
    return a;
  });

  return {
    applied: true,
    learner: nextLearner,
    progressMap: nextProgress,
    transactions: [tx, ...transactions].slice(0, 200),
    missions: nextMissions,
    achievements: nextAchievements,
  };
}
