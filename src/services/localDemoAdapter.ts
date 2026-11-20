import type {
  ActivityCompletionPayload,
  AuthResponse,
  LearnerBundleResponse,
  SyncBatchResponse,
  SyncQueueItem,
  TutorRequest,
  TutorResponse,
} from '@/types/api';
import type { LearnerProfile, ParentAccount } from '@/types/user';
import type { SavedArtwork } from '@/types/village';
import {
  applyIdempotentActivityReward,
  createInitialAchievements,
  createInitialInventory,
  createInitialMissions,
  createInitialVillage,
  createNewLearner,
  DECORATION_CATALOG,
} from '@/utils/gameFactory';
import type { BackendAdapter } from './backendAdapter';
import {
  deleteLocalAuthRecord,
  getLocalAuthRecord,
  listBundlesByParent,
  loadOfflineBundle,
  putLocalAuthRecord,
  saveOfflineBundle,
} from './indexedDb';

const SESSION_KEY = 'current_session';
const DEMO_PARENT_ID = 'par-demo-local';
const DEMO_LEARNER_ID = 'lrn-demo-1';

interface LocalSessionState {
  parentId: string;
}

interface StoredParentRecord extends ParentAccount {
  passwordDigest: string;
}

function makeId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function digestPassword(password: string, salt: string): Promise<string> {
  const input = `${salt}:${password}`;
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    const bytes = new TextEncoder().encode(input);
    const hashBuf = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return `local:${btoa(input)}`;
}

function toPublicParent(record: StoredParentRecord): ParentAccount {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    isDemo: record.isDemo,
    pinCode: record.pinCode,
    createdAt: record.createdAt,
  };
}

function buildInitialBundle(learner: LearnerProfile): LearnerBundleResponse {
  return {
    learner,
    progress: {},
    transactions: [],
    missions: createInitialMissions(),
    achievements: createInitialAchievements(),
    inventory: createInitialInventory(),
    village: createInitialVillage(learner.id),
    artworks: [],
  };
}

export class LocalDemoBackendAdapter implements BackendAdapter {
  readonly mode = 'LOCAL_DEMO' as const;
  readonly modeLabel = 'Mod Demo Tempatan (IndexedDB)';

  private async getCurrentParent(): Promise<StoredParentRecord | null> {
    const session = await getLocalAuthRecord<LocalSessionState>(SESSION_KEY);
    if (!session?.parentId) return null;
    return getLocalAuthRecord<StoredParentRecord>(`parent:${session.parentId}`);
  }

  private async requireBundle(learnerId: string): Promise<LearnerBundleResponse> {
    const parent = await this.getCurrentParent();
    const bundle = await loadOfflineBundle(learnerId);
    if (!parent || !bundle || bundle.learner.parentId !== parent.id) {
      throw new Error('Profil murid tempatan tidak ditemui.');
    }
    return bundle;
  }

  async getSession(): Promise<AuthResponse | null> {
    const parent = await this.getCurrentParent();
    if (!parent) return null;
    const learners = await listBundlesByParent(parent.id);
    return {
      parent: toPublicParent(parent),
      learners,
    };
  }

  async register(payload: {
    name: string;
    email: string;
    password: string;
    pinCode?: string;
  }): Promise<AuthResponse> {
    const email = payload.email.trim().toLowerCase();
    if (!payload.name.trim() || !email || payload.password.length < 4) {
      throw new Error('Sila lengkapkan nama, e-mel, dan kata laluan (min 4 aksara).');
    }
    const existingId = await getLocalAuthRecord<string>(`email:${email}`);
    if (existingId) {
      throw new Error('E-mel ini telah didaftarkan di peranti ini. Sila log masuk.');
    }
    const parentId = makeId('par-local');
    const passwordDigest = await digestPassword(payload.password, parentId);
    const parent: StoredParentRecord = {
      id: parentId,
      name: payload.name.trim(),
      email,
      isDemo: false,
      pinCode: (payload.pinCode || '1234').slice(0, 4),
      passwordDigest,
      createdAt: new Date().toISOString(),
    };
    await putLocalAuthRecord(`parent:${parentId}`, parent);
    await putLocalAuthRecord(`email:${email}`, parentId);
    await putLocalAuthRecord<LocalSessionState>(SESSION_KEY, { parentId });

    return {
      parent: toPublicParent(parent),
      learners: [],
    };
  }

