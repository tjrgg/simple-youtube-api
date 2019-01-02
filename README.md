# Simple YouTube API

[![Module support server](https://discordapp.com/api/guilds/430216837276368897/embed.png)](https://discord.gg/A97Qftr)
[![Build Status](https://travis-ci.org/HyperCoder2975/simple-youtube-api.svg?branch=master)](https://travis-ci.org/HyperCoder2975/simple-youtube-api)

This library is designed to greatly simplify interacting with the basic functions of the YouTube API.
It deals with viewing/searching videos, playlists, and channels.

## Installation
    $ npm install simple-youtube-api

## Usage
- [Documentation](https://HyperCoder2975.github.io/simple-youtube-api/master/)
- [Examples](https://github.com/HyperCoder2975/simple-youtube-api/tree/master/examples)

### Important note: the `part` query parameter

If you fetch a YouTube resource and it's missing information you expect to be present, it's very likely that you haven't sent the correct `part` query parameter to YouTube. This library has some default parts in order to give some basic information about each resource, but you should always verify your `part` queries if you require more/different information. Parts are available in detail on the Google Developers API documentation pages for each YouTube resource: for example, [these are the available `part`s when fetching videos](https://developers.google.com/youtube/v3/docs/videos/list#part). Parts should be comma-separated.

Parts can be sent in the request options when fetching resources. For example:

```js
const video = await youtube.getVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { part: 'statistics,status' })
```

Please see [#28](https://github.com/HyperCoder2975/simple-youtube-api/issues/38) for more information or to comment on this issue.
