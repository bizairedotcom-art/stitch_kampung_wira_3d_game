import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { audioEngine } from '@/services/audioEngine';

const NAV_ITEMS = [
  { to: '/village', label: 'Kampung', icon: 'cottage' },
  { to: '/subjects', label: 'Rumah Ilmu', icon: 'school' },
  { to: '/build', label: 'Bina Desa', icon: 'construction' },
  { to: '/missions', label: 'Misi', icon: 'task_alt' },
  { to: '/inventory', label: 'Beg & Galeri', icon: 'backpack' },
];

export const BottomNav: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Navigasi Utama Kampung Wira"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#FFF8F6]/95 border-t-4 border-[#5C240A] px-2 py-2 pb-safe shadow-[0_-6px_18px_rgba(69,26,3,0.16)]"
    >
      <div className="max-w-4xl mx-auto grid grid-cols-5 gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.to || (item.to !== '/village' && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => audioEngine.playSfx('click')}
              className={`flex flex-col items-center justify-center rounded-2xl py-1.5 px-1 transition ${
                active
                  ? 'bg-[#0D9668] text-white border-2 border-[#00422b] shadow-[0_3px_0_#00422b]'
                  : 'text-[#78350F] hover:bg-[#FFE2D6]'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${active ? 'icon-filled' : ''}`}>{item.icon}</span>
              <span className="font-display font-bold text-[11px] sm:text-xs truncate max-w-full">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
