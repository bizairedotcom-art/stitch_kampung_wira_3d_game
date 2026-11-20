import React from 'react';
import { Link } from 'react-router-dom';
import { getAllSubtopics, getSubjectById } from '@/curriculum';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';

export const MissionsPage: React.FC = () => {
  const bundle = useGameStore((s) => s.bundle);
  const claimMission = useGameStore((s) => s.claimMission);

  if (!bundle) return null;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-5">
      <div className="panel-chengal rounded-3xl p-4 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl">Misi Harian & Pencapaian</h1>
          <p className="text-sm font-semibold text-[#78350F]">Lengkapkan misi untuk kumpul Syiling Emas & Bintang!</p>
        </div>
        <Link to="/achievements" className="btn-toy btn-toy-gold px-4 rounded-2xl font-bold text-sm">🏆 Lencana</Link>
      </div>

      <div className="space-y-3">
        {bundle.missions.map((m) => {
          const ready = m.currentCount >= m.targetCount && !m.claimed;
          return (
            <div key={m.id} className="panel-chengal rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFE2D6] text-[#78350F]">{m.type}</span>
                <h2 className="font-display font-bold text-lg mt-1">{m.title}</h2>
                <p className="text-sm text-[#3d4a42]">{m.description}</p>
                <div className="text-xs font-bold text-[#006947] mt-1">
                  Kemajuan: {m.currentCount}/{m.targetCount} • Ganjaran: +{m.rewardCoins}🪙 +{m.rewardStars}⭐
                </div>
              </div>
              {m.claimed ? (
                <span className="px-4 py-2 rounded-xl bg-[#ECFDF5] border border-[#0D9668] font-bold text-xs text-[#006947]">✓ Telah Dituntut</span>
              ) : ready ? (
                <button
                  type="button"
                  onClick={() => { audioEngine.playSfx('kompang'); void claimMission(m.id); }}
                  className="btn-toy btn-toy-gold px-5 rounded-2xl font-display font-bold"
                >
                  Tuntut Ganjaran!
                </button>
              ) : (
                <Link to={m.subjectId ? `/subjects/${m.subjectId}` : '/build'} className="btn-toy btn-toy-wood px-4 rounded-2xl font-bold text-sm">
                  Pergi ➔
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AchievementsPage: React.FC = () => {
  const achievements = useGameStore((s) => s.bundle?.achievements) || [];
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-4">
      <div className="panel-chengal rounded-3xl p-4 flex items-center justify-between">
        <h1 className="font-display font-black text-2xl">Dewan Trofi & Lencana Wira</h1>
        <Link to="/missions" className="btn-toy btn-toy-wood px-4 rounded-2xl font-bold text-sm">← Misi</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((a) => (
          <div key={a.id} className={`panel-chengal rounded-2xl p-4 flex items-center gap-3 ${a.unlockedAt ? '' : 'opacity-65'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${a.unlockedAt ? 'bg-[#FEA619] border-[#78350F]' : 'bg-[#E2E8F0] border-[#94A3B8]'}`}>
              <span className="material-symbols-outlined icon-filled text-3xl text-[#351000]">{a.icon}</span>
            </div>
            <div>
              <div className="font-display font-bold text-base">{a.title}</div>
              <p className="text-xs text-[#3d4a42]">{a.description}</p>
              <span className="text-[11px] font-bold text-[#006947]">{a.unlockedAt ? '✓ Dibuka!' : '🔒 Belum dibuka'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RevisionPage: React.FC = () => {
  const progress = useGameStore((s) => s.bundle?.progress) || {};
  const allSubtopics = getAllSubtopics();
  const dueOrWeak = allSubtopics.filter((st) => {
    const p = progress[st.id];
    if (!p) return true;
    return p.status === 'needs_revision' || p.masteryPercent < 80;
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-4">
      <div className="panel-chengal rounded-3xl p-4">
        <h1 className="font-display font-black text-2xl text-[#006947]">Zon Ulang Kaji Pintar</h1>
        <p className="text-sm font-semibold text-[#78350F]">
          Subtopik yang memerlukan latihan tambahan atau ulang kaji berjadual dipaparkan di sini.
        </p>
      </div>
      <div className="space-y-3">
        {dueOrWeak.slice(0, 12).map((st) => {
          const subj = getSubjectById(st.subjectId);
          const p = progress[st.id];
          return (
            <div key={st.id} className="panel-chengal rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#855300]">{subj?.name} • Penguasaan {p?.masteryPercent ?? 0}%</span>
                <h2 className="font-display font-bold text-lg">{st.title}</h2>
              </div>
              <div className="flex gap-2">
                <Link to={`/learn/${st.id}`} className="btn-toy btn-toy-wood px-4 rounded-xl font-bold text-sm">Nota</Link>
                <Link to={`/assessment/${st.id}`} className="btn-toy btn-toy-emerald px-4 rounded-xl font-bold text-sm">Ulang Kaji</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
