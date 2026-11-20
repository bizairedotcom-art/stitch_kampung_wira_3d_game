import { create } from 'zustand';
import { apiClient } from '@/services/apiClient';
import {
  enqueueSyncItem,
  listSyncQueue,
  loadOfflineBundle,
  removeSyncedItems,
  saveOfflineBundle,
} from '@/services/indexedDb';
import type { LearnerBundleResponse } from '@/types/api';
import type {
  ActivityCompletionPayload,
  AchievementBadge,
  InventoryItem,
  MissionProgress,
  RewardTransaction,
  SubtopicProgress,
} from '@/types/game';
import type { AvatarConfig, CompanionId, LearnerProfile } from '@/types/user';
import type { SavedArtwork, VillageState } from '@/types/village';
import { applyIdempotentActivityReward, DECORATION_CATALOG } from '@/utils/gameFactory';
import { useAuthStore } from './useAuthStore';

interface GameStore {
  bundle: LearnerBundleResponse | null;
  isLoading: boolean;
  pendingSyncCount: number;
  isOnline: boolean;
  lastRewardBanner: { coins: number; stars: number; xp: number; title: string } | null;

  loadLearnerBundle: (learnerId: string) => Promise<void>;
  updateProfile: (patch: Partial<LearnerProfile>) => Promise<void>;
  updateAvatar: (avatar: AvatarConfig) => Promise<void>;
  selectCompanion: (companionId: CompanionId) => Promise<void>;
  completeActivity: (payload: ActivityCompletionPayload, title?: string) => Promise<boolean>;
  claimMission: (missionId: string) => Promise<void>;
  buildVillageBuilding: (buildingId: string) => Promise<void>;
  upgradeVillageBuilding: (buildingId: string) => Promise<void>;
  placeVillageDecoration: (catalogId: string, gridX: number, gridZ: number) => Promise<void>;
  setVillageTimeOfDay: (timeOfDay: VillageState['timeOfDay']) => void;
  saveArtwork: (payload: { title: string; motif: string; dataUrl: string }) => Promise<SavedArtwork | null>;
  syncOfflineQueue: () => Promise<void>;
  clearRewardBanner: () => void;
  setOnlineStatus: (online: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  bundle: null,
  isLoading: false,
  pendingSyncCount: 0,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastRewardBanner: null,

  loadLearnerBundle: async (learnerId) => {
    set({ isLoading: true });
    try {
      const bundle = await apiClient.getBundle(learnerId);
      await saveOfflineBundle(bundle);
      useAuthStore.getState().upsertLearnerInList(bundle.learner);
      const pending = await listSyncQueue(learnerId);
      set({ bundle, isLoading: false, pendingSyncCount: pending.length });
    } catch {
      const cached = await loadOfflineBundle(learnerId);
      const pending = await listSyncQueue(learnerId);
      set({ bundle: cached, isLoading: false, pendingSyncCount: pending.length });
    }
  },

  updateProfile: async (patch) => {
    const bundle = get().bundle;
    if (!bundle) return;
    const optimistic: LearnerBundleResponse = {
      ...bundle,
      learner: { ...bundle.learner, ...patch },
    };
    set({ bundle: optimistic });
    useAuthStore.getState().upsertLearnerInList(optimistic.learner);
    await saveOfflineBundle(optimistic);
    try {
      const updated = await apiClient.updateLearner(bundle.learner.id, patch);
      const next = { ...optimistic, learner: updated };
      set({ bundle: next });
      useAuthStore.getState().upsertLearnerInList(updated);
      await saveOfflineBundle(next);
    } catch {
      // Offline optimistic copy remains saved
    }
  },

  updateAvatar: async (avatar) => {
    await get().updateProfile({ avatar });
  },

  selectCompanion: async (companionId) => {
    await get().updateProfile({ companionId });
  },

  completeActivity: async (payload, title = 'Aktiviti Selesai!') => {
    const bundle = get().bundle;
    if (!bundle) return false;

    const appliedResult = applyIdempotentActivityReward({
      learner: bundle.learner,
      progressMap: bundle.progress,
      transactions: bundle.transactions,
      missions: bundle.missions,
      achievements: bundle.achievements,
      payload,
    });

    if (!appliedResult.applied) {
      return false;
    }

    const optimistic: LearnerBundleResponse = {
      ...bundle,
      learner: appliedResult.learner,
      progress: appliedResult.progressMap,
      transactions: appliedResult.transactions,
      missions: appliedResult.missions,
      achievements: appliedResult.achievements,
    };

    set({
      bundle: optimistic,
      lastRewardBanner: {
        coins: payload.coinsEarned,
        stars: payload.starsEarned,
        xp: payload.xpEarned,
        title,
      },
    });
    useAuthStore.getState().upsertLearnerInList(optimistic.learner);
    await saveOfflineBundle(optimistic);

    try {
      const res = await apiClient.submitProgress(bundle.learner.id, payload);
      set({ bundle: res.bundle });
      useAuthStore.getState().upsertLearnerInList(res.bundle.learner);
      await saveOfflineBundle(res.bundle);
    } catch {
      await enqueueSyncItem({
        id: payload.transactionId,
        kind: 'activity_completion',
        learnerId: bundle.learner.id,
        payload,
        createdAt: new Date().toISOString(),
      });
      const pending = await listSyncQueue(bundle.learner.id);
      set({ pendingSyncCount: pending.length });
    }
    return true;
  },

  claimMission: async (missionId) => {
    const bundle = get().bundle;
    if (!bundle) return;
    const res = await apiClient.claimMission(bundle.learner.id, missionId);
    set({ bundle: res });
    useAuthStore.getState().upsertLearnerInList(res.learner);
    await saveOfflineBundle(res);
  },

  buildVillageBuilding: async (buildingId) => {
    const bundle = get().bundle;
    if (!bundle) return;
    const res = await apiClient.buildBuilding(bundle.learner.id, buildingId);
    set({ bundle: res });
    useAuthStore.getState().upsertLearnerInList(res.learner);
    await saveOfflineBundle(res);
  },

  upgradeVillageBuilding: async (buildingId) => {
    const bundle = get().bundle;
    if (!bundle) return;
    const res = await apiClient.upgradeBuilding(bundle.learner.id, buildingId);
    set({ bundle: res });
    useAuthStore.getState().upsertLearnerInList(res.learner);
    await saveOfflineBundle(res);
  },

  placeVillageDecoration: async (catalogId, gridX, gridZ) => {
    const bundle = get().bundle;
    if (!bundle) return;
    const cat = DECORATION_CATALOG.find((c) => c.catalogId === catalogId);
    if (!cat) return;
    const res = await apiClient.placeDecoration(bundle.learner.id, catalogId, gridX, gridZ);
    set({ bundle: res });
    useAuthStore.getState().upsertLearnerInList(res.learner);
    await saveOfflineBundle(res);
  },

  setVillageTimeOfDay: (timeOfDay) => {
    const bundle = get().bundle;
    if (!bundle) return;
    const next: LearnerBundleResponse = {
      ...bundle,
      village: { ...bundle.village, timeOfDay },
    };
    set({ bundle: next });
    void saveOfflineBundle(next);
  },

  saveArtwork: async (payload) => {
    const bundle = get().bundle;
    if (!bundle) return null;
    try {
      const saved = await apiClient.saveArtwork(bundle.learner.id, payload);
      const next: LearnerBundleResponse = {
        ...bundle,
        artworks: [saved, ...bundle.artworks],
      };
      set({ bundle: next });
      await saveOfflineBundle(next);
      return saved;
    } catch {
      const offlineArt: SavedArtwork = {
        id: `art-local-${Date.now()}`,
        learnerId: bundle.learner.id,
        title: payload.title,
        motif: payload.motif,
        dataUrl: payload.dataUrl,
        starsEarned: 3,
        createdAt: new Date().toISOString(),
        displayedInGallery: true,
      };
      const next: LearnerBundleResponse = {
        ...bundle,
        artworks: [offlineArt, ...bundle.artworks],
      };
      set({ bundle: next });
      await saveOfflineBundle(next);
      return offlineArt;
    }
  },

  syncOfflineQueue: async () => {
    const bundle = get().bundle;
    if (!bundle || apiClient.getMode() === 'LOCAL_DEMO') return;
    const queue = await listSyncQueue(bundle.learner.id);
    if (!queue.length) return;
    try {
      const res = await apiClient.syncBatch(bundle.learner.id, queue);
      await removeSyncedItems(res.syncedIds);
      set({ bundle: res.bundle, pendingSyncCount: 0 });
      useAuthStore.getState().upsertLearnerInList(res.bundle.learner);
      await saveOfflineBundle(res.bundle);
    } catch {
      // Remain queued until online
    }
  },

  clearRewardBanner: () => set({ lastRewardBanner: null }),
  setOnlineStatus: (isOnline) => {
    set({ isOnline });
    if (isOnline) {
      void get().syncOfflineQueue();
    }
  },
}));

export type {
  SubtopicProgress,
  RewardTransaction,
  MissionProgress,
  AchievementBadge,
  InventoryItem,
};
