export type SubjectId =
  | 'matematik'
  | 'sains'
  | 'bahasa-melayu'
  | 'bahasa-inggeris'
  | 'pendidikan-islam'
  | 'pendidikan-moral'
  | 'pendidikan-seni-visual'
  | 'pendidikan-muzik'
  | 'pjpk'
  | 'bahasa-arab'
  | 'bahasa-cina-sk'
  | 'bahasa-tamil-sk'
  | 'bahasa-iban'
  | 'bahasa-kadazandusun'
  | 'bahasa-semai';

export type EngineId =
  | 'object-counter'
  | 'number-line'
  | 'place-value'
  | 'arithmetic-game'
  | 'fraction-simulator'
  | 'money-shop'
  | 'analog-clock'
  | 'measurement-simulator'
  | 'geometry-3d'
  | 'pictograph-builder'
  | 'object-classification'
  | 'magnet-simulator'
  | 'absorption-simulator'
  | 'plant-explorer-3d'
  | 'animal-explorer-3d'
  | 'body-explorer-3d'
  | 'construction-game-3d'
  | 'letter-tracing'
  | 'syllable-builder'
  | 'word-builder'
  | 'sentence-builder'
  | 'picture-matching'
  | 'listening-game'
  | 'story-sequence'
  | 'dialogue-adventure'
  | 'moral-decision'
  | 'drawing-studio'
  | 'batik-designer'
  | 'rhythm-game'
  | 'virtual-instrument'
  | 'movement-demonstrator'
  | 'safety-scenario'
  | 'memory-matching'
  | 'drag-and-drop'
  | 'assessment-engine';

export type VerificationStatus = 'verified_kssr_topic' | 'awaiting_educator_review';

export type AssessmentItemType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'matching'
  | 'ordering'
  | 'counting'
  | 'audio_match'
  | 'creative_rubric';

export interface AssessmentItem {
  id: string;
  type: AssessmentItemType;
  prompt: string;
  promptEn?: string;
  audioText?: string;
  visualEmoji?: string;
  visualScript?: string;
  rtl?: boolean;
  options?: string[];
  correctAnswer: string | string[];
  pairs?: { left: string; right: string }[];
  hint: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface LessonStep {
  id: string;
  title: string;
  body: string;
  audioText: string;
  exampleVisual?: string;
  scriptSample?: string;
  rtl?: boolean;
}

export interface InteractiveDemoConfig {
  title: string;
  prompt: string;
  mode: 'abacus' | 'scale' | 'magnet' | 'sponge' | 'clock' | 'coins' | 'fraction' | 'phonics' | 'rhythm' | 'batik' | 'posture' | 'script';
  items: { label: string; value: string; emoji?: string; effect?: string }[];
}

export interface Subtopic {
  id: string;
  chapterId: string;
  subjectId: SubjectId;
  code: string;
  title: string;
  learningObjective: string;
  verificationStatus: VerificationStatus;
  verificationNote?: string;
  engineId: EngineId;
  engineConfig: Record<string, unknown>;
  lessonSteps: LessonStep[];
  interactiveDemo: InteractiveDemoConfig;
  guidedPractice: AssessmentItem[];
  independentPractice: AssessmentItem[];
  assessments: AssessmentItem[];
  rewardCoins: number;
  rewardStars: number;
  rewardXp: number;
  unlockedBadge?: string;
}

export interface Chapter {
  id: string;
  subjectId: SubjectId;
  order: number;
  title: string;
  summary: string;
  dskpArea: string;
  verificationStatus: VerificationStatus;
  subtopics: Subtopic[];
}

export interface Subject {
  id: SubjectId;
  name: string;
  shortName: string;
  category: 'teras' | 'wajib' | 'elektif_bahasa';
  buildingId: string;
  buildingName: string;
  themeColor: string;
  accentColor: string;
  icon: string;
  previewImage: string;
  audioTrackId: string;
  description: string;
  dskpDocumentNote: string;
  verificationStatus: VerificationStatus;
  chapters: Chapter[];
}
