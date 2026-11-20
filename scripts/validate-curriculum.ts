import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURRICULUM_SUBJECTS } from '../src/curriculum/index';
import type { EngineId, SubjectId } from '../src/types/curriculum';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const MANDATORY_SUBJECT_IDS: SubjectId[] = [
  'matematik',
  'sains',
  'bahasa-melayu',
  'bahasa-inggeris',
  'pendidikan-islam',
  'pendidikan-moral',
  'pendidikan-seni-visual',
  'pendidikan-muzik',
  'pjpk',
  'bahasa-arab',
  'bahasa-cina-sk',
  'bahasa-tamil-sk',
  'bahasa-iban',
  'bahasa-kadazandusun',
  'bahasa-semai',
];

const VALID_ENGINE_IDS = new Set<EngineId>([
  'object-counter',
  'number-line',
  'place-value',
  'arithmetic-game',
  'fraction-simulator',
  'money-shop',
  'analog-clock',
  'measurement-simulator',
  'geometry-3d',
  'pictograph-builder',
  'object-classification',
  'magnet-simulator',
  'absorption-simulator',
  'plant-explorer-3d',
  'animal-explorer-3d',
  'body-explorer-3d',
  'construction-game-3d',
  'letter-tracing',
  'syllable-builder',
  'word-builder',
  'sentence-builder',
  'picture-matching',
  'listening-game',
  'story-sequence',
  'dialogue-adventure',
  'moral-decision',
  'drawing-studio',
  'batik-designer',
  'rhythm-game',
  'virtual-instrument',
  'movement-demonstrator',
  'safety-scenario',
  'memory-matching',
  'drag-and-drop',
  'assessment-engine',
]);

export interface CurriculumAuditResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    subjectCount: number;
    chapterCount: number;
    subtopicCount: number;
    assessmentItemCount: number;
    guidedItemCount: number;
    independentItemCount: number;
    awaitingReviewSubtopics: number;
  };
  subjects: {
    id: SubjectId;
    name: string;
    category: string;
    verificationStatus: string;
    chapterCount: number;
    subtopicCount: number;
    totalAssessmentItems: number;
    chapters: {
      id: string;
      title: string;
      subtopicCount: number;
      subtopics: {
        id: string;
        code: string;
        title: string;
        engineId: EngineId;
        verificationStatus: string;
        lessonSteps: number;
        guidedPractice: number;
        independentPractice: number;
        assessments: number;
      }[];
    }[];
  }[];
}

