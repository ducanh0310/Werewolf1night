import React, { useState } from 'react';
import { Skull, User, Trophy, ArrowRight, RotateCcw, AlertTriangle, ShieldAlert, Shuffle, Sparkles } from 'lucide-react';
import { Player, RoleType } from '../types';
import { ROLE_DETAILS } from '../constants';
import Header from './Header';

interface VotingProps {
  players: Player[];
  centerCards: RoleType[];
  onRestart: () => void;
  onFastRestart: () => void;
}

export default function Voting({ players, centerCards, onRestart, onFastRestart }: VotingProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [princessActionActive, setPrincessActionActive] = useState(false);
  const [originalPrincessName, setOriginalPrincessName] = useState<string | null>(null);
  const [princessSelectedRedirectId, setPrincessSelectedRedirectId] = useState<string | null>(null);

  // Determine who won based on the vote
  const votedPlayer = players.find(p => p.id === selectedPlayerId);

  // We need to check who wins!
  let winnerGroup: 'Dân' | 'Sói' | 'Kẻ Chán Đời' = 'Dân';
  let winnerMainText = '';
  let winnerSubText = '';

  if (votedPlayer) {
    const finalRole = votedPlayer.finalRole;

    if (finalRole === 'Kẻ Chán Đời') {
      winnerGroup = 'Kẻ Chán Đời';
      winnerMainText = `${votedPlayer.name} (Kẻ Chán Đời) Chiến Thắng!`;
      winnerSubText = 'Kẻ Chán Đời đã đạt được mục đích cao cả nhất của hắn: bị cả làng nghi ngờ và treo cổ!';
    } else if (finalRole === 'Sói') {
      winnerGroup = 'Dân';
      winnerMainText = 'Phe Dân Làng Thắng Trận!';
      winnerSubText = `Thôn làng đã phán đoán xuất sắc và treo cổ thành công Ma Sói ${votedPlayer.name}! Các Ma Sói còn lại bị tiêu diệt.`;
    } else {
      // Voted a Villager/Seer/Robber/Princess
      // Check if there are any active wolves in the final players
      const hasActiveWolf = players.some(p => p.finalRole === 'Sói');

      if (hasActiveWolf) {
        winnerGroup = 'Sói';
        winnerMainText = 'Phe Ma Sói Chiến Thắng!';
        winnerSubText = `Dân làng đã treo cổ nhầm người vô tội: ${votedPlayer.name} (${finalRole}). Ma Sói thành công lẩn trốn vào bóng đêm!`;
      } else {
        // No active wolves in play
        winnerGroup = 'Sói'; // or let's say "Dân làng thua" because they killed an innocent when no danger existed
        winnerMainText = 'Thôn Làng Thất Bại!';
        winnerSubText = `Không có ai trong số người chơi là Ma Sói (Sói nằm trong xấp bài dư), nhưng dân làng vẫn hoang mang treo cổ người vô tội ${votedPlayer.name}!`;
      }
    }
  }

  const handleReveal = () => {
    if (!selectedPlayerId) return;

    const initialVoted = players.find(p => p.id === selectedPlayerId);
    if (initialVoted && initialVoted.finalRole === 'Công Chúa') {
      // Trigger Princess special redirect choice!
      setOriginalPrincessName(initialVoted.name);
      setPrincessActionActive(true);
    } else {
      setIsRevealed(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6" id="voting-container">
      <Header subtitle="Bỏ phiếu sinh tử & Kết quả" />

      {princessActionActive ? (
        /* PRINCESS REDIRECTION SCREEN */
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6" id="princess-redirection-box">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-pink-400 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
              👑 ĐẶC QUYỀN HOÀNG GIA KÍCH HOẠT
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              {originalPrincessName} chính là Công Chúa!
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Mọi người bỏ phiếu trúng Công Chúa, nhưng nàng sở hữu đặc quyền hoàng gia bảo đảm tính mạng. Hãy chỉ định một người chơi khác gánh chịu án treo cổ thay thế:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="princess-redirect-players-grid">
            {players.filter(p => p.name !== originalPrincessName).map((p) => {
              const isSelected = princessSelectedRedirectId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPrincessSelectedRedirectId(p.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? 'bg-pink-500/10 border-pink-500 text-pink-200 shadow-md shadow-pink-950/20 scale-[1.01]' 
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                  id={`princess-redirect-option-${p.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold leading-none ${
                      isSelected ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      👤
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{p.name}</h4>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-xs bg-pink-500/20 text-pink-400 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">
                      Thế mạng
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {princessSelectedRedirectId && (
            <button
              onClick={() => {
                setSelectedPlayerId(princessSelectedRedirectId);
                setPrincessActionActive(false);
                setIsRevealed(true);
              }}
              className="w-full py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-950/30 font-sans"
              id="confirm-princess-redirect-btn"
            >
              👑 Đổi Tội Trạng & Treo Cổ Người Thế Mạng
            </button>
          )}
        </div>
      ) : !isRevealed ? (
         /* 1. SELECT VICTIM SCREEN */
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6" id="select-victim-box">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-100 flex items-center justify-center space-x-2">
              <span className="text-red-500">🗳️</span>
              <span>Ai Là Người Bị Chọn Bầu Ra Treo Cổ?</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Mọi người hãy đồng loạt chỉ tay vào nghi can lớn nhất vào 1: 2: 3! Sau đó nhấp chọn người chơi nhận nhiều phiếu bầu nhất dưới đây:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="voting-players-grid">
            {players.map((p) => {
              const isSelected = selectedPlayerId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlayerId(p.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? 'bg-red-550/10 border-red-500 text-red-200 shadow-md shadow-red-950/20 scale-[1.01]' 
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                  id={`vote-target-btn-${p.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold leading-none ${
                      isSelected ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      👤
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{p.name}</h4>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-xs bg-red-500/20 text-red-400 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">
                      Bị vote trúng!
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedPlayerId && (
            <button
              onClick={handleReveal}
              className="w-full py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer bg-gradient-to-r from-red-650 to-red-550 hover:from-red-600 hover:to-red-500 text-white shadow-red-950/30 font-sans"
              id="confirm-execution-btn"
            >
              ⚠️ Tuyên Án & Lật Bài Bí Mật
            </button>
          )}
        </div>
      ) : (
        /* 2. FINAL RESULT & REVEAL ALL CARDS */
        <div className="space-y-6" id="final-results-display">
          
          {/* Winner Banner */}
          <div className={`backdrop-blur-md rounded-2xl p-6 border text-center space-y-3 shadow-2xl relative overflow-hidden ${
            winnerGroup === 'Dân' ? 'bg-emerald-950/25 border-emerald-500/40 shadow-emerald-950/20' :
            winnerGroup === 'Kẻ Chán Đời' ? 'bg-fuchsia-950/25 border-fuchsia-500/40 shadow-fuchsia-950/20' :
            'bg-red-950/25 border-red-500/40 shadow-red-950/20'
          }`} id="winner-banner">
            
            <div className="absolute -right-8 -bottom-8 opacity-5 text-8xl pointer-events-none select-none">
              {winnerGroup === 'Dân' ? '🧑' : winnerGroup === 'Sói' ? '🐺' : '😫'}
            </div>

            <div className="flex justify-center">
              <div className={`p-4 rounded-full border ${
                winnerGroup === 'Dân' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/50' :
                winnerGroup === 'Kẻ Chán Đời' ? 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-950/50' :
                'text-red-400 border-red-500/30 bg-red-950/50'
              } animate-bounce`}>
                <Trophy className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-slate-400 block">KẾT QUẢ CUỐI CÙNG</span>
              <h2 className="text-2xl font-black">{winnerMainText}</h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              {winnerSubText}
            </p>
          </div>

          {originalPrincessName && (
            <div className="bg-gradient-to-r from-pink-500/15 to-rose-600/5 border border-pink-500/35 rounded-2xl p-4 md:p-5 shadow-lg space-y-2 animate-fade-in text-left">
              <div className="flex items-center space-x-2 text-pink-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Đặc quyền Công Chúa cứu mạng</span>
              </div>
              <div className="text-sm text-slate-200 leading-relaxed">
                👸 Ban đầu mọi người bỏ phiếu treo cổ <span className="text-pink-400 font-extrabold">{originalPrincessName}</span> (Công Chúa). Tuy nhiên, nàng đã kích hoạt đặc quyền quyền lực đặc biệt, chỉ định <span className="text-red-400 font-extrabold">{votedPlayer?.name}</span> chịu phạt treo cổ thế mạng thay thế!
              </div>
            </div>
          )}

          {/* Cards Reveal Board */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-5" id="board-reveal">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider pb-1.5 border-b border-slate-800">
              🔍 Tiết lộ vai trò bí mật của các người chơi
            </h3>

            {/* Robber Swap Log Alert Box */}
            {(() => {
              const robberPlayer = players.find(p => p.initialRole === 'Kẻ Trộm');
              const hasRobberSwapped = robberPlayer && robberPlayer.stoleFromPlayerName;
              if (robberPlayer) {
                if (hasRobberSwapped) {
                  return (
                    <div className="bg-gradient-to-r from-amber-500/15 to-amber-600/5 border border-amber-500/35 rounded-2xl p-4 md:p-5 shadow-lg space-y-2 animate-fade-in text-left">
                      <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                        <Shuffle className="w-4 h-4 animate-spin-slow" />
                        <span>Hành động đánh tráo của Kẻ Trộm</span>
                      </div>
                      <div className="text-sm text-slate-250 leading-relaxed">
                        ⚠️ <span className="text-amber-400 font-extrabold">{robberPlayer.name}</span> (Kẻ Trộm ban đầu) đã âm thầm đổi bài với <span className="text-indigo-400 font-extrabold">{robberPlayer.stoleFromPlayerName}</span>.
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className="bg-slate-950/60 border border-slate-900 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Vai trò mới của {robberPlayer.name}:</span>
                          <span className="text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{robberPlayer.finalRole}</span>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-900 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 font-medium">Vai trò mới của {robberPlayer.stoleFromPlayerName}:</span>
                          <span className="text-slate-300 font-black bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20">Dân Làng</span>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed italic pt-1">
                        👉 Người bị tráo đổi vai trò (<strong className="text-indigo-400">{robberPlayer.stoleFromPlayerName}</strong>) tự động bị kéo về phe <strong>Dân Làng</strong> và không thể tự lật bài để coi lúc Đêm nữa.
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-4 text-left flex items-start space-x-3 text-xs text-slate-400">
                      <span className="text-base shrink-0">💤</span>
                      <div>
                        <h4 className="font-bold text-slate-350 uppercase tracking-wide text-[10px] mb-0.5">Nhật ký ban đêm</h4>
                        <p className="leading-normal">Kẻ Trộm hôm nay không kích hoạt trộm bài (hoặc lá Kẻ Trộm nằm trong xấp bài dư ở giữa bàn).</p>
                      </div>
                    </div>
                  );
                }
              }
              return null;
            })()}

            <div className="space-y-3">
              {players.map((p) => {
                const isVoted = p.id === selectedPlayerId;
                const wasSwapped = p.initialRole !== p.finalRole;
                const isRealRobber = p.initialRole === 'Kẻ Trộm' && p.stoleFromPlayerName;
                const isStolenVictim = p.stolenByRobber;
                
                return (
                  <div 
                    key={p.id} 
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between text-left transition-all duration-300 gap-4 ${
                      isVoted 
                        ? 'bg-red-500/5 border-red-500/40 shadow-sm shadow-red-950/10 animate-fade-in' 
                        : isRealRobber
                        ? 'bg-amber-500/5 border-amber-500/30 shadow-sm shadow-amber-950/10'
                        : isStolenVictim
                        ? 'bg-indigo-500/5 border-indigo-500/30'
                        : 'bg-slate-950/70 border-slate-850 hover:border-slate-800'
                    }`}
                    id={`reveal-line-${p.id}`}
                  >
                    <div className="flex items-center space-x-3 shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-inner ${
                        isVoted ? 'bg-red-500 text-white animate-pulse' : 
                        isRealRobber ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                        isStolenVictim ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {isVoted ? '💀' : isRealRobber ? '🦹' : isStolenVictim ? '🎭' : '👤'}
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-1.5">
                          <h4 className="font-bold text-sm text-slate-250">{p.name}</h4>
                          {isVoted && (
                            <span className="text-[9px] bg-red-500/20 text-red-400 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                              Bị Treo Cổ
                            </span>
                          )}
                          {isRealRobber && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono flex items-center space-x-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Đã Cướp Bài</span>
                            </span>
                          )}
                          {isStolenVictim && (
                            <span className="text-[9px] bg-indigo-500/20 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                              Bị Trộm Đổi Vai
                            </span>
                          )}
                        </div>

                        {/* History tracer info */}
                        <div className="text-[11px] text-slate-400 mt-1 leading-normal">
                          {isRealRobber && (
                            <span>🦸 Gốc là <strong>Kẻ Trộm</strong>, đã cướp vai trò <strong className="text-amber-400 font-bold">{p.finalRole}</strong> của {p.stoleFromPlayerName}!</span>
                          )}
                          {isStolenVictim && (
                            <span>🎭 Ban đầu là <strong>{p.initialRole}</strong>, bị đổi thành <strong className="text-slate-300 font-bold">Dân Làng</strong>!</span>
                          )}
                          {!isRealRobber && !isStolenVictim && (
                            wasSwapped ? (
                              <span>Bản đồ vai trò thay đổi từ <strong>{p.initialRole}</strong> sang <strong>{p.finalRole}</strong>.</span>
                            ) : (
                              <span className="text-slate-500">Giữ nguyên vai trò từ đầu game.</span>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-slate-900/60 sm:border-0 pt-3 sm:pt-0">
                      {/* Timeline flow */}
                      <div className="flex items-center space-x-2 bg-slate-950 border border-slate-850 px-3.5 py-2 rounded-xl">
                        <div className="text-right shrink-0">
                          <span className="block text-[8px] uppercase tracking-wider font-mono font-bold text-slate-500 leading-none mb-0.5">Lúc đầu</span>
                          <span className="text-xs text-slate-400 font-bold">{p.initialRole}</span>
                        </div>
                        {isRealRobber || isStolenVictim || wasSwapped ? (
                          <>
                            <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
                            <div className="text-left shrink-0">
                              <span className="block text-[8px] uppercase tracking-wider font-mono font-bold text-indigo-400 leading-none mb-0.5 font-sans">Sau Đêm</span>
                              <span className={`text-xs font-black ${
                                p.finalRole === 'Sói' ? 'text-red-400' :
                                p.finalRole === 'Kẻ Chán Đời' ? 'text-fuchsia-400' :
                                'text-emerald-400'
                              }`}>{p.finalRole}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-slate-700 font-mono text-[10px] scale-y-150 shrink-0 select-none">|</span>
                            <div className="text-left shrink-0">
                              <span className="block text-[8px] uppercase tracking-wider font-mono font-bold text-slate-600 leading-none mb-0.5">Cuối</span>
                              <span className="text-xs text-slate-500 font-bold">Ko đổi</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Cards Remaining Center Board */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4" id="center-reveal">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider pb-1.5 border-b border-slate-800">
              🃏 Xấp bài dư ở giữa bàn gồm các quân bài:
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {centerCards.map((role, idx) => {
                const details = ROLE_DETAILS[role];
                return (
                  <div 
                    key={idx} 
                    className={`aspect-[3/4] rounded-xl border flex flex-col items-center justify-between p-3.5 text-center bg-gradient-to-b ${details.bgGradient} border-slate-800`}
                    id={`center-revealed-card-${idx}`}
                  >
                    <span className="text-[8px] uppercase text-slate-500 font-bold font-mono">DƯ {idx + 1}</span>
                    <span className="text-2xl my-1.5 block">
                      {role === 'Sói' ? '🐺' : role === 'Tiên Tri' ? '🔮' : role === 'Kẻ Trộm' ? '🦹' : role === 'Kẻ Chán Đời' ? '😫' : role === 'Công Chúa' ? '👸' : '🧑'}
                    </span>
                    <span className="text-xs font-extrabold text-slate-300 font-sans tracking-wide">{role}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Play again options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2" id="restart-buttons-container">
            <button
              onClick={onFastRestart}
              className="py-3.5 px-5 text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/20 flex items-center justify-center space-x-1.5"
              id="fast-play-again-btn"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Chơi Lại Nhanh (Giữ Tên)</span>
            </button>

            <button
              onClick={onRestart}
              className="py-3.5 px-5 text-sm font-bold uppercase tracking-wider rounded-xl transition-all border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-350 shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              id="play-again-btn"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Cấu Hình Lại Trận</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
