module.exports = {
	main: (link, name, domain, path, s3, callback) => {
		if (link) {
			link = link.trim().replace(/^\/+|\/+$/g, '').replace(/ /g, '_');
			if (link) {
				path = path.split('/');
				path.shift();
				//path.unshift(name);
				path = encodeURI(path.join('/'));
				s3.putObject({
					Bucket: 'redaktr.com',
					Key: name + '/' + link + '/index.html',
					WebsiteRedirectLocation: '//' + domain + '/' + (path ? path + '/' : '')
				}, (err, data) => {
					if (err) callback(err);
					else callback();
				});
				s3.putObject({
					Bucket: 'm.redaktr.com',
					Key: name + '/' + link + '/index.html',
					WebsiteRedirectLocation: '//' + domain + '/' + (path ? path + '/' : '')
				}, (err, data) => {
					if (err) callback(err);
					else callback();
				});
			}
		}
	}
};
