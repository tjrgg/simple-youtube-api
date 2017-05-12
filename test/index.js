/* globals describe, it */
require('dotenv').config({ path: './test/.env' });
const assert = require('assert');
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
            return yt.searchVideos('monstercat').then(r => {
                assert(Array.isArray(r), 'results are not an array');
                assert.equal(r.length, 5);
                for(const v of r) assert(v instanceof YouTube.Video, 'result is not an instance of Video');
            });
        });

        it('works with extra options', function() {
            return yt.searchVideos('monstercat', 10, {}).then(r => {
                assert(Array.isArray(r), 'results are not an array');
                assert.equal(r.length, 10);
                for(const v of r) assert(v instanceof YouTube.Video, 'result is not an instance of Video');
            });
        });
    });

    describe('fetching', function() {
        it('gets by URL', function() {
            return yt.getVideo('https://www.youtube.com/watch?v=zBBOfCRhEz4').then(r => {
                assert(r instanceof YouTube.Video, 'result is not an instance of Video');
                assert(r.id, 'zBBOfCRhEz4');
                assert(r.url, 'https://www.youtube.com/watch?v=zBBOfCRhEz4');
                assert(r.shortURL, 'https://youtu.be/zBBOfCRhEz4');
            });
        });
    });
});
