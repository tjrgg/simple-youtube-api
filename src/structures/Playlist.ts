import { YouTube } from '../YouTube';
import { ResourceKind } from '../types/Resource';
import { parseURL } from '../util/Util';
import { Channel } from './Channel';
import { Resource } from './Resource';

export class Playlist extends Resource {

	public id: string;

	public channel?: Channel;
	public url?: string;

	// snippet
	public description?: string;
	public publishedAt?: Date;
	public publishedTimestamp?: string;
	public thumbnails?: Record<string, unknown>;
	public title?: string;

	public channelTitle?: string;
	public defaultLanguage?: string;

	// status
	public privacy?: string;

	// contentDetails
	public itemCount?: number;

	// player
	public embed?: string;

	constructor(yt: YouTube, data: any) {
		super(yt, data, 'playlist');

		switch (data.kind) {
			case ResourceKind.playlist:
				this.id = data.id;
				break;

			case ResourceKind.playlistItem:
				if (data.snippet) this.id = data.snippet.playlistId;
				else throw new Error('Attempted to make a playlist out of a resource with no playlist data.');
				break;

			case ResourceKind.searchResult:
				if (data.id.kind === ResourceKind.playlist) this.id = data.id.playlistId;
				else throw new Error('Attempted to make a playlist out of a search result with no playlist data.');
				break;

			default:
				throw new Error(`Unknown playlist kind: ${data.kind as string}.`);
		}

		if (this.yt.options.fetchAll) this.fetch(data);
		else this.patch(data);
	}

	static extractId(url: string): any {
		const parsedUrl = parseURL(url);
		if (parsedUrl?.playlist) return parsedUrl.playlist;
		return null;
	}

	public async fetch(options: any): Promise<Playlist> {
		const playlist = await this.yt.getPlaylistById(this.id, options);
		return this.patch(playlist);
	}

	private patch(data: any): Playlist {
		this.channel = new Channel(this.yt, data);
		this.url = `https://www.youtube.com/playlist?list=${this.id}`;

		if (data.snippet) {
			this.title = data.snippet.title;
			this.description = data.snippet.description;
			this.publishedAt = new Date(data.snippet.publishedAt);
			this.publishedTimestamp = data.snippet.publishedAt;
			this.thumbnails = data.snippet.thumbnails;

			this.channelTitle = data.snippet.channelTitle;
			this.defaultLanguage = data.snippet.defaultLanguage;
		}

		if (data.status) {
			this.itemCount = data.status.itemCount;
		}

		if (data.contentDetails) {
			this.itemCount = data.contentDetails.itemCount;
		}

		if (data.player) {
			this.embed = data.player.embedHtml;
		}

		return this;
	}

}
