const { parseURL } = require('../util');
const Constants = require('../util/Constants');
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
         * Videos in this playlist.  Available after calling {@link Playlist#getVideos}.
         * @type {Array<Video>}
         */
        this.videos = [];

        this._patch(data);
    }

    _patch(data) {
        if (!data) return;

        this.raw = data;

        /**
         * This playlist's ID
         * @type {string}
         * @name Playlist#id
         */

        switch (data.kind) {
            case Constants.KINDS.SearchResult:
                if (data.id.kind === Constants.KINDS.Playlist) this.id = data.id.playlistId;
                else throw new Error('Attempted to make a playlist out of a non-playlist search result.');
                break;
            case Constants.KINDS.Playlist:
                this.id = data.id;
                break;
            case Constants.KINDS.PlaylistItem:
                if (data.snippet) this.id = data.snippet.playlistId;
                else throw new Error('Attempted to make a playlist out of a resource with no playlist data.');
                break;
            default:
                throw new Error(`Unknown playlist kind: ${data.kind}.`);
        }

        if (data.snippet) {
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
        }

        if (data.status) {
            /**
             * The privacy status of this video.
             * @type {string}
             */
            this.privacy = data.status.privacyStatus;
        }

        /**
         * The channel this playlist is in
         * @type {Channel}
         */
        this.channel = new Channel(this.youtube, data);
    }

    /**
     * The URL to this playlist
     * @type {string}
     */
    get url() {
        return `https://www.youtube.com/playlist?list=${this.id}`;
    }

    /**
     * Fetch the full representation of this playlist.
     * @param {object} [options] Any extra query params
     * @returns {Playlist}
     */
    fetch(options) {
        return this.youtube.request.getPlaylist(this.id, options).then(this._patch.bind(this));
    }

    /**
     * Gets videos in the playlist
     * @param {Number} [limit] Maximum number of videos to obtain.  Fetches all if not provided.
     * @param {Object} [options] Options to retrieve for each video.
     * @returns {Promise<Video[]>}
     */
    getVideos(limit, options) {
        return this.youtube.request.getPaginated(
            Constants.ENDPOINTS.PlaylistItems,
            limit,
            Object.assign({ playlistId: this.id, part: Constants.PARTS.PlaylistItems }, options)
        ).then(items => this.videos = items.map(i => new Video(this.youtube, i)));
    }

    /**
     * Get a playlist ID from a string (URL or ID)
     * @param {string} url The string to get the ID from
     * @returns {?string}
     */
    static extractID(url) {
        return parseURL(url).playlist;
    }
}

module.exports = Playlist;
