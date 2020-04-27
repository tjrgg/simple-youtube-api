import fetch from 'node-fetch';

import { Channel } from './structures/Channel';
import { Playlist } from './structures/Playlist';
import { Video } from './structures/Video';

import { ResourceEndpoint, ResourcePart, ResourceType } from './types/Resource';

export interface Options {
	cache: boolean;
	fetchAll: boolean;
}

/**
 * The main YouTube class.
 */
export class YouTube {

	public options: Options;

	readonly #key: string;

	public constructor(key: string, options?: Options) {
		this.#key = key;
		this.options = {
			cache: options?.cache || true,
			fetchAll: options?.fetchAll || false
		};
	}

	public async getResource(type: ResourceType, qs = {}): Promise<any> {
		// eslint-disable-next-line security/detect-object-injection
		qs = { part: ResourcePart[type], ...qs };

		// eslint-disable-next-line security/detect-object-injection
		const result = await this.request(ResourceEndpoint[type], qs);
		if (result.items.length > 0) return result.items[0];
		throw new Error(`Resource ${result.kind as string || type} not found`);
	}

	public async getResourceByID(type: ResourceType, id: string, qs = {}): Promise<any> {
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

	public async getVideo(url: string, options: Record<string, unknown> = {}): Promise<Video | null> {
		const id = Video.extractId(url);
		if (!id) throw new Error(`No video ID found in URL: ${url}`);
		return this.getVideoById(id, options);
	}

	public async getVideoById(id: string, options: any = {}): Promise<Video | null> {
		const result = await this.getResourceByID('video', id, options);
		if (result) return new Video(this, result);
		return null;
	}


	public async request(endpoint: ResourceEndpoint, qs: Record<string, string> = {}): Promise<any> {
		qs = { key: this.#key, ...qs };
		// eslint-disable-next-line security/detect-object-injection
		const params = Object.keys(qs).filter((k) => qs[k]).map((k) => `${k}=${qs[k]}`);

		const res = await fetch(encodeURI(`https://www.googleapis.com/youtube/v3/${endpoint}${params.length > 0 ? `?${params.join('&')}` : ''}`));
		const result = await res.json();
		if (result.error) {
			if (result.error.code === 400) {
				if (result.error.errors && result.error.errors.length > 0) {
					throw new Error(`YouTube API Error: ${result.error.errors[0].domain as string} - ${result.error.errors[0].reason as string}`);
				}
			} else throw new Error(`An unknown YouTube API error occurred: ${result.error.code as string || result.error as string}`);
		}

		return result;
	}

}
