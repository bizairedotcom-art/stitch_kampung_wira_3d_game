import React, { useRef, useState } from 'react';
import { audioEngine } from '@/services/audioEngine';
import type { InteractiveEngineProps } from './MathEngines';

export const LetterTracingGame: React.FC<InteractiveEngineProps> = ({ config, onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letters = (config.letters as string[]) || ['A', 'B', 'C'];
  const [idx, setIdx] = useState(0);
  const [strokes, setStrokes] = useState(0);
  const isDrawing = useRef(false);

  const drawGuide = (ctx: CanvasRenderingContext2D, char: string) => {
    ctx.clearRect(0, 0, 260, 180);
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, 260, 180);
    ctx.fillStyle = 'rgba(120, 53, 15, 0.16)';
    ctx.font = 'bold 110px Rubik, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, 130, 95);
  };

  const handleStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(((e.clientX - rect.left) / rect.width) * 260, ((e.clientY - rect.top) / rect.height) * 180);
    setStrokes((s) => s + 1);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.strokeStyle = '#0D9668';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineTo(((e.clientX - rect.left) / rect.width) * 260, ((e.clientY - rect.top) / rect.height) * 180);
    ctx.stroke();
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-3 text-center">
      <h3 className="font-display font-bold text-lg">Surih Huruf ({idx + 1}/{letters.length}): {letters[idx]}</h3>
      <canvas
        ref={(el) => {
          canvasRef.current = el;
          if (el && strokes === 0) {
            const ctx = el.getContext('2d');
            if (ctx) drawGuide(ctx, letters[idx]);
          }
        }}
        width={260}
        height={180}
        onPointerDown={handleStart}
        onPointerMove={handleMove}
        onPointerUp={() => { isDrawing.current = false; }}
        onPointerLeave={() => { isDrawing.current = false; }}
        className="mx-auto rounded-2xl border-4 border-[#78350F] touch-none cursor-crosshair bg-[#FFFBEB]"
      />
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => {
            setStrokes(0);
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) drawGuide(ctx, letters[idx]);
          }}
          className="btn-toy btn-toy-wood px-4 rounded-xl font-bold"
        >
          Padam
        </button>
        <button
          type="button"
          onClick={() => {
            audioEngine.playSfx('success');
            if (idx + 1 < letters.length) {
              setIdx((i) => i + 1);
              setStrokes(0);
            } else {
              onSuccess(100, 'Tulisan huruf kemas dan tepat!');
            }
          }}
          className="btn-toy btn-toy-emerald px-5 rounded-xl font-bold"
        >
          {idx + 1 < letters.length ? 'Huruf Seterusnya' : 'Selesai Menulis!'}
        </button>
      </div>
    </div>
  );
};

