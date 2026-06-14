import React, { useState, useEffect } from 'react';
import { Users, Plus, Minus, Settings2, Info } from 'lucide-react';
import { RoleType } from '../types';
import { ROLE_DETAILS, getDefaultRolesForPlayerCount } from '../constants';
import Header from './Header';

interface RoleSetupProps {
  initialPlayerCount: number;
  initialRoleSelection: Record<RoleType, number>;
  onComplete: (playerCount: number, roleSelection: Record<RoleType, number>) => void;
}

export default function RoleSetup({ initialPlayerCount, initialRoleSelection, onComplete }: RoleSetupProps) {
  const [playerCount, setPlayerCount] = useState<number>(initialPlayerCount);
  const [roleSelection, setRoleSelection] = useState<Record<RoleType, number>>(initialRoleSelection);
  const isFirstRender = React.useRef(true);

  // Sync default roles when playerCount changes, except on initial mount
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setRoleSelection(getDefaultRolesForPlayerCount(playerCount));
  }, [playerCount]);

  const targetCards = playerCount + 3;
  const currentTotalCards = (Object.values(roleSelection) as number[]).reduce((a, b) => a + b, 0);

  const incrementRole = (role: RoleType) => {
    // Unique special roles can have AT MOST 1 card in play according to rules
    if (role === 'Tiên Tri' || role === 'Kẻ Trộm' || role === 'Kẻ Chán Đời' || role === 'Công Chúa') {
      if ((roleSelection[role] || 0) >= 1) return;
    }
    // Limit Sói and Dân to reasonable values
    if (role === 'Sói' && (roleSelection[role] || 0) >= 3) return;
    if (role === 'Dân' && (roleSelection[role] || 0) >= 8) return;

    setRoleSelection((prev) => ({
      ...prev,
      [role]: (prev[role] || 0) + 1,
    }));
  };

  const decrementRole = (role: RoleType) => {
    if (!roleSelection[role] || roleSelection[role] <= 0) return;
    setRoleSelection((prev) => ({
      ...prev,
      [role]: prev[role] - 1,
    }));
  };

  // Quick auto-adjust helper if they want to match required cards exactly
  const handleAutoAdjust = () => {
    const defaultSetup = getDefaultRolesForPlayerCount(playerCount);
    setRoleSelection(defaultSetup);
  };

  const isValid = currentTotalCards === targetCards && roleSelection['Sói'] > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onComplete(playerCount, roleSelection);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6" id="role-setup-container">
      <Header subtitle="Cấu hình trò chơi" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Player Count Selector */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl" id="select-player-count">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="text-indigo-400 w-5 h-5" />
            <h2 className="text-lg font-semibold text-slate-100">Số lượng người chơi</h2>
          </div>

          <div className="flex items-center justify-between bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            <button
              type="button"
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
              onClick={() => setPlayerCount(Math.max(3, playerCount - 1))}
              disabled={playerCount <= 3}
              id="player-minus-btn"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="block text-3xl font-black text-indigo-400 font-sans">{playerCount}</span>
              <span className="text-xs text-slate-400">Người chơi</span>
            </div>
            <button
              type="button"
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
              onClick={() => setPlayerCount(Math.min(10, playerCount + 1))}
              disabled={playerCount >= 10}
              id="player-plus-btn"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-3 flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-indigo-300 mr-1 shrink-0" />
            <span>Tổng cộng quân bài cần phân bổ là <strong>{targetCards}</strong> quân (Số người chơi + 3 quân dư).</span>
          </p>
        </div>

        {/* Role counters */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4" id="select-roles">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Settings2 className="text-purple-400 w-5 h-5" />
              <h2 className="text-lg font-semibold text-slate-100">Chọn vai trò trong bàn</h2>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold leading-5 transition-all duration-300 ${
                currentTotalCards === targetCards 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold'
              }`}>
                {currentTotalCards} / {targetCards} Lá bài
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {(Object.keys(ROLE_DETAILS) as RoleType[]).map((roleType) => {
              const count = roleSelection[roleType] || 0;
              const details = ROLE_DETAILS[roleType];
              
              return (
                <div 
                  key={roleType} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all ${
                    count > 0 
                      ? 'bg-slate-950/60 border-slate-800/80 shadow-md' 
                      : 'bg-slate-950/20 border-slate-900/40 opacity-60'
                  }`}
                  id={`role-card-${roleType}`}
                >
                  <div className="flex items-start space-x-3 pr-2 mb-3 sm:mb-0">
                    <span className={`p-2 rounded-lg ${count > 0 ? details.color : 'text-slate-600 bg-slate-950/40'} shrink-0 mt-0.5`}>
                      {roleType === 'Sói' && <span className="font-bold text-sm">Sói</span>}
                      {roleType === 'Dân' && <span className="font-bold text-sm">Dân</span>}
                      {roleType === 'Tiên Tri' && <span className="font-bold text-sm">Tri</span>}
                      {roleType === 'Kẻ Trộm' && <span className="font-bold text-sm">Trộm</span>}
                      {roleType === 'Kẻ Chán Đời' && <span className="font-bold text-sm">Chán</span>}
                      {roleType === 'Công Chúa' && <span className="font-bold text-sm">Chúa</span>}
                    </span>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-bold text-sm text-slate-100">{details.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md">{details.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center self-end sm:self-center bg-slate-950 border border-slate-800 rounded-lg p-1 shrink-0">
                    <button
                      type="button"
                      className="p-1 px-2.5 rounded hover:bg-slate-900 text-slate-400 hover:text-slate-200 active:scale-95 transition-all disabled:opacity-25"
                      onClick={() => decrementRole(roleType)}
                      disabled={count <= 0}
                      id={`dec-${roleType}`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-slate-100">{count}</span>
                    <button
                      type="button"
                      disabled={
                        roleType === 'Tiên Tri' || roleType === 'Kẻ Trộm' || roleType === 'Kẻ Chán Đời' || roleType === 'Công Chúa'
                          ? count >= 1
                          : roleType === 'Sói'
                          ? count >= 3
                          : roleType === 'Dân'
                          ? count >= 8
                          : false
                      }
                      className="p-1 px-2.5 rounded hover:bg-slate-900 text-slate-400 hover:text-slate-200 active:scale-95 transition-all disabled:opacity-25"
                      onClick={() => incrementRole(roleType)}
                      id={`inc-${roleType}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Validation warnings */}
          {currentTotalCards !== targetCards && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl text-xs space-y-1">
              <span className="font-bold">❌ Hiện tại không trùng khớp:</span>
              <p>
                Bạn đang cấu hình <strong>{currentTotalCards}</strong> lá bài, nhưng chuẩn trò chơi cần chính xác <strong>{targetCards}</strong> lá. 
                Vui lòng tăng hoặc giảm bớt vai trò bên trên để tiếp tục. <button type="button" onClick={handleAutoAdjust} className="underline ml-1 font-bold text-indigo-400 cursor-pointer">Tự động điều chỉnh</button>
              </p>
            </div>
          )}

          {currentTotalCards === targetCards && roleSelection['Sói'] === 0 && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs">
              <span className="font-bold">❌ Thiếu Sói:</span>
              <p>Trò chơi phải có ít nhất 1 Ma Sói để có thể bắt đầu.</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg active:scale-[0.99] cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/10 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:shadow-none disabled:cursor-not-allowed"
          disabled={!isValid}
          id="role-setup-submit-btn"
        >
          Xác Nhận & Nhập Tên Người Chơi
        </button>
      </form>
    </div>
  );
}
