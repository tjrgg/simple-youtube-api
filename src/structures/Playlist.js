class Playlist {
    constructor(data) {
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

    }
}

module.exports = Playlist;
