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

export type BackendMode = 'SUPABASE' | 'LARAVEL_API' | 'LOCAL_DEMO';

export interface BackendAdapter {
  readonly mode: BackendMode;
  readonly modeLabel: string;
  getSession(): Promise<AuthResponse | null>;
  register(payload: { name: string; email: string; password: string; pinCode?: string }): Promise<AuthResponse>;
  login(payload: { email: string; password: string }): Promise<AuthResponse>;
  demoLogin(): Promise<AuthResponse>;
  logout(): Promise<{ ok: boolean }>;
  createLearner(payload: Partial<LearnerProfile>): Promise<LearnerBundleResponse>;
  getBundle(learnerId: string): Promise<LearnerBundleResponse>;
  updateLearner(learnerId: string, patch: Partial<LearnerProfile>): Promise<LearnerProfile>;
  submitProgress(
    learnerId: string,
    payload: ActivityCompletionPayload,
  ): Promise<{ applied: boolean; bundle: LearnerBundleResponse }>;
  claimMission(learnerId: string, missionId: string): Promise<LearnerBundleResponse>;
  buildBuilding(learnerId: string, buildingId: string): Promise<LearnerBundleResponse>;
  upgradeBuilding(learnerId: string, buildingId: string): Promise<LearnerBundleResponse>;
  placeDecoration(
    learnerId: string,
    catalogId: string,
    gridX: number,
    gridZ: number,
  ): Promise<LearnerBundleResponse>;
  saveArtwork(
    learnerId: string,
    payload: { title: string; motif: string; dataUrl: string },
  ): Promise<SavedArtwork>;
  syncBatch(learnerId: string, items: SyncQueueItem[]): Promise<SyncBatchResponse>;
  askTutor(payload: TutorRequest): Promise<TutorResponse>;
}
