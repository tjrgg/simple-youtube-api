const request = require('request');
const Constants = require('./Constants');
const Encode = require('./util/Encode');
const Video = require('./structures/Video');
const Playlist = require('./structures/Playlist');

class YouTube {
    constructor(key) {
        this.key = key;
        this.Constants = Constants;
    }

    request(endpoint, uriOptions) {
        return new Promise((resolve, reject) => {
            request(`https://www.googleapis.com/youtube/v3/${endpoint}?${Encode(uriOptions)}`, (err, resp, body) => {
                if (err) return reject(`An error occured: ${err}`);
                if (resp.statusCode !== 200) return reject(`Status Code ${resp.statusCode}\n${body}`);
                return resolve(JSON.parse(body));
            });
        });
    }

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

    search(query, results = 5) {
        return new Promise((resolve, reject) => {
            this.request('search', {'q': query, 'maxResults': results, 'key': this.key, 'part': Constants.PARTS.Search})
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
