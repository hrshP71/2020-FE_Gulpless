'use strict';

var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var rework = require('rework');
var reworkUrl = require('rework-plugin-url');

module.exports = function(config)
{
    // remote url or inline data pattern
    var pattern = new RegExp('^((https?:)?//|data:)');

    return through.obj(function(file, enc, cb){

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-merger', 'Streaming not supported'));
            return;
        }

        // create relative path to file path from destination
        var relative = path.relative(path.resolve(config.destination), path.dirname(file.path)).concat(path.sep);

        // path separator replace to unix style separator
        relative = relative.split(path.sep).join(path.posix.sep);

        try
        {
            var ret = rework(file.contents.toString());

            ret.use(reworkUrl(function(url){

                // url is not a local path, do not rework
                if ( url.match(pattern) )
                {
                    return url;
                }

                // relative path concatenate with file url
                return relative.concat(url);

            }));

            file.contents = new Buffer(ret.toString());

            cb(null, file);
        }
        catch (err)
        {
            cb(new gutil.PluginError('gulp-merger', err, {fileName: err.filename || file.path}));
        }

    });

};