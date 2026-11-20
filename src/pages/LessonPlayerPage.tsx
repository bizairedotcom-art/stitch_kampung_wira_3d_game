import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SpeakButton } from '@/components/common/SpeakButton';
import { TutorModal } from '@/components/layout/TutorModal';
import { getSubtopicById, getSubjectById } from '@/curriculum';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const LessonPlayerPage: React.FC = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const completeActivity = useGameStore((s) => s.completeActivity);
  const companionId = useGameStore((s) => s.bundle?.learner.companionId);
  const autoSpeak = useSettingsStore((s) => s.autoSpeak);
  const subtopic = getSubtopicById(lessonId);
  const subject = getSubjectById(subtopic?.subjectId);
  const [stepIdx, setStepIdx] = useState(0);
  const [demoResult, setDemoResult] = useState('');
  const [tutorOpen, setTutorOpen] = useState(false);

  const stepAudio = subtopic?.lessonSteps[stepIdx]?.audioText;
  useEffect(() => {
    if (autoSpeak && stepAudio && subject) {
      audioEngine.speak(stepAudio, { subjectId: subject.id, companionId, chime: false });
    }
    return () => {
      audioEngine.stopSpeech();
    };
  }, [autoSpeak, stepAudio, subject, companionId]);

  if (!subtopic || !subject) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl">Pelajaran tidak ditemui</h1>
        <Link to="/subjects" className="btn-toy btn-toy-emerald px-6 rounded-2xl inline-flex items-center font-bold">Kembali</Link>
      </div>
    );
  }

  const step = subtopic.lessonSteps[stepIdx] || subtopic.lessonSteps[0];

  const finishLesson = async () => {
    await completeActivity(
      {
        transactionId: `lesson-${subtopic.id}-${Date.now()}`,
        subtopicId: subtopic.id,
        subjectId: subtopic.subjectId,
        chapterId: subtopic.chapterId,
        engineId: subtopic.engineId,
        mode: 'lesson',
        score: 1,
        maxScore: 1,
        accuracy: 100,
        starsEarned: 1,
        coinsEarned: 15,
        xpEarned: 20,
        weakAreas: [],
        durationSeconds: 45,
      },
      `Nota Selesai: ${subtopic.title}`,
    );
    audioEngine.playSfx('success');
    navigate(`/play/${subtopic.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-4">
      <div className="panel-chengal rounded-3xl p-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-[#006947]">{subject.name} • {subtopic.code}</span>
          <h1 className="font-display font-black text-xl sm:text-2xl text-[#351000]">{subtopic.title}</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setTutorOpen(true)} className="btn-toy btn-toy-turquoise px-3 min-h-10 rounded-xl text-xs font-bold">
            🤖 Tanya Sahabat
          </button>
          <Link to={`/subjects/${subject.id}`} className="btn-toy btn-toy-wood px-3 min-h-10 rounded-xl text-xs font-bold flex items-center">
            ← Balik
          </Link>
        </div>
      </div>

      {/* Lesson Card */}
      <div className="panel-parchment rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-[#FEA619] font-display font-bold text-xs">
            Langkah {stepIdx + 1} / {subtopic.lessonSteps.length}
          </span>
          <SpeakButton
            text={step.audioText}
            label="Dengar Penerangan"
            stopLabel="Henti Bacaan"
            options={{ subjectId: subject.id, companionId }}
          />
        </div>

        <h2 className="font-display font-black text-xl text-[#351000]">{step.title}</h2>
        <p className="text-base font-semibold leading-relaxed text-[#351000]">{step.body}</p>

        {step.scriptSample && (
          <div className="rounded-2xl bg-white border-2 border-[#78350F] p-4 text-center text-3xl font-bold" dir={step.rtl ? 'rtl' : 'ltr'}>
            {step.scriptSample}
          </div>
        )}
        {step.exampleVisual && (
          <div className="rounded-2xl bg-[#FFF8F6] border-2 border-[#0D9668]/40 p-4 text-center font-display font-bold text-lg">
            {step.exampleVisual}
          </div>
        )}
      </div>

      {/* Interactive Demo Sandbox */}
      <div className="panel-chengal rounded-3xl p-5 space-y-3">
        <h3 className="font-display font-bold text-lg text-[#006947]">✨ {subtopic.interactiveDemo.title}</h3>
        <p className="text-sm text-[#78350F]">{subtopic.interactiveDemo.prompt}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {subtopic.interactiveDemo.items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                audioEngine.speak(`${item.label}. ${item.value}`, {
                  subjectId: subject.id,
                  companionId,
                  chime: false,
                });
                setDemoResult(`${item.emoji || ''} ${item.label}: ${item.value}`);
              }}
              className="btn-toy btn-toy-gold rounded-2xl p-3 text-left"
            >
              <div className="font-display font-bold text-sm">{item.emoji} {item.label}</div>
            </button>
          ))}
        </div>
        {demoResult && (
          <div className="rounded-2xl bg-[#ECFDF5] border-2 border-[#0D9668] p-3 font-bold text-sm text-[#00422b]">
            {demoResult}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {stepIdx + 1 < subtopic.lessonSteps.length ? (
          <button type="button" onClick={() => setStepIdx((i) => i + 1)} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold text-lg">
            Langkah Seterusnya ➔
          </button>
        ) : (
          <button type="button" onClick={() => void finishLesson()} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-black text-lg">
            Selesai Belajar & Teruskan ke Aktiviti 🎮
          </button>
        )}
      </div>

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
