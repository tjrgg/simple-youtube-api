const duration = require('iso8601-duration');
const Channel = require('./Channel');

/** Represents a YouTube video */
class Video {
    /**
     * @param {YouTube} youtube The YouTube instance creating this
     * @param {Object} data The data of the video
     */
    constructor(youtube, data) {
        /**
         * The YouTube instance that created this
         * @type {YouTube}
         */
        this.youtube = youtube;
        Object.defineProperty(this, 'youtube', { enumerable: false });

        /**
         * This video's ID
         * @type {string}
         */
        this.id = data.snippet.videoId || data.id.videoId || data.id;

        /**
         * This video's title
         * @type {string}
         */
        this.title = data.snippet.title;

        /**
         * This video's description
         * @type {string}
         */
        this.description = data.snippet.description;

        /**
         * The date/time this video was published
         * @type {Date}
         */
        this.publishedAt = new Date(data.snippet.publishedAt);

        /**
         * The channel this video is in
         * @type {Channel}
         */
        this.channel = new Channel(youtube, data);

        if(data.contentDetails) {
            this.id = data.contentDetails.videoId || this.id;

            /**
             * An object containing time period information. All properties are integers, and do not include the lower
             * precision ones.
             * @typedef {Object} DurationObject
             * @property {number} [hours] How many hours the video is long
             * @property {number} [minutes] How many minutes the video is long
             * @property {number} [seconds] How many seconds the video is long
             */

            /**
             * The duration of the video
             * @type {?DurationObject}
             */
            this.duration = data.contentDetails.duration ? duration.parse(data.contentDetails.duration) : null;
        }
    }

    /**
     * The URL to this video
     * @type {string}
     */
    get url() {
        return `https://www.youtube.com/watch?v=${this.id}`;
    }

    /**
     * The short URL to this video
     * @type {string}
     */
    get shortURL() {
        return `https://youtu.be/${this.id}`;
    }

    /**
     * The duration of the video in seconds
     * @type {number}
     */
    get durationSeconds() {
        return this.duration ? duration.toSeconds(this.duration) : -1;
    }
}

module.exports = Video;
