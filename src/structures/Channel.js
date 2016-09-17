class Channel {
    constructor(youtube, data) {
        this.youtube = youtube;
        this.title = data.snippet.channelTitle || data.snippet.title;
        this.id = data.snippet.channelId || data.id.channelId || data.id;
    }

    get url() {
        return `https://www.youtube.com/channel/${this.id}`;
    }
}

module.exports = Channel;
