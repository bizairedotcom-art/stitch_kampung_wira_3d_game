import type { CompanionId } from '@/types/user';

export const VOICE_DIRECTION_VERSION = 'kw-voice-v2.0';
export const AUDIO_CONFIG_VERSION = 'pcm24k-mono-norm-v1';

export type CharacterVoiceId = CompanionId | 'narrator';

export type DeliveryProfileId =
  | 'instruction'
  | 'discovery'
  | 'correct'
  | 'incorrect'
  | 'hint'
  | 'achievement'
  | 'storytelling'
  | 'welcome'
  | 'goodbye';

export type PronunciationMode =
  | 'narration'
  | 'phonics_syllable'
  | 'mathematics'
  | 'english_cefr'
  | 'arabic_jawi'
  | 'mandarin_sk'
  | 'tamil_sk'
  | 'indigenous_guarded';

export type AudioContentCategory =
  | 'general_narration'
  | 'character_dialogue'
  | 'pronunciation_drill'
  | 'quran_recitation'
  | 'arabic_pronunciation'
  | 'hadis_explanation'
  | 'malay_narration';

export type SpeechLang = 'ms-MY' | 'en-GB' | 'ar-SA' | 'zh-CN' | 'ta-IN';

export interface CandidateVoiceSpec {
  voiceId: string;
  label: string;
  register: string;
  genderHint: 'male' | 'female' | 'neutral';
  toneSummary: string;
}

export interface CharacterVoiceProfile {
  id: CharacterVoiceId;
  displayName: string;
  roleTitle: string;
  agePersona: string;
  malayDescription: string;
  defaultGeminiVoice: string;
  alternateGeminiVoices: string[];
  preferredCloudTtsVoices: string[];
  vocalRegister: string;
  styleDirective: string;
  emotionalRange: string;
  forbiddenTraits: string[];
}

export interface DeliveryProfileSpec {
  id: DeliveryProfileId;
  labelMs: string;
  emotionState: 'idle' | 'welcome' | 'instruction' | 'discovery' | 'correct' | 'incorrect' | 'hint' | 'achievement' | 'storytelling' | 'goodbye';
  styleDirective: string;
  pacingHint: string;
}

export const MASTER_MALAY_VOICE_DIRECTION = [
  'Perform as a professional Malaysian voice actor working on a premium animated educational adventure game for Malaysian children aged seven.',
  'Speak in authentic Bahasa Melayu Malaysia (Baku/standard friendly Malaysian pronunciation), NOT Indonesian pronunciation.',
  'Your voice is warm, friendly, expressive, reassuring and conversational.',
  'Maintain a natural medium or medium-low vocal register.',
  'Use comfortable pacing, clear articulation and natural pauses between important ideas.',
  'Imagine that you are personally guiding a child through an exciting educational adventure.',
  'Sound genuinely human with natural breathing.',
  'Express enthusiasm naturally without shouting. Express encouragement without exaggeration.',
  'Avoid robotic delivery, artificial pitch elevation, squeaky cartoon voices, metallic resonance and unnecessary dramatic acting.',
  'Maintain the same vocal identity throughout the recording.',
  'Read ONLY the supplied dialogue. Do not read the voice direction or production instructions aloud.',
].join(' ');

