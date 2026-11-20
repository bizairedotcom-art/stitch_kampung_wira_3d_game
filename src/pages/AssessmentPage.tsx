import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSubtopicById, getSubjectById } from '@/curriculum';
import { AssessmentEngine } from '@/engines/CreativeAndCoreEngines';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';

export const AssessmentPage: React.FC = () => {
  const { assessmentId } = useParams();
  const completeActivity = useGameStore((s) => s.completeActivity);
  const subtopic = getSubtopicById(assessmentId);
  const subject = getSubjectById(subtopic?.subjectId);
  const [summary, setSummary] = useState<{ score: number; maxScore: number; accuracy: number } | null>(null);
  const [attemptKey, setAttemptKey] = useState(0);

  if (!subtopic || !subject) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl">Penilaian tidak ditemui</h1>
        <Link to="/subjects" className="btn-toy btn-toy-emerald px-6 rounded-2xl inline-flex items-center font-bold">Kembali</Link>
      </div>
    );
  }

  const handleComplete = async (res: { score: number; maxScore: number; accuracy: number; weakAreas: string[] }) => {
    setSummary({ score: res.score, maxScore: res.maxScore, accuracy: res.accuracy });
    const stars = res.accuracy >= 90 ? 3 : res.accuracy >= 70 ? 2 : res.accuracy >= 40 ? 1 : 0;
    const coins = Math.max(10, Math.round((res.accuracy / 100) * (subtopic.rewardCoins + 15)));
    await completeActivity(
      {
        transactionId: `assess-${subtopic.id}-${Date.now()}`,
        subtopicId: subtopic.id,
        subjectId: subtopic.subjectId,
        chapterId: subtopic.chapterId,
        engineId: 'assessment-engine',
        mode: 'assessment',
        score: res.score,
        maxScore: res.maxScore,
        accuracy: res.accuracy,
        starsEarned: stars,
        coinsEarned: coins,
        xpEarned: 40,
        weakAreas: res.weakAreas,
        durationSeconds: 120,
      },
      `Penilaian Tamat: ${res.score}/${res.maxScore} (${res.accuracy}%)`,
    );
    audioEngine.playSfx(res.accuracy >= 70 ? 'kompang' : 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-4">
      <div className="panel-chengal rounded-3xl p-4 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-[#006947]">{subject.name} • Penilaian Penguasaan</span>
          <h1 className="font-display font-black text-xl text-[#351000]">{subtopic.title}</h1>
        </div>
        <Link to={`/subjects/${subject.id}`} className="btn-toy btn-toy-wood px-3 min-h-10 rounded-xl text-xs font-bold flex items-center">
          ← Balik
        </Link>
      </div>

      {!summary ? (
        <AssessmentEngine
          key={attemptKey}
          items={subtopic.assessments}
          subjectId={subject.id}
          onComplete={(r) => void handleComplete(r)}
        />
      ) : (
        <div className="panel-chengal rounded-3xl p-6 text-center space-y-4">
          <div className="text-5xl">{summary.accuracy >= 70 ? '🏆🔑' : '💪📖'}</div>
          <h2 className="font-display font-black text-2xl text-[#006947]">
            Skor Kamu: {summary.score} / {summary.maxScore} ({summary.accuracy}%)
          </h2>
          <p className="text-sm font-semibold text-[#78350F]">
            {summary.accuracy >= 80
              ? 'Cemerlang! Kamu telah menguasai subtopik ini dan membuka kunci kejayaan!'
              : 'Bagus mencuba! Kamu boleh ulang penilaian atau ulang kaji nota untuk tingkatkan bintang.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => { setSummary(null); setAttemptKey((k) => k + 1); }}
              className="btn-toy btn-toy-gold px-5 rounded-2xl font-display font-bold"
            >
              🔄 Cuba Semula
            </button>
            <Link to={`/subjects/${subject.id}`} className="btn-toy btn-toy-emerald px-5 rounded-2xl font-display font-bold flex items-center">
              Kembali ke {subject.buildingName}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
