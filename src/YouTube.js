const request = require('request');
const Constants = require('./Constants');
const Encode = require('./util/Encode');
const Video = require('./structures/Video');
const Playlist = require('./structures/Playlist');

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
                if (err) return reject(`An error occured: ${err}`);
                if (resp.statusCode !== 200) return reject(body);
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
     *    console.log(`The videos' title is ${resolts[0].title}`);
     *  })
     *  .catch(console.log);
     */
    videoById(videoId) {
        return new Promise((resolve, reject) => {
            this.request('videos', {'id': videoId, 'key': this.key, 'part': Constants.PARTS.VideoByID})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Video(this, item);
                    }));
                })
                .catch(reject);
        });
    }

    /**
     * Get a playlist by id
     * @param {String} playlistId the playlist id
     * @returns {Promise<Array<Playlist>, Error>}
     * @example
     * Api.playlistById('PL2BN1Zd8U_MsyMeK8r9Vdv1lnQGtoJaSa')
     *  .then(results => {
     *    console.log(`The playlists' title is ${resolts[0].title}`);
     *  })
     *  .catch(console.log);
     */
    playlistById(playlistId) {
        return new Promise((resolve, reject) => {
            this.request('playlists', {'id': playlistId, 'key': this.key, 'part': Constants.PARTS.Playlist})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Playlist(this, item);
                    }));
                })
                .catch(reject);
        });
    }

    /**
     * Get a video by name
     * @param {String} query the query to search
     * @param {Number} [results = 5] the max amount of results
     * @returns {Promise<Array<Playlist>, Error>}
     * @example
     * Api.search('Centuries')
     *  .then(results => {
     *    console.log(`I got ${results.length} videos`);
     *  })
     *  .catch(console.log);
     */
    search(query, limit = 5) {
        return new Promise((resolve, reject) => {
            this.request('search', {'q': query, 'maxResults': limit, 'key': this.key, 'part': Constants.PARTS.Search})
                .then(result => {
                    const items = result.items;
                    return resolve(result.items.map(item => {
                        return new Video(this, item);
                    }));
                })
                .catch(reject);
        });
    }
}

module.exports = YouTube;

/*
    search(query, results = 5) {
        return new Promise((resolve, reject) => {
            sendRequest('search', {'q': query, 'maxResults': results, 'key': this.key, 'part': parts.search}).then(resolve).catch(reject);
        });
    }

    getPlaylistItems(playlistId) {
        return new Promise((resolve, reject) => {
            sendRequest('playlistItems', {'playlistId': playlistId, 'key': this.key, 'part': parts.playlistItems}).then(resolve).catch(reject);
        });
    }
*/
