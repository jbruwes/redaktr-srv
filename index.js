'use strict'
let aws = require('aws-sdk');
let s3 = new aws.S3({
    accessKeyId: process.env.NODE_MINIO_ACCESS_KEY,
    secretAccessKey: process.env.NODE_MINIO_SECRET_ACCESS_KEY,
    endpoint: "http://s3.redaktr",
    s3ForcePathStyle: true,
    signatureVersion: "v4"
});
let http = require('http');
let html = require('./html');
let kharon = require('./kharon');
let hermes = require('./hermes');
http
  .createServer((req, res) => {
    req.on('data', chunk => {
      const event = JSON.parse(chunk);
      const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
      let id = key.match(/^[^\/]+/)[0];
      id = id.substr(0, id.lastIndexOf('.')) || id;
      const contentType = event.Records[0].s3.object.userMetadata["content-type"].match(/^.*(?=;)/)[0];
      console.log("content-type =", contentType);
      console.log("key =", key);
      console.log("id =", id);
	Promise.all([s3.getObject({Bucket: 'redaktr', Key: 'redaktr.json'}).promise(),
	s3.getObject({
		Bucket: 'redaktr',
		Key: id + '.json',
	}).promise(), s3.getObject({
		Bucket: 'redaktr',
		Key: id + '.html'
	}).promise()]).then(value => {
		let buf = JSON.parse(value[0].Body)[0];
		value[0] = {};
		value[0].Item = buf;
		console.log(value);
		switch(contentType) {
			case "application/json":
			kharon.main(value, id, key, s3, _ => {console.log('kharon done.')});
			break;
			case "text/html":
			if(id + '.html' === key)hermes.main(value, id, key, s3, _ => {console.log('hermes done.')});
			else html.main(value, id, key, s3, _ => {console.log('html done.')});
			break;
		}
	}).catch(err => {
		console.log(err);
	});
    });
    res.end();
  })
  .listen(3000);
