const fetch = require('node-fetch');
const YouTube = require('../../src');
const raw = require('../data/channels/full.json');
const responses = require('../data');

const { Channel } = YouTube;
const chan = new Channel(new YouTube('foo'), raw);

jest.mock('node-fetch');

describe('extract ID', () => {
    test('should extract the ID of a channel URL', () => {
        expect(Channel.extractID(`https://www.youtube.com/channel/${raw.id}`)).toBe(raw.id);
    });

    test('should not extract the ID of a non-channel URL', () => {
        expect(Channel.extractID('https://www.youtube.com/watch?v=zBBOfCRhEz4')).toBeUndefined();
    });

    test('should not extract the ID of a non-YouTube URL', () => {
        expect(Channel.extractID('https://www.google.com')).toBeUndefined();
    });
});

describe('full', () => {
    test('should be instance of Channel', () => {
        expect(chan).toBeInstanceOf(Channel);
    });

    test('should be type of channel', () => {
        expect(chan.type).toBe('channel');
    });

    test('should have raw data', () => {
        expect(chan.raw).toEqual(expect.anything());
    });

    test('should be full', () =>{
        expect(chan.full).toBe(true);
    });

    test('should be of kind "youtube#channel"', () => {
        expect(chan.kind).toBe('youtube#channel');
    });

    test('should have an ID', () => {
        expect(chan.id).toBe(raw.id);
    });

    test('should have a well-formed URL', () => {
        expect(chan.url).toBe(`https://www.youtube.com/channel/${raw.id}`);
    });

    test('should be able to fetch itself', async () => {
        fetch.mockResolvedValue(responses.channels.list);

        const fetched = await chan.fetch();
        expect(fetched).toBeInstanceOf(Channel);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    describe('snippet', () => {
        test('should have a title', () => {
            expect(chan.title).toBe(raw.snippet.title);
        });

        test('should have a description', () => {
            expect(chan.description).toBe(raw.snippet.description);
        });

        test('should have a custom URL', () => {
            expect(chan.customURL).toBe(raw.snippet.customUrl);
        });

        test('should have a creation date', () => {
            expect(chan.publishedAt).toBeInstanceOf(Date);
            expect(chan.publishedAt).toStrictEqual(new Date(raw.snippet.publishedAt));
        });

        test('should have thumbnails', () => {
            expect(chan.thumbnails).toStrictEqual(raw.snippet.thumbnails);
        });

        // defaultLanguage, country

        test('should be localized', () => {
            expect(chan.localized).toStrictEqual(raw.snippet.localized);
        });
    });

    describe('contentDetails', () => {
        test('should have related playlists', () => {
            expect(chan.relatedPlaylists).toStrictEqual(raw.contentDetails.relatedPlaylists);
        });
    });

    describe('statistics', () => {
        test('should have view count', () => {
            expect(chan.viewCount).toBe(raw.statistics.viewCount);
        });

        test('should have comment count', () => {
            expect(chan.commentCount).toBe(raw.statistics.commentCount);
        });

        test('should have subscriber count', () => {
            expect(chan.subscriberCount).toBe(raw.statistics.subscriberCount);
        });

        test('should have hidden subscriber count', () => {
            expect(chan.hiddenSubscriberCount).toBe(raw.statistics.hiddenSubscriberCount);
        });

        test('should have video count', () => {
            expect(chan.videoCount).toBe(raw.statistics.videoCount);
        });
    });
});
