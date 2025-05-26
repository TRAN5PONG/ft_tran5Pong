export type GameMode = 'singlePlayer' | 'multiplayer' | 'tournament';
export type GameStatus = 'waiting' | 'inProgress' | 'completed' | 'paused' | 'cancelled';
export type powerUps = 'speedBoost' | 'slowDown' | 'shield' | 'Confusion';


export interface MatchPlayer {
  userId: string; // User ID of the player
  finalScore: number; // Current score of the player
  isReady: boolean; // Whether the player is ready to start the match
  isHost: boolean; // Whether the player is the host of the match
  stats : PlayerStats; // Player statistics
} 

export interface GameSettings {
  ballSize: number;
  ballSpeed: number;
  rules : GameRules;
}

export interface GameRules {
  maxScore: number; // Maximum score to win the game ex: 10
  maxPauseTime?: number; // Maximum time allowed for a pause in seconds (only for multiplayer)
  allowPowerUps: boolean; // Whether power-ups are enabled
}

export interface Match {
  id : string;
  mode: GameMode; // Game mode
  status: GameStatus; // Current status of the match
  opponent1 : MatchPlayer; // Player 1 in the match
  opponent2 : MatchPlayer; // Player 2 in the match
}

export interface PlayerStats {

}

