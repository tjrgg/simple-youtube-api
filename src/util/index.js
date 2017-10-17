const { parse } = require('url');

function formatOutput(obj = {}) {
    return Object.assign({ playlist: null, video: null, channel: null }, obj);
}

/**
 * Parse a string as a potential YouTube resource URL.
 * @param {string} url
 * @returns {{video, channel, playlist}}
 */
exports.parseURL = (url) => {
    const parsed = parse(url, true);
    switch (parsed.hostname) {
        case 'www.youtube.com':
        case 'youtube.com':
        case 'm.youtube.com': {
            const idRegex = /^[a-zA-Z0-9-_]+$/;
            if (parsed.pathname === '/watch') {
                if (!idRegex.test(parsed.query.v)) return formatOutput();
                return formatOutput({
                    video: parsed.query.v,
                    playlist: parsed.query.list || null,
                });
            } else if (parsed.pathname === '/playlist') {
                if(!idRegex.test(parsed.query.list)) return formatOutput();
                return formatOutput({ playlist: parsed.query.list });
            } else if (parsed.pathname.startsWith('/channel/')) {
                const id = parsed.pathname.replace('/channel/', '');
                if (!idRegex.test(id)) return formatOutput();
                return formatOutput({ channel: id });
            }

            return formatOutput();
        }
        case 'youtu.be':
            return formatOutput({ video: /^\/[a-zA-Z0-9-_]+$/.test(parsed.pathname) ? parsed.pathname.slice(1) : null });
        default:
            return formatOutput();
    }
};
