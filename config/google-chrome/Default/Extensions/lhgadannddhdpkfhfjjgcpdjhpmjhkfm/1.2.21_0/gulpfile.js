const gulp = require('gulp');
const gulps = require("gulp-series");

const fs = require('fs');
const path = require("path");
const gutil = require('gulp-util');
const pump = require('pump');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const archiver = require('archiver');
const webpack = require('webpack-stream');
const manifest = require("./manifest.json");
let scripts = __dirname + "/scripts/";
let libs = __dirname + "/libs/";
let min = scripts + 'js';

const addCallbackToChain = (() => {
    let lastInChain = Promise.resolve();
    return (callback) => {
        return lastInChain = lastInChain.then(() => {
            return new Promise(callback);
        })
    };
})();

let poly = 'node_modules/babel-polyfill/dist/polyfill.js';
let background = {
    minJs: "background.min.js",
    minArr: [
        'scripts/sentry.js',
        'libs/ga.js',
        'libs/jquery/jquery-1.12.4.min.js',
        'scripts/background/device.js',
        'libs/gif.js/gif.js',
        'scripts/generic.js',
        'scripts/commons/crypto.js',
        'scripts/commons/storage.js',
        'scripts/commons/clipboard.js',
        'scripts/commons/media_stream.js',
        'scripts/commons/communication.js',
        'scripts/chrome_api/events.js',
        'scripts/chrome_api/runtime.js',
        'scripts/chrome_api/hardware.js',
        'scripts/chrome_api/storage.js',
        'scripts/chrome_api/context_menu.js',
        'scripts/chrome_api/notifications.js',
        'scripts/chrome_api/tabs.js',
        'scripts/chrome_api/windows.js',
        'scripts/chrome_api/misc.js',
        'scripts/services/take_ms.js',
        'scripts/services/monosnap.js',
        'scripts/services/aws_s3.js',
        'scripts/background/background.js',
        'scripts/background/views.js',
        'scripts/background/chrome_os.js',
        'scripts/background/context_menu.js',
        'scripts/background/screenshot.js',
        'scripts/background/screencast.js',
        'scripts/background/state/default.js',
        'scripts/background/state/app_state.js',
        'scripts/background/accounts.js',
        'scripts/background/accounts/monosnap.js',
        'scripts/background/accounts/aws_s3.js',
        'scripts/background/sessions.js',
        'scripts/background/upload.js',
        'scripts/background/log.js',
        'scripts/uuid_v1@latest.js',
    ]

};
let editor = {
    minJs: "editor.min.js",
    minArr: [
        'scripts/sentry.js',
        'libs/ga.js',
        'libs/jquery/jquery-1.12.4.min.js',
        'libs/bootstrap/js/bootstrap.min.js',
        'libs/imgAreaSelect/js/jquery.imgareaselect.dev.js',
        'libs/colorpicker/js/colorpicker.js',
        'scripts/generic.js',
        'scripts/background/state/default.js',
        'scripts/chrome_api/runtime.js',
        'scripts/chrome_api/notifications.js',
        'scripts/commons/communication.js',
        'scripts/commons/ui/ejs.js',
        'scripts/commons/ui/slider.js',
        'scripts/commons/color_tools.js',
        'scripts/editor/editor.js',
        'scripts/editor/geometric_tools.js',
        'scripts/editor/tools.js',
        'scripts/commons/ui/top_export_panel.js',
        'scripts/tab_manager.js',
    ]
};

let popup = {
    minJs: "popup.min.js",
    minArr: [
        'scripts/sentry.js',
        'libs/jquery/jquery-1.12.4.min.js',
        'scripts/generic.js',
        'libs/ga.js',
        'scripts/chrome_api/events.js',
        'scripts/chrome_api/runtime.js',
        'scripts/chrome_api/tabs.js',
        'scripts/chrome_api/notifications.js',
        'scripts/commons/communication.js',
        'scripts/popup/popup.js'
    ]
};