export const CANDIDATE_GEMINI_VOICES: CandidateVoiceSpec[] = [
  {
    voiceId: 'Fenrir',
    label: 'Fenrir (Warm Young Adult Male)',
    register: 'Medium-low warm male',
    genderHint: 'male',
    toneSummary: 'Friendly older brother cadence, natural warmth and steady adventure energy.',
  },
  {
    voiceId: 'Puck',
    label: 'Puck (Expressive Young Explorer)',
    register: 'Medium clear bright',
    genderHint: 'male',
    toneSummary: 'Curious, agile and intelligent conversational delivery without high-pitched squeaking.',
  },
  {
    voiceId: 'Zephyr',
    label: 'Zephyr (Warm Cheerful Female)',
    register: 'Medium warm female',
    genderHint: 'female',
    toneSummary: 'Expressive, musical and uplifting young adult female storytelling voice.',
  },
  {
    voiceId: 'Kore',
    label: 'Kore (Calm Malaysian Educator Female)',
    register: 'Medium-low composed female',
    genderHint: 'female',
    toneSummary: 'Patient, reassuring and articulate primary school teacher clarity.',
  },
  {
    voiceId: 'Charon',
    label: 'Charon (Deep Steady Adult Male)',
    register: 'Lower warm male',
    genderHint: 'male',
    toneSummary: 'Calm, grounded, dependable guardian register suited for mentor and protector roles.',
  },
  {
    voiceId: 'Orus',
    label: 'Orus (Gentle Reflective Male)',
    register: 'Warm baritone male',
    genderHint: 'male',
    toneSummary: 'Thoughtful, measured mentor tone with relaxed conversational phrasing.',
  },
  {
    voiceId: 'Aoede',
    label: 'Aoede (Storyteller Female)',
    register: 'Natural medium female',
    genderHint: 'female',
    toneSummary: 'Warm narrative cadence suited for Bahasa Melayu reading and stories.',
  },
];

