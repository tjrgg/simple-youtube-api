/* globals describe, it */
require('dotenv').config({ path: './test/.env' });
const assert = require('assert');
const YouTube = require('../index');

const yt = new YouTube(process.env.YOUTUBE_API_KEY);

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
});
