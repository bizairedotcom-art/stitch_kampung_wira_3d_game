import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ThreeViewport } from '@/components/three/ThreeViewport';
import { getSubjectById } from '@/curriculum';
import { createSubjectInteriorScene } from '@/features/subjects/SubjectScene3D';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';

export const SubjectDetailPage: React.FC = () => {
  const { subjectId, chapterId } = useParams();
  const subject = getSubjectById(subjectId);
  const progress = useGameStore((s) => s.bundle?.progress) || {};

  useEffect(() => {
    if (subject) {
      audioEngine.setTrack(subject.audioTrackId);
    }
  }, [subject]);

  if (!subject) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center space-y-4">
        <h1 className="font-display font-black text-2xl">Subjek tidak ditemui</h1>
        <Link to="/subjects" className="btn-toy btn-toy-emerald px-6 rounded-2xl inline-flex items-center font-bold">
          Kembali ke Rumah Ilmu
        </Link>
      </div>
    );
  }

  const visibleChapters = chapterId ? subject.chapters.filter((c) => c.id === chapterId) : subject.chapters;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-5">
      {/* 3D Subject Interior Stage */}
      <section className="panel-chengal rounded-3xl overflow-hidden">
        <ThreeViewport
          heightClassName="h-56 sm:h-72"
          ariaLabel={`Bahagian Dalam ${subject.buildingName}`}
          deps={[subject.id]}
          setupScene={(ctx) => createSubjectInteriorScene(ctx, subject.id)}
          fallback2D={
            <img src={subject.previewImage} alt={subject.buildingName} className="w-full h-full object-cover" />
          }
        />
        <div className="p-4 sm:p-5 bg-[#FFFBEB] border-t-4 border-[#5C240A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-3 py-0.5 rounded-full text-white text-xs font-display font-bold"
                style={{ backgroundColor: subject.themeColor }}
              >
                {subject.buildingName}
              </span>
              {subject.verificationStatus === 'awaiting_educator_review' && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B] text-[#653E00] text-xs font-bold">
                  Menunggu Pengesahan Guru Pakar
                </span>
              )}
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#351000] mt-1">{subject.name}</h1>
            <p className="text-xs sm:text-sm text-[#78350F] mt-0.5">{subject.dskpDocumentNote}</p>
          </div>
          <Link to="/subjects" className="btn-toy btn-toy-wood px-4 rounded-2xl font-bold text-sm shrink-0">
            ← Semua Subjek
          </Link>
        </div>
      </section>

      {/* Chapters & Subtopics */}
      <div className="space-y-4">
        {visibleChapters.map((chap) => (
          <div key={chap.id} className="panel-chengal rounded-3xl p-4 sm:p-5 space-y-3">
            <div>
              <span className="text-xs font-bold text-[#006947] uppercase">{chap.dskpArea}</span>
              <h2 className="font-display font-black text-xl text-[#351000]">{chap.title}</h2>
              <p className="text-sm text-[#3d4a42]">{chap.summary}</p>
            </div>

            <div className="space-y-3">
              {chap.subtopics.map((st) => {
                const stProg = progress[st.id];
                const mastery = stProg?.masteryPercent ?? 0;
                return (
                  <div key={st.id} className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F]/40 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-display font-bold px-2 py-0.5 rounded-full bg-[#FFE2D6] text-[#78350F]">
                          {st.code}
                        </span>
                        <span className="text-xs font-bold text-[#006947]">
                          Penguasaan {mastery}% • {stProg?.starsEarned ?? 0}⭐
                        </span>
                      </div>
                      <h3 className="font-display font-extrabold text-lg text-[#351000]">{st.title}</h3>
                      <p className="text-xs sm:text-sm text-[#3d4a42]">{st.learningObjective}</p>
                      {st.verificationNote && (
                        <p className="text-[11px] font-semibold text-[#855300]">Nota: {st.verificationNote}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Link
                        to={`/learn/${st.id}`}
                        className="btn-toy btn-toy-wood px-4 min-h-11 rounded-xl font-display font-bold text-sm flex items-center gap-1"
                      >
                        📖 Belajar
                      </Link>
                      <Link
                        to={`/play/${st.id}`}
                        className="btn-toy btn-toy-gold px-4 min-h-11 rounded-xl font-display font-bold text-sm flex items-center gap-1"
                      >
                        🎮 Main Aktiviti
                      </Link>
                      <Link
                        to={`/assessment/${st.id}`}
                        className="btn-toy btn-toy-emerald px-4 min-h-11 rounded-xl font-display font-bold text-sm flex items-center gap-1"
                      >
                        🏆 Uji ({st.assessments.length})
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
