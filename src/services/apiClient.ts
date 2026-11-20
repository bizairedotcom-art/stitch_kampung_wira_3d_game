import type {
  ActivityCompletionPayload,
  AuthResponse,
  LearnerBundleResponse,
  SyncBatchResponse,
  SyncQueueItem,
  TutorRequest,
  TutorResponse,
} from '@/types/api';
import type { LearnerProfile } from '@/types/user';
import type { SavedArtwork } from '@/types/village';
import type { BackendAdapter, BackendMode } from './backendAdapter';
import { LaravelApiBackendAdapter } from './laravelApiAdapter';
import { LocalDemoBackendAdapter } from './localDemoAdapter';
import { SupabaseBackendAdapter } from './supabaseAdapter';

const envLaravelBaseUrl =
  typeof import.meta !== 'undefined' && import.meta.env
    ? ((import.meta.env.VITE_LARAVEL_API_BASE_URL as string | undefined) || '').trim()
    : '';

const localAdapter = new LocalDemoBackendAdapter();
let activeAdapter: BackendAdapter = envLaravelBaseUrl
  ? new LaravelApiBackendAdapter(envLaravelBaseUrl)
  : localAdapter;

let modeResolved = Boolean(envLaravelBaseUrl);

/**
 * Resolves the active backend mode once:
 * - If VITE_LARAVEL_API_BASE_URL is configured on client -> LARAVEL_API
 * - Otherwise checks /api/v1/health once; uses LARAVEL_API if Laravel is reachable,
 *   SUPABASE if Supabase credentials are configured on server,
 *   or LOCAL_DEMO (IndexedDB) offline/unconfigured fallback.
 */
export async function resolveBackendAdapter(): Promise<BackendAdapter> {
  if (modeResolved) return activeAdapter;
  modeResolved = true;

  if (typeof window === 'undefined' || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    activeAdapter = localAdapter;
    return activeAdapter;
  }

  try {
    const res = await fetch('/api/v1/health', { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const info = (await res.json()) as {
        backendMode?: BackendMode;
        laravelConfigured?: boolean;
        supabaseConfigured?: boolean;
      };
      if (info.backendMode === 'LARAVEL_API' || info.laravelConfigured) {
        activeAdapter = new LaravelApiBackendAdapter('');
        return activeAdapter;
      }
      if (info.backendMode === 'SUPABASE' || info.supabaseConfigured) {
        activeAdapter = new SupabaseBackendAdapter('');
        return activeAdapter;
      }
    }
  } catch {
    // Offline or standalone static build -> cleanly remain in LOCAL_DEMO
  }

  activeAdapter = localAdapter;
  return activeAdapter;
}

export function getBackendMode(): BackendMode {
  return activeAdapter.mode;
}

export function getBackendModeLabel(): string {
  return activeAdapter.modeLabel;
}

export const apiClient = {
  getMode(): BackendMode {
    return activeAdapter.mode;
  },
  getModeLabel(): string {
    return activeAdapter.modeLabel;
  },
  async resolveMode(): Promise<BackendMode> {
    const adapter = await resolveBackendAdapter();
    return adapter.mode;
  },
  async getSession(): Promise<AuthResponse | null> {
    const adapter = await resolveBackendAdapter();
    return adapter.getSession();
  },
  async register(payload: { name: string; email: string; password: string; pinCode?: string }) {
    const adapter = await resolveBackendAdapter();
    return adapter.register(payload);
  },
  async login(payload: { email: string; password: string }) {
    const adapter = await resolveBackendAdapter();
    return adapter.login(payload);
  },
  async demoLogin() {
    const adapter = await resolveBackendAdapter();
    return adapter.demoLogin();
  },
  async logout() {
    const adapter = await resolveBackendAdapter();
    return adapter.logout();
  },
  async createLearner(payload: Partial<LearnerProfile>): Promise<LearnerBundleResponse> {
    const adapter = await resolveBackendAdapter();
    return adapter.createLearner(payload);
  },
  async getBundle(learnerId: string): Promise<LearnerBundleResponse> {
    const adapter = await resolveBackendAdapter();
    return adapter.getBundle(learnerId);
  },
  async updateLearner(learnerId: string, patch: Partial<LearnerProfile>): Promise<LearnerProfile> {
    const adapter = await resolveBackendAdapter();
    return adapter.updateLearner(learnerId, patch);
  },
  async submitProgress(learnerId: string, payload: ActivityCompletionPayload) {
    const adapter = await resolveBackendAdapter();
    return adapter.submitProgress(learnerId, payload);
  },
  async claimMission(learnerId: string, missionId: string) {
    const adapter = await resolveBackendAdapter();
    return adapter.claimMission(learnerId, missionId);
  },
  async buildBuilding(learnerId: string, buildingId: string) {
    const adapter = await resolveBackendAdapter();
    return adapter.buildBuilding(learnerId, buildingId);
  },
  async upgradeBuilding(learnerId: string, buildingId: string) {
    const adapter = await resolveBackendAdapter();
    return adapter.upgradeBuilding(learnerId, buildingId);
  },
  async placeDecoration(learnerId: string, catalogId: string, gridX: number, gridZ: number) {
    const adapter = await resolveBackendAdapter();
    return adapter.placeDecoration(learnerId, catalogId, gridX, gridZ);
  },
  async saveArtwork(learnerId: string, payload: { title: string; motif: string; dataUrl: string }) {
    const adapter = await resolveBackendAdapter();
    return adapter.saveArtwork(learnerId, payload);
  },
  async syncBatch(learnerId: string, items: SyncQueueItem[]): Promise<SyncBatchResponse> {
    const adapter = await resolveBackendAdapter();
    return adapter.syncBatch(learnerId, items);
  },
  async askTutor(payload: TutorRequest): Promise<TutorResponse> {
    const adapter = await resolveBackendAdapter();
    return adapter.askTutor(payload);
  },
};