export const CHARACTER_VOICE_BIBLE: Record<CharacterVoiceId, CharacterVoiceProfile> = {
  rimau: {
    id: 'rimau',
    displayName: 'Rimau — Pemandu Utama',
    roleTitle: 'Main Adventure Guide (Abang Rimau)',
    agePersona: 'Friendly Malaysian young adult male (early-mid 20s)',
    malayDescription: 'Suara abang yang mesra, yakin, bersemangat pengembaraan, nada sederhana rendah yang hangat.',
    defaultGeminiVoice: 'Fenrir',
    alternateGeminiVoices: ['Orus', 'Puck'],
    preferredCloudTtsVoices: ['ms-MY-Wavenet-B', 'ms-MY-Standard-B'],
    vocalRegister: 'Medium-low warm adult male',
    styleDirective:
      'Friendly Malaysian young adult male older-brother adventure guide. Warm, confident, adventurous, playfully encouraging, medium-low natural voice with clear Malaysian pronunciation.',
    emotionalRange: 'Warm welcome, curious wonder, gentle reassurance, controlled celebration.',
    forbiddenTraits: ['Squeaky cartoon voice', 'Shouting', 'Indonesian accent', 'Pitch shifting'],
  },
  kancil: {
    id: 'kancil',
    displayName: 'Kancil — Penjelajah Pintar',
    roleTitle: 'Curious Explorer & Reading Guide',
    agePersona: 'Intelligent expressive young adult',
    malayDescription: 'Suara anak muda yang petah, bijak, ingin tahu dan mesra dengan nada sederhana semula jadi.',
    defaultGeminiVoice: 'Puck',
    alternateGeminiVoices: ['Fenrir', 'Zephyr'],
    preferredCloudTtsVoices: ['ms-MY-Wavenet-D', 'ms-MY-Standard-D'],
    vocalRegister: 'Natural medium conversational register (no squeaky pitch)',
    styleDirective:
      'Intelligent, expressive young adult Malaysian explorer. Curious, clever, lively and friendly in a natural medium vocal register. Never squeaky or childish.',
    emotionalRange: 'Alert curiosity, clear phonics/word emphasis, warm encouragement.',
    forbiddenTraits: ['High-pitched chipmunk squeak', 'Hyperactive fast talking'],
  },
  enggang: {
    id: 'enggang',
    displayName: 'Enggang — Pemandu Ceria',
    roleTitle: 'Cheerful Guide (Bahasa Inggeris & Seni)',
    agePersona: 'Friendly Malaysian young adult female',
    malayDescription: 'Suara wanita muda Malaysia yang ceria, hangat, jelas sebutannya dan bersemangat.',
    defaultGeminiVoice: 'Zephyr',
    alternateGeminiVoices: ['Aoede', 'Kore'],
    preferredCloudTtsVoices: ['ms-MY-Wavenet-A', 'en-GB-Neural2-A'],
    vocalRegister: 'Natural warm medium female',
    styleDirective:
      'Friendly Malaysian young adult female guide. Cheerful, warm, expressive, adventurous and articulate without shrillness or fake excitement.',
    emotionalRange: 'Bright greetings, melodic rhythm, warm support.',
    forbiddenTraits: ['Shrill soprano', 'Overacted cartoon exaggeration'],
  },
  utan: {
    id: 'utan',
    displayName: 'Utan — Mentor Sabar',
    roleTitle: 'Patient Science & Nature Mentor',
    agePersona: 'Calm Malaysian adult male',
    malayDescription: 'Suara lelaki dewasa Malaysia yang tenang, sabar, lembut dan meyakinkan.',
    defaultGeminiVoice: 'Orus',
    alternateGeminiVoices: ['Charon', 'Fenrir'],
    preferredCloudTtsVoices: ['ms-MY-Wavenet-B', 'ms-MY-Standard-D'],
    vocalRegister: 'Warm lower-medium adult male',
    styleDirective:
      'Calm Malaysian adult male mentor. Patient, reassuring, gentle, thoughtful with a warm lower vocal register and unhurried natural pauses.',
    emotionalRange: 'Reflective wonder, patient step-by-step hints, calm affirmation.',
    forbiddenTraits: ['Rushed cadence', 'Robotic monotone'],
  },
  badak: {
    id: 'badak',
    displayName: 'Badak — Pelindung Mesra',
    roleTitle: 'Friendly Protector (Adab, Moral & PJPK)',
    agePersona: 'Warm Malaysian adult male',
    malayDescription: 'Suara lelaki dewasa yang sedikit dalam, penyayang, optimis dan boleh diharap.',
    defaultGeminiVoice: 'Charon',
    alternateGeminiVoices: ['Orus', 'Fenrir'],
    preferredCloudTtsVoices: ['ms-MY-Wavenet-D', 'ms-MY-Standard-B'],
    vocalRegister: 'Natural slightly deeper warm baritone male',
    styleDirective:
      'Warm Malaysian adult male protector. Slightly deeper natural vocal register, supportive, optimistic, dependable and genuinely kind.',
    emotionalRange: 'Steadfast encouragement, kind moral reflection, warm celebration.',
    forbiddenTraits: ['Intimidating growl', 'Artificial bass pitch transposition'],
  },
  narrator: {
    id: 'narrator',
    displayName: 'Cikgu Harmoni — Pencerita Utama',
    roleTitle: 'Main Educational Narrator',
    agePersona: 'Professional Malaysian female primary school teacher',
    malayDescription: 'Suara guru wanita sekolah rendah Malaysia yang tenang, sabar, jelas dan mesra.',
    defaultGeminiVoice: 'Kore',
    alternateGeminiVoices: ['Aoede', 'Zephyr'],
    preferredCloudTtsVoices: ['ms-MY-Wavenet-C', 'ms-MY-Standard-C'],
    vocalRegister: 'Warm, clear natural adult female teacher register',
    styleDirective:
      'Professional Malaysian female primary school teacher (Guru Tahun 1). Excellent standard Malaysian pronunciation, calm, patient, friendly, encouraging and crystal clear.',
    emotionalRange: 'Clear instruction, gentle scaffolding, warm teacher praise.',
    forbiddenTraits: ['Strict scolding tone', 'Indonesian vowel inflection', 'Monotone IVR'],
  },
};

