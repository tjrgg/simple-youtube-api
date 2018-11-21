const fetch = require('node-fetch');
const YouTube = require('../src');
const responses = require('./data');

const yt = new YouTube('foo');
jest.mock('node-fetch');

describe('constructor', () => {
    test('should throw without a key', () => {
        expect(() => new YouTube()).toThrow();
    });

    test('should throw with a non-string value as a key', () => {
        expect(() => new YouTube(42)).toThrow();
    });

    test('should return an instance of itself', () => {
        expect(new YouTube('foo')).toBeInstanceOf(YouTube);
    });
});

test('should have a request instance', () => {
    expect(yt.request).toBeInstanceOf(require('../src/Request'));
});

describe('video', () => {
    test('should fetch by ID', async () => {
        fetch.mockResolvedValue(responses.videos.list);

        const video = await yt.getVideoByID('zBBOfCRhEz4');
        expect(video).toBeInstanceOf(YouTube.Video);
    });

    test('should fetch by URL', async () => {
        fetch.mockResolvedValue(responses.videos.list);

        const video = await yt.getVideo('https://www.youtube.com/watch?v=zBBOfCRhEz4');
        expect(video).toBeInstanceOf(YouTube.Video);
    });

    test('should fetch by short URL', async () => {
        fetch.mockResolvedValue(responses.videos.list);

        const video = await yt.getVideo('https://youtu.be/zBBOfCRhEz4');
        expect(video).toBeInstanceOf(YouTube.Video);
    });

    test('should fetch by mobile URL', async () => {
        fetch.mockResolvedValue(responses.videos.list);

        const video = await yt.getVideo('https://m.youtube.com/watch?v=zBBOfCRhEz4');
        expect(video).toBeInstanceOf(YouTube.Video);
    });
});

describe('playlist', () => {
    test('should fetch by ID', async () => {
        fetch.mockResolvedValue(responses.playlists.list);

        const pl = await yt.getPlaylistByID('PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N');
        expect(pl).toBeInstanceOf(YouTube.Playlist);
    });

    test('should fetch by URL', async () => {
        fetch.mockResolvedValue(responses.playlists.list);

        const pl = await yt.getPlaylist('https://www.youtube.com/playlist?list=PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N');
        expect(pl).toBeInstanceOf(YouTube.Playlist);
    });
});

describe('channel', () => {
    test('should fetch by ID', async () => {
        fetch.mockResolvedValue(responses.channels.list);

        const chan = await yt.getChannelByID('UCJ6td3C9QlPO9O_J5dF4ZzA');
        expect(chan).toBeInstanceOf(YouTube.Channel);
    });

    test('should fetch by URL', async () => {
        fetch.mockResolvedValue(responses.channels.list);

        const chan = await yt.getChannel('https://www.youtube.com/channel/UCJ6td3C9QlPO9O_J5dF4ZzA');
        expect(chan).toBeInstanceOf(YouTube.Channel);
    });
});

describe('search', () => {
    test('should search any resource', async () => {
        fetch.mockResolvedValue(responses.search);

        const raw = require('./data/search.json');
        await expect(yt.search('monstercat')).resolves.toHaveLength(raw.items.length);
    });

    test('should search videos', async () => {
        fetch.mockResolvedValue(responses.videos.search);

        const raw = require('./data/videos/search.json');
        const videos = await yt.searchVideos('monstercat');

        expect(videos).toBeInstanceOf(Array);
        expect(videos).toHaveLength(raw.items.length);
        for (const video of videos) expect(video).toBeInstanceOf(YouTube.Video);
    });

    test('should search channels', async () => {
        fetch.mockResolvedValue(responses.channels.search);

        const raw = require('./data/channels/search.json');
        const channels = await yt.searchChannels('monstercat');

        expect(channels).toBeInstanceOf(Array);
        expect(channels).toHaveLength(raw.items.length);
        for (const channel of channels) expect(channel).toBeInstanceOf(YouTube.Channel);
    });

    test('should search playlists', async () => {
        fetch.mockResolvedValue(responses.playlists.search);

        const raw = require('./data/playlists/search.json');
        const playlists = await yt.searchPlaylists('monstercat');

        expect(playlists).toBeInstanceOf(Array);
        expect(playlists).toHaveLength(raw.items.length);
        for (const playlist of playlists) expect(playlist).toBeInstanceOf(YouTube.Playlist);
    });
});
