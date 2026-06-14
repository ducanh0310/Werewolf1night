import React from 'react';

interface HeaderProps {
  subtitle?: string;
}

export default function Header({ subtitle }: HeaderProps) {
  if (!subtitle) return null;
  return (
    <div className="text-center mb-4 flex flex-col items-center" id="header-container">
      <span className="text-[11px] text-indigo-400 font-mono uppercase tracking-widest bg-indigo-505/10 px-2.5 py-1 rounded border border-indigo-500/10">
        {subtitle}
      </span>
    </div>
  );
}
