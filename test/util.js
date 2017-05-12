const assert = require('assert');
const YouTube = require('../index');

exports.checkUnknownVideo = (video) => assert(video instanceof YouTube.Video, 'result is not an instance of Video');

exports.checkVideo = (video, id) => {
    exports.checkUnknownVideo(video);
    assert.equal(video.id, id);
    assert.equal(video.url, `https://www.youtube.com/watch?v=${id}`);
    assert.equal(video.shortURL, `https://youtu.be/${id}`);
};

exports.checkVideos = (videos, length = 5) => {
    assert(Array.isArray(videos), 'results are not an array');
    assert.equal(videos.length, length);
    for(const v of videos) exports.checkUnknownVideo(v);
};
