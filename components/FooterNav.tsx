import React from 'react';
import type { NavItem } from '../types';

interface FooterNavProps {
  items: NavItem[];
}

export const FooterNav: React.FC<FooterNavProps> = ({ items }) => {
  return (
    <footer className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 fixed bottom-0 left-0 right-0 z-50 h-16 pb-safe">
      <nav className="h-full flex justify-around items-center px-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1
                        text-slate-400 hover:text-amber-400 active:scale-95 transition-all`}
            aria-label={item.label}
          >
            <div className="transition-transform duration-200">{item.icon}</div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};