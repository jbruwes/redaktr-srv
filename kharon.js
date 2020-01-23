let html = require('./html');
let deleteFolder = require('./deleteFolder');
let hardLink = require('./hardLink');
let sitemap = require('./sitemap');
module.exports = {
	main: (value, id, key, s3, callback) => {
		var tree = JSON.parse(value[1].Body.toString()),
			map = [],
			mmap = [],
			f_sitemap = (p_tree, pPath) => {
				p_tree.forEach(val => {
					val.path = decodeURI((pPath + '/' + val.value).trim().replace(/^\//, '')).replace(/ /g, '_');
					html.main(value, id, id + '/' + val.id + '.htm', s3, callback, val);
					if (value[0].Item.domain) hardLink.main(val.url, value[0].Item.name, value[0].Item.domain, val.path, s3, callback);
					sitemap.main(val.url, value[0].Item.domain, val.path, map, mmap, val.lastmod, val.changefreq, val.priority);
					if (val.data) f_sitemap(val.data, pPath + '/' + val.value);
				});
			},
			f_sitemap2 = _ => {
				s3.deleteObject({
					Bucket: 'redaktr.com',
					Key: value[0].Item.name + '/robots.txt'
				}, (err, data) => {
					if (err) {
						console.log('tree.js', value[0].Item);
						console.log('s3.deleteObject', {
							Bucket: 'redaktr.com',
							Key: value[0].Item.name + '/robots.txt'
						});
						callback(err);
					} else if (value[0].Item.domain) s3.putObject({
						Bucket: 'redaktr.com',
						Key: value[0].Item.name + '/robots.txt',
						ContentType: 'text/plain',
						Body: 'User-agent: *\nDisallow:\nSitemap: https://' + value[0].Item.domain + '/sitemap.xml'
					}, (err, data) => {
						if (err) {
							console.log('tree.js', value[0].Item);
							console.log('s3.putObject', {
								Bucket: 'redaktr.com',
								Key: value[0].Item.name + '/robots.txt',
								ContentType: 'text/plain',
								Body: 'User-agent: *\nDisallow:\nSitemap: https://' + value[0].Item.domain + '/sitemap.xml'
							});
							callback(err);
						} else callback();
					});
				});
				s3.deleteObject({
					Bucket: 'redaktr.com',
					Key: value[0].Item.name + '/sitemap.xml'
				}, (err, data) => {
					if (err) {
						console.log('tree.js', value[0].Item);
						console.log('s3.deleteObject', {
							Bucket: 'redaktr.com',
							Key: value[0].Item.name + '/sitemap.xml'
						});
						callback(err);
					} else if (map.length) s3.putObject({
						Bucket: 'redaktr.com',
						Key: value[0].Item.name + '/sitemap.xml',
						ContentType: 'application/xml',
						Body: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + map.join('') + '</urlset>'
					}, (err, data) => {
						if (err) {
							console.log('tree.js', value[0].Item);
							console.log('s3.putObject', {
								Bucket: 'redaktr.com',
								Key: value[0].Item.name + '/sitemap.xml',
								ContentType: 'application/xml',
								Body: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + map.join('') + '</urlset>'
							});
							callback(err);
						} else callback();
					});
				});
				s3.deleteObject({
					Bucket: 'm.redaktr.com',
					Key: value[0].Item.name + '/robots.txt'
				}, (err, data) => {
					if (err) {
						console.log('tree.js', value[0].Item);
						console.log('s3.deleteObject', {
							Bucket: 'm.redaktr.com',
							Key: value[0].Item.name + '/robots.txt'
						});
						callback(err);
					} else if (value[0].Item.domain) s3.putObject({
						Bucket: 'm.redaktr.com',
						Key: value[0].Item.name + '/robots.txt',
						ContentType: 'text/plain',
						Body: 'User-agent: *\nDisallow:\nSitemap: https://m.' + value[0].Item.domain + '/sitemap.xml\nSitemap: https://' + value[0].Item.domain + '/sitemap.xml'
					}, (err, data) => {
						if (err) {
							console.log('tree.js', value[0].Item);
							console.log('s3.putObject', {
								Bucket: 'm.redaktr.com',
								Key: value[0].Item.name + '/robots.txt',
								ContentType: 'text/plain',
								Body: 'User-agent: *\nDisallow:\nSitemap: https://m.' + value[0].Item.domain + '/sitemap.xml\nSitemap: https://' + value[0].Item.domain + '/sitemap.xml'
							});
							callback(err);
						} else callback();
					});
				});
				s3.deleteObject({
					Bucket: 'm.redaktr.com',
					Key: value[0].Item.name + '/sitemap.xml'
				}, (err, data) => {
					if (err) {
						console.log('tree.js', value[0].Item);
						console.log('s3.deleteObject', {
							Bucket: 'm.redaktr.com',
							Key: value[0].Item.name + '/sitemap.xml'
						});
						callback(err);
					} else if (map.length) s3.putObject({
						Bucket: 'm.redaktr.com',
						Key: value[0].Item.name + '/sitemap.xml',
						ContentType: 'application/xml',
						Body: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + mmap.join('') + '</urlset>'
					}, (err, data) => {
						if (err) {
							console.log('tree.js', value[0].Item);
							console.log('s3.putObject', {
								Bucket: 'm.redaktr.com',
								Key: value[0].Item.name + '/sitemap.xml',
								ContentType: 'application/xml',
								Body: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + mmap.join('') + '</urlset>'
							});
							callback(err);
						} else callback();
					});
				});
			};
		deleteFolder.main(value[0].Item.name, tree, s3, f_sitemap, f_sitemap2);
	}
};
