import { describe, expect, it } from 'vitest';
import { auditCurriculum } from '../scripts/validate-curriculum';
import { CURRICULUM_SUBJECTS, getAllSubtopics, getSubjectById } from '../src/curriculum/index';
import {
  normalizeSpeechText,
  resolveSpeechLang,
  SOUNDTRACK_CATALOG,
  splitIntoSpeechChunks,
} from '../src/services/audioEngine';
import {
  applyIdempotentActivityReward,
  calculateLevelFromXp,
  COMPANIONS,
  computeMastery,
  createInitialAchievements,
  createInitialBuildings,
  createInitialMissions,
  createInitialVillage,
  createNewLearner,
  DECORATION_CATALOG,
} from '../src/utils/gameFactory';
import { LocalDemoBackendAdapter } from '../src/services/localDemoAdapter';

describe('Kampung Wira 3D — KSSR Tahun 1 SK Curriculum Integrity', () => {
  it('passes full curriculum structural & assessment audit across all 15 SK subjects', () => {
    const result = auditCurriculum();
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.summary.subjectCount).toBe(15);
  });

  it('covers all 8 Matematik chapters, 10 Sains units, 7 Pendidikan Islam fields, and 14 Pendidikan Moral values', () => {
    const math = getSubjectById('matematik');
    const sains = getSubjectById('sains');
    const islam = getSubjectById('pendidikan-islam');
    const moral = getSubjectById('pendidikan-moral');

    expect(math?.chapters.length).toBe(8);
    expect(sains?.chapters.reduce((s, c) => s + c.subtopics.length, 0)).toBeGreaterThanOrEqual(10);
    expect(islam?.chapters.length).toBe(7);
    expect(moral?.chapters.reduce((s, c) => s + c.subtopics.length, 0)).toBe(14);
  });

  it('ensures every subtopic has >= 10 assessments with valid options, hints, and explanations', () => {
    const all = getAllSubtopics();
    expect(all.length).toBeGreaterThan(40);
    for (const st of all) {
      expect(st.assessments.length).toBeGreaterThanOrEqual(10);
      expect(st.lessonSteps.length).toBeGreaterThanOrEqual(1);
      expect(st.guidedPractice.length).toBeGreaterThanOrEqual(1);
      expect(st.independentPractice.length).toBeGreaterThanOrEqual(1);
      for (const item of st.assessments) {
        expect(item.hint.trim().length).toBeGreaterThan(0);
        expect(item.explanation.trim().length).toBeGreaterThan(0);
        if (item.options) {
          expect(item.options).toContain(item.correctAnswer);
        }
      }
    }
  });

  it('flags religious and elective-language subtopics as awaiting_educator_review without inventing KPM DSKP codes', () => {
    for (const st of getAllSubtopics()) {
      expect(st.code.startsWith('KW-')).toBe(true);
    }
    const islam = getSubjectById('pendidikan-islam');
    expect(islam?.verificationStatus).toBe('awaiting_educator_review');
  });
});

