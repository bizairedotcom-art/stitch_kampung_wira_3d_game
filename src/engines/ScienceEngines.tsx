import React, { useState } from 'react';
import { audioEngine } from '@/services/audioEngine';
import type { InteractiveEngineProps } from './MathEngines';

export const ObjectClassificationGame: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const deck = [
    { name: 'Ikan Koi', emoji: '🐟', cat: 'hidup' },
    { name: 'Kerusi Kayu', emoji: '🪑', cat: 'bukan' },
    { name: 'Pokok Kelapa', emoji: '🌴', cat: 'hidup' },
    { name: 'Bola Sepak', emoji: '⚽', cat: 'bukan' },
  ];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const item = deck[idx];

  const pick = (choice: 'hidup' | 'bukan') => {
    const ok = choice === item.cat;
    audioEngine.playSfx(ok ? 'success' : 'nudge');
    const nextScore = ok ? score + 1 : score;
    setScore(nextScore);
    if (idx + 1 < deck.length) setIdx((i) => i + 1);
    else onSuccess(Math.round((nextScore / deck.length) * 100), `Pengelasan selesai: ${nextScore}/${deck.length} tepat!`);
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4 text-center">
      <h3 className="font-display font-bold text-lg">Kelaskan Objek ({idx + 1}/{deck.length})</h3>
      <div className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F] py-6">
        <div className="text-6xl mb-2">{item.emoji}</div>
        <div className="font-display text-2xl font-black">{item.name}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => pick('hidup')} className="btn-toy btn-toy-emerald rounded-2xl font-display font-bold">🌱 Benda Hidup</button>
        <button type="button" onClick={() => pick('bukan')} className="btn-toy btn-toy-gold rounded-2xl font-display font-bold">🪨 Bukan Hidup</button>
      </div>
    </div>
  );
};

export const MagnetSimulator: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const objects = [
    { name: 'Paku Besi', emoji: '🔩', magnetic: true },
    { name: 'Klip Kertas', emoji: '📎', magnetic: true },
    { name: 'Pemadam Getah', emoji: '🧽', magnetic: false },
    { name: 'Sudu Plastik', emoji: '🥄', magnetic: false },
  ];
  const [tested, setTested] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState('Pilih bahan untuk diuji dengan magnet!');

  const testObj = (o: (typeof objects)[number]) => {
    audioEngine.playSfx(o.magnetic ? 'success' : 'click');
    setLastResult(o.magnetic ? `🧲 ZAP! ${o.name} ditarik kuat oleh magnet!` : `💨 ${o.name} tidak ditarik magnet.`);
    if (!tested.includes(o.name)) setTested((t) => [...t, o.name]);
  };

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Makmal Magnet Utan</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {objects.map((o) => (
          <button key={o.name} type="button" onClick={() => testObj(o)} className="btn-toy btn-toy-wood rounded-2xl p-3 flex flex-col items-center">
            <span className="text-3xl">{o.emoji}</span>
            <span className="text-xs font-bold mt-1">{o.name}</span>
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-[#ECFDF5] border-2 border-[#0D9668] p-4 text-center font-semibold text-[#00422b]">
        {lastResult}
      </div>
      <button type="button" disabled={tested.length < 3} onClick={() => onSuccess(100, 'Eksperimen Magnet selesai!')} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold disabled:opacity-50">
        {tested.length < 3 ? `Uji sekurang-kurangnya 3 objek (${tested.length}/3)` : 'Catat Laporan Sains!'}
      </button>
    </div>
  );
};

export const AbsorptionSimulator: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const materials = [
    { name: 'Span', emoji: '🧽', absorbs: true },
    { name: 'Payung Plastik', emoji: '☂️', absorbs: false },
    { name: 'Tuala Kapas', emoji: '🧻', absorbs: true },
  ];
  const [tested, setTested] = useState<string[]>([]);
  const [msg, setMsg] = useState('Titiskan air untuk uji bahan menyerap atau kalis air.');

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Ujian Penyerapan Air</h3>
      <div className="grid grid-cols-3 gap-2">
        {materials.map((m) => (
          <button
            key={m.name}
            type="button"
            onClick={() => {
              audioEngine.playSfx('water');
              setMsg(m.absorbs ? `💧 ${m.name} MENYERAP air!` : `🛡️ ${m.name} KALIS air (titisan bergolek)!`);
              if (!tested.includes(m.name)) setTested((t) => [...t, m.name]);
            }}
            className="btn-toy btn-toy-turquoise rounded-2xl p-3 flex flex-col items-center"
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-xs font-bold mt-1">{m.name}</span>
          </button>
        ))}
      </div>
      <p className="text-center font-semibold text-[#006577]">{msg}</p>
      <button type="button" disabled={tested.length < 3} onClick={() => onSuccess(100, 'Semua bahan selesai diuji!')} className="btn-toy btn-toy-emerald w-full rounded-2xl font-bold disabled:opacity-50">
        Selesai Eksperimen Air
      </button>
    </div>
  );
};

