import React, { useState } from 'react';
import { Player, RoleType, GameState } from './types';
import RoleSetup from './components/RoleSetup';
import PlayerNames from './components/PlayerNames';
import RoleReveal from './components/RoleReveal';
import NightStep from './components/NightStep';
import DayDiscussion from './components/DayDiscussion';
import Voting from './components/Voting';

// Helper function to distribute roles to players and center cards
function distributeRoles(
  playerCount: number,
  roleSelection: Record<RoleType, number>
): { playerRoles: RoleType[]; centerRoles: RoleType[] } {
  const totalCardsNeeded = playerCount + 3;
  const uniqueRoles: RoleType[] = ['Tiên Tri', 'Kẻ Trộm', 'Kẻ Chán Đời', 'Công Chúa'];

  // Create deck of all chosen cards
  const deck: RoleType[] = [];
  for (const [role, count] of Object.entries(roleSelection)) {
    // Unique roles are strictly capped at most 1 card
    const clampCount = uniqueRoles.includes(role as RoleType) ? Math.min(1, count) : count;
    for (let i = 0; i < clampCount; i++) {
      deck.push(role as RoleType);
    }
  }

  // Backups/fallback safety
  while (deck.length < totalCardsNeeded) {
    deck.push('Dân');
  }
  while (deck.length > totalCardsNeeded) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    deck.splice(randomIndex, 1);
  }

  const hasWolfInDeck = deck.includes('Sói');
  let playerRoles: RoleType[] = [];
  let centerRoles: RoleType[] = [];
  let attempts = 0;

  // Reshuffle until the player hand has at least one werewolf, if there is a werewolf in the deck.
  while (attempts < 1000) {
    attempts++;
    // Shuffle the deck (Fisher-Yates)
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    playerRoles = shuffled.slice(0, playerCount);
    centerRoles = shuffled.slice(playerCount);

    if (!hasWolfInDeck) {
      break; // No wolf in config, can't distribute one
    }

    // Ensure there is at least one wolf in player roles
    if (playerRoles.includes('Sói')) {
      break;
    }
  }

  return { playerRoles, centerRoles };
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [roleSelection, setRoleSelection] = useState<Record<RoleType, number>>({
    'Sói': 2,
    'Dân': 2,
    'Tiên Tri': 1,
    'Kẻ Trộm': 1,
    'Kẻ Chán Đời': 1,
    'Công Chúa': 1,
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [centerCards, setCenterCards] = useState<RoleType[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>([]);

  // 1. Finished choosing player count & roles
  const handleSetupComplete = (count: number, selection: Record<RoleType, number>) => {
    setPlayerCount(count);
    setRoleSelection(selection);
    setGameState('names');
  };

  // 2. Finished typing player names -> distribute roles & start revealing
  const handleNamesComplete = (names: string[]) => {
    setSavedNames(names);
    const { playerRoles, centerRoles } = distributeRoles(playerCount, roleSelection);
    
    // Construct initial players list
    const initialPlayers: Player[] = names.map((name, index) => {
      const role = playerRoles[index];
      return {
        id: `p-${index}-${Math.random().toString(36).substring(2, 6)}`,
        name,
        initialRole: role,
        finalRole: role,
      };
    });

    setPlayers(initialPlayers);
    setCenterCards(centerRoles);
    setGameState('reveal');
  };

  // 3. Finished reading secret roles
  const handleRevealComplete = () => {
    setGameState('night_intro');
  };

  // 4. Finished Night actions
  const handleNightComplete = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
    setGameState('day_discuss');
  };

  // 5. Finished day discussion
  const handleDiscussComplete = () => {
    setGameState('voting');
  };

  // Reset & start a new game (goes back to setup but retains setup and names info)
  const handleRestart = () => {
    // We do NOT clear setSavedNames, setRoleSelection or setPlayerCount to preserve them
    setPlayers([]);
    setCenterCards([]);
    setGameState('setup');
  };

  // Fast restart same configuration & names
  const handleFastRestart = () => {
    const currentNames = players.length > 0 ? players.map(p => p.name) : (savedNames.length === playerCount ? savedNames : Array.from({ length: playerCount }, (_, i) => `Người chơi ${i + 1}`));
    const { playerRoles, centerRoles } = distributeRoles(playerCount, roleSelection);
    
    const newPlayers: Player[] = currentNames.map((name, index) => {
      const role = playerRoles[index];
      return {
        id: `p-${index}-${Math.random().toString(36).substring(2, 6)}`,
        name,
        initialRole: role,
        finalRole: role,
      };
    });

    setPlayers(newPlayers);
    setCenterCards(centerRoles);
    setGameState('reveal');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Decorative stars / dust / background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none z-0" />

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center py-8 px-4 z-10">
        <div className="w-full">
          {gameState === 'setup' && (
            <RoleSetup 
              initialPlayerCount={playerCount}
              initialRoleSelection={roleSelection}
              onComplete={handleSetupComplete} 
            />
          )}

          {gameState === 'names' && (
            <PlayerNames 
              playerCount={playerCount} 
              initialNames={savedNames}
              onComplete={handleNamesComplete} 
              onBack={() => setGameState('setup')} 
            />
          )}

          {gameState === 'reveal' && (
            <RoleReveal 
              players={players} 
              onComplete={handleRevealComplete}
              onBack={() => setGameState('names')}
            />
          )}

          {(gameState === 'night_intro' || gameState === 'night_wolf' || gameState === 'night_seer' || gameState === 'night_robber') && (
            <NightStep 
              players={players} 
              centerCards={centerCards} 
              onComplete={handleNightComplete}
            />
          )}

          {gameState === 'day_discuss' && (
            <DayDiscussion onComplete={handleDiscussComplete} />
          )}

          {gameState === 'voting' && (
            <Voting 
              players={players} 
              centerCards={centerCards} 
              onRestart={handleRestart}
              onFastRestart={handleFastRestart}
            />
          )}
        </div>
      </main>

    </div>
  );
}
