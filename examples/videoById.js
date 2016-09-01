const YouTube = require('simple-youtube-api');
const Api = new YouTube('  Y  o  u  r     A  p  i     K  e  y  ');

Api.videoById('3odIdmuFfEY')
    .then(results => {
        console.log(`The video's title is ${results[0].title}`);
    })
    .catch(console.log);


/*

    - - - - - - - - - - - - - - - - - - - -
        Search:

        Parameters:
        - Video ID

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
