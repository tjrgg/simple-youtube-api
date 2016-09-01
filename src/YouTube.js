const request = require('request');
const Constants = require('./Constants');
const Encode = require('./util/Encode');
const Video = require('./structures/Video');
const Playlist = require('./structures/Playlist');

class YouTube {
    constructor(key) {
        this.key = key;
    }

    request(endpoint, uriOptions) {
        return new Promise((resolve, reject) => {
            request(`https://www.googleapis.com/youtube/v3/${endpoint}?${Encode(uriOptions)}`, (err, resp, body) => {
                if (err | resp.statusCode !== 200) return reject(`Status Code ${resp.statusCode}\n{$err}`);
                return resolve(JSON.parse(body));
            });
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
