import React, { useRef, useState } from 'react';
import { ThreeViewport } from '@/components/three/ThreeViewport';
import type { AvatarAnimState } from '@/features/avatar/AvatarCharacterMesh';
import { createAvatarStudioScene, type AvatarSceneController } from '@/features/avatar/AvatarScene3D';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';
import type { AvatarConfig } from '@/types/user';

const SKIN_OPTIONS: { id: AvatarConfig['skinTone']; label: string; hex: string }[] = [
  { id: 'cerah', label: 'Cerah', hex: '#FFE0BD' },
  { id: 'kuning_langsat', label: 'Langsat', hex: '#F5CBA7' },
  { id: 'sawo_matang', label: 'Sawo Matang', hex: '#D49B6A' },
  { id: 'coklat_manis', label: 'Coklat', hex: '#A66A3E' },
  { id: 'gelap_hangat', label: 'Gelap', hex: '#6E4228' },
];

const ANIM_STATES: { id: AvatarAnimState; label: string }[] = [
  { id: 'idle', label: 'Rehat' },
  { id: 'wave', label: 'Lambai' },
  { id: 'walk', label: 'Jalan' },
  { id: 'run', label: 'Lari' },
  { id: 'jump', label: 'Lompat' },
  { id: 'think', label: 'Fikir' },
  { id: 'celebrate', label: 'Sorak' },
  { id: 'encourage', label: 'Semangat' },
];

