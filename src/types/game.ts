// Player
export interface Player {
  id: string;
  name: string;
  score: number;
  Avatar: string;
}

// GameStates
export type GameState = "Lobby" | "waiting" | "playing" | "finished" | "paused";

let InitEvent = {
  Table: {
	Pos : {

	},
	Size : {

	}
  },
};
