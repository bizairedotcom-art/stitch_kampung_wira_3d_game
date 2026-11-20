import type { Chapter, Subject, SubjectId, Subtopic } from '@/types/curriculum';
import { matematikSubject } from './subjects/matematik';
import { sainsSubject } from './subjects/sains';
import { bahasaMelayuSubject } from './subjects/bahasaMelayu';
import { bahasaInggerisSubject } from './subjects/bahasaInggeris';
import { pendidikanIslamSubject } from './subjects/pendidikanIslam';
import { pendidikanMoralSubject } from './subjects/pendidikanMoral';
import { pendidikanSeniVisualSubject } from './subjects/pendidikanSeniVisual';
import { pendidikanMuzikSubject } from './subjects/pendidikanMuzik';
import { pjpkSubject } from './subjects/pjpk';
import {
  bahasaArabSubject,
  bahasaCinaSubject,
  bahasaIbanSubject,
  bahasaKadazandusunSubject,
  bahasaSemaiSubject,
  bahasaTamilSubject,
} from './subjects/bahasaElektif';

export const CURRICULUM_SUBJECTS: Subject[] = [
  matematikSubject,
  sainsSubject,
  bahasaMelayuSubject,
  bahasaInggerisSubject,
  pendidikanIslamSubject,
  pendidikanMoralSubject,
  pendidikanSeniVisualSubject,
  pendidikanMuzikSubject,
  pjpkSubject,
  bahasaArabSubject,
  bahasaCinaSubject,
  bahasaTamilSubject,
  bahasaIbanSubject,
  bahasaKadazandusunSubject,
  bahasaSemaiSubject,
];

export function getSubjectById(subjectId: string | undefined): Subject | undefined {
  return CURRICULUM_SUBJECTS.find((s) => s.id === (subjectId as SubjectId));
}

export function getChapterById(subjectId: string | undefined, chapterId: string | undefined): Chapter | undefined {
  return getSubjectById(subjectId)?.chapters.find((c) => c.id === chapterId);
}

export function getAllSubtopics(): Subtopic[] {
  return CURRICULUM_SUBJECTS.flatMap((s) => s.chapters.flatMap((c) => c.subtopics));
}

export function getSubtopicById(subtopicId: string | undefined): Subtopic | undefined {
  return getAllSubtopics().find((st) => st.id === subtopicId);
}