describe('Kampung Wira 3D — Deterministic Scoring, Idempotent Rewards & Village Rules', () => {
  it('computes mastery status accurately across lesson, practice, and assessment modes', () => {
    const afterLesson = computeMastery(undefined, {
      subtopicId: 'mat-1-1',
      subjectId: 'matematik',
      chapterId: 'mat-bab-1',
      engineId: 'object-counter',
      mode: 'lesson',
      score: 1,
      maxScore: 1,
      accuracy: 100,
      coinsEarned: 15,
      starsEarned: 1,
      xpEarned: 20,
      durationSeconds: 45,
      weakAreas: [],
      transactionId: 'tx-1',
    });
    expect(afterLesson.lessonCompleted).toBe(true);
    expect(afterLesson.status).toBe('practicing');

    const afterPractice = computeMastery(afterLesson, {
      subtopicId: 'mat-1-1',
      subjectId: 'matematik',
      chapterId: 'mat-bab-1',
      engineId: 'object-counter',
      mode: 'practice',
      score: 4,
      maxScore: 4,
      accuracy: 100,
      coinsEarned: 20,
      starsEarned: 2,
      xpEarned: 30,
      durationSeconds: 60,
      weakAreas: [],
      transactionId: 'tx-1b',
    });
    expect(afterPractice.practiceCompleted).toBe(true);

    const afterAssessment = computeMastery(afterPractice, {
      subtopicId: 'mat-1-1',
      subjectId: 'matematik',
      chapterId: 'mat-bab-1',
      engineId: 'assessment-engine',
      mode: 'assessment',
      score: 9,
      maxScore: 10,
      accuracy: 90,
      coinsEarned: 35,
      starsEarned: 3,
      xpEarned: 50,
      durationSeconds: 90,
      weakAreas: [],
      transactionId: 'tx-2',
    });
    expect(afterAssessment.assessmentScore).toBe(90);
    expect(afterAssessment.starsEarned).toBe(3);
    expect(afterAssessment.masteryPercent).toBeGreaterThanOrEqual(80);
    expect(afterAssessment.status).toBe('mastered');
  });

  it('prevents duplicate reward crediting via transactionId idempotency', () => {
    const learner = createNewLearner({ id: 'lrn-test', parentId: 'par-1', name: 'Aisyah' });
    const initialCoins = learner.coins;
    const payload = {
      subtopicId: 'mat-1-1',
      subjectId: 'matematik' as const,
      chapterId: 'mat-bab-1',
      engineId: 'assessment-engine' as const,
      mode: 'assessment' as const,
      score: 9,
      maxScore: 10,
      accuracy: 90,
      coinsEarned: 40,
      starsEarned: 3,
      xpEarned: 60,
      durationSeconds: 120,
      weakAreas: [],
      transactionId: 'tx-unique-100',
    };

    const first = applyIdempotentActivityReward({
      learner,
      progressMap: {},
      transactions: [],
      missions: createInitialMissions(),
      achievements: createInitialAchievements(),
      payload,
    });

    expect(first.applied).toBe(true);
    expect(first.learner.coins).toBe(initialCoins + 40);
    expect(first.learner.stars).toBe(3);
    expect(first.learner.gems).toBe(6); // +1 gem for 3-star completion

    const second = applyIdempotentActivityReward({
      learner: first.learner,
      progressMap: first.progressMap,
      transactions: first.transactions,
      missions: first.missions,
      achievements: first.achievements,
      payload,
    });

    expect(second.applied).toBe(false);
    expect(second.learner.coins).toBe(first.learner.coins);
    expect(second.transactions.length).toBe(1);
  });

  it('calculates learner level correctly from XP', () => {
    expect(calculateLevelFromXp(0)).toBe(1);
    expect(calculateLevelFromXp(99)).toBe(1);
    expect(calculateLevelFromXp(100)).toBe(2);
    expect(calculateLevelFromXp(350)).toBe(4);
  });

  it('provides 5 Malaysian companions, 15 subject buildings, and non-overlapping initial village plots', () => {
    expect(Object.keys(COMPANIONS)).toEqual(['rimau', 'kancil', 'enggang', 'utan', 'badak']);
    const buildings = createInitialBuildings();
    expect(buildings.length).toBe(15);
    const subjectIds = new Set(CURRICULUM_SUBJECTS.map((s) => s.id));
    for (const b of buildings) {
      expect(subjectIds.has(b.subjectId)).toBe(true);
    }

    const village = createInitialVillage('lrn-1');
    for (const dec of village.decorations) {
      const collidesWithBuilding = village.buildings.some(
        (b) => Math.hypot(b.gridX - dec.gridX, b.gridZ - dec.gridZ) < 2.2,
      );
      expect(collidesWithBuilding).toBe(false);
    }
    expect(DECORATION_CATALOG.length).toBeGreaterThanOrEqual(5);
    expect(SOUNDTRACK_CATALOG.length).toBe(15);
  });
});

