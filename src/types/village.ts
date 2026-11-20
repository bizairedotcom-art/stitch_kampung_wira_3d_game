import type { SubjectId } from './curriculum';

export type BuildingStatus = 'locked' | 'available' | 'under_construction' | 'built';

export interface VillageBuilding {
  id: string;
  subjectId: SubjectId;
  name: string;
  plotId: string;
  gridX: number;
  gridZ: number;
  rotation: number;
  level: number;
  maxLevel: number;
  status: BuildingStatus;
  buildCostCoins: number;
  upgradeCostCoins: number;
  styleVariant:
    | 'tower'
    | 'lab'
    | 'library'
    | 'bay'
    | 'pavilion'
    | 'gallery'
    | 'stage'
    | 'arena'
    | 'wakaf';
  roofColor: string;
  wallColor: string;
  previewImage: string;
}

export interface VillageDecoration {
  id: string;
  catalogId: string;
  name: string;
  category: 'pokok' | 'lampu' | 'bunga' | 'kraf' | 'papan_tanda';
  gridX: number;
  gridZ: number;
  rotation: number;
  costCoins: number;
}

export interface SavedArtwork {
  id: string;
  learnerId: string;
  title: string;
  motif: string;
  dataUrl: string;
  starsEarned: number;
  createdAt: string;
  displayedInGallery: boolean;
}

export interface VillageState {
  learnerId: string;
  villageName: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  buildings: VillageBuilding[];
  decorations: VillageDecoration[];
  unlockedPlots: string[];
  celebrationsSeen: string[];
}
