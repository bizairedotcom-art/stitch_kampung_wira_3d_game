import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SpeakButton } from '@/components/common/SpeakButton';
import { ThreeViewport } from '@/components/three/ThreeViewport';
import { CURRICULUM_SUBJECTS } from '@/curriculum';
import { createVillageScene, type VillageSceneController } from '@/features/village/VillageScene3D';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';
import type { VillageBuilding } from '@/types/village';
import { COMPANIONS } from '@/utils/gameFactory';

export const VillagePage: React.FC = () => {
  const navigate = useNavigate();
  const bundle = useGameStore((s) => s.bundle);
  const setVillageTimeOfDay = useGameStore((s) => s.setVillageTimeOfDay);
  const ctrlRef = useRef<VillageSceneController | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<VillageBuilding | null>(null);

  const learner = bundle?.learner;
  const village = bundle?.village;
  const companion = learner ? COMPANIONS[learner.companionId] : COMPANIONS.rimau;

  const builtCount = useMemo(
    () => (village?.buildings || []).filter((b) => b.status === 'built').length,
    [village],
  );

  if (!bundle || !learner || !village) {
    return (
      <div className="p-8 text-center font-display font-bold">Memuatkan Kampung Wira 3D...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-5">
      {/* 3D Isometric Malaysian Village Stage */}
      <section className="relative panel-chengal rounded-3xl overflow-hidden">
        <ThreeViewport
          heightClassName="h-[340px] sm:h-[430px]"
          ariaLabel="Peta Kampung Wira 3D Interaktif"
          deps={[village.buildings.length, village.decorations.length, builtCount]}
          setupScene={(ctx) =>
            createVillageScene(
              ctx,
              village,
              (bld) => {
                audioEngine.playSfx('click');
                setSelectedBuilding(bld);
              },
              undefined,
              (ctrl) => {
                ctrlRef.current = ctrl;
              },
            )
          }
          fallback2D={
            <div className="relative h-full w-full">
              <img
                src="/assets/stitch/remote-131d8c905b1a4aea.jpg"
                alt="Kampung Wira 2D Aksesibel"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-[#FFFBEB]/95 px-3 py-1.5 rounded-xl border-2 border-[#78350F] text-xs font-bold">
                Mod Peta 2D Aksesibel Aktif — Pilih Rumah Ilmu di bawah
              </div>
            </div>
          }
        />

        {/* Top-left Village Pill & Day/Night Toggle */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#FFFBEB]/95 border-2 border-[#78350F] rounded-full px-3 py-1.5 shadow">
            <span className="material-symbols-outlined icon-filled text-[#F59E0B] text-base">
              {village.timeOfDay === 'evening' ? 'nights_stay' : 'wb_sunny'}
            </span>
            <span className="font-display font-bold text-xs sm:text-sm text-[#351000]">
              {village.villageName} ({builtCount}/15 Bangunan)
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const next =
                  village.timeOfDay === 'morning'
                    ? 'afternoon'
                    : village.timeOfDay === 'afternoon'
                      ? 'evening'
                      : 'morning';
                setVillageTimeOfDay(next);
                ctrlRef.current?.setDayNight(next);
              }}
              className="btn-toy btn-toy-wood min-h-10 px-3 rounded-full text-xs font-bold"
            >
              🌤️ Masa
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedBuilding(null);
                ctrlRef.current?.resetCamera();
              }}
              className="btn-toy btn-toy-wood min-h-10 px-3 rounded-full text-xs font-bold"
            >
              🎯 Reset
            </button>
            <SpeakButton
              text={`Hai ${learner.name}! ${companion.greeting}`}
              label="Dengar Suara"
              stopLabel="Henti"
              options={{ companionId: learner.companionId }}
              className="btn-toy btn-toy-emerald min-h-10 px-3 rounded-full text-xs font-bold flex items-center gap-1"
            />
          </div>
        </div>

        {/* Companion Speech Overlay */}
        <div className="p-3 sm:p-4 bg-[#FFFBEB] border-t-4 border-[#5C240A] flex items-center gap-3">
          <Link to="/companion" className="shrink-0">
            <img
              src={companion.portraitImage}
              alt={companion.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#78350F] shadow"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-xs text-[#006947] flex items-center gap-1">
              <span>{companion.name} ({companion.species})</span>
              <span className="bg-[#FFE2D6] text-[#78350F] px-2 py-0.5 rounded-full">Tahap {learner.companionLevel}</span>
            </div>
            <p className="text-sm font-semibold text-[#351000] truncate sm:whitespace-normal">
              “Jom {learner.name}! Klik bangunan 3D di atas atau pilih Rumah Ilmu KSSR Tahun 1 di bawah!”
            </p>
          </div>
          {selectedBuilding && (
            <button
              type="button"
              onClick={() => navigate(`/subjects/${selectedBuilding.subjectId}`)}
              className="btn-toy btn-toy-gold px-4 rounded-2xl font-display font-extrabold text-sm shrink-0"
            >
              Masuk {selectedBuilding.name} ➔
            </button>
          )}
        </div>
      </section>

      {/* Primary Play CTA Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            audioEngine.playSfx('kompang');
            navigate('/subjects');
          }}
          className="btn-toy btn-toy-emerald rounded-3xl py-4 px-6 flex items-center justify-center gap-3 font-display font-black text-xl tracking-wide"
        >
          <span className="material-symbols-outlined icon-filled text-[#FFE082] text-3xl">play_circle</span>
          MULA BERMAIN (15 SUBJEK)
        </button>
        <button
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            navigate('/build');
          }}
          className="btn-toy btn-toy-gold rounded-3xl py-4 px-6 flex items-center justify-center gap-3 font-display font-extrabold text-lg"
        >
          <span className="material-symbols-outlined icon-filled text-2xl">construction</span>
          MOD BINA DESA 3D ({village.buildings.filter((b) => b.status !== 'built').length} Plot Tersedia)
        </button>
      </div>

      {/* Building Grid ("Pilih Rumah Ilmu") */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined icon-filled text-[#006947] text-2xl">location_city</span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#351000]">Pilih Rumah Ilmu Kampung Wira</h2>
          </div>
          <Link to="/subjects" className="font-display font-bold text-sm text-[#006947] underline">
            Lihat Semua 15 Subjek ➔
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {village.buildings.map((bld) => {
            const subj = CURRICULUM_SUBJECTS.find((s) => s.id === bld.subjectId);
            const isBuilt = bld.status === 'built';
            return (
              <div
                key={bld.id}
                onClick={() => {
                  audioEngine.playSfx('click');
                  if (isBuilt) {
                    navigate(`/subjects/${bld.subjectId}`);
                  } else {
                    navigate('/build');
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(isBuilt ? `/subjects/${bld.subjectId}` : '/build');
                }}
                className={`panel-chengal rounded-2xl p-2.5 cursor-pointer transition hover:-translate-y-0.5 ${
                  !isBuilt ? 'opacity-85' : ''
                }`}
              >
                <div className="relative h-24 rounded-xl overflow-hidden mb-2 bg-[#FFE2D6]">
                  <img src={bld.previewImage} alt={bld.name} className="w-full h-full object-cover" />
                  <span
                    className="absolute top-1.5 left-1.5 text-[10px] font-display font-bold px-2 py-0.5 rounded-full text-white shadow"
                    style={{ backgroundColor: subj?.themeColor || '#0D9668' }}
                  >
                    {subj?.shortName}
                  </span>
                  {!isBuilt && (
                    <span className="absolute bottom-1.5 right-1.5 bg-[#FEA619] text-[#351000] text-[10px] font-display font-bold px-2 py-0.5 rounded-full shadow">
                      🔒 Bina ({bld.buildCostCoins}🪙)
                    </span>
                  )}
                </div>
                <div className="font-display font-bold text-sm text-[#351000] truncate">{bld.name}</div>
                <div className="text-[11px] font-medium text-[#3d4a42] truncate">
                  {isBuilt ? `Tahap ${bld.level} • ${subj?.chapters.length || 1} Bab` : 'Klik untuk Bina di Desa'}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
