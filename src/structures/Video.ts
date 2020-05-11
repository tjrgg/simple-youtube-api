import YouTube from '../YouTube';
import { ResourceKind } from '../types/Resource';
import { parseURL } from '../util/Util';
import { Channel } from './Channel';
import { Resource } from './Resource';

import { Duration, parse, toSeconds } from 'iso8601-duration';

export class Video extends Resource {

	public id: string;

	public channel?: Channel;
	public url?: string;

	// snippet
	public description?: string;
	public publishedAt?: Date;
	public publishedTimestamp?: string;
	public thumbnails?: Record<string, unknown>;
	public title?: string;

	// contentDetails
	public duration?: Duration | string | null;
	public durationSeconds?: number | null;

	constructor(yt: YouTube, data: any) {
		super(yt, data, 'video');

		switch (data.kind) {
			case ResourceKind.video:
				this.id = data.id;
				break;

			case ResourceKind.playlistItem:
				if (data.snippet) {
					if (data.snippet.resourceId.kind === ResourceKind.video) this.id = data.snippet.resourceId.videoId;
					else throw new Error('Attempted to make a video out of a non-video playlist item.');
				} else throw new Error('Attempted to make a video out of a playlist item with no video data.');
				break;

			case ResourceKind.searchResult:
				if (data.id.kind === ResourceKind.video) this.id = data.id.videoId;
				else throw new Error('Attempted to make a video out of a non-video search result.');
				break;

			default:
				throw new Error(`Unknown video kind: ${data.kind as string}.`);
		}

		this.patch(data);
	}

	static extractId(url: string): any {
		const parsedUrl = parseURL(url);
		if (parsedUrl?.video) return parsedUrl.video;
		return null;
	}

	public async fetch(options: any = {}): Promise<Video> {
		const video = await this.yt.getVideoById(this.id, options);
		return this.patch(video);
	}

	protected patch(data: any): Video {
		this.channel = new Channel(this.yt, data);
		this.url = `https://www.youtube.com/watch?v=${this.id}`;

		if (data.snippet) {
			this.title = data.snippet.title;
			this.description = data.snippet.description;
			this.publishedAt = new Date(data.snippet.publishedAt);
			this.publishedTimestamp = data.snippet.publishedAt;
			this.thumbnails = data.snippet.thumbnails;
		}

		if (data.contentDetails) {
			this.duration = data.contentDetails.duration ? parse(data.contentDetails.duration) : null;
			this.durationSeconds = data.contentDetails.duration ? toSeconds(data.contentDetails.duration) : null;
		}

		return this;
	}

}