let settings = {
    minJs: "settings.min.js",
    minArr: [
        'scripts/sentry.js',
        'libs/ga.js',
        'libs/jquery/jquery-1.12.4.min.js',
        'libs/bootstrap/js/bootstrap.min.js',
        'scripts/generic.js',
        'scripts/chrome_api/runtime.js',
        'scripts/services/aws_s3.js',
        'scripts/chrome_api/notifications.js',
        'scripts/commons/communication.js',
        'scripts/commons/ui/ejs.js',
        'scripts/settings/settings.js',
        'scripts/settings/general.js',
        'scripts/settings/accounts.js',
        'scripts/settings/feedback.js',
        'scripts/tab_manager.js'
    ]
};

let screencast_player = {
    minJs: "screencast_player.min.js",
    minArr: [
        'scripts/sentry.js',
        'libs/ga.js',
        'libs/jquery/jquery-1.12.4.min.js',
        'libs/bootstrap/js/bootstrap.min.js',
        'libs/imgAreaSelect/js/jquery.imgareaselect.dev.js',
        'scripts/generic.js',
        'scripts/tab_manager.js',
        'scripts/chrome_api/runtime.js',
        'scripts/commons/communication.js',
        'scripts/commons/ui/slider.js',
        'scripts/commons/ui/top_export_panel.js',
        'scripts/editor/geometric_tools.js',
        'scripts/recording/screencast_player.js'
    ]
};
let countdown = {
    minJs: "countdown.min.js",
    minArr: [
        'scripts/sentry.js',
        'scripts/tab_manager.js',
        'scripts/chrome_api/runtime.js',
        'scripts/countdown/countdown.js'
    ]
};

let latest_uploads = {
    minJs: "latest_uploads.min.js",
    minArr: [
        'scripts/sentry.js',
        'libs/ga.js',
        'libs/jquery/jquery-1.12.4.min.js',
        'libs/bootstrap/js/bootstrap.min.js',
        "scripts/generic.js",
        'scripts/tab_manager.js',
        'scripts/chrome_api/runtime.js',
        'scripts/commons/communication.js',
        'scripts/services/monosnap.js',
        'scripts/services/aws_s3.js',
        'scripts/commons/ui/ejs.js',
        'scripts/latest_uploads/latest_uploads.js',
        'scripts/uuid_v1@latest.js',
    ]
};

let recording_controls = {
    minJs: "recording_controls.min.js",
    minArr: [
        'scripts/sentry.js',
        'libs/jquery/jquery-1.12.4.min.js',
        'libs/ga.js',
        'scripts/chrome_api/hardware.js',
        'scripts/background/device.js',
        'scripts/generic.js',
        'scripts/tab_manager.js',
        'scripts/chrome_api/runtime.js',
        'scripts/commons/communication.js',
        'scripts/recording/controls.js'
    ]
};

let okta = {
    poly: false,
    minJs: "okta.min.js",
    minArr: [
        'scripts/sentry.js',
        'libs/jquery/jquery-1.12.4.min.js',
        'scripts/commons/communication.js',
        'scripts/settings/okta.js'
    ]
};
const oktaAuthClient = {
    processWithWebpack: true,
    minJs: "oktaAuthClient.min.js",
    minArr: [
        "scripts/okta/oktaAuthClient/index.js"
    ]
};
const popupChromeExtensionLoaderInjectScript = {
    processWithWebpack: true,
    minJs: "PopupLoaderInjectScript.min.js",
    minArr: [
        "scripts/okta/loader/PopupChromeExtensionLoader/PopupLoaderInjectScript.js"
    ]
};

const oktaBlock = {
    processWithWebpack: true,
    minJs: "OktaBlock.min.js",
    minArr: [
        "scripts/settings/OktaBlock/index.js"
    ]
};

let files = [
    background,
    editor,
    popup,
    settings,
    screencast_player,
    countdown,
    recording_controls,
    latest_uploads,
    okta,
    oktaAuthClient,
    popupChromeExtensionLoaderInjectScript,
    oktaBlock
];


function deleteFiles(files, callback) {
    var i = files.length;
    files.forEach(function (filepath) {
        fs.unlink(min + "/" + filepath.minJs, function (err) {
            i--;
            try {
                if (fs.existsSync(min + "/" + filepath.minJs)) {
                    fs.unlinkSync(min + "/" + filepath.minJs);
                    if (fs.existsSync(min + "/" + filepath.minJs + '.map')) {
                        fs.unlinkSync(min + "/" + filepath.minJs + '.map');
                    }
                }
                if (i <= 0) {
                    callback(null);
                }
            } catch (err) {
                callback(err);
            }
        });
    });
}