export const SyllableBuilder: React.FC<InteractiveEngineProps> = ({ config, onSuccess }) => {
  const words = (config.words as { word: string; syllables: string[]; emoji: string }[]) || [
    { word: 'buku', syllables: ['bu', 'ku'], emoji: '📖' },
    { word: 'bola', syllables: ['bo', 'la'], emoji: '⚽' },
  ];
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const cur = words[idx];
  const pool = [...cur.syllables, 'ma', 'ti'].sort();

  const addSyl = (s: string) => {
    audioEngine.speak(s);
    const next = [...picked, s];
    setPicked(next);
    if (next.join('') === cur.word) {
      audioEngine.playSfx('success');
      audioEngine.speak(cur.word);
      setTimeout(() => {
        if (idx + 1 < words.length) {
          setIdx((i) => i + 1);
          setPicked([]);
        } else {
          onSuccess(100, 'Semua perkataan suku kata berjaya dibina!');
        }
      }, 450);
    } else if (next.length >= cur.syllables.length) {
      audioEngine.playSfx('nudge');
      setTimeout(() => setPicked([]), 450);
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4 text-center">
      <h3 className="font-display font-bold text-lg">Cantum Suku Kata ({idx + 1}/{words.length})</h3>
      <div className="text-5xl">{cur.emoji}</div>
      <div className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F] py-3 font-display text-2xl font-black tracking-wider">
        {picked.join(' + ') || '___ + ___'}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {pool.map((s, i) => (
          <button key={`${s}-${i}`} type="button" onClick={() => addSyl(s)} className="btn-toy btn-toy-gold px-5 rounded-2xl font-display font-bold text-lg">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export const WordBuilder: React.FC<InteractiveEngineProps> = ({ config, onSuccess }) => {
  const words = (config.words as { word: string; hint: string; emoji: string }[]) || [
    { word: 'jam', hint: 'Alat melihat masa', emoji: '🕒' },
    { word: 'kedai', hint: 'Tempat beli barang', emoji: '🏪' },
  ];
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const cur = words[idx];

  const check = () => {
    if (typed.trim().toLowerCase() === cur.word.toLowerCase()) {
      audioEngine.playSfx('success');
      if (idx + 1 < words.length) {
        setIdx((i) => i + 1);
        setTyped('');
      } else {
        onSuccess(100, 'Ejaan KVK & diftong tepat!');
      }
    } else {
      audioEngine.playSfx('nudge');
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4 text-center">
      <h3 className="font-display font-bold text-lg">Eja Perkataan ({idx + 1}/{words.length})</h3>
      <div className="text-5xl">{cur.emoji}</div>
      <p className="text-sm font-semibold text-[#78350F]">Petunjuk: {cur.hint}</p>
      <input
        type="text"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder="Taip perkataan..."
        className="w-full rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 text-center font-display text-xl font-bold"
      />
      <button type="button" onClick={check} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold">
        Semak Ejaan
      </button>
    </div>
  );
};

export const SentenceBuilder: React.FC<InteractiveEngineProps> = ({ config, onSuccess }) => {
  const sentences = (config.sentences as string[][]) || [
    ['Adik', 'makan', 'nasi', 'lemak.'],
    ['Ibu', 'menyiram', 'pokok', 'bunga.'],
  ];
  const [idx, setIdx] = useState(0);
  const target = sentences[idx];
  const [chosen, setChosen] = useState<string[]>([]);
  const shuffled = [...target].sort();

  const pickWord = (w: string) => {
    audioEngine.speak(w);
    const next = [...chosen, w];
    setChosen(next);
    if (next.length === target.length) {
      if (next.join(' ') === target.join(' ')) {
        audioEngine.playSfx('success');
        if (idx + 1 < sentences.length) {
          setIdx((i) => i + 1);
          setChosen([]);
        } else {
          onSuccess(100, 'Ayat lengkap berjaya disusun!');
        }
      } else {
        audioEngine.playSfx('nudge');
        setTimeout(() => setChosen([]), 450);
      }
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Susun Perkataan Menjadi Ayat ({idx + 1}/{sentences.length})</h3>
      <div className="min-h-16 rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F] p-3 font-display font-bold text-lg">
        {chosen.join(' ') || 'Ketik perkataan mengikut urutan...'}
      </div>
      <div className="flex flex-wrap gap-2">
        {shuffled.map((w, i) => (
          <button key={`${w}-${i}`} type="button" onClick={() => pickWord(w)} className="btn-toy btn-toy-gold px-4 rounded-xl font-bold">
            {w}
          </button>
        ))}
        <button type="button" onClick={() => setChosen([])} className="btn-toy btn-toy-wood px-4 rounded-xl font-bold">Ulang</button>
      </div>
    </div>
  );
};

export const PictureMatchingGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const pairs = [
    { label: 'Buku', match: '📖' },
    { label: 'Bintang', match: '⭐' },
    { label: 'Bunga Raya', match: '🌺' },
  ];
  const [idx, setIdx] = useState(0);
  const cur = pairs[idx];
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4 text-center">
      <h3 className="font-display font-bold text-lg">Padankan Kata & Gambar</h3>
      <div className="rounded-2xl bg-[#FEF3C7] border-2 border-[#78350F] p-4 font-display text-2xl font-black">{cur.label}</div>
      <div className="grid grid-cols-3 gap-3">
        {pairs.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              if (p.match === cur.match) {
                audioEngine.playSfx('success');
                if (idx + 1 < pairs.length) setIdx((i) => i + 1);
                else onSuccess(100, 'Semua padanan kata tepat!');
              } else {
                audioEngine.playSfx('nudge');
              }
            }}
            className="btn-toy btn-toy-wood rounded-2xl text-4xl py-4"
          >
            {p.match}
          </button>
        ))}
      </div>
    </div>
  );
};

export const ListeningGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const prompts = [
    { audio: 'Pencil', options: ['✏️ Pencil', '🎒 Bag', '📏 Ruler'], ans: '✏️ Pencil' },
    { audio: 'Blue Boat', options: ['⛵ Blue Boat', '🍎 Red Apple', '🐱 Cute Cat'], ans: '⛵ Blue Boat' },
  ];
  const [idx, setIdx] = useState(0);
  const cur = prompts[idx];
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4 text-center">
      <h3 className="font-display font-bold text-lg">Dengar & Pilih ({idx + 1}/{prompts.length})</h3>
      <button type="button" onClick={() => audioEngine.speak(cur.audio, 'en-GB')} className="btn-toy btn-toy-turquoise px-6 rounded-2xl font-display font-bold inline-flex items-center gap-2">
        🔊 Dengar Sebutan
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {cur.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              if (opt === cur.ans) {
                audioEngine.playSfx('success');
                if (idx + 1 < prompts.length) setIdx((i) => i + 1);
                else onSuccess(100, 'Pendengaran & sebutan hebat!');
              } else {
                audioEngine.playSfx('nudge');
              }
            }}
            className="btn-toy btn-toy-gold rounded-2xl font-display font-bold"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export const StorySequenceGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const events = ['1. Bangun pagi & gosok gigi', '2. Bersarapan & ke sekolah', '3. Membaca buku di Pustaka'];
  const [step, setStep] = useState(0);
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-3">
      <h3 className="font-display font-bold text-lg">Susun Turutan Cerita</h3>
      <p className="text-sm text-[#78350F]">Klik mengikut urutan 1 ➔ 2 ➔ 3:</p>
      {events.map((ev, i) => (
        <button
          key={ev}
          type="button"
          onClick={() => {
            if (i === step) {
              audioEngine.playSfx('success');
              if (step + 1 === events.length) onSuccess(100, 'Turutan cerita tersusun kemas!');
              else setStep((s) => s + 1);
            } else {
              audioEngine.playSfx('nudge');
            }
          }}
          className={`w-full text-left btn-toy rounded-2xl px-4 font-bold ${i < step ? 'btn-toy-emerald' : 'btn-toy-wood'}`}
        >
          {ev}
        </button>
      ))}
    </div>
  );
};

