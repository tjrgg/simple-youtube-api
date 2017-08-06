const { parseURL } = require('../util');
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

        /**
         * Videos in this playlist.  Available after calling `getVideos`.
         * @see Playlist#getVideos
         * @type {Array<Video>}
         */
        this.videos = [];
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
     * @param {Object} [options] Options to retrieve for each video.
     * @returns {Promise<Video[]>}
     */
    getVideos(limit, options) {
        return this.youtube.fetchPaginated(Constants.ENDPOINTS.PlaylistItems, limit, Object.assign(
            { 'playlistId': this.id, part: Constants.PARTS.Videos }, options
        )).then(items => this.videos = items.map(i => new Video(this.youtube, i)));
    }

    /**
     * Get a playlist ID from a string (URL or ID)
     * @param {string} url The string to get the ID from
     * @returns {?string}
     */
    static extractID(url) {
        const parsed = parseURL(url);
        if (!parsed || parsed.type !== 'playlist') return null;
        return parsed.id;
    }
}

module.exports = Playlist;
