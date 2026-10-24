export interface DiscordOAuth2Config {
    clientId: string;
    redirectUri: string;
    scopes: string[];
}

export interface DiscordUser {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    discriminator?: string;
}

export interface DiscordGuildMember {
    nick: string | null;
    roles: string[];
    joined_at: string;
}