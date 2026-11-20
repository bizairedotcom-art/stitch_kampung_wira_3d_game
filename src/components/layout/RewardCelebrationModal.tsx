import React from 'react';
import { useGameStore } from '@/stores/useGameStore';

export const RewardCelebrationModal: React.FC = () => {
  const banner = useGameStore((s) => s.lastRewardBanner);
  const clear = useGameStore((s) => s.clearRewardBanner);

  if (!banner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#351000]/65 flex items-center justify-center p-4">
      <div className="panel-chengal rounded-3xl max-w-md w-full p-6 text-center space-y-4 relative overflow-hidden">
        <div className="songket-strip h-3 -mx-6 -mt-6 mb-2" />
        <div className="text-5xl animate-bounce">🏆🔑✨</div>
        <h2 className="font-display font-black text-2xl text-[#006947]">{banner.title}</h2>
        <p className="text-sm font-semibold text-[#78350F]">
          Syabas Wira! Ganjaran berjaya direkodkan ke akaun kamu.
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-[#FEF3C7] border-2 border-[#F59E0B] p-3">
            <div className="text-xl">🪙</div>
            <div className="font-display font-black text-lg">+{banner.coins}</div>
            <div className="text-xs font-bold">Syiling</div>
          </div>
          <div className="rounded-2xl bg-[#ECFDF5] border-2 border-[#0D9668] p-3">
            <div className="text-xl">⭐</div>
            <div className="font-display font-black text-lg">+{banner.stars}</div>
            <div className="text-xs font-bold">Bintang</div>
          </div>
          <div className="rounded-2xl bg-[#ECFEFF] border-2 border-[#06B6D4] p-3">
            <div className="text-xl">⚡</div>
            <div className="font-display font-black text-lg">+{banner.xp}</div>
            <div className="text-xs font-bold">XP</div>
          </div>
        </div>
        <button type="button" onClick={clear} className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold text-lg">
          Teruskan Pengembaraan!
        </button>
      </div>
    </div>
  );
};
