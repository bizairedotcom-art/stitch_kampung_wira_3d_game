import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CURRICULUM_SUBJECTS } from '@/curriculum';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';

export const SubjectsHubPage: React.FC = () => {
  const progress = useGameStore((s) => s.bundle?.progress) || {};
  const [filter, setFilter] = useState<'semua' | 'teras' | 'wajib' | 'elektif_bahasa'>('semua');

  const filtered = CURRICULUM_SUBJECTS.filter((s) => filter === 'semua' || s.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-5">
      <div className="panel-chengal rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#351000]">
            Rumah Ilmu — 15 Subjek KSSR Tahun 1 (SK)
          </h1>
          <p className="text-sm font-semibold text-[#78350F]">
            Semua subjek teras, wajib dan bahasa elektif Sekolah Kebangsaan berserta latihan dan penilaian lengkap.
          </p>
        </div>
        <Link to="/revision" className="btn-toy btn-toy-gold px-4 rounded-2xl font-display font-bold text-sm flex items-center gap-1 shrink-0">
          🔄 Zon Ulang Kaji
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ['semua', `Semua (${CURRICULUM_SUBJECTS.length})`],
            ['teras', 'Subjek Teras'],
            ['wajib', 'Seni, Muzik & PJPK'],
            ['elektif_bahasa', 'Bahasa Tambahan SK (6)'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => { audioEngine.playSfx('click'); setFilter(key); }}
            className={`btn-toy px-4 min-h-11 rounded-2xl font-display font-bold text-sm ${
              filter === key ? 'btn-toy-emerald' : 'btn-toy-wood'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 15 Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((subj) => {
          const allSubtopics = subj.chapters.flatMap((c) => c.subtopics);
          const avgMastery =
            allSubtopics.length === 0
              ? 0
              : Math.round(
                  allSubtopics.reduce((acc, st) => acc + (progress[st.id]?.masteryPercent ?? 0), 0) / allSubtopics.length,
                );

          return (
            <Link
              key={subj.id}
              to={`/subjects/${subj.id}`}
              onClick={() => audioEngine.playSfx('click')}
              className="panel-chengal rounded-3xl overflow-hidden flex flex-col hover:-translate-y-1 transition"
            >
              <div className="relative h-36 bg-[#FFE2D6]">
                <img src={subj.previewImage} alt={subj.buildingName} className="w-full h-full object-cover" />
                <span
                  className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-white font-display font-bold text-xs shadow"
                  style={{ backgroundColor: subj.themeColor }}
                >
                  {subj.buildingName}
                </span>
                {subj.verificationStatus === 'awaiting_educator_review' && (
                  <span className="absolute bottom-2 right-2 bg-[#FEF3C7] text-[#653E00] border border-[#F59E0B] px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Semakan Guru Disyorkan
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h2 className="font-display font-black text-lg text-[#351000]">{subj.name}</h2>
                  <p className="text-xs text-[#3d4a42] mt-1 line-clamp-2">{subj.description}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-[#78350F]">
                    <span>{subj.chapters.length} Bab • {allSubtopics.length} Subtopik</span>
                    <span>Penguasaan {avgMastery}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#FFDBCC] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0D9668]" style={{ width: `${avgMastery}%` }} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
