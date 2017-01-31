const parseURL = require('url').parse;
const YouTube = require('../YouTube');
const Constants = require('../Constants');
const Video = require('./Video');
const Channel = require('./Channel');

/** Represents a YouTube playlist */
class Playlist {
    /**
     * @param {YouTube} youtube The YouTube instance creating this
     * @param {Object} data The data of the playlist
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
        this.type = 'playlist';

        /**
         * This playlist's ID
         * @type {string}
         */
        this.id = data.snippet.playlistId || data.id.playlistId || data.id;

        /**
         * This playlist's title
         * @type {string}
         */
        this.title = data.snippet.title;

        /**
         * This playlist's description
         * @type {string}
         */
        this.description = data.snippet.description;

        /**
         * The date/time this playlist was published
         * @type {Date}
         */
        this.publishedAt = new Date(data.snippet.publishedAt);

        /**
         * The channel this playlist is in
         * @type {Channel}
         */
        this.channel = new Channel(youtube, data);
    }

    /**
     * The URL to this playlist
     * @type {string}
     */
    get url() {
        return `https://www.youtube.com/playlist?list=${this.id}`;
    }

    /**
     * Gets videos in the playlist
     * @param {Number} [limit] Maximum number of videos to obtain.  Fetches all if not provided.
     * @returns {Promise<Video[]>}
     */
    getVideos(limit) {
        return this._getVideos(limit);
    }

    /**
     * Recursively retrieve videos.
     * @param {Number} count Number of videos left to retrieve.
     * @param {?string} pageToken Page token of videos to retrieve.
     * @return {Promise.<Video[]>}
     * @private
     */
    _getVideos(count = Infinity, pageToken = null)    {
        const limit = count > 50 ? 50 : count;
        return this.youtube.request(Constants.ENDPOINTS.PlaylistItems, {'playlistId': this.id, 'part': Constants.PARTS.PlaylistItems, 'maxResults': limit, 'pageToken': pageToken})
            .then(result => {
                if(result.nextPageToken && limit !== count) return this._getVideos(count - limit, pageToken);
                return result.items.map(item => new Video(this.youtube, item));
            });
    }

    /**
     * Get a playlist ID from a string (URL or ID)
     * @param {string} url The string to get the ID from
     * @returns {?string}
     */
    static extractID(url) {
        if(!YouTube.checkBaseURL(url)) return null;

        const parsed = parseURL(url, true);
        let id = parsed.query.list;
        if (!id) {
            const s = parsed.pathname.split('/');
            id = s[s.length - 1];
        }
        return id || null;
    }
}

module.exports = Playlist;
