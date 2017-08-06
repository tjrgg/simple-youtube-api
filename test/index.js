/* globals describe, it, before */
require('dotenv').config({ path: './test/.env' });
const assert = require('assert');
const util = require('./util');
const YouTube = require('../index');

const yt = new YouTube(process.env.YOUTUBE_API_KEY);

describe('util', function() {
    it('can parse a video URL', function() {
        const parsed = YouTube.util.parseURL('https://www.youtube.com/watch?v=zBBOfCRhEz4');
        assert.deepEqual(parsed, {
            type: 'video',
            id: 'zBBOfCRhEz4'
        });
    });

    it('can parse a playlist URL', function() {
        const parsed = YouTube.util.parseURL('https://www.youtube.com/playlist?list=PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N');
        assert.deepEqual(parsed, {
            type: 'playlist',
            id: 'PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N'
        });
    });

    it('can parse a channel URL', function() {
        const parsed = YouTube.util.parseURL('https://www.youtube.com/channel/UCJ6td3C9QlPO9O_J5dF4ZzA');
        assert.deepEqual(parsed, {
            type: 'channel',
            id: 'UCJ6td3C9QlPO9O_J5dF4ZzA'
        });
    });
});

describe('Video', function() {
    describe('search', function() {
        it('works with default parameters', function() {
            return yt.searchVideos('monstercat').then(util.checkVideos);
        });

        it('works with extra options', function() {
            return yt.searchVideos('monstercat', 10, {}).then(r => util.checkVideos(r, 10));
        });
    });

    describe('fetch', function() {
        it('gets by URL', function() {
            return yt.getVideo('https://www.youtube.com/watch?v=zBBOfCRhEz4').then(r => util.checkVideo(r, 'zBBOfCRhEz4'));
        });

        it('gets by ID', function() {
            return yt.getVideoByID('zBBOfCRhEz4').then(r => util.checkVideo(r, 'zBBOfCRhEz4'));
        });
    });
});

describe('Playlist', function() {
    describe('search', function() {
        it('works with default parameters', function() {
            return yt.searchPlaylists('monstercat').then(util.checkPlaylists);
        });

        it('works with extra options', function() {
            this.timeout(7000);
            return yt.searchPlaylists('monstercat', 10, {}).then(r => util.checkPlaylists(r, 10));
        });
    });

    describe('fetch', function() {
        it('gets by URL', function() {
            return yt.getPlaylist('https://www.youtube.com/playlist?list=PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N').then(r => util.checkPlaylist(r, 'PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N'));
        });

        it('gets by ID', function() {
            return yt.getPlaylistByID('PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N').then(r => util.checkPlaylist(r, 'PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N'));
        });
    });

    describe('videos', function() {
        let playlist;
        before('loads the playlist', function() {
            return yt.getPlaylistByID('PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N').then(r => {
                util.checkPlaylist(r, 'PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N');
                playlist = r;
            });
        });

        let length;
        it('loads videos', function() {
            return playlist.getVideos().then(videos => {
                length = videos.length;
                videos.map(util.checkUnknownVideo);
            });
        });

        it('caches videos', function() {
            util.checkVideos(playlist.videos, length);
        });
    });
});

describe('Channel', function() {
    describe('search', function() {
        it('works with default parameters', function() {
            return yt.searchChannels('monstercat').then(util.checkChannels);
        });

        it('works with extra options', function() {
            return yt.searchChannels('monstercat', 10, {});
        });
    });

    describe('fetch', function() {
        it('gets by URL', function() {
            return yt.getChannel('https://www.youtube.com/channel/UCJ6td3C9QlPO9O_J5dF4ZzA').then(r => util.checkChannel(r, 'UCJ6td3C9QlPO9O_J5dF4ZzA'));
        });

        it('gets by ID', function() {
            return yt.getChannelByID('UCJ6td3C9QlPO9O_J5dF4ZzA').then(r => util.checkChannel(r, 'UCJ6td3C9QlPO9O_J5dF4ZzA'));
        });
    });
});

describe('general', function() {
    describe('search', function() {
        it('works with default parameters', function() {
            return yt.search('monstercat').then(results => results.forEach(util.checkUnknown));
        });

        it('works with extra options', function() {
            return yt.search('monstercat', 10, {}).then(results => results.forEach(util.checkUnknown));
        });
    });
});
