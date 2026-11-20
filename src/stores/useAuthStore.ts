import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/services/apiClient';
import type { BackendMode } from '@/services/backendAdapter';
import type { LearnerProfile, ParentAccount } from '@/types/user';

interface AuthStore {
  parent: ParentAccount | null;
  learners: LearnerProfile[];
  activeLearnerId: string | null;
  backendMode: BackendMode;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  initSession: () => Promise<void>;
  register: (payload: { name: string; email: string; password: string; pinCode?: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  setActiveLearner: (learnerId: string) => void;
  upsertLearnerInList: (learner: LearnerProfile) => void;
  createLearner: (payload: Partial<LearnerProfile>) => Promise<LearnerProfile>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      parent: null,
      learners: [],
      activeLearnerId: null,
      backendMode: apiClient.getMode(),
      isLoading: false,
      error: null,
      initialized: false,

      initSession: async () => {
        if (get().initialized) return;
        set({ isLoading: true });
        try {
          const mode = await apiClient.resolveMode();
          const data = await apiClient.getSession();
          if (data) {
            const currentActive = get().activeLearnerId;
            const validActive =
              data.learners.find((l) => l.id === currentActive)?.id ?? data.learners[0]?.id ?? null;
            set({
              parent: data.parent,
              learners: data.learners,
              activeLearnerId: validActive,
              backendMode: mode,
              initialized: true,
              isLoading: false,
            });
          } else {
            set({ backendMode: mode, initialized: true, isLoading: false });
          }
        } catch {
          set({ backendMode: apiClient.getMode(), initialized: true, isLoading: false });
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiClient.register(payload);
          set({
            parent: data.parent,
            learners: data.learners,
            activeLearnerId: data.learners[0]?.id ?? null,
            backendMode: apiClient.getMode(),
            isLoading: false,
            initialized: true,
          });
        } catch (err) {
          set({ isLoading: false, error: err instanceof Error ? err.message : 'Gagal mendaftar.' });
          throw err;
        }
      },

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiClient.login(payload);
          set({
            parent: data.parent,
            learners: data.learners,
            activeLearnerId: data.learners[0]?.id ?? null,
            backendMode: apiClient.getMode(),
            isLoading: false,
            initialized: true,
          });
        } catch (err) {
          set({ isLoading: false, error: err instanceof Error ? err.message : 'Gagal log masuk.' });
          throw err;
        }
      },

      loginDemo: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiClient.demoLogin();
          set({
            parent: data.parent,
            learners: data.learners,
            activeLearnerId: data.learners[0]?.id ?? null,
            backendMode: apiClient.getMode(),
            isLoading: false,
            initialized: true,
          });
        } catch (err) {
          set({ isLoading: false, error: err instanceof Error ? err.message : 'Gagal memulakan Mod Demo.' });
          throw err;
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } catch {
          // Ignore network logout error
        }
        set({ parent: null, learners: [], activeLearnerId: null, error: null });
      },

      setActiveLearner: (learnerId) => set({ activeLearnerId: learnerId }),

      upsertLearnerInList: (learner) => {
        set((state) => {
          const exists = state.learners.some((l) => l.id === learner.id);
          return {
            learners: exists
              ? state.learners.map((l) => (l.id === learner.id ? learner : l))
              : [...state.learners, learner],
          };
        });
      },

      createLearner: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const bundle = await apiClient.createLearner(payload);
          set((state) => ({
            learners: [...state.learners, bundle.learner],
            activeLearnerId: bundle.learner.id,
            isLoading: false,
          }));
          return bundle.learner;
        } catch (err) {
          set({ isLoading: false, error: err instanceof Error ? err.message : 'Gagal mencipta profil murid.' });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'kampung-wira-auth',
      partialize: (state) => ({
        activeLearnerId: state.activeLearnerId,
      }),
    },
  ),
);
