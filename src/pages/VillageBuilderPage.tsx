import React, { useState } from 'react';
import { ThreeViewport } from '@/components/three/ThreeViewport';
import { createVillageScene } from '@/features/village/VillageScene3D';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';
import type { VillageBuilding } from '@/types/village';
import { DECORATION_CATALOG } from '@/utils/gameFactory';

export const VillageBuilderPage: React.FC = () => {
  const bundle = useGameStore((s) => s.bundle);
  const buildVillageBuilding = useGameStore((s) => s.buildVillageBuilding);
  const upgradeVillageBuilding = useGameStore((s) => s.upgradeVillageBuilding);
  const placeVillageDecoration = useGameStore((s) => s.placeVillageDecoration);

  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
  const [confirmBld, setConfirmBld] = useState<VillageBuilding | null>(null);
  const [ceremonyBanner, setCeremonyBanner] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const village = bundle?.village;
  const learner = bundle?.learner;

  if (!village || !learner) return null;

  const handleBuild = async (bld: VillageBuilding) => {
    setErrorMsg('');
    try {
      await buildVillageBuilding(bld.id);
      audioEngine.playSfx('build');
      setTimeout(() => audioEngine.playSfx('kompang'), 350);
      setCeremonyBanner(`🎉 Upacara Potong Reben & Paluan Kompang: ${bld.name} Siap Dibina!`);
      setConfirmBld(null);
    } catch (err) {
      audioEngine.playSfx('nudge');
      setErrorMsg(err instanceof Error ? err.message : 'Syiling emas tidak mencukupi.');
    }
  };

  const handleUpgrade = async (bld: VillageBuilding) => {
    setErrorMsg('');
    try {
      await upgradeVillageBuilding(bld.id);
      audioEngine.playSfx('kompang');
      setCeremonyBanner(`✨ ${bld.name} dinaik taraf ke Tahap ${bld.level + 1}!`);
    } catch (err) {
      audioEngine.playSfx('nudge');
      setErrorMsg(err instanceof Error ? err.message : 'Syiling tidak mencukupi.');
    }
  };

  const handleGroundTap = async (x: number, z: number) => {
    if (!selectedCatalog) return;
    setErrorMsg('');
    try {
      await placeVillageDecoration(selectedCatalog, x, z);
      audioEngine.playSfx('build');
      setCeremonyBanner(`🌿 Hiasan diletakkan di koordinat (${x}, ${z})!`);
      setSelectedCatalog(null);
    } catch (err) {
      audioEngine.playSfx('nudge');
      setErrorMsg(err instanceof Error ? err.message : 'Tidak boleh letak di petak ini.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-4">
      <div className="panel-chengal rounded-3xl p-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display font-black text-2xl text-[#351000]">Mod Bina Desa 3D Kampung Wira</h1>
          <p className="text-xs sm:text-sm font-semibold text-[#78350F]">
            Gunakan syiling emas terkumpul ({learner.coins} 🪙) untuk membina bangunan subjek & menghias kampung!
          </p>
        </div>
        {selectedCatalog && (
          <span className="px-3 py-1.5 rounded-full bg-[#FEA619] font-display font-bold text-xs animate-pulse">
            Klik tanah hijau pada peta 3D untuk meletakkan hiasan!
          </span>
        )}
      </div>

      {ceremonyBanner && (
        <div className="panel-chengal rounded-2xl p-4 bg-[#ECFDF5] border-[#0D9668] text-center font-display font-black text-[#006947]">
          {ceremonyBanner}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-2xl p-3 bg-[#FFDAD6] border-2 border-[#BA1A1A] text-center font-bold text-sm text-[#93000A]">
          {errorMsg}
        </div>
      )}

      <ThreeViewport
        heightClassName="h-72 sm:h-96"
        ariaLabel="Peta Pembinaan Kampung Wira 3D"
        deps={[village.buildings, village.decorations.length]}
        setupScene={(ctx) =>
          createVillageScene(
            ctx,
            village,
            (bld) => setConfirmBld(bld),
            (x, z) => void handleGroundTap(x, z),
          )
        }
        fallback2D={
          <img src="/assets/stitch/remote-3e4c7af12718e3f1.jpg" alt="Peta Bina Desa" className="w-full h-full object-cover" />
        }
      />

      {/* Decoration Palette */}
      <div className="panel-chengal rounded-3xl p-4 space-y-2">
        <h2 className="font-display font-bold text-lg">Tambah Hiasan Kampung</h2>
        <div className="flex flex-wrap gap-2">
          {DECORATION_CATALOG.map((item) => (
            <button
              key={item.catalogId}
              type="button"
              onClick={() => setSelectedCatalog((prev) => (prev === item.catalogId ? null : item.catalogId))}
              className={`btn-toy px-4 min-h-11 rounded-2xl font-display font-bold text-xs flex items-center gap-1.5 ${
                selectedCatalog === item.catalogId ? 'btn-toy-emerald' : 'btn-toy-gold'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              {item.name} ({item.costCoins}🪙)
            </button>
          ))}
        </div>
      </div>

      {/* Building Plots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {village.buildings.map((bld) => (
          <div key={bld.id} className="panel-chengal rounded-2xl p-3 flex items-center gap-3">
            <img src={bld.previewImage} alt={bld.name} className="w-16 h-16 rounded-xl object-cover border-2 border-[#78350F]" />
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm truncate">{bld.name}</div>
              <div className="text-xs text-[#78350F]">
                {bld.status === 'built' ? `Siap • Tahap ${bld.level}/${bld.maxLevel}` : `Plot ${bld.plotId} • Kos ${bld.buildCostCoins} 🪙`}
              </div>
            </div>
            {bld.status !== 'built' ? (
              <button type="button" onClick={() => setConfirmBld(bld)} className="btn-toy btn-toy-gold px-3 min-h-10 rounded-xl font-display font-bold text-xs">
                Bina
              </button>
            ) : bld.level < bld.maxLevel ? (
              <button type="button" onClick={() => void handleUpgrade(bld)} className="btn-toy btn-toy-emerald px-3 min-h-10 rounded-xl font-display font-bold text-xs">
                Naik Taraf ({bld.upgradeCostCoins}🪙)
              </button>
            ) : (
              <span className="text-xs font-bold text-[#006947] px-2">Maksimum ⭐</span>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmBld && confirmBld.status !== 'built' && (
        <div className="fixed inset-0 z-50 bg-[#351000]/60 flex items-center justify-center p-4">
          <div className="panel-chengal rounded-3xl max-w-md w-full p-5 space-y-4 text-center">
            <img src={confirmBld.previewImage} alt={confirmBld.name} className="w-full h-40 object-cover rounded-2xl border-2 border-[#78350F]" />
            <h3 className="font-display font-black text-xl">Sahkan Pembinaan {confirmBld.name}?</h3>
            <p className="text-sm font-semibold text-[#78350F]">
              Kos pembinaan ialah <strong>{confirmBld.buildCostCoins} Syiling Emas</strong> di {confirmBld.plotId}.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmBld(null)} className="btn-toy btn-toy-wood flex-1 rounded-2xl font-bold">Batal</button>
              <button type="button" onClick={() => void handleBuild(confirmBld)} className="btn-toy btn-toy-emerald flex-1 rounded-2xl font-display font-bold">
                Bina Sekarang! 🏗️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
