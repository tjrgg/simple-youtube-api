const fetch = require('node-fetch');
const Constants = require('./util/Constants');

class Request {
    constructor(youtube) {
        this.youtube = youtube;
    }

    /**
     * Make a request to the YouTube API
     * @param {string} endpoint The endpoint to query
     * @param {object} qs Query strings
     */
    make(endpoint, qs = {}) {
        qs = Object.assign({ key: this.youtube.key }, qs);
        const params = Object.keys(qs).filter(k => qs[k]).map(k => `${k}=${qs[k]}`);
        return fetch(`https://www.googleapis.com/youtube/v3/${endpoint}${params.length ? `?${params.join('&')}` : ''}`)
            .then(result => result.json())
            .then(result => {
                if (result.error) return Promise.reject(result.error);
                return result;
            });
    }

    /**
     * Get a resource from the YouTube API
     * @param {string} type The type of resource to get
     * @param {object} qs Any other query options
     */
    getResource(type, qs = {}) {
        qs = Object.assign({ part: Constants.PARTS[type] }, qs);
        return this.make(Constants.ENDPOINTS[type], qs).then(result =>
            result.items.length ? result.items[0] : Promise.reject(new Error('resource not found'))
        );
    }

    /**
     * Get a resource from the YouTube API, by ID
     * @param {string} type The type of resource to get
     * @param {string} id The ID of the resource to get
     * @param {object} qs Any other query options
     */
    getResourceByID(type, id, qs = {}) {
        return this.getResource(type, Object.assign(qs, { id }));
    }

    /**
     * Get a video from the YouTube API
     * @param {string} id The video to get
     * @param {object} options Any request options
     */
    getVideo(id, options) {
        return this.getResourceByID('Videos', id, options);
    }

    /**
     * Get a playlist from the YouTube API
     * @param {string} id The playlist to get
     * @param {object} [options] Any request options
     */
    getPlaylist(id, options) {
        return this.getResourceByID('Playlists', id, options);
    }

    /**
     * Get a channel from the YouTube API
     * @param {string} id The channel to get
     * @param {object} [options] Any request options
     */
    getChannel(id, options) {
        return this.getResourceByID('Channels', id, options);
    }

    /**
     * Fetch a paginated resource.
     * @param {string} endpoint The endpoint to query.
     * @param {number} [count=Infinity] How many results to retrieve.
     * @param {Object} [options={}] Additional options to send.
     * @param {Array} [fetched=[]] Previously fetched resources.
     * @param {?string} [pageToken] The page token to retrieve.
     */
    getPaginated(endpoint, count = Infinity, options = {}, fetched = [], pageToken = null) {
        if(count < 1) return Promise.reject('Cannot fetch less than 1.');

        const limit = count > 50 ? 50 : count;
        return this.make(endpoint, Object.assign(options, { pageToken, maxResults: limit })).then(result => {
            const results = fetched.concat(result.items);
            if(result.nextPageToken && limit !== count) return this.getPaginated(endpoint, count - limit, options, results, result.nextPageToken);
            return results;
        });
    }
}

module.exports = Request;
