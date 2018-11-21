const fetch = require('node-fetch');
const YouTube = require('../../src');
const raw = require('../data/playlists/full.json');
const responses = require('../data');

const { Playlist } = YouTube;
const pl = new Playlist(new YouTube('foo'), raw);

jest.mock('node-fetch');

describe('extract ID', () => {
    test('should extract the ID of a channel URL', () => {
        expect(Playlist.extractID(`https://www.youtube.com/playlist?list=${raw.id}`)).toBe(raw.id);
    });

    test('should not extract the ID of a non-channel URL', () => {
        expect(Playlist.extractID('https://www.youtube.com/watch?v=zBBOfCRhEz4')).toBeUndefined();
    });

    test('should not extract the ID of a non-YouTube URL', () => {
        expect(Playlist.extractID('https://www.google.com')).toBeUndefined();
    });
});

test('should be instance of Playlist', () => {
    expect(pl).toBeInstanceOf(Playlist);
});

test('should have a YouTube client', () => {
    expect(pl.youtube).toBeInstanceOf(YouTube);
});

test('should be type of playlist', () => {
    expect(pl.type).toBe('playlist');
});

test('should have an empty list of videos', () => {
    expect(pl.videos).toStrictEqual([]);
});

test('should have raw data', () => {
    expect(pl.raw).toEqual(expect.anything());
});

test('should have a non-full channel', () => {
    expect(pl.channel).toBeInstanceOf(YouTube.Channel);
    expect(pl.channel.full).toBe(false);
});

test('should have an ID', () => {
    expect(pl.id).toBe(raw.id);
});

test('should have a well-formed URL', () => {
    expect(pl.url).toBe(`https://www.youtube.com/playlist?list=${raw.id}`);
});

test('should fetch itself', async () => {
    fetch.mockResolvedValue(responses.playlists.list);

    const fetched = await pl.fetch();
    expect(fetched).toBeInstanceOf(Playlist);
    expect(fetch).toHaveBeenCalledTimes(1);
});

test('should fetch its own videos', async () => {
    fetch.mockResolvedValue(responses.playlists.items);
    const { items } = require('../data/playlists/items');

    const fetched = await pl.getVideos();
    expect(fetched).toBeInstanceOf(Array);
    expect(fetched).toHaveLength(items.length);
    for (const video of fetched) expect(video).toBeInstanceOf(YouTube.Video);
    expect(pl.videos).toStrictEqual(fetched);
});

describe('snippet', () => {
    test('should have a title', () => {
        expect(pl.title).toBe(raw.snippet.title);
    });

    test('should have a description', () => {
        expect(pl.description).toBe(raw.snippet.description);
    });

    test('should have a published date', () => {
        expect(pl.publishedAt).toStrictEqual(new Date(raw.snippet.publishedAt));
        expect(pl.publishedAt).toBeInstanceOf(Date);
    });

    test('should have thumbnails', () => {
        expect(pl.thumbnails).toStrictEqual(raw.snippet.thumbnails);
    });

    test('should have a channel title', () => {
        expect(pl.channelTitle).toBe(raw.snippet.channelTitle);
    });

    test('should have a default language', () => {
        expect(pl.defaultLanguage).toBe(raw.snippet.defaultLanguage);
    });

    test('should be localized', () => {
        expect(pl.localized).toStrictEqual(raw.snippet.localized);
    });
});

describe('status', () => {
    test('should have privacy status', () => {
        expect(pl.privacy).toBe(raw.snippet.privacyStatus);
    });
});

// describe('player', () => {
//     test('should have embeddable HTML', () => {
//         expect(pl.embedHTML).toBe(raw.player.embedHtml);
//     });
// });
