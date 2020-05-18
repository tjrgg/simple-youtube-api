import { YouTube } from '../YouTube';

import { ResourceKind, ResourceType } from '../types/Resource';

import { Channel } from './Channel';
import { Playlist } from './Playlist';
import { Video } from './Video';

export abstract class Resource {

	public yt: YouTube;

	public raw: any;
	public kind: string;

	public type: ResourceType;
	public full: boolean;

	abstract id: string;

	constructor(yt: YouTube, data: any, type: ResourceType) {
		this.yt = yt;

		this.raw = data;
		this.kind = data.kind;

		this.type = type;
		this.full = data.kind === ResourceKind[this.type];
	}

	abstract fetch(options?: any): Promise<Video | Playlist | Channel>;

	protected abstract patch(data: any): Video | Playlist | Channel;

}