export const DialogueAdventure: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [step, setStep] = useState(0);
  const dialog = [
    { speaker: 'Enggang', line: 'Hello friend! Welcome to Adventure Bay! How are you today?', replies: ['I am fine, thank you!', 'Good night!'], correct: 'I am fine, thank you!' },
    { speaker: 'Enggang', line: 'Look! I have a red kite and a blue boat. What do you like?', replies: ['I like the blue boat!', 'It is a pencil!'], correct: 'I like the blue boat!' },
  ];
  const cur = dialog[step];
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <div className="rounded-2xl bg-[#E0F7FA] border-2 border-[#006577] p-4">
        <div className="font-display font-bold text-[#006577] mb-1">🦜 {cur.speaker} berkata:</div>
        <p className="font-semibold text-lg">“{cur.line}”</p>
      </div>
      <div className="space-y-2">
        {cur.replies.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              if (r === cur.correct) {
                audioEngine.playSfx('success');
                if (step + 1 < dialog.length) setStep((s) => s + 1);
                else onSuccess(100, 'Dialog Adventure Bay selesai!');
              } else {
                audioEngine.playSfx('nudge');
              }
            }}
            className="w-full text-left btn-toy btn-toy-gold rounded-2xl px-4 font-display font-bold"
          >
            💬 {r}
          </button>
        ))}
      </div>
    </div>
  );
};
