import { YouTube } from '../YouTube';
import { ResourceKind, ResourceType } from '../types/Resource';

export class Resource {

	public yt: YouTube;

	public raw: any;
	public kind: string;

	public type: ResourceType;
	public full: boolean;

	constructor(yt: YouTube, data: any, type: ResourceType) {
		this.yt = yt;

		this.raw = data;
		this.kind = data.kind;

		this.type = type;
		this.full = data.kind === ResourceKind[this.type];
	}

}
