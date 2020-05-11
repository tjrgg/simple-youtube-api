export interface ParsedURL {
	channel?: string | null;
	playlist?: string | null;
	video?: string | null;
}

export const parseURL = (url: string): ParsedURL => {
	const parsed = new URL(url);
	switch (parsed.hostname) {
		case 'www.youtube.com':
		case 'youtube.com':
		case 'm.youtube.com':
		case 'music.youtube.com': {
			const idRegex = /^[a-zA-Z0-9-_]+$/;
			if (parsed.pathname === '/watch') {
				if (!idRegex.test(parsed.searchParams.get('v') as string)) return {};
				const response: ParsedURL = { video: parsed.searchParams.get('v') };
				if (parsed.searchParams.has('list')) response.playlist = parsed.searchParams.get('list');
				return response;
			}

			if (parsed.pathname === '/playlist') {
				if (!idRegex.test(parsed.searchParams.get('list') as string)) return {};
				return { playlist: parsed.searchParams.get('list') };
			}

			if (parsed.pathname.startsWith('/channel/')) {
				const id = parsed.pathname.replace('/channel/', '');
				if (!idRegex.test(id)) return {};
				return { channel: id };
			}

			if (parsed.pathname.startsWith('/browse/')) {
				const id = parsed.pathname.replace('/browse/', '');
				if (!idRegex.test(id)) return {};
				return { channel: id };
			}

			return {};
		}

		case 'youtu.be':
			const response: ParsedURL = { video: /^\/[a-zA-Z0-9-_]+$/.test(parsed.pathname) ? parsed.pathname.slice(1) : null };
			if (parsed.searchParams.has('list')) response.playlist = parsed.searchParams.get('list');
			return response;

		default:
			return {};
	}
};
