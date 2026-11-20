import type { LearnerProfile, ParentAccount } from './user';
import type { ActivityCompletionPayload, AchievementBadge, InventoryItem, MissionProgress, RewardTransaction, SubtopicProgress } from './game';
import type { SavedArtwork, VillageState } from './village';

export interface AuthResponse {
  parent: ParentAccount;
  learners: LearnerProfile[];
  token?: string;
}

export interface LearnerBundleResponse {
  learner: LearnerProfile;
  progress: Record<string, SubtopicProgress>;
  transactions: RewardTransaction[];
  missions: MissionProgress[];
  achievements: AchievementBadge[];
  inventory: InventoryItem[];
  village: VillageState;
  artworks: SavedArtwork[];
}

export interface SyncQueueItem {
  id: string;
  kind: 'activity_completion' | 'village_action' | 'artwork_save' | 'profile_update';
  learnerId: string;
  payload: unknown;
  createdAt: string;
}

export interface SyncBatchRequest {
  learnerId: string;
  items: SyncQueueItem[];
}

export interface SyncBatchResponse {
  syncedIds: string[];
  bundle: LearnerBundleResponse;
}

export interface TutorRequest {
  learnerName: string;
  subjectId: string;
  subjectName: string;
  subtopicTitle: string;
  question: string;
  language?: 'ms' | 'en';
}

export interface TutorResponse {
  answer: string;
  source: 'gemini' | 'local_pedagogy';
  hintTip: string;
}

export type { ActivityCompletionPayload };
