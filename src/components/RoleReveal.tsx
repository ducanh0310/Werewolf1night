import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { Player } from '../types';
import { ROLE_DETAILS } from '../constants';
import Header from './Header';

interface RoleRevealProps {
  players: Player[];
  onComplete: () => void;
  onBack: () => void;
}

export default function RoleReveal({ players, onComplete, onBack }: RoleRevealProps) {
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentPlayerIdx];
  const roleInfo = ROLE_DETAILS[currentPlayer.initialRole];

  const handleNext = () => {
    setIsRevealed(false);
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6" id="role-reveal-container">
      <Header subtitle="Nhận vai trò bí mật" />

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl text-center space-y-6">
        
        {/* Progress indicator */}
        <div className="flex justify-between items-center bg-slate-950/50 px-3.5 py-1.5 rounded-full text-xs text-slate-400 font-mono">
          <span>Người chơi {currentPlayerIdx + 1} / {players.length}</span>
          <div className="flex space-x-1">
            {players.map((_, idx) => (
              <span 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentPlayerIdx 
                    ? 'bg-indigo-400 scale-125' 
                    : idx < currentPlayerIdx 
                      ? 'bg-slate-600' 
                      : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Big prompt to hand the device */}
        {!isRevealed ? (
          <div className="space-y-4 py-4 animate-fade-in" id="pass-device-prompt">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-mono font-bold">Chuyển máy cho</span>
              <h2 className="text-2xl font-black text-slate-100 font-sans tracking-wide">{currentPlayer.name}</h2>
            </div>

            <button
              onClick={() => setIsRevealed(true)}
              className="w-full max-w-xs mx-auto py-3 px-5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg active:scale-95 cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white flex items-center justify-center space-x-2"
              id="reveal-role-btn"
            >
              <Eye className="w-4 h-4" />
              <span>Xem vai trò bí mật</span>
            </button>
          </div>
        ) : (
          /* SECRET CARD SHOW */
          <div className="space-y-4 py-2 animate-scale-up" id="secret-card-container">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">VAI TRÒ CỦA</span>
              <h3 className="text-xl font-black text-indigo-400">{currentPlayer.name}</h3>
            </div>

            {/* Simulated compact card without description text */}
            <div className={`mx-auto max-w-xs rounded-2xl border-2 p-4 flex flex-col items-center text-center transition-all bg-gradient-to-b ${roleInfo.bgGradient} ${
              currentPlayer.initialRole === 'Sói' ? 'border-red-500/50 shadow-md shadow-red-950/20' :
              currentPlayer.initialRole === 'Tiên Tri' ? 'border-cyan-500/50 shadow-md shadow-cyan-950/20' :
              currentPlayer.initialRole === 'Kẻ Trộm' ? 'border-amber-500/50 shadow-md shadow-amber-950/20' :
              currentPlayer.initialRole === 'Kẻ Chán Đời' ? 'border-fuchsia-500/50 shadow-md shadow-fuchsia-950/20' :
              'border-emerald-500/50 shadow-md shadow-emerald-950/20'
            }`}>
              
              {/* Icon / Character emblem */}
              <div className="flex flex-col items-center">
                <div className={`p-4 rounded-full border mb-2 ${roleInfo.color} bg-slate-950/85`}>
                  {currentPlayer.initialRole === 'Sói' && <span className="text-3xl select-none">🐺</span>}
                  {currentPlayer.initialRole === 'Tiên Tri' && <span className="text-3xl select-none">🔮</span>}
                  {currentPlayer.initialRole === 'Kẻ Trộm' && <span className="text-3xl select-none">🦹</span>}
                  {currentPlayer.initialRole === 'Kẻ Chán Đời' && <span className="text-3xl select-none">😫</span>}
                  {currentPlayer.initialRole === 'Dân' && <span className="text-3xl select-none">🧑</span>}
                  {currentPlayer.initialRole === 'Công Chúa' && <span className="text-3xl select-none">👸</span>}
                </div>
                <h4 className="text-lg font-black tracking-wide text-slate-100 uppercase font-sans">
                  {currentPlayer.initialRole}
                </h4>
                <p className="text-[9px] uppercase font-bold tracking-widest font-mono text-slate-400 mt-0.5">
                  {roleInfo.factionName}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full max-w-xs mx-auto py-2.5 px-5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all bg-slate-800 hover:bg-slate-700 hover:text-slate-100 active:scale-95 text-slate-300 border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
              id="hide-and-continue-btn"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Che vai trò & Tiếp tục</span>
            </button>
          </div>
        )}

      </div>

      {currentPlayerIdx === 0 && !isRevealed && (
        <button
          onClick={onBack}
          className="mx-auto block mt-6 text-xs text-slate-500 hover:text-slate-300 transition-all font-mono hover:underline cursor-pointer"
          id="back-to-names-btn"
        >
          &larr; QUAY LẠI THIẾT LẬP TÊN
        </button>
      )}
    </div>
  );
}
