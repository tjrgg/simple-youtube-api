const YouTube = require('simple-youtube-api');
const youtube = new YouTube('  Y  o  u  r     A  p  i     K  e  y  ');

youtube.getPlaylist('https://www.youtube.com/playlist?list=PL2BN1Zd8U_MsyMeK8r9Vdv1lnQGtoJaSa')
    .then(playlist => {
        console.log(`The playlist's title is ${playlist.title}`);
        playlist.getVideos()
            .then(videos => {
                console.log(`This playlist has ${videos.length === 50 ? '50+' : videos.length} videos.`);
            })
            .catch(console.log);
    })
    .catch(console.log);
