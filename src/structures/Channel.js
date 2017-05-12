const parseURL = require('url').parse;
const { checkBaseURL } = require('../util');

/** Represents a YouTube channel */
class Channel {
    /**
     * @param {YouTube} youtube The YouTube instance creating this
     * @param {Object} data The data of the channel
     */
    constructor(youtube, data) {
        /**
         * The YouTube instance that created this
         * @type {YouTube}
         */
        this.youtube = youtube;
        Object.defineProperty(this, 'youtube', { enumerable: false });

        /**
         * The type to filter search results
         * @type {string}
         */
        this.type = 'channel';

        /**
         * This channel's ID
         * @type {string}
         */
        this.id = data.snippet.channelId || data.id.channelId || data.id;

        /**
         * This channel's title
         * @type {string}
         */
        this.title = data.snippet.channelTitle || data.snippet.title;
    }

    /**
     * The URL to this channel
     * @type {string}
     */
    get url() {
        return `https://www.youtube.com/channel/${this.id}`;
    }

    /**
     * Get a channel ID from a string (URL or ID)
     * @param {string} url The string to get the ID from
     * @returns {?string}
     */
    static extractID(url) {
        if(!checkBaseURL(url)) return null;

        const parsed = parseURL(url, true);
        const s = parsed.pathname.split('/');
        const id = s[s.length - 1];
        return id || null;
    }
}

module.exports = Channel;
