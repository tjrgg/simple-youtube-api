# Simple YouTube API
This is designed to simplify some functions of the YouTube API.

## Usage

#### Installation
    $ npm install simple-youtube-api

## *All methods return an array.*

#### Search by video name
[Another Example](https://github.com/Hyper-Coder/simple-youtube-api/blob/master/examples/search.js)
```js
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('  Y  o  u  r     A  p  i     K  e  y  ');

youtube.searchVideos('Centuries', 4)
    .then(results => {
        console.log(`The video's title is ${results[0].title}`);
    })
    .catch(console.error);
```

#### Get video
[Another Example](https://github.com/Hyper-Coder/simple-youtube-api/blob/master/examples/video.js)
```js
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('  Y  o  u  r     A  p  i     K  e  y  ');

youtube.getVideo('3odIdmuFfEY')
    .then(results => {
        console.log(`The video's title is ${results[0].title}`);
    })
    .catch(console.error);
```

#### Get playlist
[Another Example](https://github.com/Hyper-Coder/simple-youtube-api/blob/master/examples/playlist.js)
```js
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('  Y  o  u  r     A  p  i     K  e  y  ');

youtube.getPlaylist('PL2BN1Zd8U_MsyMeK8r9Vdv1lnQGtoJaSa')
    .then(results => {
        console.log(`The playlist's title is ${results[0].title}`);
    })
    .catch(console.error);
```

#### Get videos from a playlist
[Another Example](https://github.com/Hyper-Coder/simple-youtube-api/blob/master/examples/playlist.js)
```js
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('  Y  o  u  r     A  p  i     K  e  y  ');

youtube.getPlaylist('PL2BN1Zd8U_MsyMeK8r9Vdv1lnQGtoJaSa')
    .then(results => {
        console.log(`The playlist's title is ${results[0].title}`);
        results[0].getVideos()
            .then(videos => {
                console.log(`This playlist has ${videos.length === 50 ? '50+' : videos.length} videos.`);
            })
            .catch(console.error);
    })
    .catch(console.error);
```
