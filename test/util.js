const assert = require('assert');
const YouTube = require('../index');

exports.checkUnknownVideo = (video) => assert(video instanceof YouTube.Video, 'result is not an instance of Video');
exports.checkUnknownPlaylist = (playlist) => assert(playlist instanceof YouTube.Playlist, 'result is not an instance of Playlist');

exports.checkVideo = (video, id) => {
    exports.checkUnknownVideo(video);
    assert.equal(video.id, id);
    assert.equal(video.url, `https://www.youtube.com/watch?v=${id}`);
    assert.equal(video.shortURL, `https://youtu.be/${id}`);
};
exports.checkPlaylist = (playlist, id) => {
    exports.checkUnknownPlaylist(playlist);
    assert.equal(playlist.id, id);
    assert.equal(playlist.url, `https://www.youtube.com/playlist?list=${id}`);
};

exports.checkVideos = (videos, length = 5) => {
    assert(Array.isArray(videos), 'results are not an array');
    assert.equal(videos.length, length);
    for(const v of videos) exports.checkUnknownVideo(v);
};
exports.checkPlaylists = (playlists, length = 5) => {
    assert(Array.isArray(playlists), 'results are not an array');
    assert.equal(playlists.length, length);
    for(const p of playlists) exports.checkUnknownPlaylist(p);
};