export const AvatarStudioPage: React.FC = () => {
  const bundle = useGameStore((s) => s.bundle);
  const updateAvatar = useGameStore((s) => s.updateAvatar);

  const [draft, setDraft] = useState<AvatarConfig>(() => bundle?.learner.avatar ?? {
    skinTone: 'sawo_matang',
    hairStyle: 'pendek_kemas',
    hairColor: '#2a1700',
    headwear: 'songkok',
    headwearColor: '#006947',
    outfit: 'baju_melayu_zamrud',
    outfitColor: '#0D9668',
    accessory: 'beg_rotan',
    footwear: 'kasut_sekolah',
    expression: 'ceria',
  });
  const [tab, setTab] = useState<'kulit' | 'rambut' | 'pakaian' | 'aksesori' | 'kasut'>('kulit');
  const [anim, setAnim] = useState<AvatarAnimState>('idle');
  const [savedNotice, setSavedNotice] = useState('');
  const ctrlRef = useRef<AvatarSceneController | null>(null);

  const randomize = () => {
    audioEngine.playSfx('coin');
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    setDraft((prev) => ({
      ...prev,
      skinTone: pick(['cerah', 'kuning_langsat', 'sawo_matang', 'coklat_manis', 'gelap_hangat']),
      headwear: pick(['tiada', 'songkok', 'hijab_merdeka', 'tengkolok', 'topi_rimba']),
      outfit: pick(['baju_melayu_zamrud', 'baju_kurung_pelangi', 'jaket_pengembara', 'pakaian_sukan_wira', 'baju_batik_emas']),
      accessory: pick(['tiada', 'beg_rotan', 'cermin_mata', 'selendang_songket', 'lencana_bintang']),
      footwear: pick(['kasut_sekolah', 'but_rimba', 'capal_tradisi', 'kasut_sukan']),
    }));
  };

  const handleSave = async () => {
    await updateAvatar(draft);
    audioEngine.playSfx('success');
    setSavedNotice('Gaya Avatar 3D berjaya disimpan!');
    setTimeout(() => setSavedNotice(''), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-4">
      <div className="panel-chengal rounded-3xl p-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-black text-2xl text-[#351000]">Studio Cipta Wira 3D</h1>
          <p className="text-xs sm:text-sm font-semibold text-[#78350F]">
            Reka avatar pelajar Tahun 1 Malaysia mengikut citarasa kamu!
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAnim('celebrate');
            ctrlRef.current?.setAnimState('celebrate');
            audioEngine.playSfx('kompang');
          }}
          className="btn-toy btn-toy-turquoise px-4 rounded-2xl font-display font-bold text-sm"
        >
          🔊 Sorak!
        </button>
      </div>

      {/* 3D Pedestal Stage */}
      <div className="panel-chengal rounded-3xl p-4 space-y-3">
        <ThreeViewport
          heightClassName="h-72 sm:h-80"
          ariaLabel="Studio Avatar 3D Real-Time"
          deps={[draft]}
          setupScene={(ctx) =>
            createAvatarStudioScene(ctx, draft, anim, (ctrl) => {
              ctrlRef.current = ctrl;
            })
          }
          fallback2D={
            <div className="h-full bg-[#FFF1EB] flex flex-col items-center justify-center p-4">
              <img src="/assets/stitch/remote-b705206ceb7dd355.jpg" alt="Pratonton Avatar" className="h-52 object-contain" />
              <span className="text-xs font-bold text-[#78350F]">Mod Pratonton 2D</span>
            </div>
          }
        />

        {/* Rotation & Randomize Controls */}
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => ctrlRef.current?.rotateBy(-0.6)} className="btn-toy btn-toy-wood px-4 min-h-11 rounded-xl font-bold text-sm">⟲ Kiri</button>
          <button type="button" onClick={() => ctrlRef.current?.spin360()} className="btn-toy btn-toy-wood px-4 min-h-11 rounded-xl font-bold text-sm">360°</button>
          <button type="button" onClick={() => ctrlRef.current?.rotateBy(0.6)} className="btn-toy btn-toy-wood px-4 min-h-11 rounded-xl font-bold text-sm">Kanan ⟳</button>
          <button type="button" onClick={randomize} className="btn-toy btn-toy-gold px-4 min-h-11 rounded-xl font-bold text-sm">🎲 Rawak!</button>
        </div>

        {/* 9 Animation States */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {ANIM_STATES.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                setAnim(st.id);
                ctrlRef.current?.setAnimState(st.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-display font-bold border-2 ${
                anim === st.id ? 'bg-[#0D9668] text-white border-[#00422b]' : 'bg-[#FFFBEB] border-[#78350F]/40'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            ['kulit', 'Kulit & Rambut'],
            ['rambut', 'Penutup Kepala'],
            ['pakaian', 'Pakaian Tradisi'],
            ['aksesori', 'Aksesori'],
            ['kasut', 'Kasut'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => { audioEngine.playSfx('click'); setTab(id); }}
            className={`btn-toy px-4 min-h-11 rounded-2xl font-display font-bold text-sm shrink-0 ${
              tab === id ? 'btn-toy-emerald' : 'btn-toy-wood'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Selection Drawer */}
      <div className="panel-chengal rounded-3xl p-4 space-y-3">
        {tab === 'kulit' && (
          <>
            <div className="grid grid-cols-5 gap-2">
              {SKIN_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, skinTone: s.id }))}
                  className={`p-2 rounded-2xl border-2 flex flex-col items-center ${
                    draft.skinTone === s.id ? 'border-[#0D9668] bg-[#ECFDF5]' : 'border-[#78350F]/30 bg-white'
                  }`}
                >
                  <span className="w-8 h-8 rounded-full border-2 border-[#351000]" style={{ backgroundColor: s.hex }} />
                  <span className="text-[11px] font-bold mt-1">{s.label}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['pendek_kemas', 'tocang_dua', 'ikal_berombak', 'rambut_lurus'] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, hairStyle: h }))}
                  className={`btn-toy rounded-xl text-xs font-bold ${draft.hairStyle === h ? 'btn-toy-gold' : 'btn-toy-wood'}`}
                >
                  {h.replace('_', ' ')}
                </button>
              ))}
            </div>
          </>
        )}

        {tab === 'rambut' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(
              [
                ['tiada', 'Tiada'],
                ['songkok', 'Songkok Emas'],
                ['hijab_merdeka', 'Hijab Ceria'],
                ['tengkolok', 'Tengkolok Diraja'],
                ['topi_rimba', 'Topi Rimba'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, headwear: id }))}
                className={`btn-toy rounded-xl text-xs font-bold ${draft.headwear === id ? 'btn-toy-gold' : 'btn-toy-wood'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {tab === 'pakaian' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  ['baju_melayu_zamrud', 'Baju Melayu Zamrud', '#0D9668'],
                  ['baju_kurung_pelangi', 'Baju Kurung Pelangi', '#E11D48'],
                  ['jaket_pengembara', 'Jaket Pengembara', '#0284C7'],
                  ['pakaian_sukan_wira', 'Pakaian Sukan Wira', '#7C3AED'],
                  ['baju_batik_emas', 'Baju Batik Emas', '#D97706'],
                ] as const
              ).map(([id, label, color]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, outfit: id, outfitColor: color }))}
                  className={`btn-toy rounded-xl text-xs font-bold px-2 ${draft.outfit === id ? 'btn-toy-gold' : 'btn-toy-wood'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'aksesori' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(
              [
                ['tiada', 'Tiada'],
                ['beg_rotan', 'Beg Rotan'],
                ['cermin_mata', 'Cermin Mata'],
                ['selendang_songket', 'Selendang Songket'],
                ['lencana_bintang', 'Lencana Bintang'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, accessory: id }))}
                className={`btn-toy rounded-xl text-xs font-bold ${draft.accessory === id ? 'btn-toy-gold' : 'btn-toy-wood'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {tab === 'kasut' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                ['kasut_sekolah', 'Kasut Sekolah'],
                ['but_rimba', 'But Rimba'],
                ['capal_tradisi', 'Capal Tradisi'],
                ['kasut_sukan', 'Kasut Sukan'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, footwear: id }))}
                className={`btn-toy rounded-xl text-xs font-bold ${draft.footwear === id ? 'btn-toy-gold' : 'btn-toy-wood'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {savedNotice && <p className="text-center font-bold text-[#006947]">{savedNotice}</p>}
        <button type="button" onClick={() => void handleSave()} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-extrabold text-lg">
          💾 Simpan Gaya Avatar
        </button>
      </div>
    </div>
  );
};
