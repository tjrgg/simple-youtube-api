// Typescript Declaration by
// Taylor Stapleton on November 6th 2018
// For the project simple-youtube-api
// Project: https://github.com/HyperCoder2975/simple-youtube-api
// Writer of this file: https://github.com/OscarXcore

declare module 'simple-youtube-api' {
  class YouTube {
    key: string;
    request: Request;

    constructor(key: string);
    public getVideo(url: string, options?: object): Promise<Video | Error>;
    public getPlaylist(url: string, options?: object): Promise<Playlist | Error>;
    public getChannel(url: string, options?: object): Promise<Channel | Error>;
    public getVideoByID(id: string, options?: object): Promise<Video | Error>;
    public getPlaylistByID(id: string, options?: object): Promise<Playlist | Error>;
    public getChannelByID(id: string, options?: object): Promise<Channel | Error>;
    public search(query: string, limit: number, options?: object): Promise<Array<Video | Playlist | Channel | null>>;
    public searchVideos(query: string, limit: number, options?: object): Promise<Video[]>;
    public searchPlaylists(query: string, limit: number, options?: object): Promise<Playlist[]>;
    public searchChannels(query: string, limit: number, options?: object): Promise<Channel[]>;
    public parseURL(url: string): { video?: string; channel?: string; playlist?: string };
  }

  class Request {
    youtube: YouTube;
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
    youtube: YouTube;
    type: string;
    raw: object;
    full: boolean;
    kind: string;
    id: string;
    title?: string;
    description?: string;
    customURL?: string;
    publishedAt?: Date;
    thumbnails?: Map<string, Thumbnail>;
    defaultLanguage?: string;
    localized?: { title: string; description: string };
    country?: string;
    relatedPlaylists?: { likes: string; favorites: string; uploads: string };
    viewCount?: number;
    commentCount?: number;
    subscriberCount?: number;
    hiddenSubscriberCount?: boolean;
    videoCount?: number;

    constructor(youtube: YouTube, data: object);
    private _patch(data: object): Channel;
    public fetch(options: object): Channel;
    public url(): string;
    static extractID(url: string): string | null;
  }

  class Playlist {
    youtube: YouTube;
    type: string;
    videos: Array<Video>;
    raw: object;
    channel: Channel;
    id: string;
    title?: string;
    description?: string;
    publishedAt?: Date;
    thumbnails?: Map<string, Thumbnail>;
    channelTitle?: string;
    defaultLanguage?: string;
    localized?: { title: string; description: string };
    privacy: string;
    length: number;
    embedHTML: string;

    constructor(youtube: YouTube, data: object);
    private _patch(data: object): Playlist;
    public url(): string;
    public fetch(options: object): Playlist;
    public getVideos(limit: number, options: object): Promise<Video[]>;
    static extractID(url: string): string | null;
  }

  class Video {
    youtube: YouTube;
    type: string;
    raw: object;
    full: boolean;
    kind: string;
    id: string;
    title: string;
    description: string;
    thumbnails: Map<['default', 'medium', 'high', 'standard', 'maxres'], string>;
    publishedAt: Date;
    channel: Channel;
    duration: DurationObject;

    constructor(youtube: YouTube, data: object);
    private _patch(data: object): Video;
    public maxRes(): object;
    public url(): string;
    public shortURL(): string;
    public durationSeconds(): number;
    public fetch(options: object): Video;
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

  enum PARTS {
    Search = 'snippet',
    Videos = 'snippet,contentDetails',
    Playlists = 'snippet',
    PlaylistItems = 'snippet,status',
    Channels = 'snippet'
  }

  enum KINDS {
    Video = 'youtube#video',
    PlaylistItem = 'youtube#playlistItem',
    Playlist = 'youtube#playlist',
    SearchResult = 'youtube#searchResult',
    Channel = 'youtube#channel'
  }

  enum ENDPOINTS {
    PlaylistItems = 'playlistItems',
    Channels = 'channels',
    Videos = 'videos',
    Playlists = 'playlists',
    Search = 'search'
  }
}