describe('Kampung Wira 3D — LOCAL_DEMO BackendAdapter (IndexedDB / Offline)', () => {
  it('supports demo login, learner avatar update, idempotent progress, village construction & artworks without Laravel', async () => {
    const adapter = new LocalDemoBackendAdapter();
    expect(adapter.mode).toBe('LOCAL_DEMO');

    const auth = await adapter.demoLogin();
    expect(auth.parent.isDemo).toBe(true);
    expect(auth.learners.length).toBeGreaterThanOrEqual(1);

    const learnerId = auth.learners[0].id;
    const updatedLearner = await adapter.updateLearner(learnerId, {
      avatar: {
        skinTone: 'cerah',
        hairStyle: 'tocang_dua',
        hairColor: '#1a1a1a',
        headwear: 'hijab_merdeka',
        headwearColor: '#E11D48',
        outfit: 'baju_kurung_pelangi',
        outfitColor: '#0D9668',
        accessory: 'selendang_songket',
        footwear: 'capal_tradisi',
        expression: 'ceria',
      },
    });
    expect(updatedLearner.avatar.headwear).toBe('hijab_merdeka');

    const firstSubmit = await adapter.submitProgress(learnerId, {
      transactionId: 'tx-local-demo-1',
      subtopicId: 'mat-1-1',
      subjectId: 'matematik',
      chapterId: 'mat-bab-1',
      engineId: 'object-counter',
      mode: 'assessment',
      score: 10,
      maxScore: 10,
      accuracy: 100,
      starsEarned: 3,
      coinsEarned: 45,
      xpEarned: 60,
      weakAreas: [],
      durationSeconds: 50,
    });
    expect(firstSubmit.applied).toBe(true);

    const duplicateSubmit = await adapter.submitProgress(learnerId, {
      transactionId: 'tx-local-demo-1',
      subtopicId: 'mat-1-1',
      subjectId: 'matematik',
      chapterId: 'mat-bab-1',
      engineId: 'object-counter',
      mode: 'assessment',
      score: 10,
      maxScore: 10,
      accuracy: 100,
      starsEarned: 3,
      coinsEarned: 45,
      xpEarned: 60,
      weakAreas: [],
      durationSeconds: 50,
    });
    expect(duplicateSubmit.applied).toBe(false);
    expect(duplicateSubmit.bundle.learner.coins).toBe(firstSubmit.bundle.learner.coins);

    const builtBundle = await adapter.buildBuilding(learnerId, 'bld-psv');
    const psvBuilding = builtBundle.village.buildings.find((b) => b.id === 'bld-psv');
    expect(psvBuilding?.status).toBe('built');

    const art = await adapter.saveArtwork(learnerId, {
      title: 'Batik Bunga Raya Wira',
      motif: 'Bunga Raya',
      dataUrl: 'data:image/png;base64,iVBORw0KGgo=',
    });
    expect(art.displayedInGallery).toBe(true);

    const sessionAfter = await adapter.getSession();
    expect(sessionAfter?.parent.id).toBe(auth.parent.id);
  });
});

describe('Kampung Wira 3D — Voice Pronunciation, Language Routing & Chunking', () => {
  it('normalizes KSSR math symbols, fractions, ringgit, and strips emojis before TTS', () => {
    const malay = normalizeSpeechText('🌟 Kira 1/2 + RM5 = 5 ringgit setengah • Seterusnya!', 'ms-MY');
    expect(malay).toContain('satu per dua');
    expect(malay).toContain('tambah');
    expect(malay).toContain('5 ringgit');
    expect(malay).toContain('sama dengan');
    expect(malay).not.toContain('🌟');

    const eng = normalizeSpeechText('🎈 2 + 3 = 5', 'en-GB');
    expect(eng).toContain('plus');
    expect(eng).toContain('equals');
  });

  it('auto-detects native language from Unicode script or subjectId', () => {
    expect(resolveSpeechLang('بِسْمِ اللَّهِ', { subjectId: 'pendidikan-islam' })).toBe('ar-SA');
    expect(resolveSpeechLang('你好朋友', { subjectId: 'bahasa-cina-sk' })).toBe('zh-CN');
    expect(resolveSpeechLang('வணக்கம்', { subjectId: 'bahasa-tamil-sk' })).toBe('ta-IN');
    expect(resolveSpeechLang('I like the blue boat!', { subjectId: 'bahasa-inggeris' })).toBe('en-GB');
    expect(resolveSpeechLang('Mari mengira bersama Rimau!', { subjectId: 'matematik' })).toBe('ms-MY');
  });

  it('splits long narration paragraphs into clean sentence chunks for reliable playback', () => {
    const longText =
      'Selamat datang ke Kampung Wira 3D. Hari ini kita akan belajar mengenal nombor satu hingga sepuluh dengan mudah. Selepas itu kita boleh membina bangunan baharu di desa!';
    const chunks = splitIntoSpeechChunks(longText, 90);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(110);
    }
  });
});
