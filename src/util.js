const { parse } = require('url');

/**
 * Parse a string as a potential YouTube resource URL.
 * @param {string} url
 * @returns {?{type: string, id: string}}
 */
exports.parseURL = (url) => {
    const parsed = parse(url, true);
    switch (parsed.hostname) {
        case 'www.youtube.com':
        case 'youtube.com':
        case 'm.youtube.com': {
            const idRegex = /^[a-zA-Z0-9-_]+$/;
            if (parsed.pathname === '/watch') {
                if (!idRegex.test(parsed.query.v)) return null;
                return {
                    type: 'video',
                    id: parsed.query.v
                };
            } else if (parsed.pathname === '/playlist') {
                if(!idRegex.test(parsed.query.list)) return null;
                return {
                    type: 'playlist',
                    id: parsed.query.list
                };
            } else if (parsed.pathname.startsWith('/channel/')) {
                const id = parsed.pathname.replace('/channel/', '');
                if (!idRegex.test(id)) return null;
                return {
                    type: 'channel',
                    id
                };
            }

            return null;
        }
        case 'youtu.be':
            return /\/^[a-zA-Z0-9-_]+$/.test(parsed.pathname) ? { type: 'video', id: parsed.pathname.slice(1) } : null;
        default:
            return null;
    }
};
