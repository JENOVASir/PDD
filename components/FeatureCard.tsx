import React from 'react';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl flex flex-col hover:border-amber-500/30 transition-colors ${className}`}>
      <div className="flex items-center justify-center mb-6 gap-3">
        <div className="p-3 bg-slate-900 rounded-xl shadow-inner border border-slate-800">
           {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-amber-100 text-center">{title}</h2>
      </div>
      {children}
    </div>
  );
};