const Constants = require('../Constants');
const Video = require('./Video');

class Playlist {
    constructor(youtube, data) {
        this.youtube = youtube;
        this.title = data.snippet.title;
        this.id = data.id;
        this.description = data.snippet.description;
        this.url = `https://www.youtube.com/playlist?list=${this.id}`;
        this.publishedAt = data.snippet.publishedAt;
        this.channel = {
            title: data.snippet.channelTitle,
            id: data.snippet.channelId
        };
    }

    getVideos() {
        return new Promise((resolve, reject) => {
            this.youtube.request('playlistItems', {'playlistId': this.id, 'key': this.youtube.key, 'part': Constants.PARTS.PlaylistItems, 'maxResults': 50})
                .then(result => {
                    return resolve(result.items.map(item => {
                        return new Video(this, item);
                    }));
                })
                .catch(reject);
        });
    }
}

module.exports = Playlist;
