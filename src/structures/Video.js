class Video {
    constructor(data) {
        this.title = data.snippet.title;
        this.id = data.id.videoId ? data.id.videoId : data.id;
        this.description = data.snippet.description;
        this.url = `https://www.youtube.com/watch?v=${this.id}`;
        this.publishedAt = data.snippet.publishedAt;
        this.channel = {
            title: data.snippet.channelTitle,
            id: data.snippet.channelId
        };
    }
}

module.exports = Video;
