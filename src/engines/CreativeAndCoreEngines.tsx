import React, { useEffect, useRef, useState } from 'react';
import { SpeakButton } from '@/components/common/SpeakButton';
import { audioEngine } from '@/services/audioEngine';
import { useGameStore } from '@/stores/useGameStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { AssessmentItem } from '@/types/curriculum';
import type { InteractiveEngineProps } from './MathEngines';

export const MoralDecisionGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const scenarios = [
    { q: 'Kawan terlupa membawa pensel ke sekolah. Apakah tindakan mulia?', opts: ['Berkongsi pensel dengannya', 'Mentertawakannya'], ans: 'Berkongsi pensel dengannya' },
    { q: 'Kolam Teratai dipenuhi daun kering. Apakah tindakan kita?', opts: ['Bergotong-royong membersihkan kolam', 'Membaling lebih banyak sampah'], ans: 'Bergotong-royong membersihkan kolam' },
  ];
  const [idx, setIdx] = useState(0);
  const cur = scenarios[idx];
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Pilihan Budi Taman Harmoni</h3>
      <div className="rounded-2xl bg-[#FEF3C7] border-2 border-[#78350F] p-4 font-semibold">{cur.q}</div>
      <div className="space-y-2">
        {cur.opts.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => {
              if (o === cur.ans) {
                audioEngine.playSfx('success');
                if (idx + 1 < scenarios.length) setIdx((i) => i + 1);
                else onSuccess(100, 'Tahniah! Keputusan murni dan bertanggungjawab!');
              } else {
                audioEngine.playSfx('nudge');
              }
            }}
            className="w-full text-left btn-toy btn-toy-emerald rounded-2xl px-4 font-bold"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
};

