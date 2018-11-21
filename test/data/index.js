const fs = require('fs');
const path = require('path');

const { Response } = jest.requireActual('node-fetch');

function loadDir(dir) {
    const files = fs.readdirSync(dir);
    for (let file of files) {
        file = path.resolve(dir, file);

        const stats = fs.statSync(file);
        if (stats.isFile() && path.extname(file) === '.json') {
            const data = require(file);

            const loc = path.relative(__dirname, file).split(path.sep);
            const prop = path.basename(loc.pop(), '.json');
            const obj = loc.reduce((a, b) => a[b] || (a[b] = {}), module.exports);

            Object.defineProperty(obj, prop, { get: () => new Response(JSON.stringify(data)), enumerable: true });
        } else if (stats.isDirectory()) {
            loadDir(path.resolve(dir, file));
        }
    }
}

loadDir(__dirname);
