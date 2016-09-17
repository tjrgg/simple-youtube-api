const request = require('request');
const url = require('url');
const Constants = require('./Constants');
const Encode = require('./util/Encode');
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
         * Your YouTube Data API key
         * @type {?string}
         */
        this.key = key;
        Object.defineProperty(this, 'key', { enumerable: false });
    }

    /**
     * Make a request to the YouTube API
     * @param {string} endpoint The endpoint of the API
     * @param {Object} uriOptions The URI options to send to the API
     * @returns {Promise<Object>}
     */
    request(endpoint, uriOptions) {
        return new Promise((resolve, reject) => {
            request(`https://www.googleapis.com/youtube/v3/${endpoint}?${Encode(uriOptions)}`, (err, resp, body) => {
                if (err) return reject(err);
                if (resp.statusCode !== 200) return reject(JSON.parse(body));
                return resolve(JSON.parse(body));
            });
        });
    }

    /**
     * Get a video by URL or ID
     * @param {string} url The video URL or ID
     * @returns {Promise<Video[]>}
     * @example
     * API.getVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
     *  .then(results => {
     *    console.log(`The video's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getVideo(url) {
        const parsed = url.parse(url, true);
        let id = parsed.query.v;
        if (parsed.hostname === 'youtu.be' || !id) {
            const s = parsed.pathname.split('/');
            id = s[s.length - 1];
        }
        if (!id) return Promise.reject(new Error(`No video ID found in URL: ${url}`));
        return this.getVideoByID(id);
    }

    /**
     * Get a video by ID
     * @param {string} id The video ID
     * @returns {Promise<Video[]>}
     * @example
     * API.getVideoByID('3odIdmuFfEY')
     *  .then(results => {
     *    console.log(`The video's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getVideoByID(id) {
        return new Promise((resolve, reject) => {
            this.request('videos', {id: id, key: this.key, part: Constants.PARTS.Video})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Video(this, item);
                    }));
                })
                .catch(reject);
        });
    }

    /**
     * Get a playlist by URL or ID
     * @param {string} url The playlist URL or ID
     * @returns {Promise<Playlist[]>}
     * @example
     * API.getPlaylist('https://www.youtube.com/playlist?list=PLuY9odN8x9puRuCxiddyRzJ3F5jR-Gun9')
     *  .then(results => {
     *    console.log(`The playlist's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getPlaylist(url) {
        const parsed = url.parse(url, true);
        let id = parsed.query.list;
        if (!id) {
            const s = parsed.pathname.split('/');
            id = s[s.length - 1];
        }
        if (!id) return Promise.reject(new Error(`No playlist ID found in URL: ${url}`));
        return this.getPlaylistByID(id);
    }

    /**
     * Get a playlist by ID
     * @param {string} id The playlist ID
     * @returns {Promise<Playlist[]>}
     * @example
     * API.getPlaylistByID('PL2BN1Zd8U_MsyMeK8r9Vdv1lnQGtoJaSa')
     *  .then(results => {
     *    console.log(`The playlist's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getPlaylistByID(id) {
        return new Promise((resolve, reject) => {
            this.request('playlists', {id: id, key: this.key, part: Constants.PARTS.Playlist})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Playlist(this, item);
                    }));
                })
                .catch(reject);
        });
    }

    /**
     * Get a channel by URL or ID
     * @param {string} url The channel URL or ID
     * @returns {Promise<Channel[]>}
     * @example
     * API.getChannel('https://www.youtube.com/channel/UC477Kvszl9JivqOxN1dFgPQ')
     *  .then(results => {
     *    console.log(`The channel's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getChannel(url) {
        const parsed = url.parse(url, true);
        const s = parsed.pathname.split('/');
        let id = s[s.length - 1];
        if (!id) return Promise.reject(new Error(`No channel ID found in URL: ${url}`));
        return this.getChannelByID(id);
    }

    /**
     * Get a channel by ID
     * @param {string} id The channel ID
     * @returns {Promise<Channel[]>}
     * @example
     * API.getChannelByID('UC477Kvszl9JivqOxN1dFgPQ')
     *  .then(results => {
     *    console.log(`The channel's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    getChannelByID(id) {
        return new Promise((resolve, reject) => {
            this.request('channels', {id: id, key: this.key, part: Constants.PARTS.Channel})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Channel(this, item);
                    }));
                })
                .catch(reject);
        });
    }

    /**
     * Search YouTube for videos, playlists, and channels
     * @param {string} query The string to search for
     * @param {number} [results = 5] Maximum results to obtain
     * @param {Object} [options] Additional options to pass to the API request
     * @returns {Promise<Array<Video|Playlist|Channel|Object>>}
     * @example
     * API.search('Centuries')
     *  .then(results => {
     *    console.log(`I got ${results.length} results`);
     *  })
     *  .catch(console.error);
     */
    search(query, limit = 5, options = {}) {
        Object.assign(options, {q: query, maxResults: limit, key: this.key, part: Constants.PARTS.Search});
        return new Promise((resolve, reject) => {
            this.request('search', options)
                .then(result => {
                    const items = result.items;
                    return resolve(result.items.map(item => {
                        if (item.id.videoId) return new Video(this, item);
                        if (item.id.playlistId) return new Playlist(this, item);
                        if (item.id.channelId) return new Channel(this, item);
                        return item;
                    }));
                })
                .catch(reject);
        });
    }

    /**
     * Search YouTube for videos
     * @param {string} query The string to search for
     * @param {number} [results = 5] Maximum results to obtain
     * @param {Object} [options] Additional options to pass to the API request
     * @returns {Promise<Video[]>}
     * @example
     * API.searchVideos('Centuries')
     *  .then(results => {
     *    console.log(`I got ${results.length} videos`);
     *  })
     *  .catch(console.error);
     */
    searchVideos(query, limit = 5, options = {}) {
        Object.assign(options, {type: 'video'});
        return this.search(query, limit, options);
    }

    /**
     * Search YouTube for playlists
     * @param {string} query The string to search for
     * @param {number} [results = 5] Maximum results to obtain
     * @param {Object} [options] Additional options to pass to the API request
     * @returns {Promise<Playlist[]>}
     * @example
     * API.searchPlaylists('Centuries')
     *  .then(results => {
     *    console.log(`I got ${results.length} playlists`);
     *  })
     *  .catch(console.error);
     */
    searchPlaylists(query, limit = 5, options = {}) {
        Object.assign(options, {type: 'video'});
        return this.search(query, limit, options);
    }

    /**
     * Search YouTube for channels
     * @param {string} query The string to search for
     * @param {number} [results = 5] Maximum results to obtain
     * @param {Object} [options] Additional options to pass to the API request
     * @returns {Promise<Channel[]>}
     * @example
     * API.searchChannels('Centuries')
     *  .then(results => {
     *    console.log(`I got ${results.length} channels`);
     *  })
     *  .catch(console.error);
     */
    searchChannels(query, limit = 5, options = {}) {
        Object.assign(options, {type: 'channel'});
        return this.search(query, limit, options);
    }
}

module.exports = YouTube;
