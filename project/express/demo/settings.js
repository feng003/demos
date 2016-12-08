module.exports = {
	cookieSecret:'myblog',
	url:"mongodb://localhost/users",
	ttl: 14 * 24 * 60 * 60, // = 14 days. Default
	autoRemove: 'native' // Default
};
