// Initiate Requires
const request = require("request");

// Create Variables
const parts = {
    "search": "snippet",
    "playlistItems": "contentDetails,id,snippet,status"
};

// Create Functions
function encode(object) {
    return Object.keys(object).map(key => {
        let param = `${encodeURIComponent(key)}=`;
        if (Array.isArray(object[key])) return object[key].map(keyVar => {return `${param}${encodeURIComponent(keyVar)}`;}).join("&");
        return `${param}${encodeURIComponent(object[key])}`;
    }).join("&");
}
function sendRequest(endpoint, options) {
    return new Promise((resolve, reject) => {
        request(`https://www.googleapis.com/youtube/v3/${endpoint}?${encode(options)}`, (err, resp, body) => {
            if (err | resp.statusCode !== 200) return reject({"error": err, "response": resp});
            return resolve(JSON.parse(body));
        });
    });
}

// Create YouTube API Class
class YouTube {
    constructor(key) {
        this.key = key;
    }

    search(query, results = 5) {
        return new Promise((resolve, reject) => {
            sendRequest("search", {"q": query, "maxResults": results, "key": this.key, "part": parts.search}).then(resolve).catch(reject);
        });
    }

    getPlaylistItems(playlistId) {
        return new Promise((resolve, reject) => {
            sendRequest("playlistItems", {"playlistId": playlistId, "key": this.key, "part": parts.playlistItems}).then(resolve).catch(reject);
        });
    }
}

module.exports = YouTube;
