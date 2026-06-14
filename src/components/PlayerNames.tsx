import React, { useState } from 'react';
import { User, Sparkles, ChevronRight } from 'lucide-react';
import Header from './Header';

interface PlayerNamesProps {
  playerCount: number;
  initialNames?: string[];
  onComplete: (names: string[]) => void;
  onBack: () => void;
}

export default function PlayerNames({ playerCount, initialNames, onComplete, onBack }: PlayerNamesProps) {
  const [names, setNames] = useState<string[]>(() => {
    if (initialNames && initialNames.length === playerCount) {
      return initialNames;
    }
    const baseNames = initialNames || [];
    return Array.from({ length: playerCount }, (_, i) => 
      baseNames[i] || `Người chơi ${i + 1}`
    );
  });

  const handleNameChange = (index: number, value: string) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const handleFocus = (index: number) => {
    if (names[index] === `Người chơi ${index + 1}`) {
      const updated = [...names];
      updated[index] = '';
      setNames(updated);
    }
  };

  const handleBlur = (index: number) => {
    if (names[index].trim() === '') {
      const updated = [...names];
      updated[index] = `Người chơi ${index + 1}`;
      setNames(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNames = names.map((name, i) => name.trim() || `Người chơi ${i + 1}`);
    onComplete(finalNames);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6" id="player-names-container">
      <Header subtitle="Thiết lập người chơi" />

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-5">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
          <h2 className="text-lg font-bold text-slate-100">Nhập tên {playerCount} người chơi</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {names.map((name, i) => (
              <div 
                key={i} 
                className="flex items-center space-x-3 bg-slate-950/80 border border-slate-850 rounded-xl px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/80 transition-all"
                id={`name-input-group-${i}`}
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 text-xs font-mono font-bold shrink-0">
                  {i + 1}
                </div>
                <User className="text-slate-500 w-4.5 h-4.5 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  onFocus={() => handleFocus(i)}
                  onBlur={() => handleBlur(i)}
                  className="w-full bg-transparent focus:outline-none text-sm text-slate-100 placeholder-slate-550 border-0 p-1.5"
                  placeholder={`Mời nhập tên người thứ ${i + 1}`}
                  required
                  id={`name-input-${i}`}
                />
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-3">
            <button
              type="button"
              onClick={onBack}
              className="w-1/3 py-3 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-all cursor-pointer"
              id="back-to-setup-btn"
            >
              Quay lại
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg active:scale-[0.99] cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/10 flex items-center justify-center space-x-1"
              id="submit-names-btn"
            >
              <span>Xem Vai Trò</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
