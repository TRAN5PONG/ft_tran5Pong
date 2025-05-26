import { User } from './user';

export type ChatType = 'private' | 'tournament';

export type ChatReactionType = 'like' | 'dislike' | 'laugh' | 'sad' | 'angry';

export interface ChatReaction {
	from: User;
	type: ChatReactionType;
}

export interface ChatMessage {
	from: User;
	date: Date;
	message: string;
	isRead: boolean;
	reactions: ChatReaction[];
}