export function auditCurriculum(): CurriculumAuditResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const foundIds = new Set(CURRICULUM_SUBJECTS.map((s) => s.id));
  for (const id of MANDATORY_SUBJECT_IDS) {
    if (!foundIds.has(id)) {
      errors.push(`Missing mandatory KSSR Year 1 SK subject: ${id}`);
    }
  }

  const math = CURRICULUM_SUBJECTS.find((s) => s.id === 'matematik');
  if (!math || math.chapters.length !== 8) {
    errors.push(`Matematik must have 8 chapters, found ${math?.chapters.length ?? 0}`);
  }

  const sains = CURRICULUM_SUBJECTS.find((s) => s.id === 'sains');
  const sainsSubtopics = sains?.chapters.reduce((acc, c) => acc + c.subtopics.length, 0) ?? 0;
  if (sainsSubtopics < 10) {
    errors.push(`Sains must cover all 10 KSSR Year 1 units (subtopics >= 10), found ${sainsSubtopics}`);
  }

  const islam = CURRICULUM_SUBJECTS.find((s) => s.id === 'pendidikan-islam');
  if (!islam || islam.chapters.length < 7) {
    errors.push(`Pendidikan Islam must have 7 fields/chapters, found ${islam?.chapters.length ?? 0}`);
  }

  const moral = CURRICULUM_SUBJECTS.find((s) => s.id === 'pendidikan-moral');
  const moralSubtopics = moral?.chapters.reduce((acc, c) => acc + c.subtopics.length, 0) ?? 0;
  if (moralSubtopics < 14) {
    errors.push(`Pendidikan Moral must cover all 14 values, found ${moralSubtopics}`);
  }

  let chapterCount = 0;
  let subtopicCount = 0;
  let assessmentItemCount = 0;
  let guidedItemCount = 0;
  let independentItemCount = 0;
  let awaitingReviewSubtopics = 0;

  const seenSubtopicIds = new Set<string>();

  const subjectsAudit = CURRICULUM_SUBJECTS.map((subj) => {
    chapterCount += subj.chapters.length;
    let subjAssessments = 0;
    let subjSubtopics = 0;

    const chaptersAudit = subj.chapters.map((chap) => {
      const subtopicsAudit = chap.subtopics.map((st) => {
        subtopicCount += 1;
        subjSubtopics += 1;

        if (seenSubtopicIds.has(st.id)) {
          errors.push(`Duplicate subtopic ID detected: ${st.id}`);
        }
        seenSubtopicIds.add(st.id);

        if (!VALID_ENGINE_IDS.has(st.engineId)) {
          errors.push(`Invalid engineId "${st.engineId}" in subtopic ${st.id}`);
        }
        if (st.code.startsWith('1.') || st.code.startsWith('2.') || st.code.startsWith('3.')) {
          warnings.push(`Subtopic ${st.id} uses numeric code ${st.code}; verify it is not claiming official KPM DSKP numbering.`);
        }
        if (st.verificationStatus === 'awaiting_educator_review') {
          awaitingReviewSubtopics += 1;
        }
        if (!st.lessonSteps || st.lessonSteps.length === 0) {
          errors.push(`Subtopic ${st.id} has no lessonSteps`);
        }
        if (!st.interactiveDemo || !st.interactiveDemo.items || st.interactiveDemo.items.length === 0) {
          errors.push(`Subtopic ${st.id} has empty interactiveDemo`);
        }
        if (!st.guidedPractice || st.guidedPractice.length === 0) {
          errors.push(`Subtopic ${st.id} has empty guidedPractice`);
        }
        if (!st.independentPractice || st.independentPractice.length === 0) {
          errors.push(`Subtopic ${st.id} has empty independentPractice`);
        }
        if (!st.assessments || st.assessments.length < 10) {
          errors.push(`Subtopic ${st.id} has ${st.assessments?.length ?? 0} assessment items (minimum 10 required)`);
        }

        for (const item of [...st.guidedPractice, ...st.independentPractice, ...st.assessments]) {
          const ansEmpty = Array.isArray(item.correctAnswer)
            ? item.correctAnswer.length === 0
            : !String(item.correctAnswer).trim();
          if (ansEmpty) {
            errors.push(`Assessment item ${item.id} in ${st.id} has empty correctAnswer`);
          }
          if (!item.hint?.trim() || !item.explanation?.trim()) {
            errors.push(`Assessment item ${item.id} in ${st.id} missing hint or explanation`);
          }
        }

        assessmentItemCount += st.assessments.length;
        guidedItemCount += st.guidedPractice.length;
        independentItemCount += st.independentPractice.length;
        subjAssessments += st.assessments.length;

        return {
          id: st.id,
          code: st.code,
          title: st.title,
          engineId: st.engineId,
          verificationStatus: st.verificationStatus,
          lessonSteps: st.lessonSteps.length,
          guidedPractice: st.guidedPractice.length,
          independentPractice: st.independentPractice.length,
          assessments: st.assessments.length,
        };
      });

      return {
        id: chap.id,
        title: chap.title,
        subtopicCount: chap.subtopics.length,
        subtopics: subtopicsAudit,
      };
    });

    return {
      id: subj.id,
      name: subj.name,
      category: subj.category,
      verificationStatus: subj.verificationStatus,
      chapterCount: subj.chapters.length,
      subtopicCount: subjSubtopics,
      totalAssessmentItems: subjAssessments,
      chapters: chaptersAudit,
    };
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      subjectCount: CURRICULUM_SUBJECTS.length,
      chapterCount,
      subtopicCount,
      assessmentItemCount,
      guidedItemCount,
      independentItemCount,
      awaitingReviewSubtopics,
    },
    subjects: subjectsAudit,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const result = auditCurriculum();
  const inventoryPath = path.join(ROOT_DIR, 'CURRICULUM_INVENTORY.json');
  fs.writeFileSync(
    inventoryPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        curriculumScope: 'KSSR Semakan 2017 - Tahap 1 - Tahun 1 - Sekolah Kebangsaan (SK) Sahaja',
        ...result.summary,
        subjects: result.subjects,
      },
      null,
      2,
    ),
  );

  console.log('=== Kampung Wira Curriculum Audit ===');
  console.log(JSON.stringify(result.summary, null, 2));
  if (result.warnings.length > 0) {
    console.warn('Warnings:', result.warnings);
  }
  if (!result.valid) {
    console.error('Errors:', result.errors);
    process.exit(1);
  }
  console.log(`Audit PASSED. Inventory written to ${inventoryPath}`);
}
