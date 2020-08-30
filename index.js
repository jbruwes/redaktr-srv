module.exports = {
        main: (name, tree, s3, f_sitemap, f_sitemap2) => {
                var callback = _ => {
                        f_sitemap(tree, '');
                        if (f_sitemap2) f_sitemap2();
                };
                Promise.all([s3.listObjects({
                        Bucket: 'redaktr.com',
                        Prefix: name + '/'
                }).promise(), s3.listObjects({
                        Bucket: 'm.redaktr.com',
                        Prefix: name + '/'
                }).promise()]).then(values => {
                        var deleter = (data, params) => {
                                        data.Contents.forEach(content => {
                                                if (!content.Key.match(/^[^\/]+\/?[^\/]+$/)) params.Delete.Objects.push({
                                                        Key: content.Key
                                                });
                                        });
                                        return params.Delete.Objects.length ? s3.deleteObjects(params).promise() : null;
                                },
                                param1 = {
                                        Bucket: 'redaktr.com',
                                        Delete: {
                                                Objects: []
                                        }
                                },
                                param2 = {
                                        Bucket: 'm.redaktr.com',
                                        Delete: {
                                                Objects: []
                                        }
                                };
                        if (values[0].Contents.length === 0 && values[1].Contents.length === 0) callback();
                        else Promise.all([deleter(values[0], param1), deleter(values[1], param2)]).then(dvalues => {
                                if (dvalues[0].Deleted.length === 1000 || dvalues[1].Deleted.length === 1000) module.exports.main(name, tree, s3, f_sitemap, f_sitemap2);
                                else callback();
                        }).catch(err => {
                                console.log('deleteFolder.js', name);
                                console.log('s3.deleteObjects', JSON.stringify(param1));
                                console.log('s3.deleteObjects', JSON.stringify(param2));
                                console.log(JSON.stringify(err));
                                callback(err);
                        });
                }).catch(err => {
                        console.log('deleteFolder.js', name);
                        console.log('s3.listObjects', {
                                Bucket: 'redaktr.com',
                                Prefix: name + '/'
                        });
                        console.log('s3.listObjects', {
                                Bucket: 'm.redaktr.com',
                                Prefix: name + '/'
                        });
                        console.log(JSON.stringify(err));
                        callback(err);
                });
        }
};
