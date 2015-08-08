/*
 * grunt-raygun-sourcemaps
 * https://github.com/clubdesign/grunt-raygun-sourcemaps
 *
 * Copyright (c) 2015 Marcus Pohorely
 * Licensed under the MIT license.
 */
'use strict';

var async = require('async');

module.exports = function(grunt) {

  var fs = require('fs');
  var rest = require('restler');
  var chalk = require('chalk');

  grunt.registerMultiTask('raygun_sourcemaps', 'Grunt plugin to upload multiple sourcemap files to Raygun.io', function() {
    var done = this.async();

    var options = this.options({
      raygun_app_id: "",
      raygun_external_token: "",
      url_prefix: "",
      test_run: false,
      prepareUrlParam: function(abspath) {
        return abspath;
      }
    });

    if (options.raygun_external_token === "") {
      grunt.fail.warn('Raygun External Token is missing.');
      return;
    }

    if (options.raygun_app_id === "") {
      grunt.fail.warn('Raygun App ID is missing.');
      return;
    }

    if (options.url_prefix === "") {
      grunt.fail.warn('Url Prefix is missing');
      return;
    }

    if (options.test_run) {
      grunt.log.warn('Test Rund is enabled. Files will not be uploaded.');
    }

    // Building Raygun Url
    options.raygun_url = "https://app.raygun.io/upload/jssymbols/" + options.raygun_app_id + "?authToken=" + options.raygun_external_token;

    async.eachSeries(this.files, function(f, nextFileObj) {

      var files = f.src.filter(function(filepath) {

        if (!grunt.file.isFile(filepath)) {
          return false;
        }

        if (filepath.slice(-4) !== ".map") {
          grunt.log.warn('Source file "' + filepath + '" doesn`t seem to be a sourcemap, will not be uploaded.');
          return false;
        }

        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }

        return true;

      });


      if (files.length === 0) {
        if (f.src.length < 1) {
          grunt.log.warn('Destination ' + chalk.cyan(f.src) + ' not written because no source files were found.');
        }
        return nextFileObj();
      }

      async.concatSeries(files, function(file, next) {

        var file_url = options.url_prefix + options.prepareUrlParam(file.replace(".map", ""));

        if (!options.test_run) {
          uploadToRaygun(options.raygun_url, file, file_url, function(has_err, err) {

            if (!has_err) {
              grunt.log.ok('Upload successful of "' + file + '"');
              process.nextTick(next);
            } else {
              grunt.log.warn('Upload failed of "' + file + '"');
              nextFileObj(err);
            }

          });
        } else {
          grunt.log.write(">> File: " + file + " >> " + file_url + "\n");
          process.nextTick(next);
        }

      }, function() {
        nextFileObj();
      });

    }, done);

  });

  var uploadToRaygun = function(raygun_url, file, file_url, callback) {

    fs.stat(file, function(err, stats) {

      if (err) {
        callback(true, err);
        return;
      }

      if (!stats.isFile()) {
        callback(true, "no_file");
        return;
      }

      var file_size = stats.size;
      var request_data = {
        file: rest.file(file, null, file_size, null, null),
        url: file_url
      };

      rest.post(raygun_url, {
        rejectUnauthorized: false,
        followRedirects: true,
        headers: {},
        multipart: true,
        data: request_data
      }).on('error', function(e) {
        grunt.fail.warn('Failed uploading (error code: ' + e.message + ')');
        callback(true, e.message);
      }).on('complete', function(jdata, response) {
        if (response !== null && response.statusCode >= 200 && response.statusCode < 300) {

          if (jdata.Status === "Success") {
            callback(false);
          } else {
            callback(true, jdata.Message);
          }

        } else {
          callback(true, 'Failed uploading "' + file + '" (status code: ' + response.statusCode + ')');
        }
      });

    });

  };

};
