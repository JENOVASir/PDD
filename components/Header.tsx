import React from 'react';
import type { NavItem } from '../types';

interface HeaderProps {
  logoText: string;
  logoSubtitle: string;
  logoIcon: React.ReactNode;
  navItems: NavItem[];
  activeItem: string;
  onNavigate: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ logoText, logoSubtitle, logoIcon, navItems, activeItem, onNavigate }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 h-16 shadow-lg">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Nav items on the left (visually right in RTL) */}
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.onClick ? item.onClick() : onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${item.id === activeItem || item.isActive
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Logo on the right (visually left in RTL) */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
           <div className="text-left flex flex-col justify-center">
            <h1 className="text-lg md:text-xl font-bold text-amber-500 leading-none tracking-wide">{logoText}</h1>
            <p className="text-[10px] md:text-xs text-slate-400 font-serif tracking-widest opacity-70">{logoSubtitle}</p>
          </div>
          <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700 shadow-inner">
            {logoIcon}
          </div>
        </div>

        {/* Mobile Spacer (if needed) */}
        <div className="md:hidden w-8"></div> 
      </div>
    </header>
  );
};