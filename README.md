# [<img title="skipper-qiniu - Qiniu Storage adapter for Skipper" src="http://i.imgur.com/P6gptnI.png" width="200px" alt="skipper emblem - face of a ship's captain"/>](https://github.com/loulin/skipper-qiniu) Qiniu Storage Adapter

[![npm version](https://badge.fury.io/js/skipper-qiniu.svg)](https://badge.fury.io/js/skipper-qiniu) 

Qiniu adapter for receiving [upstreams](https://github.com/balderdashy/skipper#what-are-upstreams). Particularly useful for handling streaming multipart file uploads from the [Skipper](https://github.com/balderdashy/skipper) body parser.

## Installation

```
$ npm install skipper-qiniu --save
```

Also make sure you have skipper itself [installed as your body parser](http://sailsjs.org/documentation/concepts/middleware#?adding-or-overriding-http-middleware).  This is the default configuration in [Sails](https://github.com/balderdashy/sails) as of v0.10.

## Usage

```javascript
req.file('avatar').upload({
  adapter: require('skipper-qiniu'),
  bucket: 'development', // required
  accessKey: 'your qiniu accessKey', // required
  secretKey: 'your qiniu secretKey', // required
  policy: {
    // returnUrl should not be included
    returnBody: '{"name": $(fname),"size": $(fsize),"width": $(imageInfo.width),"height": $(imageInfo.height),"key": $(key)}'
  },
  extra: {}
}, function(err, files) {
  if (err) {
    return res.serverError(err);
  }

  return res.json({
    message: files.length + ' file(s) uploaded successfully!',
    files: files
  });
});
```

For more detailed usage information and a full list of available options, see [Qiniu Node.js SDK](http://developer.qiniu.com/docs/v6/sdk/nodejs-sdk.html).

## Contributions

If you want to contribute something to the project, feel free to create a pull request or open an issue.

To run the tests:

```sh
git clone git@github.com:loulin/skipper-qiniu.git
cd skipper-qiniu
npm install
ACCESSKEY=your_qiniu_access_key SECRETKEY=your_qiniu_secret_key BUCKET=your_qiniu_bucket npm test
```

Please don't check in your qiniu credentials :)

## License

**[MIT](./LICENSE)**
&copy; 2015-

[Lin Lou](https://github.com/loulin), [Node.js](https://lodejs.org) & contributors

See `LICENSE.md`.

This module is part of the [Sails framework](http://sailsjs.org), and is free and open-source under the [MIT License](http://sails.mit-license.org/).

![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png)


