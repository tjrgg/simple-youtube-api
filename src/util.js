const { parse: parseURL } = require('url');

exports.checkBaseURL = (text) => {
    const parsed = parseURL(text);
};
