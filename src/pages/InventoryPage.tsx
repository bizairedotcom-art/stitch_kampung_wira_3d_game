import React from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '@/stores/useGameStore';

export const InventoryPage: React.FC = () => {
  const bundle = useGameStore((s) => s.bundle);
  if (!bundle) return null;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 pb-28 space-y-5">
      <div className="panel-chengal rounded-3xl p-4">
        <h1 className="font-display font-black text-2xl text-[#351000]">Beg Pengembara, Jurnal Alam & Galeri Batik</h1>
        <p className="text-sm font-semibold text-[#78350F]">Semua kraf, kad hidupan kolam, dan karya lukisan batik kamu disimpan di sini.</p>
      </div>

      {/* Saved Batik Gallery */}
      <section className="panel-chengal rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-xl text-[#E11D48]">🎨 Galeri Batik Pelangi ({bundle.artworks.length})</h2>
          <Link to="/play/psv-1-1" className="btn-toy btn-toy-gold px-4 min-h-10 rounded-xl font-bold text-xs flex items-center">
            + Lukis Batik Baru
          </Link>
        </div>
        {bundle.artworks.length === 0 ? (
          <p className="text-sm text-[#78350F]">Belum ada lukisan disimpan. Terokai Bengkel Batik untuk hasilkan karya pertama!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {bundle.artworks.map((art) => (
              <div key={art.id} className="rounded-2xl bg-white border-2 border-[#78350F] p-3 space-y-2">
                <img src={art.dataUrl} alt={art.title} className="w-full h-36 object-contain rounded-xl bg-[#FFFBEB]" />
                <div className="font-display font-bold text-sm">{art.title}</div>
                <div className="text-xs text-[#006947] font-bold">⭐ {art.starsEarned} Bintang Pameran</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pond Nature Encyclopedia Cards */}
      <section className="panel-chengal rounded-3xl p-5 space-y-3">
        <h2 className="font-display font-black text-xl text-[#006577]">🪷 Jurnal Hidupan Kolam Teratai</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#ECFEFF] border-2 border-[#06B6D4] p-4 flex items-center gap-3">
            <div className="text-4xl">🐟</div>
            <div>
              <h3 className="font-display font-bold">Ikan Koi Emas</h3>
              <p className="text-xs text-[#3d4a42]">Bernafas menggunakan insang dan berenang dengan sirip. Suka air kolam yang bersih.</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#ECFDF5] border-2 border-[#0D9668] p-4 flex items-center gap-3">
            <div className="text-4xl">🪷</div>
            <div>
              <h3 className="font-display font-bold">Bunga Teratai</h3>
              <p className="text-xs text-[#3d4a42]">Tumbuhan akuatik berdaun lebar terapung dan memberi teduhan kepada hidupan kolam.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Backpack Items */}
      <section className="panel-chengal rounded-3xl p-5 space-y-3">
        <h2 className="font-display font-black text-xl text-[#351000]">🎒 Barang Dalam Beg ({bundle.inventory.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bundle.inventory.map((item) => (
            <div key={item.id} className="rounded-2xl bg-[#FFFBEB] border-2 border-[#78350F]/40 p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FEA619] flex items-center justify-center border border-[#78350F]">
                <span className="material-symbols-outlined text-[#351000]">{item.icon}</span>
              </div>
              <div>
                <div className="font-display font-bold text-sm">{item.name} ×{item.quantity}</div>
                <p className="text-xs text-[#3d4a42]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
