# grunt-raygun-sourcemaps [![NPM version](https://badge.fury.io/js/grunt-raygun-sourcemaps.png)](http://badge.fury.io/js/grunt-raygun-sourcemaps)

> Grunt plugin to upload multiple sourcemap files to Raygun.io using [Restler](https://github.com/danwrong/restler).

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-raygun-sourcemaps --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-raygun-sourcemaps');
```

## The "raygun_sourcemaps" task

### Overview
In your project's Gruntfile, add a section named `raygun_sourcemaps` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({

  raygun_sourcemaps: {
    your_target: {
      options: {
        raygun_app_id: "RAYGUN_APP_ID",
        raygun_external_token: "RAYGUN_EXTERNAL_TOKEN",
        url_prefix: "http://www.urltoyourjsdir.com/js/",
        test_run: true,
        prepareUrlParam: function(filesrc) {
          return filesrc;
        }
      },
      files: [{
        expand: true,
        src: ['path/to/sourcemap_dir/**/*.map']
      }]
    }
  }

})
```

### Options

#### options.raygun_app_id
Type: `String`
Default value: `''`
Required: `Yes`

This is your App ID from the Raygun.io App. To get this id, either browse to Application Settings > JS Source Center and copy the last part of the path or just browse anywhere within Raygun and check the URL, your App ID will be in there, f.e. `https://app.raygun.io/dashboard/XXXXX`. The XXXXX is your App ID.

#### options.raygun_external_token
Type: `String`
Default value: `''`
Required: `Yes`

You can create this external Token within your user settings in Raygun, just navigate to https://app.raygun.io/user and check the section `External Access Token`. Generate it, pass it as option.

#### options.url_prefix
Type: `String`
Default value: `''`
Required: `Yes`

This is the url prefix to your final js directory on your server. Just the part which doesn't change before any of the uploaded scripts. Like let's say: `http://www.yourdomain.com/js`

#### options.test_run
Type: `Boolean`
Default value: `false`
Required: `Optional`

This enables a Test Run. No files will be uploaded but the plugin displays all files that need to be uploaded with their parsed urls. You can check if everything will be correct before running the upload.

#### options.prepareUrlParam
Type: `Object`
DefaultValue: `{}`
Required: `Optional`

This callback function sends you the relative path to every `*.map` file it detects, you can modify this path and return a news one for every file. Useful if your local folder structure differs from your server's structure.

### Usage Examples

#### Default Options
In this example, the Plugin will take all files ending with `*.map` within the provided directory, cycle them through the `prepareUrlParams` function and upload them to Raygun.io.
The `prepareUrlParams` function is nice when your real reachable folder structure is different than your local structure. You can use replace or any other string stuff to change the final path in the url to any uploaded file.
If you are unsure what this function does with your paths, just set `test_run` to `true`. With this option no files will be uploaded, they are just gonna be displayed ion your terminal to check all the urls.

```js
grunt.initConfig({

  raygun_sourcemaps: {
    maps: {
      options: {
        raygun_app_id: "123456",
        raygun_external_token: "123456",
        url_prefix: "http://www.urltoyourjsdir.com/js/",
        prepareUrlParam: function(filesrc) {
          return filesrc.replace("ANY_FOLDER", "");
        }
      },
      files: [{
        expand: true,
        src: ['path/to/sourcemap_dir/**/*.map']
      }]
    }
  }

})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

You should fork this repo, and issue a Pull Request with your proposed changes.

### Roadmap ideas
keep your ideas coming..

## Release History
- 0.1.2 - 2015-08-08: Initial Release.
- 0.1.1 - 2015-08-07: Initial Pre-release.