  async login(payload: { email: string; password: string }): Promise<AuthResponse> {
    const email = payload.email.trim().toLowerCase();
    const parentId = await getLocalAuthRecord<string>(`email:${email}`);
    if (!parentId || !payload.password) {
      throw new Error('E-mel atau kata laluan tidak ditemui dalam storan tempatan.');
    }
    const parent = await getLocalAuthRecord<StoredParentRecord>(`parent:${parentId}`);
    if (!parent) {
      throw new Error('Akaun tempatan tidak sah.');
    }
    const digest = await digestPassword(payload.password, parent.id);
    if (digest !== parent.passwordDigest) {
      throw new Error('E-mel atau kata laluan tidak sah.');
    }
    await putLocalAuthRecord<LocalSessionState>(SESSION_KEY, { parentId: parent.id });
    const learners = await listBundlesByParent(parent.id);
    return {
      parent: toPublicParent(parent),
      learners,
    };
  }

  async demoLogin(): Promise<AuthResponse> {
    let parent = await getLocalAuthRecord<StoredParentRecord>(`parent:${DEMO_PARENT_ID}`);
    if (!parent) {
      parent = {
        id: DEMO_PARENT_ID,
        name: 'Mod Demo Tetamu (Tempatan)',
        email: 'demo@kampungwira.local',
        isDemo: true,
        pinCode: '1234',
        passwordDigest: 'demo-local',
        createdAt: new Date().toISOString(),
      };
      await putLocalAuthRecord(`parent:${DEMO_PARENT_ID}`, parent);
    }

    let demoBundle = await loadOfflineBundle(DEMO_LEARNER_ID);
    if (!demoBundle) {
      const demoLearner = createNewLearner({
        id: DEMO_LEARNER_ID,
        parentId: DEMO_PARENT_ID,
        name: 'Wira Tetamu',
        className: 'Tahun 1 Bestari (Mod Demo Tempatan)',
        companionId: 'rimau',
        onboardingCompleted: true,
      });
      demoBundle = buildInitialBundle(demoLearner);
      await saveOfflineBundle(demoBundle);
    }

    await putLocalAuthRecord<LocalSessionState>(SESSION_KEY, { parentId: DEMO_PARENT_ID });
    const learners = await listBundlesByParent(DEMO_PARENT_ID);
    return {
      parent: toPublicParent(parent),
      learners,
    };
  }

  async logout(): Promise<{ ok: boolean }> {
    await deleteLocalAuthRecord(SESSION_KEY);
    return { ok: true };
  }

  async createLearner(payload: Partial<LearnerProfile>): Promise<LearnerBundleResponse> {
    const parent = await this.getCurrentParent();
    if (!parent) {
      throw new Error('Sila log masuk dahulu.');
    }
    if (!payload.name || !payload.name.trim()) {
      throw new Error('Nama murid diperlukan.');
    }
    const learner = createNewLearner({
      id: makeId('lrn-local'),
      parentId: parent.id,
      name: payload.name,
      age: payload.age ?? 7,
      className: payload.className,
      companionId: payload.companionId,
      avatar: payload.avatar,
      onboardingCompleted: payload.onboardingCompleted ?? false,
    });
    const bundle = buildInitialBundle(learner);
    await saveOfflineBundle(bundle);
    return bundle;
  }

  async getBundle(learnerId: string): Promise<LearnerBundleResponse> {
    return this.requireBundle(learnerId);
  }

  async updateLearner(learnerId: string, patch: Partial<LearnerProfile>): Promise<LearnerProfile> {
    const bundle = await this.requireBundle(learnerId);
    const updatedLearner: LearnerProfile = {
      ...bundle.learner,
      name: patch.name?.trim() || bundle.learner.name,
      className: patch.className?.trim() || bundle.learner.className,
      avatar: patch.avatar ?? bundle.learner.avatar,
      companionId: patch.companionId ?? bundle.learner.companionId,
      onboardingCompleted: patch.onboardingCompleted ?? bundle.learner.onboardingCompleted,
    };
    const nextBundle: LearnerBundleResponse = {
      ...bundle,
      learner: updatedLearner,
    };
    await saveOfflineBundle(nextBundle);
    return updatedLearner;
  }

