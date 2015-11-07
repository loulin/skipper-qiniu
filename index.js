/**
 *
 * Author: Lou, Lin <lin.lou@hotmail.com>
 * Purpose: Skipper adapter ( used by the sails.js framework )
 * License: MIT
 * Copyright Lin Lou @2015
 */

var Writable = require('stream').Writable;
var _ = require('lodash');
var mime = require('mime');
var qiniu = require('qiniu');
var debug = require('debug')('skipper-qiniu');

module.exports = function SkipperQiniu(globalOptions) {
  globalOptions = globalOptions || {};

  var adapter = {
    receive: QiniuReceiver
  };

  return adapter;

  /**
   * A simple receiver for Skipper that writes Upstreams to Qiniu Storage
   * to the configured container at the configured path.
   *
   * @param {Object} options
   * @returns {Stream.Writable}
   */
  function QiniuReceiver(options) {

    options = options || {};
    options = _.defaults(options, globalOptions);

    qiniu.conf.ACCESS_KEY = options.accessKey;
    qiniu.conf.SECRET_KEY = options.secretKey;

    var receiver = Writable({
      objectMode: true
    });

    receiver.once('error', function(err) {
      console.error('Receiver: Error', err);
    });

    receiver._write = function onFile(newFile, encoding, done) {
      var startedAt = new Date();

      newFile.once('error', function(err) {
        console.error('Receiver: Error on file read stream (%s) :: ', newFile.filename, err);
      });

      var putPolicy = new qiniu.rs.PutPolicy(options.bucket);
      var extra = new qiniu.io.PutExtra();

      _.assign(putPolicy, options.policy);
      _.assign(extra, options.extra);
      //extra.mimeType = extra.mimeType || mime.lookup(newFile.fd);

      var key = options.setKey ? newFile.filename : null;

      var uptoken = putPolicy.token();

      qiniu.io.put(uptoken, key, newFile, extra, function(err, ret) {
        if (err) {
          // http://developer.qiniu.com/docs/v6/api/reference/codes.html
          //receiver.emit('error', err);
          console.error('Receiver: Error writing (%s) :: ' + newFile.filename, err);
          return done(err);
        }

        var endedAt = new Date();
        var duration = (endedAt - startedAt) / 1000;

        debug('UPLOAD ' + newFile.filename + ' took ' + duration + ' seconds .. ');
        //receiver.emit('finish', ret);
        newFile.extra = ret;
        return done(null, ret);
      });
    };
    return receiver;
  }
};