export const DELIVERY_PROFILES: Record<DeliveryProfileId, DeliveryProfileSpec> = {
  instruction: {
    id: 'instruction',
    labelMs: 'Arahan Pelajaran',
    emotionState: 'instruction',
    styleDirective: 'Calm, patient, clear and gently encouraging primary-school guidance with clean pauses.',
    pacingHint: 'Balanced, clear articulation',
  },
  discovery: {
    id: 'discovery',
    labelMs: 'Penerokaan',
    emotionState: 'discovery',
    styleDirective: 'Curious, adventurous and gently excited, inviting the child to observe closely.',
    pacingHint: 'Engaging conversational rhythm',
  },
  correct: {
    id: 'correct',
    labelMs: 'Jawapan Betul',
    emotionState: 'correct',
    styleDirective: 'Happy, proud and warmly congratulatory, smiling through the voice without shouting.',
    pacingHint: 'Bright and affirming',
  },
  incorrect: {
    id: 'incorrect',
    labelMs: 'Sokongan Lembut',
    emotionState: 'incorrect',
    styleDirective: 'Gentle, supportive and reassuring. Never disappointed or stern. Warmly encourages trying again.',
    pacingHint: 'Soft, patient, reassuring',
  },
  hint: {
    id: 'hint',
    labelMs: 'Petunjuk Sahabat',
    emotionState: 'hint',
    styleDirective: 'Thoughtful, conspiratorial and helpful, guiding the child to notice the clue.',
    pacingHint: 'Thoughtful pause before key clue',
  },
  achievement: {
    id: 'achievement',
    labelMs: 'Kejayaan & Trofi',
    emotionState: 'achievement',
    styleDirective: 'Energetic, proud and celebratory but controlled and pleasant on mobile speakers without shouting.',
    pacingHint: 'Joyful, balanced resonance',
  },
  storytelling: {
    id: 'storytelling',
    labelMs: 'Penceritaan',
    emotionState: 'storytelling',
    styleDirective: 'Immersive, expressive animated adventure storytelling with natural pauses and imagery.',
    pacingHint: 'Flowing narrative cadence',
  },
  welcome: {
    id: 'welcome',
    labelMs: 'Sambutan Mesra',
    emotionState: 'welcome',
    styleDirective: 'Warm, welcoming and genuinely pleased to see the young learner.',
    pacingHint: 'Inviting, natural smile',
  },
  goodbye: {
    id: 'goodbye',
    labelMs: 'Penutup Mesra',
    emotionState: 'goodbye',
    styleDirective: 'Friendly, proud of today’s effort, and reassuring until next time.',
    pacingHint: 'Gentle closure',
  },
};

export interface AuditionTestPhrase {
  id: string;
  label: string;
  deliveryProfile: DeliveryProfileId;
  text: string;
}

export const AUDITION_TEST_PHRASES: AuditionTestPhrase[] = [
  {
    id: 'phrase-1-welcome',
    label: 'Frasa 1 — Sambutan Kampung Wira',
    deliveryProfile: 'welcome',
    text: 'Selamat datang ke Kampung Wira! Jom kita mulakan pengembaraan kita hari ini.',
  },
  {
    id: 'phrase-2-counting',
    label: 'Frasa 2 — Arahan Mengira (Matematik)',
    deliveryProfile: 'instruction',
    text: 'Cuba kira berapa biji rambutan yang ada di dalam bakul ini.',
  },
  {
    id: 'phrase-3-correct',
    label: 'Frasa 3 — Pujian Jawapan Betul',
    deliveryProfile: 'correct',
    text: 'Wah, hebatnya kamu! Jawapan itu betul.',
  },
  {
    id: 'phrase-4-encourage',
    label: 'Frasa 4 — Sokongan Lembut Cuba Lagi',
    deliveryProfile: 'incorrect',
    text: 'Tak apa. Jangan risau. Jom kita cuba sekali lagi.',
  },
  {
    id: 'phrase-5-geometry',
    label: 'Frasa 5 — Arahan Bentuk Geometri',
    deliveryProfile: 'instruction',
    text: 'Pilih bentuk yang mempunyai tiga sisi.',
  },
  {
    id: 'phrase-6-word-problem',
    label: 'Frasa 6 — Masalah Bercerita Matematik',
    deliveryProfile: 'storytelling',
    text: 'Ali mempunyai lima biji mangga. Ibu memberikan tiga biji lagi. Berapakah jumlah semuanya?',
  },
  {
    id: 'phrase-7-achievement',
    label: 'Frasa 7 — Kejayaan Membina Desa',
    deliveryProfile: 'achievement',
    text: 'Syabas! Kamu dah berjaya membina jambatan baharu untuk kampung kita.',
  },
];

