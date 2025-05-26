export interface User {
	id : string;
	username: string;
	firstName: string;
	lastName: string;
	isOnline: boolean;
	lastSeen: Date;
	avatar : string;
	banner?: string;
	bio?: string;
	createdAt: Date;
	updatedAt: Date;
	// Profile Stats
	totalGames: number;
	wins: number;
	losses: number;
	rank : number;
	level: number;
	friends: string[]; // Array of user IDs
	blockedUsers: string[]; // Array of user IDs
	twoFactorEnabled: boolean;
	isVerified: boolean;
	walletBalance: number; // In-game currency balance
}

export interface UserProfile {
	matchHistory: string[]; // Array of match IDs
	preferences: UserPreferences;
}

export interface UserPreferences {
	soundEnabled: boolean;
	notifications: NotificationSettings;
}

export interface NotificationSettings {
	friendRequests: boolean;
	chatMessages: boolean;
	gameInvites: boolean;
	tournamentUpdates: boolean;
}