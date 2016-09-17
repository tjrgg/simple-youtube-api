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
     * Create the YouTube API caller
     * @param {String} key your youtube data api v3 key
     */
    constructor(key) {
        /**
         * Your YouTube Data API key
         * @type {?String}
         */
        this.key = key;
        Object.defineProperty(this, 'key', { enumerable: false });
    }

    /**
     * Make a request to the YouTube API
     * @param {String} endpoint the endpoint of the api
     * @param {Object} uriOptions the uri options to send to the api
     * @returns {Promise<Object, Error>}
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
     * Get a video by id
     * @param {String} videoId the video id
     * @returns {Promise<Array<Video>, Error>}
     * @example
     * Api.videoById('3odIdmuFfEY')
     *  .then(results => {
     *    console.log(`The video's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    videoById(videoId) {
        return new Promise((resolve, reject) => {
            this.request('videos', {id: videoId, key: this.key, part: Constants.PARTS.Video})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Video(this, item);
                    }));
                })
                .catch(reject);
        });
    }

    /**
     * Get a video by URL or ID
     * @param {String} videoUrl the video URL/ID
     * @returns {Promise<Array<Video>, Error>}
     * @example
     * Api.videoByUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
     *  .then(results => {
     *    console.log(`The video's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    videoByUrl(videoUrl) {
        const parsed = url.parse(videoUrl, true);
        let id = parsed.query.v;
        if (parsed.hostname === 'youtu.be' || !id) {
            const s = parsed.pathname.split('/');
            id = s[s.length - 1];
        }
        if (!id) return Promise.reject(new Error(`No video ID found in URL: ${videoUrl}`));
        return this.videoById(id);
    }

    /**
     * Get a playlist by id
     * @param {String} playlistId the playlist id
     * @returns {Promise<Array<Playlist>, Error>}
     * @example
     * Api.playlistById('PL2BN1Zd8U_MsyMeK8r9Vdv1lnQGtoJaSa')
     *  .then(results => {
     *    console.log(`The playlist's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    playlistById(playlistId) {
        return new Promise((resolve, reject) => {
            this.request('playlists', {id: playlistId, key: this.key, part: Constants.PARTS.Playlist})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Playlist(this, item);
                    }));
                })
                .catch(reject);
        });
    }

    /**
     * Get a playlist by URL or ID
     * @param {String} playlistUrl the playlist URL/ID
     * @returns {Promise<Array<Playlist>, Error>}
     * @example
     * Api.playlistByUrl('https://www.youtube.com/playlist?list=PLuY9odN8x9puRuCxiddyRzJ3F5jR-Gun9')
     *  .then(results => {
     *    console.log(`The playlist's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    playlistByUrl(playlistUrl) {
        const parsed = url.parse(playlistUrl, true);
        let id = parsed.query.list;
        if (!id) {
            const s = parsed.pathname.split('/');
            id = s[s.length - 1];
        }
        if (!id) return Promise.reject(new Error(`No playlist ID found in URL: ${playlistUrl}`));
        return this.playlistById(id);
    }

    /**
     * Get a channel by id
     * @param {String} channelId the channel id
     * @returns {Promise<Array<Channel>, Error>}
     * @example
     * Api.channelById('UC477Kvszl9JivqOxN1dFgPQ')
     *  .then(results => {
     *    console.log(`The channel's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    channelById(channelId) {
        return new Promise((resolve, reject) => {
            this.request('channels', {id: channelId, key: this.key, part: Constants.PARTS.Channel})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Channel(this, item);
                    }));
                })
                .catch(reject);
        });
    }

    /**
     * Get a channel by URL or ID
     * @param {String} channelUrl the channel URL/ID
     * @returns {Promise<Array<Channel>, Error>}
     * @example
     * Api.channelByUrl('https://www.youtube.com/channel/UC477Kvszl9JivqOxN1dFgPQ')
     *  .then(results => {
     *    console.log(`The channel's title is ${results[0].title}`);
     *  })
     *  .catch(console.error);
     */
    channelByUrl(channelUrl) {
        const parsed = url.parse(channelUrl, true);
        const s = parsed.pathname.split('/');
        let id = s[s.length - 1];
        if (!id) return Promise.reject(new Error(`No channel ID found in URL: ${channelUrl}`));
        return this.channelById(id);
    }

    /**
     * Search YouTube for videos, playlists, and channels
     * @param {String} query the query to search
     * @param {Number} [results = 5] the max amount of results
     * @param {Object} [options] additional options to pass to the API request
     * @returns {Promise<Array<Playlist>, Error>}
     * @example
     * Api.search('Centuries')
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
     * @param {String} query the query to search
     * @param {Number} [results = 5] the max amount of results
     * @param {Object} [options] additional options to pass to the API request
     * @returns {Promise<Array<Playlist>, Error>}
     * @example
     * Api.searchVideos('Centuries')
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
     * @param {String} query the query to search
     * @param {Number} [results = 5] the max amount of results
     * @param {Object} [options] additional options to pass to the API request
     * @returns {Promise<Array<Playlist>, Error>}
     * @example
     * Api.searchPlaylists('Centuries')
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
     * Search YouTube for playlists
     * @param {String} query the query to search
     * @param {Number} [results = 5] the max amount of results
     * @param {Object} [options] additional options to pass to the API request
     * @returns {Promise<Array<Playlist>, Error>}
     * @example
     * Api.searchChannels('Centuries')
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

/*
    search(query, results = 5) {
        return new Promise((resolve, reject) => {
            sendRequest('search', {q: query, maxResults: results, key: this.key, part: parts.search}).then(resolve).catch(reject);
        });
    }

    getPlaylistItems(playlistId) {
        return new Promise((resolve, reject) => {
            sendRequest('playlistItems', {'playlistId': playlistId, key: this.key, part: parts.playlistItems}).then(resolve).catch(reject);
        });
    }
*/
