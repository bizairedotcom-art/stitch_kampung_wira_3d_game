import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CURRICULUM_SUBJECTS } from '@/curriculum';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';

export const ParentDashboardPage: React.FC = () => {
  const { parent, learners, activeLearnerId, setActiveLearner } = useAuthStore();
  const bundle = useGameStore((s) => s.bundle);
  const loadLearnerBundle = useGameStore((s) => s.loadLearnerBundle);

  const [pinInput, setPinInput] = useState('');
  const [unlocked, setUnlocked] = useState(Boolean(parent?.isDemo));
  const [pinErr, setPinErr] = useState('');

  const expectedPin = parent?.pinCode || '1234';

  const verifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === expectedPin) {
      setUnlocked(true);
      setPinErr('');
    } else {
      setPinErr('PIN tidak sepadan. (Lalai pendaftaran atau 1234 untuk demo)');
    }
  };

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto px-4 pt-8 pb-28">
        <form onSubmit={verifyPin} className="panel-chengal rounded-3xl p-6 space-y-4 text-center">
          <div className="text-4xl">🔐</div>
          <h1 className="font-display font-black text-2xl">Zon Ibu Bapa & Guru</h1>
          <p className="text-sm text-[#78350F]">Masukkan PIN 4 digit penjaga untuk melihat laporan prestasi KSSR.</p>
          <input
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="••••"
            className="w-full rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 text-center font-display text-2xl tracking-widest"
          />
          {pinErr && <p className="text-xs font-bold text-[#BA1A1A]">{pinErr}</p>}
          <button type="submit" className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold">
            Buka Laporan Penjaga
          </button>
        </form>
      </div>
    );
  }

  const progress = bundle?.progress || {};
  const learner = bundle?.learner;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-5">
      <div className="panel-chengal rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-black text-2xl text-[#351000]">Papan Pemuka Ibu Bapa — KSSR Tahun 1</h1>
          <p className="text-xs sm:text-sm text-[#78350F]">
            Penjaga: {parent?.name} • {parent?.isDemo ? 'Akaun Mod Demo' : parent?.email}
          </p>
        </div>
        <Link to="/onboarding/learner" className="btn-toy btn-toy-gold px-4 rounded-2xl font-display font-bold text-sm">
          + Tambah Profil Anak
        </Link>
      </div>

      {/* Multi-learner Switcher */}
      <div className="panel-chengal rounded-3xl p-4 space-y-2">
        <h2 className="font-display font-bold text-base">Pilih Profil Murid ({learners.length})</h2>
        <div className="flex flex-wrap gap-2">
          {learners.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                setActiveLearner(l.id);
                void loadLearnerBundle(l.id);
              }}
              className={`btn-toy px-4 min-h-11 rounded-2xl font-display font-bold text-sm ${
                l.id === activeLearnerId ? 'btn-toy-emerald' : 'btn-toy-wood'
              }`}
            >
              {l.name} ({l.className}) — Tahap {l.level}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      {learner && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="panel-chengal rounded-2xl p-4 text-center">
            <div className="text-xs font-bold text-[#78350F]">Jumlah Bintang</div>
            <div className="font-display font-black text-2xl text-[#F59E0B]">{learner.stars} ⭐</div>
          </div>
          <div className="panel-chengal rounded-2xl p-4 text-center">
            <div className="text-xs font-bold text-[#78350F]">Syiling Terkumpul</div>
            <div className="font-display font-black text-2xl text-[#D97706]">{learner.coins} 🪙</div>
          </div>
          <div className="panel-chengal rounded-2xl p-4 text-center">
            <div className="text-xs font-bold text-[#78350F]">Subtopik Diterokai</div>
            <div className="font-display font-black text-2xl text-[#006947]">{Object.keys(progress).length}</div>
          </div>
          <div className="panel-chengal rounded-2xl p-4 text-center">
            <div className="text-xs font-bold text-[#78350F]">Transaksi Direkod</div>
            <div className="font-display font-black text-2xl text-[#006577]">{bundle?.transactions.length ?? 0}</div>
          </div>
        </div>
      )}

      {/* 15 Subject Mastery Report */}
      <div className="panel-chengal rounded-3xl p-5 space-y-3">
        <h2 className="font-display font-black text-xl">Laporan Penguasaan 15 Subjek KSSR Tahun 1 (SK)</h2>
        <div className="space-y-2.5">
          {CURRICULUM_SUBJECTS.map((subj) => {
            const subs = subj.chapters.flatMap((c) => c.subtopics);
            const avg =
              subs.length === 0
                ? 0
                : Math.round(subs.reduce((a, st) => a + (progress[st.id]?.masteryPercent ?? 0), 0) / subs.length);
            return (
              <div key={subj.id} className="rounded-2xl bg-[#FFFBEB] border border-[#78350F]/30 p-3">
                <div className="flex justify-between items-center text-sm font-bold mb-1">
                  <span>
                    {subj.name}{' '}
                    {subj.verificationStatus === 'awaiting_educator_review' && (
                      <span className="text-[10px] bg-[#FEF3C7] border border-[#F59E0B] px-2 py-0.5 rounded-full ml-1">
                        Semakan Guru Disyorkan
                      </span>
                    )}
                  </span>
                  <span className="text-[#006947]">{avg}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#FFDBCC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0D9668]" style={{ width: `${avg}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
