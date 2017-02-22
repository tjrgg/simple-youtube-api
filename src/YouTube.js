const request = require('request-promise-native');
const {parse} = require('url');
const Constants = require('./Constants');
const Video = require('./structures/Video');
const Playlist = require('./structures/Playlist');
const Channel = require('./structures/Channel');

/**
 * The YouTube API module
 */
class YouTube {
    /**
     * @param {string} key The YouTube Data API v3 key to use
     */
    constructor(key) {
        /**
         * The YouTube Data API v3 key
         * @type {?string}
         */
        this.key = key;
        Object.defineProperty(this, 'key', { enumerable: false });
    }

    /**
     * Make a request to the YouTube API
     * @param {string} endpoint The endpoint of the API
     * @param {Object} qs The query string options
     * @returns {Promise<Object>}
     */
    request(endpoint, qs) {
        return request({
            uri: `https://www.googleapis.com/youtube/v3/${endpoint}`,
            qs: Object.assign({ key: this.key }, qs),
            json: true
        });
    }

    /**
     * Get a video by URL or ID
     * @param {string} url The video URL or ID
     * @param {Object} [options = {}] Options to request with the video.
     * @returns {Promise<Video>}
     * @example
     * API.getVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
     *  .then(results => {
     *    console.log(`The video's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getVideo(url, options = {}) {
        const id = Video.extractID(url);
        if (!id) return Promise.reject(new Error(`No video ID found in URL: ${url}`));
        return this.getVideoByID(id, options);
    }

    /**
     * Get a video by ID
     * @param {string} id The video ID
     * @param {Object} [options = {}] Options to request with the video.
     * @returns {Promise<Video>}
     * @example
     * API.getVideoByID('3odIdmuFfEY')
     *  .then(results => {
     *    console.log(`The video's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getVideoByID(id, options = {}) {
        return this.request(Constants.ENDPOINTS.Videos, Object.assign(options, { id, part: Constants.PARTS.Videos }))
            .then(result => new Video(this, result.items[0]));
    }

    /**
     * Get a playlist by URL or ID
     * @param {string} url The playlist URL or ID
     * @param {Object} [options = {}] Options to request with the playlist.
     * @returns {Promise<Playlist[]>}
     * @example
     * API.getPlaylist('https://www.youtube.com/playlist?list=PLuY9odN8x9puRuCxiddyRzJ3F5jR-Gun9')
     *  .then(results => {
     *    console.log(`The playlist's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getPlaylist(url, options = {}) {
        const id = Playlist.extractID(url);
        if (!id) return Promise.reject(new Error(`No playlist ID found in URL: ${url}`));
        return this.getPlaylistByID(id, options);
    }

    /**
     * Get a playlist by ID
     * @param {string} id The playlist ID
     * @param {Object} [options = {}] Options to request with the playlist.
     * @returns {Promise<Playlist[]>}
     * @example
     * API.getPlaylistByID('PL2BN1Zd8U_MsyMeK8r9Vdv1lnQGtoJaSa')
     *  .then(results => {
     *    console.log(`The playlist's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getPlaylistByID(id, options = {}) {
        return this.request(Constants.ENDPOINTS.Playlists, Object.assign(options, { id, part: Constants.PARTS.Playlists }))
            .then(result => new Playlist(this, result.items[0]));
    }

    /**
     * Get a channel by URL or ID
     * @param {string} url The channel URL or ID
     * @param {Object} [options = {}] Options to request with the channel.
     * @returns {Promise<Channel[]>}
     * @example
     * API.getChannel('https://www.youtube.com/channel/UC477Kvszl9JivqOxN1dFgPQ')
     *  .then(results => {
     *    console.log(`The channel's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getChannel(url, options = {}) {
        const id = Channel.extractID(url);
        if (!id) return Promise.reject(new Error(`No channel ID found in URL: ${url}`));
        return this.getChannelByID(id, options);
    }

    /**
     * Get a channel by ID
     * @param {string} id The channel ID
     * @param {Object} [options = {}] Options to request with the channel.
     * @returns {Promise<Channel[]>}
     * @example
     * API.getChannelByID('UC477Kvszl9JivqOxN1dFgPQ')
     *  .then(results => {
     *    console.log(`The channel's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getChannelByID(id, options = {}) {
        return this.request(Constants.ENDPOINTS.Channels, Object.assign(options, { id, part: Constants.PARTS.Channels }))
            .then(result => new Channel(this, result.items[0]));
    }

    /**
     * @typedef {?{video: {}, playlist: {}, channel: {}}|?Object} DeepSearch If provided, will load
     * each result with the given options.  If result is a playlist, will load all playlist videos with given
     * video options.  Provide an empty object to deep search with default parts.
     */

