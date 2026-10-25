export interface Mee6Player {
    id: string;
    username: string;
    level: number;
    xp: number;
    message_count: number;
}

export interface Mee6Level {
    level: number;
    xp: number;
    messages: number;
    rank: number;
}