import { YouTube } from '../YouTube';
import { ResourceKind } from '../types/Resource';
import { parseURL } from '../util/Util';
import { Resource } from './Resource';

export class Channel extends Resource {

	public id: string;

	// snippet
	public description?: string;
	public publishedAt?: Date;
	public thumbnails?: Record<string, unknown>;
	public title?: string;

	// statistics
	public commentCount?: number;
	public hiddenSubscriberCount?: boolean;
	public subscriberCount?: number;
	public videoCount?: number;
	public viewCount?: number;

	// contentDetails
	public relatedPlaylists?: any;

	constructor(yt: YouTube, data: any) {
		super(yt, data, 'channel');

		switch (data.kind) {
			case ResourceKind.channel:
				this.id = data.id;
				break;

			case ResourceKind.playlist:
			case ResourceKind.playlistItem:
			case ResourceKind.video:
				if (data.snippet) {
					this.id = data.snippet.channelId;
				}
				else throw new Error('Attempted to make a channel out of a resource with no channel data.');
				break;

			case ResourceKind.searchResult:
				if (data.id.kind === ResourceKind.channel) {
					this.id = data.id.channelId;
					break;
				}
				else if (data.snippet) {
					this.id = data.snippet.channelId;
					break;
				}
				else throw new Error('Attempted to make a channel out of a search result with no channel data.');

			default:
				throw new Error(`Unknown channel kind: ${data.kind as string}.`);
		}

		if (this.yt.options.fetchAll) this.fetch(data);
		else this.patch(data);
	}

	static extractId(url: string): any {
		const parsedUrl = parseURL(url);
		if (parsedUrl?.channel) return parsedUrl.channel;
		return null;
	}

	public async fetch(options: any): Promise<Channel> {
		const channel = await this.yt.getChannelById(this.id, options);
		return this.patch(channel);
	}

	protected patch(data: any): Channel {
		switch (data.kind) {
			case ResourceKind.playlist:
			case ResourceKind.playlistItem:
			case ResourceKind.video:
			case ResourceKind.searchResult:
				if (data.snippet) {
					this.title = data.snippet.channelTitle;
				}
				else throw new Error('Attempted to make a channel out of a resource with no channel data.');
				break;

			default:
				if (data.snippet) {
					this.title = data.snippet.title;
					this.description = data.snippet.description;
					this.publishedAt = new Date(data.snippet.publishedAt);
					this.thumbnails = data.snippet.thumbnails;
				}

				if (data.statistics) {
					this.commentCount = data.statistics.commentCount;
					this.hiddenSubscriberCount = data.statistics.hiddenSubscriberCount;
					this.subscriberCount = data.statistics.subscriberCount;
					this.videoCount = data.statistics.videoCount;
					this.viewCount = data.statistics.viewCount;
				}

				if (data.contentDetails) {
					this.relatedPlaylists = data.contentDetails.relatedPlaylists;
				}
		}

		return this;
	}

}
