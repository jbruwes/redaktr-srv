module.exports = {
	main: (link, domain, path, map, mmap, lastmod, changefreq, priority) => {
		if (domain) {
			path = path.split('/');
			path.shift();
			path = path.join('/');
			if (link) link = link.replace(/^\/+|\/+$/g, '');
			if (link) {
				map.push('<url>' +
					'<loc>https://' + domain + '/' + link + '/' + '</loc>' +
					(lastmod ? '<lastmod>' + lastmod + '</lastmod>' : '') +
					(changefreq ? '<changefreq>' + changefreq + '</changefreq>' : '') +
					(priority ? '<priority>' + priority + '</priority>' : '') +
					'</url>');
				mmap.push('<url>' +
					'<loc>https://m.' + domain + '/' + link + '/' + '</loc>' +
					(lastmod ? '<lastmod>' + lastmod + '</lastmod>' : '') +
					(changefreq ? '<changefreq>' + changefreq + '</changefreq>' : '') +
					(priority ? '<priority>' + priority + '</priority>' : '') +
					'</url>');
			} else {
				map.push('<url>' +
					'<loc>https://' + domain + (path ? '/' + path + '/' : '/') + '</loc>' +
					(lastmod ? '<lastmod>' + lastmod + '</lastmod>' : '') +
					(changefreq ? '<changefreq>' + changefreq + '</changefreq>' : '') +
					(priority ? '<priority>' + priority + '</priority>' : '') +
					'</url>');
				mmap.push('<url>' +
					'<loc>https://m.' + domain + (path ? '/' + path + '/' : '/') + '</loc>' +
					(lastmod ? '<lastmod>' + lastmod + '</lastmod>' : '') +
					(changefreq ? '<changefreq>' + changefreq + '</changefreq>' : '') +
					(priority ? '<priority>' + priority + '</priority>' : '') +
					'</url>');
			}
		}
	}
};