    /**
     * Search YouTube for videos, playlists, and channels
     * @param {string} query The string to search for
     * @param {number} [limit = 5] Maximum results to obtain
     * @param {DeepSearch} [deep = null]
     * @param {Object} [options] Additional options to pass to the API request
     * @returns {Promise<Array<Video|Playlist|Channel|Object>>}
     * @example
     * API.search('Centuries')
     *  .then(results => {
     *    console.log(`I got ${results.length} results`);
     *  })
     *  .catch(console.error);
     */
    search(query, limit = 5, deep = null, options = {}) {
        options = Object.assign(options, { part: Constants.PARTS.Search }, { q: query, maxResults: limit });
        return this.request(Constants.ENDPOINTS.Search, options)
            .then(result => {
                if(typeof deep === 'object') {
                    const vidOpt = Object.assign({}, deep.video || deep);
                    const plOpt = Object.assign({}, deep.playlist || deep);
                    const chOpt = Object.assign({}, deep.channel || deep);

                    return Promise.all(result.items.map(item => {
                        if (item.id.videoId) return this.getVideoByID(item.id.videoId, vidOpt);
                        if (item.id.playlistId) {
                            const pl = this.getPlaylistByID(item.id.playlistId, plOpt);
                            return pl.then(l => l.getVideos(Infinity, vidOpt)).then(() => pl);
                        }
                        if (item.id.channelId) return this.getChannelByID(item.id.channelId, chOpt);
                        return item;
                    }));
                }

                return result.items.map(item => {
                    if (item.id.videoId) return new Video(this, item);
                    if (item.id.playlistId) return new Playlist(this, item);
                    if (item.id.channelId) return new Channel(this, item);
                    return item;
                });
            });
    }

    /**
     * Search YouTube for videos
     * @param {string} query The string to search for
     * @param {number} [limit = 5] Maximum results to obtain
     * @param {DeepSearch} [deep = null]
     * @param {Object} [options] Additional options to pass to the API request
     * @returns {Promise<Video[]>}
     * @example
     * API.searchVideos('Centuries')
     *  .then(results => {
     *    console.log(`I got ${results.length} videos`);
     *  })
     *  .catch(console.error);
     */
    searchVideos(query, limit = 5, deep = null, options = {}) {
        Object.assign(options, {type: 'video'});
        return this.search(query, limit, deep, options);
    }

    /**
     * Search YouTube for playlists
     * @param {string} query The string to search for
     * @param {number} [limit = 5] Maximum results to obtain
     * @param {DeepSearch} [deep = null]
     * @param {Object} [options] Additional options to pass to the API request
     * @returns {Promise<Playlist[]>}
     * @example
     * API.searchPlaylists('Centuries')
     *  .then(results => {
     *    console.log(`I got ${results.length} playlists`);
     *  })
     *  .catch(console.error);
     */
    searchPlaylists(query, limit = 5, deep = null, options = {}) {
        return this.search(query, limit, deep, Object.assign(options, {type: 'playlist'}));
    }

    /**
     * Search YouTube for channels
     * @param {string} query The string to search for
     * @param {number} [limit = 5] Maximum results to obtain
     * @param {DeepSearch} [deep = null]
     * @param {Object} [options] Additional options to pass to the API request
     * @returns {Promise<Channel[]>}
     * @example
     * API.searchChannels('Centuries')
     *  .then(results => {
     *    console.log(`I got ${results.length} channels`);
     *  })
     *  .catch(console.error);
     */
    searchChannels(query, limit = 5, deep, options = {}) {
        Object.assign(options, {type: 'channel'});
        return this.search(query, limit, deep, options);
    }
}

YouTube.Video = Video;
YouTube.Playlist = Playlist;
YouTube.Channel = Channel;

module.exports = YouTube;
