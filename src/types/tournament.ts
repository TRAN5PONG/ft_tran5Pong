import { GameStatus } from "./game";

export type TournamentType = 'singleElimination';
export type TournamentRound = "qualifiers" | "semiFinals" | "final";
export type TournamentStatus = 'registration' | 'ready' | 'inProgress' | 'completed' | 'cancelled';


export interface Tournament {
	id : string;
	name : string;
	desription? : string;
	organizerId : string; // User ID of the organizer
	participants: TournamentPlayer[];
	requiredCurrency: number; // Currency required to join the tournament
}

export interface TournamentMatch {
	id : string;
	tournamentId: string; 
	round: TournamentRound; 
	opponent1: TournamentPlayer; 
	opponent2: TournamentPlayer; 
	status: GameStatus; 
}


export interface TournamentPlayer {
	userId : string;
	currentRound: TournamentRound; 
	isEliminated: boolean;
	isReady: boolean; // Whether the player is ready for the match
}