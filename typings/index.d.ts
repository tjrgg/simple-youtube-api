declare module "simple-youtube-api" {
    
    export class Channel {
        public constructor(youtube: Youtube, data: Object);

        public readonly id: string;
        public readonly title: string;
        public readonly type: string;
        public readonly url: string;
        public readonly youtube: Youtube;

        public static extractID(url: string): string | null;
    }

    export class Playlist {
        public constructor(youtube: Youtube, data: Object);

        public readonly channel: Channel;
        public readonly description: string;
        public readonly id: string;
        public readonly publishedAt: Date;
        public readonly title: string;
        public readonly type: string;
        public readonly url: string;
        public readonly youtube: Youtube;

        public getVideos(limit?: number): Promise<Video[]>;

        public static extractID(url: string): string | null;
    }
    
    export class Video {
        public constructor(youtube: Youtube, data: Object);

        public readonly channel: Channel;
        public readonly description: string;
        public readonly duration?: DurationObject;
        public readonly durationSeconds: string;
        public readonly id: string;
        public readonly publishedAt: Date;
        public readonly shortURL: string;
        public readonly title: string;
        public readonly type: string;
        public readonly url: string;
        public readonly youtube: Youtube;

        public static extractID(url: string): string | null;
    }
    
    export class Youtube {
        public constructor(key: string);

        public readonly key: string;

        public getChannel(url: string): Promise<Channel[]>;
        public getChannelByID(id: string): Promise<Channel[]>;
        public getPlaylist(url: string): Promise<Playlist[]>;
        public getPlaylistByID(id: string): Promise<Playlist[]>;
        public getVideo(url: string): Promise<Video>;
        public getVideoByID(id: string): Promise<Video>;
        public request(endpoint: string, qs?: Object): Promise<Object>;
        public search(query: string, limit?: number, options?: Object): Promise<Array<Video | Playlist | Channel | Object>>;
        public searchChannels(query: string, limit?: number, options?: Object): Promise<Channel[]>;
        public searchPlaylists(query: string, limit?: number, options?: Object): Promise<Playlist[]>;
        public searchVideos(query: string, limit?: number, options?: Object): Promise<Video[]>;
    }

    type DurationObject = {
        hours: number;
        minutes: number;
        seconds: number;
    }
}