import React, { useState } from 'react';
import { audioEngine } from '@/services/audioEngine';

export interface InteractiveEngineProps {
  onSuccess: (accuracy: number, summary: string) => void;
  config: Record<string, unknown>;
}

export const ObjectCounterGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const targets = [7, 12, 14];
  const [round, setRound] = useState(0);
  const [count, setCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const target = targets[round];

  const handleCheck = () => {
    if (count === target) {
      audioEngine.playSfx('success');
      if (round + 1 < targets.length) {
        setFeedback(`Tepat sekali! ${target} bintang! Seterusnya...`);
        setRound((r) => r + 1);
        setCount(0);
      } else {
        onSuccess(100, 'Berjaya membilang semua bintang Menara Nombor!');
      }
    } else {
      audioEngine.playSfx('nudge');
      setFeedback(`Sekarang ada ${count}. Cuba dapatkan tepat ${target} bintang!`);
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-extrabold text-lg">Kira Bintang Kristal (Pusingan {round + 1}/3)</span>
        <span className="px-3 py-1 rounded-full bg-[#FEA619] text-[#351000] font-display font-bold">Sasaran: {target}</span>
      </div>
      <div className="min-h-28 rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F]/30 p-4 flex flex-wrap gap-2 items-center justify-center">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 40}ms` }}>
            ⭐
          </span>
        ))}
        {count === 0 && <span className="text-sm text-[#78350F]">Tekan + Tambah Bintang untuk mula membilang!</span>}
      </div>
      <div className="text-center font-display text-3xl font-black text-[#006947]">{count}</div>
      {feedback && <p className="text-center font-semibold text-[#855300]">{feedback}</p>}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            setCount((c) => Math.max(0, c - 1));
          }}
          className="btn-toy btn-toy-wood rounded-2xl font-display font-bold"
        >
          - Tolak
        </button>
        <button
          type="button"
          onClick={() => {
            audioEngine.playSfx('coin');
            setCount((c) => Math.min(20, c + 1));
          }}
          className="btn-toy btn-toy-gold rounded-2xl font-display font-bold"
        >
          + Tambah
        </button>
        <button type="button" onClick={handleCheck} className="btn-toy btn-toy-emerald rounded-2xl font-display font-bold">
          Semak
        </button>
      </div>
    </div>
  );
};

export const PlaceValueGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const targets = [14, 26, 43];
  const [round, setRound] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [feedback, setFeedback] = useState('');
  const target = targets[round];
  const current = tens * 10 + ones;

  const check = () => {
    if (current === target) {
      audioEngine.playSfx('success');
      if (round + 1 < targets.length) {
        setFeedback(`Hebat! ${target} = ${Math.floor(target / 10)} Puluh ${target % 10} Sa!`);
        setRound((r) => r + 1);
        setTens(0);
        setOnes(0);
      } else {
        onSuccess(100, 'Pakar Abakus Manik Kristal!');
      }
    } else {
      audioEngine.playSfx('nudge');
      setFeedback(`Nilai semasa ialah ${current} (${tens} Puluh ${ones} Sa). Sasaran ialah ${target}.`);
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-extrabold text-lg">Abakus Manik Kristal</span>
        <span className="px-3 py-1 rounded-full bg-[#006577] text-white font-display font-bold">Bentuk Nombor: {target}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-[#FEF3C7] border-2 border-[#78350F] p-3 text-center">
          <div className="font-display font-bold text-[#855300] mb-2">PULUH (×10)</div>
          <div className="h-24 flex flex-wrap justify-center items-center gap-1.5">
            {Array.from({ length: tens }).map((_, i) => (
              <span key={i} className="w-7 h-7 rounded-full bg-[#F59E0B] border-2 border-[#78350F] shadow inline-block" />
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setTens((v) => Math.max(0, v - 1))} className="btn-toy btn-toy-wood flex-1 rounded-xl font-bold">-</button>
            <button type="button" onClick={() => setTens((v) => Math.min(9, v + 1))} className="btn-toy btn-toy-gold flex-1 rounded-xl font-bold">+</button>
          </div>
        </div>
        <div className="rounded-2xl bg-[#ECFDF5] border-2 border-[#065F46] p-3 text-center">
          <div className="font-display font-bold text-[#006947] mb-2">SA (×1)</div>
          <div className="h-24 flex flex-wrap justify-center items-center gap-1.5">
            {Array.from({ length: ones }).map((_, i) => (
              <span key={i} className="w-6 h-6 rounded-full bg-[#10B981] border-2 border-[#065F46] shadow inline-block" />
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setOnes((v) => Math.max(0, v - 1))} className="btn-toy btn-toy-wood flex-1 rounded-xl font-bold">-</button>
            <button type="button" onClick={() => setOnes((v) => Math.min(9, v + 1))} className="btn-toy btn-toy-emerald flex-1 rounded-xl font-bold">+</button>
          </div>
        </div>
      </div>
      <div className="text-center font-display text-2xl font-black">Jumlah Abakus: {current}</div>
      {feedback && <p className="text-center text-sm font-semibold text-[#855300]">{feedback}</p>}
      <button type="button" onClick={check} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold text-lg">
        Sahkan Kunci Emas
      </button>
    </div>
  );
};

export const NumberLineGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [pos, setPos] = useState(0);
  const targets = [10, 16, 20];
  const [round, setRound] = useState(0);
  const target = targets[round];

  const handleCheck = () => {
    if (pos === target) {
      audioEngine.playSfx('success');
      if (round + 1 < targets.length) setRound((r) => r + 1);
      else onSuccess(100, 'Lompatan Garis Nombor Tepat!');
    } else {
      audioEngine.playSfx('nudge');
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-display font-bold text-lg">Garis Nombor Kancil</span>
        <span className="px-3 py-1 rounded-full bg-[#FEA619] font-display font-bold">Lompat ke: {target}</span>
      </div>
      <div className="overflow-x-auto py-3">
        <div className="flex items-center gap-1 min-w-max">
          {Array.from({ length: 21 }).map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                audioEngine.playSfx('click');
                setPos(n);
              }}
              className={`w-10 h-12 rounded-xl font-display font-bold border-2 transition ${
                pos === n ? 'bg-[#0D9668] text-white border-[#00422b] scale-110' : 'bg-white border-[#78350F]/40'
              }`}
            >
              {pos === n ? '🦊' : n}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setPos((p) => Math.max(0, p - 2))} className="btn-toy btn-toy-wood flex-1 rounded-2xl font-bold">-2 Langkah</button>
        <button type="button" onClick={() => setPos((p) => Math.min(20, p + 2))} className="btn-toy btn-toy-gold flex-1 rounded-2xl font-bold">+2 Langkah</button>
        <button type="button" onClick={handleCheck} className="btn-toy btn-toy-emerald flex-1 rounded-2xl font-bold">Semak ({pos})</button>
      </div>
    </div>
  );
};

export const ArithmeticGame: React.FC<InteractiveEngineProps> = ({ config, onSuccess }) => {
  const isSub = config.operation === 'subtract';
  const problems = isSub
    ? [
        { a: 12, b: 4, ans: 8 },
        { a: 18, b: 7, ans: 11 },
        { a: 25, b: 9, ans: 16 },
      ]
    : [
        { a: 6, b: 8, ans: 14 },
        { a: 12, b: 7, ans: 19 },
        { a: 15, b: 13, ans: 28 },
      ];
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [spinDeg, setSpinDeg] = useState(0);
  const [msg, setMsg] = useState('');
  const p = problems[idx];

  const submit = () => {
    if (Number(input) === p.ans) {
      audioEngine.playSfx('success');
      setSpinDeg((d) => d + 180);
      setInput('');
      setMsg('Gear Berputar! Jawapan tepat!');
      if (idx + 1 < problems.length) setIdx((i) => i + 1);
      else onSuccess(100, 'Semua Gear Enjin Nombor berjaya diaktifkan!');
    } else {
      audioEngine.playSfx('nudge');
      setMsg(`Cuba lagi! Kira ${p.a} ${isSub ? 'tolak' : 'tambah'} ${p.b}.`);
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-lg">Bilik Enjin Gear ({idx + 1}/{problems.length})</span>
        <span
          className="text-4xl inline-block transition-transform duration-700"
          style={{ transform: `rotate(${spinDeg}deg)` }}
        >
          ⚙️
        </span>
      </div>
      <div className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F] p-5 text-center font-display text-3xl font-black text-[#351000]">
        {p.a} {isSub ? '-' : '+'} {p.b} = ?
      </div>
      <div className="flex gap-3">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Taip jawapan..."
          className="flex-1 rounded-2xl border-2 border-[#78350F] bg-white px-4 py-3 font-display text-xl font-bold"
        />
        <button type="button" onClick={submit} className="btn-toy btn-toy-emerald px-6 rounded-2xl font-display font-bold">
          Putar Gear!
        </button>
      </div>
      {msg && <p className="text-center font-semibold text-[#855300]">{msg}</p>}
    </div>
  );
};

export const FractionSimulator: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [parts, setParts] = useState<2 | 4>(4);
  const [shaded, setShaded] = useState<boolean[]>([true, false, false, false]);
  const [goalIdx, setGoalIdx] = useState(0);
  const goals = [
    { label: '1/2 (Separuh)', parts: 2 as const, count: 1 },
    { label: '1/4 (Satu Perempat)', parts: 4 as const, count: 1 },
    { label: '3/4 (Tiga Perempat)', parts: 4 as const, count: 3 },
  ];
  const goal = goals[goalIdx];

  const activeCount = shaded.slice(0, parts).filter(Boolean).length;

  const verify = () => {
    if (parts === goal.parts && activeCount === goal.count) {
      audioEngine.playSfx('success');
      if (goalIdx + 1 < goals.length) setGoalIdx((g) => g + 1);
      else onSuccess(100, 'Hebat memotong pecahan kek lapis!');
    } else {
      audioEngine.playSfx('nudge');
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-display font-bold text-lg">Simulator Pecahan Kuih</span>
        <span className="px-3 py-1 rounded-full bg-[#FEA619] font-display font-bold">Bina: {goal.label}</span>
      </div>
      <div className="flex gap-2 justify-center">
        <button type="button" onClick={() => setParts(2)} className={`btn-toy px-4 rounded-xl font-bold ${parts === 2 ? 'btn-toy-emerald' : 'btn-toy-wood'}`}>2 Bahagian</button>
        <button type="button" onClick={() => setParts(4)} className={`btn-toy px-4 rounded-xl font-bold ${parts === 4 ? 'btn-toy-emerald' : 'btn-toy-wood'}`}>4 Bahagian</button>
      </div>
      <div className={`grid ${parts === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-2 max-w-xs mx-auto`}>
        {Array.from({ length: parts }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              setShaded((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
            }}
            className={`h-20 rounded-2xl border-2 font-display font-bold transition ${
              shaded[i] ? 'bg-[#E11D48] text-white border-[#7f1d1d]' : 'bg-[#FEF3C7] text-[#351000] border-[#78350F]'
            }`}
          >
            {shaded[i] ? 'Berlorek' : 'Kosong'}
          </button>
        ))}
      </div>
      <div className="text-center font-display text-xl font-bold">Pecahan Semasa: {activeCount}/{parts}</div>
      <button type="button" onClick={verify} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold">Semak Pecahan</button>
    </div>
  );
};

export const MoneyShopGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const items = [
    { name: 'Karipap Panas', priceSen: 60, emoji: '🥟' },
    { name: 'Buku Nota Wira', priceSen: 150, emoji: '📒' },
  ];
  const [idx, setIdx] = useState(0);
  const [paidSen, setPaidSen] = useState(0);
  const item = items[idx];

  const addMoney = (sen: number) => {
    audioEngine.playSfx('coin');
    setPaidSen((p) => p + sen);
  };

  const pay = () => {
    if (paidSen === item.priceSen) {
      audioEngine.playSfx('success');
      if (idx + 1 < items.length) {
        setIdx((i) => i + 1);
        setPaidSen(0);
      } else {
        onSuccess(100, 'Bijak mengira wang Malaysia!');
      }
    } else {
      audioEngine.playSfx('nudge');
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-lg">Kedai Kampung Wira</span>
        <span className="px-3 py-1 rounded-full bg-[#FEA619] font-display font-bold">
          {item.emoji} {item.name}: {item.priceSen >= 100 ? `RM${(item.priceSen / 100).toFixed(2)}` : `${item.priceSen} sen`}
        </span>
      </div>
      <div className="text-center font-display text-2xl font-black text-[#006947]">
        Jumlah Bayaran: {paidSen >= 100 ? `RM${(paidSen / 100).toFixed(2)}` : `${paidSen} sen`}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {[10, 20, 50, 100, 500].map((val) => (
          <button key={val} type="button" onClick={() => addMoney(val)} className="btn-toy btn-toy-gold rounded-xl font-display font-bold text-sm">
            {val >= 100 ? `RM${val / 100}` : `${val} sen`}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => setPaidSen(0)} className="btn-toy btn-toy-wood flex-1 rounded-2xl font-bold">Set Semula</button>
        <button type="button" onClick={pay} className="btn-toy btn-toy-emerald flex-1 rounded-2xl font-bold">Bayar Sekarang</button>
      </div>
    </div>
  );
};

export const AnalogClockGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [hour, setHour] = useState(3);
  const [half, setHalf] = useState(false);
  const targets = [
    { hour: 8, half: false, label: '8:00' },
    { hour: 4, half: true, label: '4:30' },
  ];
  const [idx, setIdx] = useState(0);
  const target = targets[idx];

  const hourAngle = ((hour % 12) + (half ? 0.5 : 0)) * 30;
  const minAngle = half ? 180 : 0;

  const verify = () => {
    if (hour === target.hour && half === target.half) {
      audioEngine.playSfx('success');
      if (idx + 1 < targets.length) setIdx((i) => i + 1);
      else onSuccess(100, 'Jam Angkasa menyala terang!');
    } else {
      audioEngine.playSfx('nudge');
    }
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-lg">Jam Angkasa Menara</span>
        <span className="px-3 py-1 rounded-full bg-[#006577] text-white font-display font-bold">Tetapkan: {target.label}</span>
      </div>
      <div className="flex justify-center">
        <svg viewBox="0 0 160 160" className="w-44 h-44 bg-[#FFFBEB] rounded-full border-4 border-[#78350F] shadow-lg">
          <circle cx="80" cy="80" r="68" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="4" />
          {[12, 3, 6, 9].map((num, i) => {
            const coords = [[80, 26], [134, 85], [80, 142], [26, 85]][i];
            return <text key={num} x={coords[0]} y={coords[1]} textAnchor="middle" className="font-bold fill-[#351000] text-xs">{num}</text>;
          })}
          <line x1="80" y1="80" x2={80 + Math.sin((hourAngle * Math.PI) / 180) * 34} y2={80 - Math.cos((hourAngle * Math.PI) / 180) * 34} stroke="#351000" strokeWidth="6" strokeLinecap="round" />
          <line x1="80" y1="80" x2={80 + Math.sin((minAngle * Math.PI) / 180) * 50} y2={80 - Math.cos((minAngle * Math.PI) / 180) * 50} stroke="#0D9668" strokeWidth="4" strokeLinecap="round" />
          <circle cx="80" cy="80" r="5" fill="#F59E0B" />
        </svg>
      </div>
      <div className="text-center font-display text-2xl font-black">{hour}:{half ? '30' : '00'}</div>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={() => setHour((h) => (h % 12) + 1)} className="btn-toy btn-toy-gold rounded-xl font-bold">+1 Jam</button>
        <button type="button" onClick={() => setHalf((v) => !v)} className="btn-toy btn-toy-wood rounded-xl font-bold">{half ? 'Tepat (:00)' : 'Setengah (:30)'}</button>
        <button type="button" onClick={verify} className="btn-toy btn-toy-emerald rounded-xl font-bold">Semak</button>
      </div>
    </div>
  );
};

export const MeasurementSimulator: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [clips, setClips] = useState(1);
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Ukur Panjang Pensel Dengan Klip Kertas</h3>
      <div className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F] p-4 space-y-2">
        <div className="text-3xl">✏️✏️✏️✏️✏️ (Panjang: 5 Klip)</div>
        <div className="flex gap-1 items-center text-2xl">
          {Array.from({ length: clips }).map((_, i) => <span key={i}>📎</span>)}
        </div>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => setClips((c) => Math.max(1, c - 1))} className="btn-toy btn-toy-wood flex-1 rounded-2xl font-bold">- Klip</button>
        <button type="button" onClick={() => setClips((c) => Math.min(8, c + 1))} className="btn-toy btn-toy-gold flex-1 rounded-2xl font-bold">+ Klip ({clips})</button>
        <button type="button" onClick={() => { if (clips === 5) { audioEngine.playSfx('success'); onSuccess(100, 'Tepat! Panjang pensel ialah 5 klip kertas!'); } else audioEngine.playSfx('nudge'); }} className="btn-toy btn-toy-emerald flex-1 rounded-2xl font-bold">Sahkan</button>
      </div>
    </div>
  );
};

export const Geometry3DGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const shapes = [
    { name: 'Kubus', emoji: '🎲', desc: '6 permukaan rata sama saiz' },
    { name: 'Sfera', emoji: '⚽', desc: '1 permukaan melengkung, boleh bergolek' },
    { name: 'Silinder', emoji: '🥫', desc: '2 bulatan rata & 1 melengkung' },
    { name: 'Kon', emoji: '🍦', desc: '1 tapak bulat & 1 bucu puncak' },
  ];
  const [selected, setSelected] = useState(shapes[0]);
  const [visited, setVisited] = useState<string[]>(['Kubus']);

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Peneroka Bentuk 3D</h3>
      <div className="grid grid-cols-4 gap-2">
        {shapes.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              setSelected(s);
              if (!visited.includes(s.name)) setVisited((v) => [...v, s.name]);
            }}
            className={`btn-toy rounded-2xl p-2 flex flex-col items-center ${selected.name === s.name ? 'btn-toy-emerald' : 'btn-toy-wood'}`}
          >
            <span className="text-2xl">{s.emoji}</span>
            <span className="text-xs font-bold">{s.name}</span>
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F] p-4 text-center">
        <div className="text-5xl mb-2">{selected.emoji}</div>
        <div className="font-display font-bold text-xl">{selected.name}</div>
        <p className="text-sm text-[#78350F]">{selected.desc}</p>
      </div>
      <button
        type="button"
        disabled={visited.length < 3}
        onClick={() => { audioEngine.playSfx('success'); onSuccess(100, 'Semua bentuk 3D berjaya diterokai!'); }}
        className="btn-toy btn-toy-gold w-full rounded-2xl font-display font-bold disabled:opacity-50"
      >
        {visited.length < 3 ? `Sentuh sekurang-kurangnya 3 bentuk (${visited.length}/3)` : 'Selesai Teroka Bentuk!'}
      </button>
    </div>
  );
};

export const PictographBuilder: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [counts, setCounts] = useState({ Mangga: 1, Rambutan: 2, Pisang: 0 });
  const total = counts.Mangga + counts.Rambutan + counts.Pisang;
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Bina Piktograf Buah Kampung (Tambah hingga 6 ikon)</h3>
      <div className="space-y-2">
        {(['Mangga', 'Rambutan', 'Pisang'] as const).map((fruit) => (
          <div key={fruit} className="flex items-center justify-between bg-[#FFFBEB] rounded-2xl p-3 border border-[#78350F]/30">
            <span className="font-display font-bold w-24">{fruit}</span>
            <div className="flex-1 text-xl">{'🥭'.repeat(fruit === 'Mangga' ? counts[fruit] : 0)}{'🍒'.repeat(fruit === 'Rambutan' ? counts[fruit] : 0)}{'🍌'.repeat(fruit === 'Pisang' ? counts[fruit] : 0)}</div>
            <button type="button" onClick={() => { audioEngine.playSfx('coin'); setCounts((c) => ({ ...c, [fruit]: Math.min(5, c[fruit] + 1) })); }} className="btn-toy btn-toy-gold px-3 rounded-xl font-bold">+</button>
          </div>
        ))}
      </div>
      <button type="button" disabled={total < 6} onClick={() => { audioEngine.playSfx('success'); onSuccess(100, 'Piktograf buah lengkap dibina!'); }} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold disabled:opacity-50">
        {total < 6 ? `Tambah ${6 - total} lagi ikon` : 'Simpan Piktograf!'}
      </button>
    </div>
  );
};