export const PlantExplorer3D: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const parts = [
    { id: 'Bunga', emoji: '🌺', info: 'Bunga berkembang menjadi buah dan biji benih.' },
    { id: 'Daun', emoji: '🍃', info: 'Daun membuat makanan menggunakan cahaya matahari.' },
    { id: 'Batang', emoji: '🪵', info: 'Batang menyokong pokok dan mengangkut air.' },
    { id: 'Akar', emoji: '🌱', info: 'Akar menyerap air dan mencengkam tanah.' },
  ];
  const [seen, setSeen] = useState<string[]>(['Bunga']);
  const [cur, setCur] = useState(parts[0]);

  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Teroka Bahagian Pokok Bunga Raya</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {parts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              audioEngine.playSfx('click');
              setCur(p);
              if (!seen.includes(p.id)) setSeen((s) => [...s, p.id]);
            }}
            className={`btn-toy rounded-2xl p-2 font-bold ${cur.id === p.id ? 'btn-toy-emerald' : 'btn-toy-wood'}`}
          >
            {p.emoji} {p.id}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F] p-4 text-center">
        <div className="text-4xl mb-1">{cur.emoji}</div>
        <div className="font-display font-bold text-lg">{cur.id}</div>
        <p className="text-sm">{cur.info}</p>
      </div>
      <button type="button" disabled={seen.length < 4} onClick={() => onSuccess(100, '4 bahagian tumbuhan diterokai!')} className="btn-toy btn-toy-gold w-full rounded-2xl font-bold disabled:opacity-50">
        {seen.length < 4 ? `Sentuh semua 4 bahagian (${seen.length}/4)` : 'Tamat Penerokaan Tumbuhan!'}
      </button>
    </div>
  );
};

export const AnimalExplorer3D: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const animals = [
    { name: 'Burung Enggang', part: 'Paruh & Kepak untuk terbang', emoji: '🦜' },
    { name: 'Ikan Koi', part: 'Sirip & Sisik untuk berenang', emoji: '🐟' },
    { name: 'Kura-kura', part: 'Cangkerang keras pelindung diri', emoji: '🐢' },
  ];
  const [idx, setIdx] = useState(0);
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4 text-center">
      <h3 className="font-display font-bold text-lg">Bahagian Tubuh Haiwan Malaysia</h3>
      <div className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F] p-5">
        <div className="text-5xl mb-2">{animals[idx].emoji}</div>
        <div className="font-display font-bold text-xl">{animals[idx].name}</div>
        <p className="text-sm text-[#78350F]">{animals[idx].part}</p>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => setIdx((i) => (i + 1) % animals.length)} className="btn-toy btn-toy-wood flex-1 rounded-2xl font-bold">Haiwan Seterusnya</button>
        <button type="button" onClick={() => onSuccess(100, 'Ciri tubuh haiwan difahami!')} className="btn-toy btn-toy-emerald flex-1 rounded-2xl font-bold">Saya Faham!</button>
      </div>
    </div>
  );
};

export const BodyExplorer3D: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const senses = [
    { organ: 'Mata 👀', deria: 'Deria Penglihatan (Warna & Bentuk)' },
    { organ: 'Telinga 👂', deria: 'Deria Pendengaran (Bunyi)' },
    { organ: 'Hidung 👃', deria: 'Deria Bau (Wangi & Busuk)' },
    { organ: 'Lidah 👅', deria: 'Deria Rasa (Manis, Masam, Masin, Pahit)' },
    { organ: 'Kulit ✋', deria: 'Deria Sentuhan (Panas, Sejuk, Kasar, Licin)' },
  ];
  const [checked, setChecked] = useState<string[]>([]);
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-3">
      <h3 className="font-display font-bold text-lg">5 Deria Manusia</h3>
      <div className="space-y-2">
        {senses.map((s) => (
          <button
            key={s.organ}
            type="button"
            onClick={() => {
              audioEngine.speak(s.deria);
              if (!checked.includes(s.organ)) setChecked((c) => [...c, s.organ]);
            }}
            className={`w-full text-left rounded-2xl p-3 border-2 flex justify-between items-center ${checked.includes(s.organ) ? 'bg-[#ECFDF5] border-[#0D9668]' : 'bg-white border-[#78350F]/30'}`}
          >
            <span className="font-display font-bold">{s.organ}</span>
            <span className="text-xs sm:text-sm font-semibold text-[#3d4a42]">{s.deria}</span>
          </button>
        ))}
      </div>
      <button type="button" disabled={checked.length < 3} onClick={() => onSuccess(100, '5 Deria berjaya diterokai!')} className="btn-toy btn-toy-emerald w-full rounded-2xl font-bold disabled:opacity-50">
        Selesai ({checked.length}/5 Deria)
      </button>
    </div>
  );
};

export const ConstructionGame3D: React.FC<InteractiveEngineProps> = ({ onSuccess }) => {
  const [blocks, setBlocks] = useState<string[]>(['Kuboid Tapak']);
  const palette = ['Kubus', 'Silinder', 'Piramid Bumbung'];
  return (
    <div className="panel-chengal rounded-3xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg">Bina Menara Bongkah Asas</h3>
      <div className="min-h-32 rounded-2xl bg-[#E0F7FA] border-2 border-[#006577] p-4 flex flex-col-reverse items-center gap-1">
        {blocks.map((b, i) => (
          <div key={i} className="px-6 py-2 rounded-xl bg-[#F59E0B] border-2 border-[#78350F] font-display font-bold text-sm shadow">
            {b}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {palette.map((b) => (
          <button key={b} type="button" onClick={() => { audioEngine.playSfx('build'); setBlocks((prev) => [...prev, b]); }} className="btn-toy btn-toy-gold px-4 rounded-xl font-bold">+ {b}</button>
        ))}
      </div>
      <button type="button" disabled={blocks.length < 4} onClick={() => onSuccess(100, 'Binaan bongkah asas kukuh siap!')} className="btn-toy btn-toy-emerald w-full rounded-2xl font-bold disabled:opacity-50">
        Siap Bina ({blocks.length}/4 Bongkah)
      </button>
    </div>
  );
};
