const { parseURL } = require('../util');
const Constants = require('../util/Constants');

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

        this._patch(data);
    }

    _patch(data) {
        if (!data) return;

        /**
         * Raw data from the YouTube API
         */
        this.raw = data;

        /**
         * Whether this is a full channel object.
         */
        this.full = data.kind === Constants.KINDS.Channel;

        /**
         * The YouTube resource from which this channel was created.
         */
        this.kind = data.kind;

        /**
         * This channel's ID
         * @type {string}
         * @name Channel#id
         */

        /**
         * This channel's title
         * @type {string}
         * @name Channel#title
         */

        switch (data.kind) {
            case Constants.KINDS.Playlist:
            case Constants.KINDS.PlaylistItem:
            case Constants.KINDS.Video:
                if (data.snippet) {
                    this.id = data.snippet.channelId;
                    this.title = data.snippet.channelTitle;
                    return;
                } else {
                    throw new Error('Attempted to make a channel out of a resource with no channel data.');
                }
            case Constants.KINDS.SearchResult:
                if (data.id.kind === Constants.KINDS.Channel) {
                    this.id = data.id.channelId;
                    break;
                } else if (data.snippet) {
                    this.id = data.snippet.channelId;
                    this.title = data.snippet.channelTitle;
                    return;
                } else throw new Error('Attempted to make a channel out of a search result with no channel data.');
            case Constants.KINDS.Channel:
                this.id = data.id;
                break;
            default:
                throw new Error(`Unknown channel kind: ${data.kind}.`);
        }
    }

    fetch(options) {
        return this.youtube.request.getChannel(this.id, options).then(this._patch.bind(this));
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
        const parsed = parseURL(url);
        if (!parsed || parsed.type !== 'channel') return null;
        return parsed.id;
    }
}

module.exports = Channel;
