export type SkinToneId = 'cerah' | 'kuning_langsat' | 'sawo_matang' | 'coklat_manis' | 'gelap_hangat';
export type HairStyleId = 'pendek_kemas' | 'tocang_dua' | 'ikal_berombak' | 'rambut_lurus';
export type HeadwearId = 'tiada' | 'songkok' | 'hijab_merdeka' | 'tengkolok' | 'topi_rimba';
export type OutfitId = 'baju_melayu_zamrud' | 'baju_kurung_pelangi' | 'jaket_pengembara' | 'pakaian_sukan_wira' | 'baju_batik_emas';
export type AccessoryId = 'tiada' | 'beg_rotan' | 'cermin_mata' | 'selendang_songket' | 'lencana_bintang';
export type FootwearId = 'kasut_sekolah' | 'but_rimba' | 'capal_tradisi' | 'kasut_sukan';
export type ExpressionId = 'ceria' | 'senyum_lebar' | 'berfikir' | 'semangat';

export interface AvatarConfig {
  skinTone: SkinToneId;
  hairStyle: HairStyleId;
  hairColor: string;
  headwear: HeadwearId;
  headwearColor: string;
  outfit: OutfitId;
  outfitColor: string;
  accessory: AccessoryId;
  footwear: FootwearId;
  expression: ExpressionId;
}

export type CompanionId = 'rimau' | 'kancil' | 'enggang' | 'utan' | 'badak';

export interface CompanionProfile {
  id: CompanionId;
  name: string;
  species: string;
  role: string;
  personality: string;
  specialAbility: string;
  primaryColor: string;
  accentColor: string;
  portraitImage: string;
  greeting: string;
}

export interface LearnerProfile {
  id: string;
  parentId: string;
  name: string;
  age: number;
  className: string;
  avatar: AvatarConfig;
  companionId: CompanionId;
  companionLevel: number;
  companionBondXp: number;
  xp: number;
  level: number;
  coins: number;
  stars: number;
  gems: number;
  energy: number;
  streakDays: number;
  lastActiveDate: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface ParentAccount {
  id: string;
  name: string;
  email: string;
  isDemo: boolean;
  pinCode: string;
  createdAt: string;
}
