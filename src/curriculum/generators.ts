import type {
  AssessmentItem,
  InteractiveDemoConfig,
  LessonStep,
  SubjectId,
  Subtopic,
  VerificationStatus,
  EngineId,
} from '@/types/curriculum';

export interface SeedQuestion {
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  difficulty?: 1 | 2 | 3;
  type?: AssessmentItem['type'];
  visualEmoji?: string;
  visualScript?: string;
  rtl?: boolean;
  audioText?: string;
}

export function buildAssessments(prefix: string, seeds: SeedQuestion[]): AssessmentItem[] {
  return seeds.map((s, idx) => ({
    id: `${prefix}-q${idx + 1}`,
    type: s.type ?? 'multiple_choice',
    prompt: s.prompt,
    audioText: s.audioText ?? s.prompt,
    visualEmoji: s.visualEmoji,
    visualScript: s.visualScript,
    rtl: s.rtl,
    options: s.options,
    correctAnswer: s.correctAnswer,
    hint: s.hint,
    explanation: s.explanation,
    difficulty: s.difficulty ?? (idx < 4 ? 1 : idx < 8 ? 2 : 3),
  }));
}

export function makeMathCountingQuestions(prefix: string, start: number, step: number): AssessmentItem[] {
  const items: SeedQuestion[] = [];
  for (let i = 0; i < 10; i++) {
    const n = start + i * step;
    const wrong1 = Math.max(0, n - (i % 2 === 0 ? 1 : 2));
    const wrong2 = n + (i % 3 === 0 ? 2 : 3);
    const wrong3 = n + 5;
    const opts = Array.from(new Set([String(n), String(wrong1), String(wrong2), String(wrong3)]));
    while (opts.length < 4) opts.push(String(n + opts.length + 1));
    opts.sort((a, b) => Number(a) - Number(b));
    items.push({
      prompt: `Berapakah bilangan bintang jika ada ${n} biji bintang?`,
      visualEmoji: '⭐'.repeat(Math.min(n, 10)) + (n > 10 ? ` (+${n - 10})` : ''),
      options: opts,
      correctAnswer: String(n),
      hint: `Kira satu demi satu hingga ${n}.`,
      explanation: `Jumlah yang betul ialah ${n}.`,
      difficulty: i < 4 ? 1 : i < 8 ? 2 : 3,
    });
  }
  return buildAssessments(prefix, items);
}

export function makeAdditionQuestions(prefix: string, pairs: [number, number][]): AssessmentItem[] {
  return buildAssessments(
    prefix,
    pairs.map(([a, b], idx) => {
      const sum = a + b;
      const opts = Array.from(new Set([sum, Math.max(0, sum - 1), sum + 1, sum + 2]))
        .sort((x, y) => x - y)
        .map(String);
      return {
        prompt: `Kira hasil tambah: ${a} + ${b} = ?`,
        visualEmoji: a <= 8 && b <= 8 ? `${'🍎'.repeat(a)} + ${'🍏'.repeat(b)}` : '🧮',
        options: opts,
        correctAnswer: String(sum),
        hint: `Mulakan daripada nombor ${Math.max(a, b)}, kemudian bilang naik ${Math.min(a, b)} langkah.`,
        explanation: `${a} ditambah dengan ${b} bersamaan ${sum}.`,
        difficulty: idx < 4 ? 1 : idx < 8 ? 2 : 3,
      };
    }),
  );
}

export function makeSubtractionQuestions(prefix: string, pairs: [number, number][]): AssessmentItem[] {
  return buildAssessments(
    prefix,
    pairs.map(([a, b], idx) => {
      const diff = a - b;
      const opts = Array.from(new Set([diff, Math.max(0, diff - 1), diff + 1, diff + 2]))
        .sort((x, y) => x - y)
        .map(String);
      return {
        prompt: `Kira baki tolak: ${a} - ${b} = ?`,
        visualEmoji: a <= 10 ? `${'🥭'.repeat(a)} (keluar ${b})` : '🧮',
        options: opts,
        correctAnswer: String(diff),
        hint: `Ada ${a}, buang ${b}. Bilang baki yang tinggal.`,
        explanation: `${a} tolak ${b} ialah ${diff}.`,
        difficulty: idx < 4 ? 1 : idx < 8 ? 2 : 3,
      };
    }),
  );
}

export function padToTenSeeds(seeds: SeedQuestion[]): SeedQuestion[] {
  const out = [...seeds];
  let idx = 0;
  while (out.length < 10) {
    const base = seeds[idx % seeds.length];
    out.push({
      ...base,
      prompt: `${base.prompt} (Ulang Kaji ${out.length + 1})`,
      difficulty: 3,
    });
    idx++;
  }
  return out.slice(0, 10);
}

export function createSubtopic(params: {
  id: string;
  chapterId: string;
  subjectId: SubjectId;
  code: string;
  title: string;
  learningObjective: string;
  verificationStatus?: VerificationStatus;
  verificationNote?: string;
  engineId: EngineId;
  engineConfig: Record<string, unknown>;
  lessonSteps: LessonStep[];
  interactiveDemo: InteractiveDemoConfig;
  assessments: AssessmentItem[];
  rewardCoins?: number;
  rewardStars?: number;
  rewardXp?: number;
  unlockedBadge?: string;
}): Subtopic {
  const assessments = params.assessments;
  return {
    id: params.id,
    chapterId: params.chapterId,
    subjectId: params.subjectId,
    code: params.code,
    title: params.title,
    learningObjective: params.learningObjective,
    verificationStatus: params.verificationStatus ?? 'verified_kssr_topic',
    verificationNote: params.verificationNote,
    engineId: params.engineId,
    engineConfig: params.engineConfig,
    lessonSteps: params.lessonSteps,
    interactiveDemo: params.interactiveDemo,
    guidedPractice: assessments.slice(0, 3),
    independentPractice: assessments.slice(3, 7),
    assessments,
    rewardCoins: params.rewardCoins ?? 25,
    rewardStars: params.rewardStars ?? 3,
    rewardXp: params.rewardXp ?? 35,
    unlockedBadge: params.unlockedBadge,
  };
}