  async submitProgress(
    learnerId: string,
    payload: ActivityCompletionPayload,
  ): Promise<{ applied: boolean; bundle: LearnerBundleResponse }> {
    const bundle = await this.requireBundle(learnerId);
    const result = applyIdempotentActivityReward({
      learner: bundle.learner,
      progressMap: bundle.progress,
      transactions: bundle.transactions,
      missions: bundle.missions,
      achievements: bundle.achievements,
      payload,
    });
    if (!result.applied) {
      return { applied: false, bundle };
    }
    const nextBundle: LearnerBundleResponse = {
      ...bundle,
      learner: result.learner,
      progress: result.progressMap,
      transactions: result.transactions,
      missions: result.missions,
      achievements: result.achievements,
    };
    await saveOfflineBundle(nextBundle);
    return { applied: true, bundle: nextBundle };
  }

  async claimMission(learnerId: string, missionId: string): Promise<LearnerBundleResponse> {
    const bundle = await this.requireBundle(learnerId);
    const mission = bundle.missions.find((m) => m.id === missionId);
    if (!mission || mission.claimed || mission.currentCount < mission.targetCount) {
      throw new Error('Misi belum selesai atau telah dituntut.');
    }
    const nextBundle: LearnerBundleResponse = {
      ...bundle,
      learner: {
        ...bundle.learner,
        coins: bundle.learner.coins + mission.rewardCoins,
        stars: bundle.learner.stars + mission.rewardStars,
      },
      missions: bundle.missions.map((m) => (m.id === missionId ? { ...m, claimed: true } : m)),
    };
    await saveOfflineBundle(nextBundle);
    return nextBundle;
  }

  async buildBuilding(learnerId: string, buildingId: string): Promise<LearnerBundleResponse> {
    const bundle = await this.requireBundle(learnerId);
    const target = bundle.village.buildings.find((b) => b.id === buildingId);
    if (!target) {
      throw new Error('Bangunan tidak ditemui.');
    }
    if (target.status === 'built') {
      return bundle;
    }
    if (bundle.learner.coins < target.buildCostCoins) {
      throw new Error('Syiling emas tidak mencukupi.');
    }
    const nowIso = new Date().toISOString();
    const nextBundle: LearnerBundleResponse = {
      ...bundle,
      learner: {
        ...bundle.learner,
        coins: bundle.learner.coins - target.buildCostCoins,
      },
      village: {
        ...bundle.village,
        buildings: bundle.village.buildings.map((b) =>
          b.id === buildingId ? { ...b, status: 'built' } : b,
        ),
      },
      achievements: bundle.achievements.map((a) =>
        a.id === 'ach-builder' && !a.unlockedAt ? { ...a, unlockedAt: nowIso } : a,
      ),
      missions: bundle.missions.map((m) =>
        m.id === 'mis-4' && m.currentCount < m.targetCount
          ? { ...m, currentCount: m.currentCount + 1 }
          : m,
      ),
    };
    await saveOfflineBundle(nextBundle);
    return nextBundle;
  }

  async upgradeBuilding(learnerId: string, buildingId: string): Promise<LearnerBundleResponse> {
    const bundle = await this.requireBundle(learnerId);
    const target = bundle.village.buildings.find((b) => b.id === buildingId);
    if (!target || target.status !== 'built' || target.level >= target.maxLevel) {
      throw new Error('Bangunan tidak boleh dinaik taraf.');
    }
    if (bundle.learner.coins < target.upgradeCostCoins) {
      throw new Error('Syiling emas tidak mencukupi.');
    }
    const nextBundle: LearnerBundleResponse = {
      ...bundle,
      learner: {
        ...bundle.learner,
        coins: bundle.learner.coins - target.upgradeCostCoins,
      },
      village: {
        ...bundle.village,
        buildings: bundle.village.buildings.map((b) =>
          b.id === buildingId
            ? { ...b, level: b.level + 1, upgradeCostCoins: b.upgradeCostCoins + 40 }
            : b,
        ),
      },
    };
    await saveOfflineBundle(nextBundle);
    return nextBundle;
  }

