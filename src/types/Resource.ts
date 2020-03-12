export enum ResourceEndpoint {
	channel = 'channels',
	playlist = 'playlists',
	playlistItem = 'playlistItems',
	search = 'search',
	video = 'videos'
}

export enum ResourceKind {
	channel = 'youtube#channel',
	playlist = 'youtube#playlist',
	playlistItem = 'youtube#playlistItem',
	searchResult = 'youtube#searchResult',
	video = 'youtube#video'
}

export enum ResourcePart {
	channel = 'snippet',
	playlist = 'snippet',
	playlistItem = 'snippet,status',
	search = 'snippet',
	video = 'snippet,contentDetails'
}

export type ResourceType = 'channel' | 'playlist' | 'video';
