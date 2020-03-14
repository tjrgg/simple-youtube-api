<h1 align="center">
	simple-youtube-api
</h1>

<h3 align="center">
	simple-youtube-api is a library that wraps the YouTube Data API.
</h3>

<p align="center">
	<a href="https://github.com/tjrgg/simple-youtube-api/fork">
		<img alt="GitHub Forks" src="https://img.shields.io/github/forks/tjrgg/simple-youtube-api?label=Fork&style=social" />
	</a>
	<a href="https://github.com/tjrgg/simple-youtube-api">
		<img alt="GitHub Stars" src="https://img.shields.io/github/stars/tjrgg/simple-youtube-api?label=Star&style=social" />
	</a>
	<a href="https://github.com/tjrgg/simple-youtube-api/subscription">
		<img alt="GitHub Watchers" src="https://img.shields.io/github/watchers/tjrgg/simple-youtube-api?label=Watch&style=social" />
	</a>
</p>

<p align="center">
	<img alt="Contributors" src="https://img.shields.io/github/contributors-anon/tjrgg/simple-youtube-api?cacheSeconds=86400" />
	<img alt="Issues" src="https://img.shields.io/github/issues/tjrgg/simple-youtube-api?cacheSeconds=86400" />
	<img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/tjrgg/simple-youtube-api?cacheSeconds=86400" />
	<img alt="Size" src="https://img.shields.io/github/repo-size/tjrgg/simple-youtube-api?cacheSeconds=86400&label=size" />
	<img alt="Version" src="https://img.shields.io/github/package-json/version/tjrgg/simple-youtube-api?cacheSeconds=86400&label=version" />
</p>

<p align="center">
	<img alt="Dependencies" src="https://img.shields.io/david/tjrgg/simple-youtube-api?cacheSeconds=86400" />
	<img alt="Vulnerabilities" src="https://img.shields.io/snyk/vulnerabilities/github/tjrgg/simple-youtube-api?cacheSeconds=86400" />
</p>

<p align="center">
	<a href="https://discordapp.com/invite/vxXrG8W">
		<img alt="Discord" src="https://img.shields.io/discord/110118478119174144?style=social" />
	</a>
	<a href="https://twitter.com/tjrgg">
		<img alt="Twitter" src="https://img.shields.io/twitter/follow/tjrgg?style=social" />
	</a>
</p>


## Install

npm
```sh
npm install simple-youtube-api
```

yarn
```sh
yarn add simple-youtube-api
```


## Usage

```js
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('YOUTUBE-API-KEY');

youtube.searchVideos('Centuries', 4)
    .then(results => {
        console.log(`The video's title is ${results[0].title}`);
    })
    .catch(console.log);
```


## Author

👤 **Tyler Richards**

* GitHub: [@tjrgg](https://github.com/tjrgg)
* Twitter: [@tjrgg](https://twitter.com/tjrgg)


## License

Copyright © 2020 Tyler Richards and contributors. All rights reserved.

Released under the [Apache License, version 2.0](LICENSE.md).
