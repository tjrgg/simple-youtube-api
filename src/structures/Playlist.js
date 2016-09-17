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
     * @param {Number} [limit=50] Maximum number of videos to obtain
     * @returns {Promise<Video[]>}
     */
    getVideos(limit = 50) {
        return new Promise((resolve, reject) => {
            this.youtube.request('playlistItems', {'playlistId': this.id, 'key': this.youtube.key, 'part': Constants.PARTS.PlaylistItems, 'maxResults': limit})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Video(this.youtube, item);
                    }));
                })
                .catch(reject);
        });
    }
}

module.exports = Playlist;