export const NATURAL_MALAY_DIALOGUES = {
  chooseAnswer: 'Jom pilih jawapan yang betul!',
  tryAgain: 'Tak apa, jom kita cuba sekali lagi.',
  slowTryAgain: 'Jangan risau, kita cuba perlahan-lahan.',
  missionComplete: 'Hebat! Misi kita dah berjaya!',
  countTogether: 'Jom kita kira sama-sama.',
  observeShape: 'Cuba perhatikan bentuk ini.',
  smartPraise: 'Wah, bijaknya kamu!',
  starEarned: 'Pandainya! Satu lagi bintang untuk kamu.',
  villagePretty: 'Kampung kita semakin cantik!',
  exploreNew: 'Jom terokai tempat baharu!',
  rimauHint: 'Rimau ada petunjuk untuk kamu.',
  correctFeedback: [
    'Wah, hebatnya kamu! Jawapan itu betul.',
    'Pandainya! Satu lagi bintang untuk kamu.',
    'Wah, bijaknya kamu! Teruskan usaha!',
  ],
  incorrectFeedback: [
    'Tak apa. Jangan risau. Jom kita cuba sekali lagi.',
    'Hampir tepat! Jangan risau, kita cuba perlahan-lahan.',
    'Tak apa, cuba baca petunjuk sahabat dan pilih semula ya!',
  ],
};

export const INDIGENOUS_SUBJECT_IDS = new Set([
  'bahasa-iban',
  'bahasa-kadazandusun',
  'bahasa-semai',
]);

export function resolvePronunciationMode(
  text: string,
  subjectId?: string,
  explicitMode?: PronunciationMode,
): PronunciationMode {
  if (explicitMode) return explicitMode;
  if (subjectId && INDIGENOUS_SUBJECT_IDS.has(subjectId)) return 'indigenous_guarded';
  if (/[\u0600-\u06FF]/.test(text) || subjectId === 'bahasa-arab') return 'arabic_jawi';
  if (/[\u4E00-\u9FFF]/.test(text) || subjectId === 'bahasa-cina-sk') return 'mandarin_sk';
  if (/[\u0B80-\u0BFF]/.test(text) || subjectId === 'bahasa-tamil-sk') return 'tamil_sk';
  if (subjectId === 'bahasa-inggeris') return 'english_cefr';
  if (subjectId === 'matematik' || /\d+\s*\/\s*\d+|[+÷×=]|\bRM\s*\d/i.test(text)) {
    return 'mathematics';
  }
  return 'narration';
}

