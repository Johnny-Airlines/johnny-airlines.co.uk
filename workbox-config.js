module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{html,txt,js,css,png,jpg,svg,ico,gif,json,mp3,md,webmanifest,ttf,otf}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};