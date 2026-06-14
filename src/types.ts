export type RoleType = 'Sói' | 'Dân' | 'Tiên Tri' | 'Kẻ Trộm' | 'Kẻ Chán Đời' | 'Công Chúa';

export interface RoleDef {
  type: RoleType;
  name: string;
  description: string;
  faction: 'Sói' | 'Dân' | 'Kẻ Chán Đời';
  color: string;
  count: number;
}

export interface Player {
  id: string;
  name: string;
  initialRole: RoleType;
  finalRole: RoleType;
  votedFor?: string; // Player ID they voted for
  stolenByRobber?: boolean;
  stoleFromPlayerName?: string;
  robbedInitialRole?: RoleType;
}

export type GameState = 
  | 'setup'       // Set player count + select roles
  | 'names'       // Input names
  | 'reveal'      // Secretly view initial role
  | 'night_intro' // Closing eyes, getting ready
  | 'night_wolf'  // Werewolf wake up
  | 'night_seer'  // Seer wake up
  | 'night_robber'// Robber wake up
  | 'day_discuss' // Discuss with timer
  | 'voting'      // Pick who to execute
  | 'result';     // Show winner and cards
