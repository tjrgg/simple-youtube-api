const YouTube = require('simple-youtube-api');
const youtube = new YouTube('yor api youtube key');

youtube.getVideo('https://www.youtube.com/watch?v=3odIdmuFfEY')
    .then(video => {
        console.log(`The video's title is ${video.title}`);
    })
    .catch(console.log);
