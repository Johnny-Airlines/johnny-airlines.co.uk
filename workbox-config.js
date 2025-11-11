module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{txt,png,jpg,svg,ico,gif,json,mp3,md,webmanifest,ttf,otf}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};
