import React from 'react';
import type { EngineId } from '@/types/curriculum';
import {
  AnalogClockGame,
  ArithmeticGame,
  FractionSimulator,
  Geometry3DGame,
  MeasurementSimulator,
  MoneyShopGame,
  NumberLineGame,
  ObjectCounterGame,
  PictographBuilder,
  PlaceValueGame,
  type InteractiveEngineProps,
} from './MathEngines';
import {
  AbsorptionSimulator,
  AnimalExplorer3D,
  BodyExplorer3D,
  ConstructionGame3D,
  MagnetSimulator,
  ObjectClassificationGame,
  PlantExplorer3D,
} from './ScienceEngines';
import {
  DialogueAdventure,
  LetterTracingGame,
  ListeningGame,
  PictureMatchingGame,
  SentenceBuilder,
  StorySequenceGame,
  SyllableBuilder,
  WordBuilder,
} from './LanguageEngines';
import {
  BatikPatternDesigner,
  DrawingStudio,
  MemoryMatchingGame,
  MoralDecisionGame,
  MovementDemonstrator,
  RhythmGame,
  SafetyScenarioGame,
  VirtualInstrument,
  DragAndDropGame,
} from './CreativeAndCoreEngines';

const ENGINE_REGISTRY: Record<Exclude<EngineId, 'assessment-engine'>, React.FC<InteractiveEngineProps>> = {
  'object-counter': ObjectCounterGame,
  'number-line': NumberLineGame,
  'place-value': PlaceValueGame,
  'arithmetic-game': ArithmeticGame,
  'fraction-simulator': FractionSimulator,
  'money-shop': MoneyShopGame,
  'analog-clock': AnalogClockGame,
  'measurement-simulator': MeasurementSimulator,
  'geometry-3d': Geometry3DGame,
  'pictograph-builder': PictographBuilder,
  'object-classification': ObjectClassificationGame,
  'magnet-simulator': MagnetSimulator,
  'absorption-simulator': AbsorptionSimulator,
  'plant-explorer-3d': PlantExplorer3D,
  'animal-explorer-3d': AnimalExplorer3D,
  'body-explorer-3d': BodyExplorer3D,
  'construction-game-3d': ConstructionGame3D,
  'letter-tracing': LetterTracingGame,
  'syllable-builder': SyllableBuilder,
  'word-builder': WordBuilder,
  'sentence-builder': SentenceBuilder,
  'picture-matching': PictureMatchingGame,
  'listening-game': ListeningGame,
  'story-sequence': StorySequenceGame,
  'dialogue-adventure': DialogueAdventure,
  'moral-decision': MoralDecisionGame,
  'drawing-studio': DrawingStudio,
  'batik-designer': BatikPatternDesigner,
  'rhythm-game': RhythmGame,
  'virtual-instrument': VirtualInstrument,
  'movement-demonstrator': MovementDemonstrator,
  'safety-scenario': SafetyScenarioGame,
  'memory-matching': MemoryMatchingGame,
  'drag-and-drop': DragAndDropGame,
};

interface EngineHostProps {
  engineId: EngineId;
  config: Record<string, unknown>;
  onSuccess: (accuracy: number, summary: string) => void;
}

export const EngineHost: React.FC<EngineHostProps> = ({ engineId, config, onSuccess }) => {
  const Component = ENGINE_REGISTRY[engineId as Exclude<EngineId, 'assessment-engine'>] ?? PictureMatchingGame;
  return <Component config={config} onSuccess={onSuccess} />;
};