export function normalizeDialogueText(
  rawText: string,
  lang: SpeechLang = 'ms-MY',
  mode: PronunciationMode = 'narration',
): string {
  // Replace formal textbook lines if passed verbatim
  let cleaned = rawText
    .replace(/\bSila pilih jawapan yang tepat\.?/gi, NATURAL_MALAY_DIALOGUES.chooseAnswer)
    .replace(/\bJawapan anda salah\.?/gi, NATURAL_MALAY_DIALOGUES.tryAgain)
    .replace(/\bAnda telah menyelesaikan tugasan\.?/gi, NATURAL_MALAY_DIALOGUES.missionComplete);

  // Strip pictographic emojis & UI symbols so TTS never vocalizes symbols
  cleaned = cleaned
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, ' ')
    .replace(/[•▪◦●★☆✓✔✕✖➔➜→←▼▲◆]/g, ', ')
    .replace(/[*_`~#|]/g, ' ');

  if (mode === 'phonics_syllable') {
    // Separate hyphenated or '+' syllable drills clearly without saying "plus" or "dash"
    cleaned = cleaned
      .replace(/\s*\+\s*/g, ', ')
      .replace(/(?<=[a-zA-Z])-(?=[a-zA-Z])/g, ', ');
  }

  if (lang === 'ms-MY' && mode !== 'phonics_syllable') {
    cleaned = cleaned
      .replace(/\bRM\s*(\d+)(?:\.(\d{1,2}))?\b/gi, (_m, ringgit: string, sen?: string) => {
        if (!sen || Number(sen) === 0) return `${Number(ringgit)} ringgit`;
        return `${Number(ringgit)} ringgit ${Number(sen)} sen`;
      })
      .replace(/\b(\d+)\s*\/\s*(\d+)\b/g, (_m, a: string, b: string) => {
        if (a === '1' && b === '2') return 'satu per dua';
        if (a === '1' && b === '4') return 'satu per empat';
        if (a === '3' && b === '4') return 'tiga per empat';
        return `${a} per ${b}`;
      })
      .replace(/\s*\+\s*/g, ' tambah ')
      .replace(/\s*[−–-]\s*(?=\d)/g, ' tolak ')
      .replace(/\s*[×x]\s*(?=\d)/gi, ' darab ')
      .replace(/\s*÷\s*/g, ' bahagi ')
      .replace(/\s*=\s*/g, ' sama dengan ')
      .replace(/\bKSSR\b/g, 'K S S R')
      .replace(/\bCEFR\b/g, 'C E F R')
      .replace(/\bPJPK\b/g, 'P J P K')
      .replace(/\bSK\b/g, 'S K');
  } else if (lang === 'en-GB' && mode !== 'phonics_syllable') {
    cleaned = cleaned
      .replace(/\s*\+\s*/g, ' plus ')
      .replace(/\s*[−–-]\s*(?=\d)/g, ' minus ')
      .replace(/\s*[×]\s*/g, ' times ')
      .replace(/\s*÷\s*/g, ' divided by ')
      .replace(/\s*=\s*/g, ' equals ');
  }

  // Collapse repeated commas/spaces and trim trailing punctuation clutter
  return cleaned
    .replace(/\s+/g, ' ')
    .replace(/,\s*,+/g, ',')
    .replace(/^\s*,\s*/, '')
    .trim();
}

export function buildSpeechDirectionPrompt(params: {
  characterId: CharacterVoiceId;
  deliveryProfile: DeliveryProfileId;
  lang: SpeechLang;
  pronunciationMode: PronunciationMode;
  audioCategory?: AudioContentCategory;
}): string {
  const char = CHARACTER_VOICE_BIBLE[params.characterId] || CHARACTER_VOICE_BIBLE.rimau;
  const delivery = DELIVERY_PROFILES[params.deliveryProfile] || DELIVERY_PROFILES.instruction;

  const langInstruction =
    params.lang === 'en-GB'
      ? 'Language: Malaysian-friendly clear British English (CEFR Year 1 primary school clarity).'
      : params.lang === 'ar-SA'
        ? 'Language: Clear Standard Arabic for Malaysian primary students learning basic words and Hijaiyah.'
        : params.lang === 'zh-CN'
          ? 'Language: Clear Mandarin Chinese for Malaysian SK primary learners.'
          : params.lang === 'ta-IN'
            ? 'Language: Clear standard Tamil for Malaysian SK primary learners.'
            : 'Language: Authentic Bahasa Melayu Malaysia (ms-MY), natural Malaysian pronunciation, NEVER Indonesian accent.';

  let modeNote = '';
  if (params.pronunciationMode === 'phonics_syllable') {
    modeNote = 'Delivery mode: Phonetic and syllable clarity. Articulate each letter or syllable clearly with gentle pauses between commas, without reading punctuation names.';
  } else if (params.pronunciationMode === 'mathematics') {
    modeNote = 'Delivery mode: Mathematical clarity. Speak numbers and Malay math terms cleanly and steadily.';
  } else if (params.audioCategory === 'hadis_explanation') {
    modeNote = 'Delivery mode: Calm, respectful, gentle moral and educational explanation suitable for children.';
  }

  return [
    MASTER_MALAY_VOICE_DIRECTION,
    `Character identity: ${char.styleDirective}`,
    `Context delivery (${delivery.labelMs}): ${delivery.styleDirective}`,
    langInstruction,
    modeNote,
  ]
    .filter(Boolean)
    .join(' ');
}
