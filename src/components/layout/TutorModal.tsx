import React, { useState } from 'react';
import { SpeakButton } from '@/components/common/SpeakButton';
import { apiClient } from '@/services/apiClient';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';

interface TutorModalProps {
  open: boolean;
  onClose: () => void;
  subjectId: string;
  subjectName: string;
  subtopicTitle: string;
}

export const TutorModal: React.FC<TutorModalProps> = ({ open, onClose, subjectId, subjectName, subtopicTitle }) => {
  const learnerName = useGameStore((s) => s.bundle?.learner.name) || 'Wira';
  const companionId = useGameStore((s) => s.bundle?.learner.companionId);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const ask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    try {
      const res = await apiClient.askTutor({
        learnerName,
        subjectId,
        subjectName,
        subtopicTitle,
        question: question.trim(),
      });
      setAnswer(res.answer);
      setTip(res.hintTip);
      audioEngine.speak(res.answer, { subjectId, companionId });
    } catch {
      setAnswer('Cuba baca semula langkah pelajaran atau tekan Dengar Suara untuk bantuan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#351000]/60 flex items-center justify-center p-4">
      <div className="panel-chengal rounded-3xl max-w-lg w-full p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-xl text-[#006947]">Tanya Sahabat Pintar</h3>
          <button type="button" onClick={onClose} className="btn-toy btn-toy-crimson min-h-10 px-3 rounded-xl font-bold">✕</button>
        </div>
        <p className="text-xs font-semibold text-[#78350F]">
          Topik aktif: {subjectName} — {subtopicTitle}
        </p>
        <form onSubmit={ask} className="space-y-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Tanya soalan ringkas tentang topik ini..."
            className="w-full rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 font-semibold"
          />
          <button type="submit" disabled={loading} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold">
            {loading ? 'Sedang berfikir...' : 'Tanya Sekarang'}
          </button>
        </form>
        {answer && (
          <div className="rounded-2xl bg-[#ECFDF5] border-2 border-[#0D9668] p-4 space-y-2 text-sm">
            <p className="font-semibold text-[#002113]">{answer}</p>
            {tip && <p className="text-xs font-bold text-[#006947]">💡 {tip}</p>}
            <SpeakButton
              text={`${answer} ${tip || ''}`}
              label="Dengar Jawapan"
              stopLabel="Henti"
              options={{ subjectId, companionId }}
              className="btn-toy btn-toy-turquoise px-3 min-h-9 rounded-xl text-xs font-bold flex items-center gap-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};
