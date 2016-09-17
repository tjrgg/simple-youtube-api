const Constants = require('../Constants');
const Video = require('./Video');
const Channel = require('./Channel');

class Playlist {
    constructor(youtube, data) {
        this.youtube = youtube;
        this.title = data.snippet.title;
        this.id = data.snippet.playlistId || data.id.playlistId || data.id;
        this.description = data.snippet.description;
        this.publishedAt = data.snippet.publishedAt;
        this.channel = new Channel(youtube, data);
    }

    get url() {
        return `https://www.youtube.com/playlist?list=${this.id}`;
    }

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
