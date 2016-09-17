const YouTube = require('simple-youtube-api');
const youtube = new YouTube('  Y  o  u  r     A  p  i     K  e  y  ');

youtube.videoById('https://www.youtube.com/watch?v=3odIdmuFfEY')
    .then(results => {
        console.log(`The video's title is ${results[0].title}`);
    })
    .catch(console.log);
