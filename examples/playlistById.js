const YouTube = require('simple-youtube-api');
const Api = new YouTube('  Y  o  u  r     A  p  i     K  e  y  ');

Api.playlistById('PL2BN1Zd8U_MsyMeK8r9Vdv1lnQGtoJaSa')
    .then(results => {
        console.log(`The playlist's title is ${results[0].title}`);
    })
    .catch(console.log);


/*

    - - - - - - - - - - - - - - - - - - - -
        playlistById:

        Parameters:
        - Playlist ID

        Returns:
        - Promise <Array, Error>

        Properties:
        - title
        - id
        - description
        - url
        - publishedAt
        - channel
          > title
          > id

*/
