// Typescript Declaration by
// Taylor Stapleton on November 6th 2018
// For the project simple-youtube-api
// Project: https://github.com/HyperCoder2975/simple-youtube-api
// Writer of this file: https://github.com/OscarXcore

declare module 'simple-youtube-api' {
  class YouTube {
    public key: string;
    public request: Request;

    constructor(key: string);
    public getVideo(url: string, options?: object): Promise<Video | null>;
    public getPlaylist(url: string, options?: object): Promise<Playlist | null>;
    public getChannel(url: string, options?: object): Promise<Channel | null>;
    public getVideoByID(id: string, options?: object): Promise<Video | null>;
    public getPlaylistByID(id: string, options?: object): Promise<Playlist | null>;
    public getChannelByID(id: string, options?: object): Promise<Channel | null>;
    public search(query: string, limit: number, options?: object): Promise<Array<Video | Playlist | Channel | null>>;
    public searchVideos(query: string, limit: number, options?: object): Promise<Video[]>;
    public searchPlaylists(query: string, limit: number, options?: object): Promise<Playlist[]>;
    public searchChannels(query: string, limit: number, options?: object): Promise<Channel[]>;

    static Request: typeof Request;
    static Channel: typeof Channel;
    static Playlist: typeof Playlist;
    static Video: typeof Video;
    static util: { parseURL(url: string): { video?: string; channel?: string; playlist?: string } };
  }

  class Request {
    public youtube: YouTube;

    constructor(youtube: YouTube);
    public make(endpoint: string, qs: object): Promise<object>;
    public getResource(type: string, qs: object): Promise<object>;
    public getResourceByID(type: string, id: string, qs: object): Promise<object>;
    public getVideo(id: string, options: object): Promise<object>;
    public getPlaylist(id: string, options: object): Promise<object>;
    public getChannel(id: string, options: object): Promise<object>;
    public getPaginated(endpoint: string, count: number, options: object, fetched: Array<object>, pageToken?: string): Promise<Array<object>>;
  }

  class Channel {
    public youtube: YouTube;
    public type: string;
    public raw: object;
    public full: boolean;
    public kind: string;
    public id: string;
    public title?: string;
    public description?: string;
    public customURL?: string;
    public publishedAt?: Date;
    public thumbnails?: Thumbnail
    public defaultLanguage?: string;
    public localized?: { title: string; description: string };
    public country?: string;
    public relatedPlaylists?: { likes: string; favorites: string; uploads: string };
    public viewCount?: number;
    public commentCount?: number;
    public subscriberCount?: number;
    public hiddenSubscriberCount?: boolean;
    public videoCount?: number;
    public readonly url: string;

    constructor(youtube: YouTube, data: object);
    private _patch(data: object): this;
    public fetch(options: object): Promise<this>;
    static extractID(url: string): string | null;
  }

  class Playlist {
    public youtube: YouTube;
    public type: string;
    public videos: Array<Video>;
    public raw: object;
    public channel: Channel;
    public id: string;
    public title?: string;
    public description?: string;
    public publishedAt?: Date;
    public thumbnails?: Thumbnail;
    public channelTitle?: string;
    public defaultLanguage?: string;
    public localized?: { title: string; description: string };
    public privacy: string;
    public length: number;
    public embedHTML: string;
    public readonly url: string;

    constructor(youtube: YouTube, data: object);
    private _patch(data: object): this;
    public fetch(options: object): Promise<this>;
    public getVideos(limit: number, options: object): Promise<Video[]>;
    static extractID(url: string): string | null;
  }

  class Video {
    public youtube: YouTube;
    public type: string;
    public raw: object;
    public full: boolean;
    public kind: string;
    public id: string;
    public title: string;
    public description: string;
    public thumbnails: { default: string, medium: string, high: string, standard: string, maxres: string };
    public publishedAt: Date;
    public channel: Channel;
    public duration: DurationObject;
    public readonly url: string;
    public readonly maxRes: object;
    public readonly shortURL: string;
    public readonly durationSeconds: number;

    constructor(youtube: YouTube, data: object);
    private _patch(data: object): this;
    public fetch(options: object): Promise<this>;
    static extractID(url: string): string | null;
  }

  interface DurationObject {
    hours: number;
    minutes: number;
    seconds: number;
  }

  interface Thumbnail {
    url: string;
    width: number;
    height: number;
  }

  export = YouTube;
}
