let html = require('./html');
let deleteFolder = require('./deleteFolder');
let hardLink = require('./hardLink');
module.exports = {
	main: (value, id, key, s3, callback) => {
		var tree = JSON.parse(value[1].Body.toString()),
			f_sitemap = (p_tree, pPath) => {
				p_tree.forEach(val => {
					val.path = decodeURI((pPath + '/' + val.value).trim().replace(/^\//, '')).replace(/ /g, '_');
					html.main(value, id, id + '/' + val.id + '.htm', s3, callback, val);
					if (value[0].Item.domain) hardLink.main(val.url, value[0].Item.name, value[0].Item.domain, val.path, s3, callback);
					if (val.data) f_sitemap(val.data, pPath + '/' + val.value);
				});
			};
		deleteFolder.main(value[0].Item.name, tree, s3, f_sitemap);
	}
};
