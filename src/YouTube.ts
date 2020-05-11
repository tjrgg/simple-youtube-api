import fetch from 'node-fetch';

import { Channel } from './structures/Channel';
import { Playlist } from './structures/Playlist';
import { Resource } from './structures/Resource';
import { Video } from './structures/Video';

import { RequestOptions, RequestQueryString, RequestResult } from './types/Request';
import { ResourceEndpoint, ResourceKind, ResourcePart, ResourceType } from './types/Resource';

export interface Options {
	cache: boolean;
	fetchAll: boolean;
}

/**
 * The main YouTube class.
 */
export default class YouTube {

	public options: Options;

	readonly #key: string;

	public constructor(key: string, options?: Options) {
		this.#key = key;
		this.options = {
			cache: options?.cache || true,
			fetchAll: options?.fetchAll || false
		};
	}

	public async getResource(type: ResourceType, qs = {}): Promise<Resource> {
		// eslint-disable-next-line security/detect-object-injection
		qs = { part: ResourcePart[type], ...qs };

		// eslint-disable-next-line security/detect-object-injection
		const result = await this.request(ResourceEndpoint[type], qs);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		if (result.items.length > 0) return result.items[0];
		throw new Error(`Resource ${result.kind || type} not found`);
	}

	public async getResourceByID(type: ResourceType, id: string, qs = {}): Promise<Resource> {
		return this.getResource(type, Object.assign(qs, { id }));
	}


	public async getChannel(url: string, options: Record<string, unknown> = {}): Promise<Channel | null> {
		const id = Channel.extractId(url);
		if (!id) throw new Error(`No channel ID found in URL: ${url}`);
		return this.getChannelById(id, options);
	}

	public async getChannelById(id: string, options: any = {}): Promise<Channel | null> {
		const result = await this.getResourceByID('channel', id, options);
		if (result) return new Channel(this, result);
		return null;
	}

	public async getPlaylist(url: string, options: Record<string, unknown> = {}): Promise<Playlist | null> {
		const id = Playlist.extractId(url);
		if (!id) throw new Error(`No playlist ID found in URL: ${url}`);
		return this.getPlaylistById(id, options);
	}

	public async getPlaylistById(id: string, options: any = {}): Promise<Playlist | null> {
		const result = await this.getResourceByID('playlist', id, options);
		if (result) return new Playlist(this, result);
		return null;
	}

	public async getVideo(url: string, options: Record<string, boolean | string> = {}): Promise<Video | null> {
		const id = Video.extractId(url);
		if (!id) throw new Error(`No video ID found in URL: ${url}`);
		return this.getVideoById(id, options);
	}

	public async getVideoById(id: string, options: any = {}): Promise<Video | null> {
		const result = await this.getResourceByID('video', id, options);
		if (result) return new Video(this, result);
		return null;
	}


	public async search(query: string, limit = 5, options: RequestOptions = {}): Promise<Array<Resource | undefined>> {
		const result = await this.paginatedRequest(ResourceEndpoint.search, limit, Object.assign(options, { q: query, part: ResourcePart.search }));
		return result.map((item) => {
			if (item.id.kind === ResourceKind.video) return new Video(this, item);
			if (item.id.kind === ResourceKind.playlist) return new Playlist(this, item);
			if (item.id.kind === ResourceKind.channel) return new Channel(this, item);
			return undefined;
		});
	}

	public async searchVideos(query: string, limit = 5, options: RequestOptions = {}): Promise<Array<Resource | undefined>> {
		return this.search(query, limit, Object.assign(options, { type: 'video' }));
	}


	public async request(endpoint: ResourceEndpoint, qs: RequestQueryString = {}): Promise<RequestResult> {
		qs = { key: this.#key, ...qs };
		// // eslint-disable-next-line security/detect-object-injection
		// @ts-ignore
		const parameters = Object.keys(qs).filter((k: string) => qs[k]).map((k: string) => `${k}=${qs[k]}`);

		// eslint-disable-next-line unicorn/prevent-abbreviations
		const res = await fetch(encodeURI(`https://www.googleapis.com/youtube/v3/${endpoint}${parameters.length > 0 ? `?${parameters.join('&')}` : ''}`));
		const result = await res.json();
		if (result.error) {
			if (result.error.code === 400) {
				if (result.error.errors && result.error.errors.length > 0) {
					throw new Error(`YouTube API Error: ${result.error.errors[0].domain as string} - ${result.error.errors[0].reason as string}`);
				}
			}
			else throw new Error(`An unknown YouTube API error occurred: ${result.error.code as string || result.error as string}`);
		}

		return result;
	}

	// eslint-disable-next-line max-params
	public async paginatedRequest(endpoint: ResourceEndpoint, count = 50, options: RequestOptions = {}, fetched: any[] = [], pageToken?: string): Promise<any[]> {
		if (count < 1) throw new Error('Cannot fetch less than 1.');

		const limit = count > 50 ? 50 : count;
		// eslint-disable-next-line unicorn/prevent-abbreviations
		const res = await this.request(endpoint, { maxResults: limit, pageToken, ...options });
		const results = fetched.concat(res.items);
		if (res.nextPageToken && limit !== count) return this.paginatedRequest(endpoint, count - limit, options, results, res.nextPageToken);
		return results;
	}

}
