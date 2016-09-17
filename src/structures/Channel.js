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
}

module.exports = Channel;
