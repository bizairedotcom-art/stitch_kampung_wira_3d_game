import type { SubjectId, EngineId } from './curriculum';

export type MasteryStatus = 'not_started' | 'learning' | 'practicing' | 'mastered' | 'needs_revision';

export interface SubtopicProgress {
  subtopicId: string;
  subjectId: SubjectId;
  chapterId: string;
  lessonCompleted: boolean;
  practiceCompleted: boolean;
  assessmentScore: number;
  attempts: number;
  bestAccuracy: number;
  starsEarned: number;
  masteryPercent: number;
  status: MasteryStatus;
  lastPlayedAt: string;
  nextRevisionAt: string;
  weakTopics: string[];
}

export interface RewardTransaction {
  transactionId: string;
  learnerId: string;
  sourceType: 'lesson' | 'practice' | 'assessment' | 'mission' | 'minigame' | 'daily_bonus';
  sourceId: string;
  coinsDelta: number;
  starsDelta: number;
  xpDelta: number;
  gemsDelta: number;
  createdAt: string;
}

export interface MissionProgress {
  id: string;
  title: string;
  description: string;
  subjectId?: SubjectId;
  targetCount: number;
  currentCount: number;
  rewardCoins: number;
  rewardStars: number;
  claimed: boolean;
  type: 'daily' | 'weekly' | 'story';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'akademik' | 'desa' | 'sahabat' | 'kreatif';
  unlockedAt?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'hiasan' | 'aksesori' | 'kraf' | 'sijil';
  description: string;
  quantity: number;
  costCoins: number;
  icon: string;
}

export interface ActivityCompletionPayload {
  transactionId: string;
  subtopicId: string;
  subjectId: SubjectId;
  chapterId: string;
  engineId: EngineId;
  mode: 'lesson' | 'practice' | 'assessment' | 'minigame';
  score: number;
  maxScore: number;
  accuracy: number;
  starsEarned: number;
  coinsEarned: number;
  xpEarned: number;
  weakAreas: string[];
  durationSeconds: number;
}

export type GraphicsPreset = 'low' | 'medium' | 'high' | 'ultra';

export interface SettingsState {
  language: 'ms' | 'en';
  graphicsPreset: GraphicsPreset;
  fallback2DMode: boolean;
  reducedMotion: boolean;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  voiceRate: number;
  preferredVoiceUri: string;
  autoSpeak: boolean;
  muted: boolean;
  highContrastText: boolean;
  subtitleEnabled: boolean;
}
