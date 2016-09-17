const duration = require('iso8601-duration');
const Channel = require('./Channel');

class Video {
    constructor(youtube, data) {
        this.youtube = youtube;
        this.title = data.snippet.title;
        this.id = data.snippet.videoId || data.id.videoId || data.id;
        this.description = data.snippet.description;
        this.publishedAt = data.snippet.publishedAt;
        this.channel = new Channel(youtube, data);

        if(data.contentDetails) {
            this.id = data.contentDetails.videoId || this.id;
            this.duration = data.contentDetails.duration ? duration.parse(data.contentDetails.duration) : null;
            this.duration_seconds = this.duration ? duration.toSeconds(this.duration) : -1;
        }
    }

    get url() {
        return `https://youtu.be/${this.id}`;
    }
}

module.exports = Video;
