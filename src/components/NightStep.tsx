import React, { useState } from 'react';
import { Eye, Shuffle, Skull, Check, EyeOff, AlertCircle, Lock } from 'lucide-react';
import { Player, RoleType } from '../types';
import { ROLE_DETAILS } from '../constants';
import Header from './Header';

interface NightStepProps {
  players: Player[];
  centerCards: RoleType[];
  onComplete: (updatedPlayers: Player[]) => void;
}

type NightStepPhase = 'intro' | 'wolf' | 'seer' | 'robber' | 'outro';

export default function NightStep({ players, centerCards, onComplete }: NightStepProps) {
  const [phase, setPhase] = useState<NightStepPhase>('intro');
  const [isActionRevealed, setIsActionRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPhase, setPendingPhase] = useState<NightStepPhase>('intro');
  
  // State for updating final roles
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>(() => 
    players.map(p => ({ ...p, finalRole: p.initialRole }))
  );

  // Seer state
  const [seerRevealedIdx, setSeerRevealedIdx] = useState<number[]>([]);
  // Robber state
  const [robbedPlayerId, setRobbedPlayerId] = useState<string | null>(null);
  const [robberStateSaveText, setRobberStateSaveText] = useState<string>('');
  const [stolenRole, setStolenRole] = useState<RoleType | null>(null);
  const [stolenFromPlayerName, setStolenFromPlayerName] = useState<string | null>(null);

  // Find actual players with these roles
  const wolves = currentPlayers.filter(p => p.initialRole === 'Sói');
  const seer = currentPlayers.find(p => p.initialRole === 'Tiên Tri');
  const robber = currentPlayers.find(p => p.initialRole === 'Kẻ Trộm');

  const goToNextPhase = () => {
    setIsActionRevealed(false);
    
    let next: NightStepPhase | 'complete' = 'intro';
    if (phase === 'intro') {
      next = 'wolf';
    } else if (phase === 'wolf') {
      if (seer) {
        next = 'seer';
      } else if (robber) {
        next = 'robber';
      } else {
        next = 'outro';
      }
    } else if (phase === 'seer') {
      if (robber) {
        next = 'robber';
      } else {
        next = 'outro';
      }
    } else if (phase === 'robber') {
      next = 'outro';
    } else {
      next = 'complete';
    }

    if (next === 'complete') {
      onComplete(currentPlayers);
    } else {
      setPendingPhase(next);
      setIsTransitioning(true);
    }
  };

  // Handle Seer clicking on center cards
  const handleSeerClickCard = (cardIdx: number) => {
    if (seerRevealedIdx.includes(cardIdx)) return;
    if (seerRevealedIdx.length >= 2) return; // limit to 2 cards
    setSeerRevealedIdx([...seerRevealedIdx, cardIdx]);
  };

  // Handle Robber picking a target player
  const handleRobberSteal = (targetId: string) => {
    if (robbedPlayerId) return; // already did
    setRobbedPlayerId(targetId);

    // Find Robber's player and Target's player
    const robberPlayer = currentPlayers.find(p => p.initialRole === 'Kẻ Trộm');
    const targetPlayer = currentPlayers.find(p => p.id === targetId);

    if (targetPlayer) {
      setStolenRole(targetPlayer.initialRole);
      setStolenFromPlayerName(targetPlayer.name);
    }

    if (robberPlayer && targetPlayer) {
      const targetInitialRole = targetPlayer.initialRole;

      // Update final roles:
      // Robber becomes target's role.
      // Target becomes 'Dân'.
      const updated = currentPlayers.map(p => {
        if (p.initialRole === 'Kẻ Trộm') {
          return {
            ...p,
            finalRole: targetInitialRole,
            stoleFromPlayerName: targetPlayer.name,
            robbedInitialRole: targetInitialRole
          };
        }
        if (p.id === targetId) {
          return {
            ...p,
            finalRole: 'Dân' as RoleType,
            stolenByRobber: true
          };
        }
        return p;
      });

      setCurrentPlayers(updated);
      setRobberStateSaveText(`Bạn đã đánh tráo thành công! Nhặt lấy vai trò của ${targetPlayer.name} là [${targetInitialRole}] và gieo cho họ vai trò [Dân Làng].`);
    } else {
      // If there is no real Robber player (e.g. Robber card is in center but player clicked to act for fun),
      // we just simulate
      const targetPlayer = currentPlayers.find(p => p.id === targetId);
      setRobberStateSaveText(`(Mô phỏng hành động bí mật) Bạn giả vờ tráo bài của ${targetPlayer?.name || 'người chơi'}.`);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6" id="night-step-container">
      <Header subtitle="Giai đoạn Đêm duy nhất" />

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Compact Night Indicator */}
        <div className="flex justify-center">
          <span className="bg-slate-950/80 border border-slate-850 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-widest text-indigo-400">
            NIGHT ACTION SEQUENCE
          </span>
        </div>

        {isTransitioning ? (
          <div className="text-center space-y-5 py-6 animate-fade-in animate-scale-up" id="night-transition-screen">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-950/45 animate-pulse">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                🔒 ĐÃ KHÓA BẢO MẬT
              </span>
              <h3 className="text-base font-extrabold text-slate-100">
                Sẵn sàng cho vai trò tiếp theo
              </h3>
              <p className="text-[11px] text-amber-500 font-medium">
                ⚠️ Chỉ mở mắt khi bạn thực hiện lượt này!
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={() => {
                  setPhase(pendingPhase);
                  setIsTransitioning(false);
                }}
                className="w-full py-3 px-5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-95 shadow-md"
                id="btn-confirm-transition"
              >
                Tiếp tục &rarr;
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 1. INTRO PHASE */}
            {phase === 'intro' && (
              <div className="text-center space-y-4 py-4 animate-fade-in" id="night-intro-phase">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wider">Đêm Đã Buông Xuống</h2>
                  <p className="text-xs text-slate-400">
                    Tất cả nhắm mắt lại để bắt đầu hành động đêm.
                  </p>
                </div>

                <div className="flex justify-center my-4">
                  <span className="text-5xl animate-pulse">🌌</span>
                </div>

                <button
                  onClick={goToNextPhase}
                  className="w-full py-3 px-5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-95 shadow-md"
                  id="start-night-actions-btn"
                >
                  Bắt đầu hành động &rarr;
                </button>
              </div>
            )}

            {/* 2. WEREWOLF PHASE */}
            {phase === 'wolf' && (
              <div className="space-y-4 py-2 animate-scale-up" id="night-wolf-phase">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-red-400">BƯỚC 1: SÓI THỨC GIẤC</span>
                  <h3 className="text-base font-bold text-slate-100">Nhân dạng đồng bọn Ma Sói</h3>
                </div>

                {!isActionRevealed ? (
                  <button
                    onClick={() => setIsActionRevealed(true)}
                    className="w-full py-3 rounded-xl font-bold uppercase text-xs transition-all bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-950/50 cursor-pointer flex items-center justify-center space-x-2 animate-pulse"
                    id="wolf-action-trigger-btn"
                  >
                    <Skull className="w-3.5 h-3.5" />
                    <span>Tôi là SÓI - Nhấn xem đồng bọn</span>
                  </button>
                ) : (
                  <div className="bg-slate-950/80 border border-red-950/50 p-4 rounded-xl space-y-3 animate-fade-in" id="wolf-reveal-subbox">
                    <div className="text-center">
                      <p className="text-xs font-semibold text-slate-200">
                        {wolves.length === 0 ? (
                          "Không có Ma Sói nào trong người chơi (cả 2 Sói ở bài dư)."
                        ) : wolves.length === 1 ? (
                          `Bạn là Sói cô đơn! Không có sói khác.`
                        ) : (
                          <span>
                            Đồng bọn Sói hoạt động:<br />
                            <strong className="text-red-400 text-base mt-1 block">
                              {wolves.map(w => w.name).join(' & ')}
                            </strong>
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={goToNextPhase}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
                      id="wolf-finish-btn"
                    >
                      Xong, nhắm mắt &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. SEER PHASE */}
            {phase === 'seer' && (
              <div className="space-y-4 py-2 animate-scale-up" id="night-seer-phase">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-cyan-400">BƯỚC 2: TIÊN TRI THỨC GIẤC</span>
                  <h3 className="text-base font-bold text-slate-100">Soi bài trung tâm</h3>
                </div>

                {!isActionRevealed ? (
                  <button
                    onClick={() => setIsActionRevealed(true)}
                    className="w-full py-3 rounded-xl font-bold uppercase text-xs transition-all bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50 cursor-pointer flex items-center justify-center space-x-2 animate-pulse"
                    id="seer-action-trigger-btn"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Tôi là TIÊN TRI - Soi 2 lá bài dư</span>
                  </button>
                ) : (
                  <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 animate-fade-in" id="seer-action-interactive">
                    <div className="text-center">
                      <p className="text-[11px] text-slate-400">Chọn tối đa 2 lá bài ở giữa để xem:</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      {centerCards.map((role, idx) => {
                        const isRevealed = seerRevealedIdx.includes(idx);
                        return (
                          <button
                            key={idx}
                            disabled={!isRevealed && seerRevealedIdx.length >= 2}
                            onClick={() => handleSeerClickCard(idx)}
                            className={`aspect-[3/4] rounded-xl border flex flex-col items-center justify-center p-2 text-center transition-all ${
                              isRevealed 
                                ? 'bg-slate-900 border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950/20' 
                                : 'bg-slate-950 hover:bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-400 disabled:opacity-40 disabled:pointer-events-none'
                            }`}
                            id={`seer-center-card-${idx}`}
                          >
                            {isRevealed ? (
                              <div className="space-y-0.5 animate-scale-up">
                                <span className="text-xl block">
                                  {role === 'Sói' ? '🐺' : role === 'Tiên Tri' ? '🔮' : role === 'Kẻ Trộm' ? '🦹' : role === 'Kẻ Chán Đời' ? '😫' : role === 'Công Chúa' ? '👸' : '🧑'}
                                </span>
                                <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold">{role}</span>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="text-base font-mono font-black">{idx + 1}</span>
                                <p className="text-[8px] uppercase tracking-tighter opacity-40 leading-none">BÀI DƯ</p>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-semibold text-slate-500 font-mono">
                        Đã xem: {seerRevealedIdx.length} / 2
                      </span>
                    </div>

                    <button
                      onClick={goToNextPhase}
                      disabled={!!seer && seerRevealedIdx.length < 2 && centerCards.length >= 2}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer disabled:opacity-20"
                      id="seer-finish-btn"
                    >
                      Xong, nhắm mắt &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4. ROBBER PHASE */}
            {phase === 'robber' && (
              <div className="space-y-4 py-2 animate-scale-up" id="night-robber-phase">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-amber-400">BƯỚC 3: TRỘM THỨC GIẤC</span>
                  <h3 className="text-base font-bold text-slate-100">Đổi bài với người khác</h3>
                </div>

                {!isActionRevealed ? (
                  <button
                    onClick={() => setIsActionRevealed(true)}
                    className="w-full py-3 rounded-xl font-bold uppercase text-xs transition-all bg-amber-950/30 border border-amber-500/30 text-amber-400 hover:bg-amber-950/50 cursor-pointer flex items-center justify-center space-x-2 animate-pulse"
                    id="robber-action-trigger-btn"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Tôi là KẺ TRỘM - Trộm bài</span>
                  </button>
                ) : (
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-4 animate-fade-in" id="robber-action-interactive">
                    
                    {/* Steal targets */}
                    {!robbedPlayerId ? (
                      <div className="space-y-3">
                        <div className="text-center pb-1">
                          <span className="text-[10px] text-amber-500 font-mono font-bold tracking-widest uppercase">CHỌN MỘT NGƯỜI ĐỂ TRÁO BÀI</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                          {players.map((p) => {
                            // Don't list the robber themselves!
                            if (p.initialRole === 'Kẻ Trộm') return null;
                            return (
                              <button
                                key={p.id}
                                onClick={() => handleRobberSteal(p.id)}
                                className="p-2.5 text-center rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-xs font-semibold text-slate-200 hover:text-amber-400 transition-all cursor-pointer"
                                id={`robber-steal-target-${p.id}`}
                              >
                                🧑 {p.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-center py-1 animate-fade-in animate-scale-up" id="robber-stolen-result">
                        {stolenRole ? (
                          <div className="space-y-3">
                            <div className="text-slate-500 text-[10px] font-mono tracking-wider uppercase">VAI TRÒ MỚI CỦA BẠN</div>
                            
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-sm mx-auto shadow-md space-y-2">
                              <span className="text-4xl block animate-bounce" style={{ animationDuration: '3s' }}>
                                {stolenRole === 'Sói' ? '🐺' : 
                                 stolenRole === 'Tiên Tri' ? '🔮' : 
                                 stolenRole === 'Kẻ Trộm' ? '🦹' : 
                                 stolenRole === 'Kẻ Chán Đời' ? '😫' : 
                                 stolenRole === 'Công Chúa' ? '👸' : '🧑'}
                              </span>
                              
                              <h3 className="text-xl font-black text-rose-400 tracking-wide uppercase">
                                Bạn là {stolenRole}
                              </h3>
                              
                              {stolenFromPlayerName && (
                                <p className="text-[11px] text-slate-300">
                                  Bạn đã tráo bài của <strong className="text-amber-400">{stolenFromPlayerName}</strong>.
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-center">
                              <span className="text-3xl animate-bounce">🎭</span>
                            </div>
                            
                            <p className="text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-amber-500/20 max-w-sm mx-auto">
                              {robberStateSaveText}
                            </p>
                          </>
                        )}

                        <button
                          onClick={goToNextPhase}
                          className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
                          id="robber-finish-btn"
                        >
                          Xong, nhắm mắt &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. OUTRO PHASE */}
            {phase === 'outro' && (
              <div className="text-center space-y-4 py-4 animate-fade-in" id="night-outro-phase">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wider">Hết Một Đêm!</h2>
                  <p className="text-xs text-slate-400">
                    Hãy đánh thức tất cả mọi người dậy thảo luận.
                  </p>
                </div>

                <div className="flex justify-center my-4">
                  <span className="text-5xl animate-spin-slow">🌅</span>
                </div>

                <button
                  onClick={goToNextPhase}
                  className="w-full py-3 px-5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white cursor-pointer active:scale-95 shadow-md"
                  id="start-daytime-btn"
                >
                  Bắt đầu thảo luận &rarr;
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