export const BatikPatternDesigner: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const saveArtwork = useGameStore((s) => s.saveArtwork);
  const [color, setColor] = useState('#E11D48');
  const [title, setTitle] = useState('Batik Bunga Raya Saya');
  const [savedMsg, setSavedMsg] = useState('');
  const drawing = useRef(false);

  const colors = ['#E11D48', '#F59E0B', '#0D9668', '#06B6D4', '#7C3AED', '#351000'];

  const initMotif = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, 320, 220);
    // Faint wax canting Bunga Raya outline
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.ellipse(160 + Math.cos(a) * 42, 110 + Math.sin(a) * 42, 28, 18, a, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(160, 110, 14, 0, Math.PI * 2);
    ctx.stroke();
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const r = canvasRef.current.getBoundingClientRect();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(((e.clientX - r.left) / r.width) * 320, ((e.clientY - r.top) / r.height) * 220, 9, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleSave = async () => {
    const dataUrl = canvasRef.current?.toDataURL('image/png') || '';
    if (dataUrl) {
      await saveArtwork({ title, motif: 'Bunga Raya', dataUrl });
      audioEngine.playSfx('kompang');
      setSavedMsg('Karya batik disimpan ke Galeri Batik Pelangi!');
      onSuccess(100, 'Karya Batik Bunga Raya dipamerkan di Galeri!');
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-3">
      <h3 className="font-display font-bold text-lg">Kanvas Canting Batik Bunga Raya</h3>
      <div className="flex flex-wrap gap-2 items-center">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            aria-label={`Warna ${c}`}
            className={`w-10 h-10 rounded-full border-4 ${color === c ? 'border-[#351000] scale-110' : 'border-white'}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 min-w-40 rounded-xl border-2 border-[#78350F] px-3 py-2 text-sm font-bold bg-white"
        />
      </div>
      <canvas
        ref={(el) => {
          if (el && !canvasRef.current) {
            canvasRef.current = el;
            const ctx = el.getContext('2d');
            if (ctx) initMotif(ctx);
          }
        }}
        width={320}
        height={220}
        onPointerDown={(e) => { drawing.current = true; handleMove(e); }}
        onPointerMove={handleMove}
        onPointerUp={() => { drawing.current = false; }}
        onPointerLeave={() => { drawing.current = false; }}
        className="w-full max-w-sm mx-auto block rounded-2xl border-4 border-[#78350F] touch-none cursor-crosshair"
      />
      {savedMsg && <p className="text-center font-bold text-[#006947]">{savedMsg}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => { const ctx = canvasRef.current?.getContext('2d'); if (ctx) initMotif(ctx); }} className="btn-toy btn-toy-wood flex-1 rounded-2xl font-bold">Kanvas Baru</button>
        <button type="button" onClick={handleSave} className="btn-toy btn-toy-emerald flex-1 rounded-2xl font-bold">Simpan & Pamer!</button>
      </div>
    </div>
  );
};

export const DrawingStudio: React.FC<InteractiveEngineProps> = (props) => <BatikPatternDesigner {...props} />;

export const VirtualInstrument: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [played, setPlayed] = useState(0);
  const pads = [
    { name: 'Kompang 🥁', hz: 150 },
    { name: 'Angklung Do 🎋', hz: 261.63 },
    { name: 'Angklung Mi 🎋', hz: 329.63 },
    { name: 'Kerincing 🔺', hz: 880 },
  ];
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Alat Perkusi Nusantara</h3>
      <div className="grid grid-cols-2 gap-3">
        {pads.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => {
              audioEngine.playTone(p.hz, 0.35, 'triangle');
              setPlayed((c) => c + 1);
            }}
            className="btn-toy btn-toy-gold rounded-2xl py-5 font-display font-bold text-lg"
          >
            {p.name}
          </button>
        ))}
      </div>
      <button type="button" disabled={played < 4} onClick={() => { audioEngine.playSfx('success'); onSuccess(100, 'Persembahan perkusi merdu!'); }} className="btn-toy btn-toy-emerald w-full rounded-2xl font-bold disabled:opacity-50">
        {played < 4 ? `Mainkan sekurang-kurangnya 4 paluan (${played}/4)` : 'Tamat Persembahan!'}
      </button>
    </div>
  );
};

export const RhythmGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [beats, setBeats] = useState(0);
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4 text-center">
      <h3 className="font-display font-bold text-lg">Tepuk Detik 4/4</h3>
      <div className="flex justify-center gap-3">
        {[1, 2, 3, 4].map((b) => (
          <div key={b} className={`w-14 h-14 rounded-full flex items-center justify-center font-display font-black border-2 ${beats % 4 === b - 1 && beats > 0 ? 'bg-[#F59E0B] text-[#351000] scale-110' : 'bg-white border-[#78350F]'}`}>{b}</div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          audioEngine.playSfx('kompang');
          const next = beats + 1;
          setBeats(next);
          if (next >= 8) onSuccess(100, 'Detik irama konsisten!');
        }}
        className="btn-toy btn-toy-gold w-full rounded-2xl font-display font-black text-xl"
      >
        👏 TEPUK DETIK ({beats}/8)
      </button>
    </div>
  );
};

export const MovementDemonstrator: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const moves = ['Regangan Tangan Tinggi 🙌', 'Lompat Bintang ⭐', 'Imbangan Bangau 🦩'];
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-3">
      <h3 className="font-display font-bold text-lg">Lakukan Pergerakan Arena Wira</h3>
      {moves.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => {
            audioEngine.playSfx('success');
            if (!done.includes(m)) setDone((d) => [...d, m]);
          }}
          className={`w-full btn-toy rounded-2xl font-bold ${done.includes(m) ? 'btn-toy-emerald' : 'btn-toy-wood'}`}
        >
          {m} {done.includes(m) ? '✓ Selesai' : ''}
        </button>
      ))}
      <button type="button" disabled={done.length < 3} onClick={() => onSuccess(100, 'Senaman PJPK lengkap!')} className="btn-toy btn-toy-gold w-full rounded-2xl font-bold disabled:opacity-50">
        Selesai Senaman ({done.length}/3)
      </button>
    </div>
  );
};

export const SafetyScenarioGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => <MoralDecisionGame config={{}} onSuccess={onSuccess} />;

export const MemoryMatchingGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [matched, setMatched] = useState(0);
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4 text-center">
      <h3 className="font-display font-bold text-lg">Padanan Memori Kampung</h3>
      <button type="button" onClick={() => { const n = matched + 1; setMatched(n); audioEngine.playSfx('coin'); if (n >= 3) onSuccess(100, 'Memori cemerlang!'); }} className="btn-toy btn-toy-gold w-full rounded-2xl font-bold">
        Cari Pasangan Kad ({matched}/3)
      </button>
    </div>
  );
};

export const DragAndDropGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [leaves, setLeaves] = useState(['🍂 Daun 1', '🍁 Daun 2', '🍂 Daun 3', '🍁 Daun 4']);
  const [fed, setFed] = useState(false);

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4 text-center">
      <h3 className="font-display font-bold text-lg">Kolam Teratai: Tangkap Daun Kering & Beri Makan Ikan Koi</h3>
      <div className="rounded-2xl bg-[#ECFEFF] border-4 border-[#06B6D4] p-4 min-h-36 flex flex-wrap gap-3 items-center justify-center">
        {leaves.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              audioEngine.playSfx('water');
              setLeaves((prev) => prev.filter((x) => x !== l));
            }}
            className="btn-toy btn-toy-gold px-4 rounded-2xl font-bold animate-pulse"
          >
            {l}
          </button>
        ))}
        {leaves.length === 0 && (
          <div className="space-y-2">
            <div className="text-4xl">🪷 🐟 🐟 🪷</div>
            <p className="font-bold text-[#006947]">Kolam 100% Bersih! Sekarang beri makan ikan koi!</p>
            <button
              type="button"
              onClick={() => {
                audioEngine.playSfx('success');
                setFed(true);
                onSuccess(100, 'Trofi Kolam Kristal dibuka!');
              }}
              className="btn-toy btn-toy-emerald px-6 rounded-2xl font-display font-bold"
            >
              {fed ? 'Ikan Gembira!' : '🍤 Tabur Makanan Koi'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface AssessmentEngineProps {
  items: AssessmentItem[];
  subjectId?: string;
  onComplete: (result: { score: number; maxScore: number; accuracy: number; weakAreas: string[] }) => void;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({ items, subjectId, onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const companionId = useGameStore((s) => s.bundle?.learner.companionId);
  const autoSpeak = useSettingsStore((s) => s.autoSpeak);

  const item = items[idx];

  useEffect(() => {
    if (autoSpeak && item) {
      audioEngine.speak(item.audioText || item.prompt, { subjectId, companionId, chime: false });
    }
    return () => {
      audioEngine.stopSpeech();
    };
  }, [autoSpeak, item, subjectId, companionId]);

  if (!item) return null;

  const isCorrect = selected === item.correctAnswer;

  const handleCheck = () => {
    if (!selected || checked) return;
    setChecked(true);
    if (isCorrect) {
      audioEngine.playSfx('success');
      setCorrectCount((c) => c + 1);
    } else {
      audioEngine.playSfx('nudge');
      setWeakAreas((w) => [...w, item.prompt.slice(0, 48)]);
    }
  };

  const handleNext = () => {
    if (idx + 1 < items.length) {
      setIdx((i) => i + 1);
      setSelected(null);
      setShowHint(false);
      setChecked(false);
    } else {
      const finalScore = correctCount;
      const accuracy = Math.round((finalScore / items.length) * 100);
      onComplete({ score: finalScore, maxScore: items.length, accuracy, weakAreas });
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display font-bold text-sm px-3 py-1 rounded-full bg-[#FFE2D6] text-[#78350F]">
          Soalan {idx + 1} / {items.length}
        </span>
        <SpeakButton
          text={item.audioText || item.prompt}
          label="Dengar"
          stopLabel="Henti"
          options={{ subjectId, companionId }}
          className="btn-toy btn-toy-turquoise px-3 py-1 min-h-10 rounded-xl text-sm font-bold flex items-center gap-1"
        />
      </div>

      <div className="w-full bg-[#FFDBCC] rounded-full h-3 overflow-hidden">
        <div
          className="bg-[#0D9668] h-full transition-all duration-300"
          style={{ width: `${((idx + 1) / items.length) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F]/40 p-4 space-y-2">
        {item.visualEmoji && <div className="text-4xl text-center">{item.visualEmoji}</div>}
        {item.visualScript && (
          <div className="text-4xl font-bold text-center py-2" dir={item.rtl ? 'rtl' : 'ltr'}>
            {item.visualScript}
          </div>
        )}
        <p className="font-display font-bold text-lg sm:text-xl text-[#351000] leading-snug">{item.prompt}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(item.options || []).map((opt) => {
          const isPick = selected === opt;
          let cls = 'btn-toy-wood';
          if (checked) {
            if (opt === item.correctAnswer) cls = 'btn-toy-emerald';
            else if (isPick) cls = 'btn-toy-crimson';
          } else if (isPick) {
            cls = 'btn-toy-gold';
          }
          return (
            <button
              key={opt}
              type="button"
              disabled={checked}
              onClick={() => {
                audioEngine.playSfx('click');
                setSelected(opt);
              }}
              className={`btn-toy ${cls} rounded-2xl px-4 py-3 text-left font-display font-bold text-base`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowHint((h) => !h)}
          className="btn-toy btn-toy-wood px-4 min-h-11 rounded-xl text-sm font-bold"
        >
          💡 {showHint ? 'Tutup Petunjuk' : 'Petunjuk Sahabat'}
        </button>

        {!checked ? (
          <button
            type="button"
            disabled={!selected}
            onClick={handleCheck}
            className="btn-toy btn-toy-emerald px-6 rounded-2xl font-display font-bold disabled:opacity-50"
          >
            Semak Jawapan
          </button>
        ) : (
          <button type="button" onClick={handleNext} className="btn-toy btn-toy-gold px-6 rounded-2xl font-display font-bold">
            {idx + 1 < items.length ? 'Soalan Seterusnya ➔' : 'Lihat Keputusan 🏆'}
          </button>
        )}
      </div>

      {showHint && (
        <div className="rounded-2xl bg-[#FEF3C7] border-2 border-[#F59E0B] p-3 text-sm font-semibold text-[#653E00]">
          💡 Petunjuk: {item.hint}
        </div>
      )}

      {checked && (
        <div
          className={`rounded-2xl p-3 text-sm font-semibold border-2 ${
            isCorrect ? 'bg-[#ECFDF5] border-[#0D9668] text-[#00422b]' : 'bg-[#FFF1F2] border-[#E11D48] text-[#9f1239]'
          }`}
        >
          {isCorrect ? '🎉 Tepat sekali! ' : '💪 Hampir tepat! '}
          {item.explanation}
        </div>
      )}
    </div>
  );
};
