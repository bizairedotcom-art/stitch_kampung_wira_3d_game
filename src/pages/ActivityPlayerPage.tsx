import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TutorModal } from '@/components/layout/TutorModal';
import { getSubtopicById, getSubjectById } from '@/curriculum';
import { EngineHost } from '@/engines/EngineHost';
import { useGameStore } from '@/stores/useGameStore';

export const ActivityPlayerPage: React.FC = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const completeActivity = useGameStore((s) => s.completeActivity);
  const subtopic = getSubtopicById(activityId);
  const subject = getSubjectById(subtopic?.subjectId);
  const [completedMsg, setCompletedMsg] = useState('');
  const [tutorOpen, setTutorOpen] = useState(false);

  if (!subtopic || !subject) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl">Aktiviti tidak ditemui</h1>
        <Link to="/subjects" className="btn-toy btn-toy-emerald px-6 rounded-2xl inline-flex items-center font-bold">Kembali</Link>
      </div>
    );
  }

  const handleEngineSuccess = async (accuracy: number, summary: string) => {
    setCompletedMsg(summary);
    await completeActivity(
      {
        transactionId: `play-${subtopic.id}-${Date.now()}`,
        subtopicId: subtopic.id,
        subjectId: subtopic.subjectId,
        chapterId: subtopic.chapterId,
        engineId: subtopic.engineId,
        mode: 'practice',
        score: accuracy,
        maxScore: 100,
        accuracy,
        starsEarned: accuracy >= 80 ? 2 : 1,
        coinsEarned: subtopic.rewardCoins,
        xpEarned: subtopic.rewardXp,
        weakAreas: [],
        durationSeconds: 60,
      },
      summary,
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-4">
      <div className="panel-chengal rounded-3xl p-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-[#006947]">{subject.buildingName} • Latihan Interaktif</span>
          <h1 className="font-display font-black text-xl text-[#351000]">{subtopic.title}</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setTutorOpen(true)} className="btn-toy btn-toy-turquoise px-3 min-h-10 rounded-xl text-xs font-bold">
            🤖 Bantuan
          </button>
          <Link to={`/subjects/${subject.id}`} className="btn-toy btn-toy-wood px-3 min-h-10 rounded-xl text-xs font-bold flex items-center">
            ← Balik
          </Link>
        </div>
      </div>

      <EngineHost engineId={subtopic.engineId} config={subtopic.engineConfig} onSuccess={handleEngineSuccess} />

      {completedMsg && (
        <div className="panel-chengal rounded-3xl p-4 bg-[#ECFDF5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display font-bold text-[#006947]">🎉 {completedMsg}</p>
          <button
            type="button"
            onClick={() => navigate(`/assessment/${subtopic.id}`)}
            className="btn-toy btn-toy-gold px-5 rounded-2xl font-display font-bold"
          >
            Ambil Penilaian ({subtopic.assessments.length} Soalan) 🏆
          </button>
        </div>
      )}

      <TutorModal
        open={tutorOpen}
        onClose={() => setTutorOpen(false)}
        subjectId={subject.id}
        subjectName={subject.name}
        subtopicTitle={subtopic.title}
      />
    </div>
  );
};