function webpackGulp(entry) {
    return addCallbackToChain((resolve, reject) => {
        const {minJs, minArr} = entry;
        pump(
            [
                gulp.src(...minArr),
                webpack({
                    mode: process.env.NODE_ENV,
                    output: {
                        filename: minJs
                    },
                    devtool: "none",
                    resolve: {
                        aliasFields: ["main"],
                        alias: {
                            "jso$": path.resolve(__dirname, "node_modules/jso/dist/jso.js")
                        }
                    },
                    module: {
                        rules: [
                            {
                                test: /\.m?js$/,
                                exclude: /(node_modules|bower_components)/,
                                use: {
                                    loader: 'babel-loader',
                                    options: {
                                        presets: [
                                            ['@babel/preset-env',
                                                {
                                                    "targets": {
                                                        "chrome": "50",
                                                    }
                                                }
                                            ]
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }),
                gulp.dest(min)
            ], (error) => error ? reject(error) : resolve()
        );
    });
}

function pushPromise() {
    return new Promise((res, rej) => {
        let prom = [];

        files.forEach(function (obj, key) {

            let p = poly;
            if (obj.poly !== undefined && obj.poly === false) {
                p = ''
            }
            prom.push(new Promise((res, rej) => {
                const {processWithWebpack} = obj;
                if (processWithWebpack) {
                    webpackGulp(obj).then(res, rej);
                } else {
                    pump(
                        [
                            gulp.src([p, ...obj.minArr]),
                            babel({presets: ['@babel/env']}),
                            concat(obj.minJs),
                            // uglify(),
                            gulp.dest(min)
                        ], (data) => {
                            if (!data) {
                                res()
                            } else {
                                rej(data)
                            }

                        }
                    );
                }
            }));
            if (key === files.length - 1) {
                res(prom)
            }
        })

    })
}

let one = (cb) => {
    deleteFiles(files, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('all files removed');
            pushPromise().then((prom) => {
                Promise.all(prom)
                    .then(() => {
                            cb()
                        },
                        (err) => {
                            gutil.log(gutil.colors.red('[Error]'), err.toString());
                            cb(err.code)
                        });
            });
        }
    });
};


gulp.task('minify', one);


if (process.env.WATCH === 'true') {
    let pat = "**/*.js";
    let watcher = gulp.watch([__filename, scripts + pat, libs + pat], ['minify']);
    watcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
}


function formFileName() {
    const dt = new Date();
    const date = `${dt.getFullYear()}_${dt.getMonth() + 1}_${dt.getDate()}`;
    const time = dt.getHours() + '-' + dt.getMinutes();
    const version = manifest.version;
    console.log(`Date: ${date} Time: ${time}`);
    return `chromeExt_${version}_${date}_${time}.zip`;

}

let two = (cb) => {
    let zip = formFileName();

    let ignore = [
        '.DS_Store',
        '.git',
        '.idea',
        'node_modules',
        'package-lock.json',
        'builds'
    ];

    const buildPath = path.resolve(__dirname, './builds');
    // create a file to stream archive data to.
    if (!fs.existsSync(buildPath)) {
        fs.mkdirSync(buildPath);
    }
    const writePath = path.resolve(buildPath, zip);
    var output = fs.createWriteStream(writePath);
    var archive = archiver('zip', {
        zlib: {level: 9} // Sets the compression level.
    });


    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        cb()
    });


    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function () {
        console.log('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
        throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);
    let f = fs.readdirSync('./');
    f.forEach((file, key) => {
        if (ignore.indexOf(file) !== -1) {
            return
        }

        if (fs.lstatSync('./' + file).isDirectory()) {
            archive.directory(file + '/', file);
        } else if (fs.lstatSync('./' + file).isFile()) {
            archive.file(file, {name: file});
        }

        if (f.length - 1 === key) {
            archive.finalize();
        }
    })


};
gulp.task('zip', two);
gulps.registerTasks({
    "minify": one,
    "zip": two
});
gulps.registerSeries("deploy", ['minify', 'zip']);
