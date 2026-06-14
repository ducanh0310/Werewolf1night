import { RoleDef, RoleType } from './types';

export const ROLE_DETAILS: Record<RoleType, { name: string; desc: string; factionName: string; color: string; icon: string; bgGradient: string }> = {
  'Sói': {
    name: 'Ma Sói (Werewolf)',
    desc: 'Thức dậy cùng đồng bọn để nhận mặt nhau. Nếu là Sói duy nhất, bạn sẽ biết mình cô độc.',
    factionName: 'Phe Sói',
    color: 'text-red-400 border-red-500/30 bg-red-950/20',
    bgGradient: 'from-red-950/40 via-purple-950/30 to-slate-950',
    icon: 'Skull',
  },
  'Dân': {
    name: 'Dân Làng (Villager)',
    desc: 'Không thức dậy ban đêm. Cùng phe dân tìm kiếm và treo cổ Ma Sói.',
    factionName: 'Phe Dân Làng',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
    bgGradient: 'from-emerald-950/40 via-teal-950/30 to-slate-950',
    icon: 'User',
  },
  'Tiên Tri': {
    name: 'Tiên Tri (Seer)',
    desc: 'Thức dậy đêm và được xem bí mật 2 lá bài bất kỳ từ xập bài còn dư ở giữa bàn.',
    factionName: 'Phe Dân Làng',
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
    bgGradient: 'from-cyan-950/40 via-sky-950/30 to-slate-950',
    icon: 'Eye',
  },
  'Kẻ Trộm': {
    name: 'Kẻ Trộm (Robber)',
    desc: 'Được đổi bài của mình với 1 người chơi khác và biết vai trò mới đó. Người bị trộm sẽ đổi sang vai trò Dân Làng.',
    factionName: 'Phe Dân Làng (Ban đầu)',
    color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
    bgGradient: 'from-amber-950/40 via-yellow-950/30 to-slate-950',
    icon: 'Shuffle',
  },
  'Kẻ Chán Đời': {
    name: 'Kẻ Chán Đời (Tanner)',
    desc: 'Phe thứ 3 độc lập. Không làm gì ban đêm, nhưng muốn bị mọi người vote chết để giành chiến thắng duy nhất.',
    factionName: 'Phe Thứ Ba',
    color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-950/20',
    bgGradient: 'from-fuchsia-950/40 via-pink-950/30 to-slate-950',
    icon: 'Frown',
  },
  'Công Chúa': {
    name: 'Công Chúa (Princess)',
    desc: 'Không thức dậy ban đêm. Phe Dân Làng. Khi bị đồn bỏ phiếu treo cổ buổi sáng, nàng được quyền chọn ngay 1 người chơi khác ngoài bản thân chịu tội thay mình.',
    factionName: 'Phe Dân Làng',
    color: 'text-pink-400 border-pink-500/30 bg-pink-950/20',
    bgGradient: 'from-pink-950/40 via-rose-950/30 to-slate-950',
    icon: 'Sparkles',
  }
};

// Default roles based on player count
export const getDefaultRolesForPlayerCount = (playerCount: number): Record<RoleType, number> => {
  const totalCards = playerCount + 3;
  
  // Custom smart templates to fit totalCards
  if (playerCount === 3) {
    // 6 cards: 2 Sói, 1 Tiên Tri, 1 Kẻ Trộm, 1 Kẻ Chán Đời, 1 Dân
    return { 'Sói': 2, 'Tiên Tri': 1, 'Kẻ Trộm': 1, 'Kẻ Chán Đời': 1, 'Dân': 1, 'Công Chúa': 0 };
  } else if (playerCount === 4) {
    // 7 cards: 2 Sói, 1 Tiên Tri, 1 Kẻ Trộm, 1 Kẻ Chán Đời, 2 Dân
    return { 'Sói': 2, 'Tiên Tri': 1, 'Kẻ Trộm': 1, 'Kẻ Chán Đời': 1, 'Dân': 2, 'Công Chúa': 0 };
  } else if (playerCount === 5) {
    // 8 cards: 2 Sói, 1 Tiên Tri, 1 Kẻ Trộm, 1 Kẻ Chán Đời, 2 Dân, 1 Công Chúa
    return { 'Sói': 2, 'Tiên Tri': 1, 'Kẻ Trộm': 1, 'Kẻ Chán Đời': 1, 'Dân': 2, 'Công Chúa': 1 };
  } else if (playerCount === 6) {
    // 9 cards: 2 Sói, 1 Tiên Tri, 1 Kẻ Trộm, 1 Kẻ Chán Đời, 3 Dân, 1 Công Chúa
    return { 'Sói': 2, 'Tiên Tri': 1, 'Kẻ Trộm': 1, 'Kẻ Chán Đời': 1, 'Dân': 3, 'Công Chúa': 1 };
  } else {
    // playerCount > 6
    const remaining = totalCards - 6; // 2 Sói, 1 Tiên Tri, 1 Kẻ Trộm, 1 Kẻ Chán Đời, 1 Công Chúa already total 6
    return {
      'Sói': 2,
      'Tiên Tri': 1,
      'Kẻ Trộm': 1,
      'Kẻ Chán Đời': 1,
      'Công Chúa': 1,
      'Dân': Math.max(1, remaining),
    };
  }
};
