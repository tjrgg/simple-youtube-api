/* globals describe, it, before */
require('dotenv').config({ path: './test/.env' });
const assert = require('assert');
const util = require('./util');
const YouTube = require('../src/index');

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

        // it('fails when searching obscure strings', function() {
        //     return yt.searchVideos('asudyiuhsaiduyhoi7dushklauyhdlkuhsaludhisudhsiudghuygdsuayg').then(util.isNull);
        // });
    });

    describe('fetch', function() {
        it('gets by URL', function() {
            return yt.getVideo('https://www.youtube.com/watch?v=zBBOfCRhEz4').then(r => util.checkVideo(r, 'zBBOfCRhEz4'));
        });

        it('gets by ID', function() {
            return yt.getVideoByID('zBBOfCRhEz4').then(r => util.checkVideo(r, 'zBBOfCRhEz4'));
        });

        it('rejects when invalid URL format', function() {
            return yt.getVideo('not a URL').then(...util.throws);
        });

        it('rejects when invalid URL', function() {
            return yt.getVideo('https://www.youtube.com/watch?v=jskadhuiusdaksudkha').then(...util.throws);
        });

        it('rejects when invalid ID', function() {
            return yt.getVideoByID('not an ID').then(...util.throws);
        });
    });
});

describe('Playlist', function() {
    describe('search', function() {
        it('works with default parameters', function() {
            return yt.searchPlaylists('monstercat').then(util.checkPlaylists);
        });
    });

    describe('fetch', function() {
        it('gets by URL', function() {
            return yt.getPlaylist('https://www.youtube.com/playlist?list=PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N').then(r => util.checkPlaylist(r, 'PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N'));
        });

        it('gets by ID', function() {
            return yt.getPlaylistByID('PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N').then(r => util.checkPlaylist(r, 'PLe8jmEHFkvsbRwwi0ode5c9iMQ2dyJU3N'));
        });

        it('rejects when invalid URL format', function() {
            return yt.getPlaylist('not a URL').then(...util.throws);
        });

        it('rejects when invalid URL', function() {
            return yt.getPlaylist('https://www.youtube.com/playlist?list=iasodjasiodjujasidhaisudhiasdaksjdiunkasd').then(...util.throws);
        });

        it('rejects when invalid ID', function() {
            return yt.getPlaylistByID('not an ID').then(...util.throws);
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

        it('fetches each full video', function() {
            return Promise.all(playlist.videos.map(v => {
                if (v.full) return assert.fail('full video already loaded');
                return v.fetch().then(r => {
                    util.checkUnknownVideo(r);
                    assert(v.full, 'video isn\'t full after fetching');
                });
            }));
        });
    });
});

describe('Channel', function() {
    describe('search', function() {
        it('works with default parameters', function() {
            return yt.searchChannels('monstercat').then(util.checkChannels);
        });
    });

    describe('fetch', function() {
        it('gets by URL', function() {
            return yt.getChannel('https://www.youtube.com/channel/UCJ6td3C9QlPO9O_J5dF4ZzA').then(r => util.checkChannel(r, 'UCJ6td3C9QlPO9O_J5dF4ZzA'));
        });

        it('gets by ID', function() {
            return yt.getChannelByID('UCJ6td3C9QlPO9O_J5dF4ZzA').then(r => util.checkChannel(r, 'UCJ6td3C9QlPO9O_J5dF4ZzA'));
        });

        it('rejects when invalid URL format', function() {
            return yt.getChannel('not a URL').then(...util.throws);
        });

        it('rejects when invalid URL', function() {
            return yt.getChannel('https://www.youtube.com/channel/asuidahsduhkuhisoaduhioj').then(...util.throws);
        });

        it('rejects when invalid ID', function() {
            return yt.getChannelByID('not an ID').then(...util.throws);
        });
    });
});

describe('general', function() {
    describe('search', function() {
        it('works with default parameters', function() {
            return yt.search('monstercat').then(results => results.forEach(util.checkUnknown));
        });
    });
});
