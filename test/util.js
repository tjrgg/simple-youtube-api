const assert = require('assert');
const YouTube = require('../src/index');

exports.checkUnknownVideo = (video) => assert(video instanceof YouTube.Video, 'result is not an instance of Video');
exports.checkUnknownPlaylist = (playlist) => assert(playlist instanceof YouTube.Playlist, 'result is not an instance of Playlist');
exports.checkUnknownChannel = (channel) => assert(channel instanceof YouTube.Channel, 'result is not an instance of Channel');

exports.checkUnknown = (thing) => {
    assert(thing instanceof YouTube.Video || thing instanceof YouTube.Playlist || thing instanceof YouTube.Channel, 'result is not a YouTube structure');
};

exports.isNull = (result) => assert.deepStrictEqual(result, null, 'result is not null');
exports.throws = [
    result => assert.fail(`resolved with ${result}`),
    error => assert(error instanceof Error, 'does not reject with error'),
];

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
exports.checkChannel = (channel, id) => {
    exports.checkUnknownChannel(channel);
    assert.equal(channel.id, id);
    assert.equal(channel.url, `https://www.youtube.com/channel/${id}`);
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
exports.checkChannels = (channels, length = 5) => {
    assert(Array.isArray(channels), 'results are not an array');
    assert.equal(channels.length, length);
    for(const c of channels) exports.checkUnknownChannel(c);
};