  async placeDecoration(
    learnerId: string,
    catalogId: string,
    gridX: number,
    gridZ: number,
  ): Promise<LearnerBundleResponse> {
    const bundle = await this.requireBundle(learnerId);
    const item = DECORATION_CATALOG.find((c) => c.catalogId === catalogId);
    if (!item) {
      throw new Error('Hiasan tidak sah.');
    }
    const collides =
      bundle.village.buildings.some((b) => Math.hypot(b.gridX - gridX, b.gridZ - gridZ) < 2.2) ||
      bundle.village.decorations.some((d) => Math.hypot(d.gridX - gridX, d.gridZ - gridZ) < 1.2);
    if (collides) {
      throw new Error('Petak ini bertindih dengan bangunan atau hiasan lain.');
    }
    if (bundle.learner.coins < item.costCoins) {
      throw new Error('Syiling tidak mencukupi.');
    }
    const nextBundle: LearnerBundleResponse = {
      ...bundle,
      learner: {
        ...bundle.learner,
        coins: bundle.learner.coins - item.costCoins,
      },
      village: {
        ...bundle.village,
        decorations: [
          ...bundle.village.decorations,
          {
            id: makeId('dec-local'),
            catalogId: item.catalogId,
            name: item.name,
            category: item.category,
            gridX,
            gridZ,
            rotation: Math.random() * Math.PI * 2,
            costCoins: item.costCoins,
          },
        ],
      },
    };
    await saveOfflineBundle(nextBundle);
    return nextBundle;
  }

  async saveArtwork(
    learnerId: string,
    payload: { title: string; motif: string; dataUrl: string },
  ): Promise<SavedArtwork> {
    const bundle = await this.requireBundle(learnerId);
    const nowIso = new Date().toISOString();
    const art: SavedArtwork = {
      id: makeId('art-local'),
      learnerId,
      title: (payload.title || 'Batik Bunga Raya').slice(0, 60),
      motif: payload.motif || 'Bunga Raya',
      dataUrl: payload.dataUrl,
      starsEarned: 3,
      createdAt: nowIso,
      displayedInGallery: true,
    };
    const nextBundle: LearnerBundleResponse = {
      ...bundle,
      artworks: [art, ...bundle.artworks],
      achievements: bundle.achievements.map((a) =>
        a.id === 'ach-artist' && !a.unlockedAt ? { ...a, unlockedAt: nowIso } : a,
      ),
    };
    await saveOfflineBundle(nextBundle);
    return art;
  }

  async syncBatch(learnerId: string, items: SyncQueueItem[]): Promise<SyncBatchResponse> {
    let current = await this.requireBundle(learnerId);
    const syncedIds: string[] = [];
    for (const item of items) {
      if (item.kind === 'activity_completion') {
        const res = await this.submitProgress(
          learnerId,
          item.payload as ActivityCompletionPayload,
        );
        current = res.bundle;
      }
      syncedIds.push(item.id);
    }
    return { syncedIds, bundle: current };
  }

  async askTutor(payload: TutorRequest): Promise<TutorResponse> {
    if (typeof navigator === 'undefined' || navigator.onLine) {
      try {
        const res = await fetch('/api/v1/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          return (await res.json()) as TutorResponse;
        }
      } catch {
        // Fall through to local pedagogy response
      }
    }
    return {
      answer: `Hai ${payload.learnerName}! Untuk topik "${payload.subtopicTitle}" (${payload.subjectName}), cuba pecahkan soalan kepada langkah kecil: perhati gambar atau nombor dahulu, sebut perlahan-lahan, dan semak contoh pada papan pelajaran.`,
      source: 'local_pedagogy',
      hintTip: 'Tekan butang "Dengar Suara" atau "Petunjuk" untuk panduan langkah demi langkah.',
    };
  }
}
