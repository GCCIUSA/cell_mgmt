var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var streamqueue = require("streamqueue");

// source code compilation

gulp.task("js", function () {
    var lib = gulp.src([
        "www/libs/jquery/jquery-2.1.1.min.js",
        "www/libs/jquery/jquery.xdomainajax.js",
        "www/libs/ionic/js/ionic.bundle.min.js",
        "www/libs/ionic/js/ng-cordova.min.js",
        "www/libs/firebase/firebase.js",
        "www/libs/firebase/angularfire.min.js",
        "www/libs/angulartics/angulartics.min.js",
        "www/libs/angulartics/angulartics-ga-cordova.js"]);

    var custom = gulp.src(["www/components/_config.js", "www/components/route.js", "www/components/api.js", "www/components/service.js", "www/controllers/*.js"])
        .pipe(plugins.uglify({ preserveComments: "some" }));

    return streamqueue({ objectMode: true })
        .queue(lib).queue(custom).done()
        .pipe(plugins.concat("script.js"))
        .pipe(gulp.dest("./www/assets/js/"));
});

gulp.task("css", function () {
    var lib = gulp.src("www/libs/ionic/css/ionic.min.css");

    var custom = gulp.src("www/styles/*.less")
        .pipe(plugins.less())
        .pipe(plugins.minifyCss({ keepSpecialComments: 1 }));

    return streamqueue({ objectMode: true })
        .queue(lib).queue(custom).done()
        .pipe(plugins.concat("style.css"))
        .pipe(gulp.dest("./www/assets/css/"));
});

gulp.task("fonts", function () {
    return gulp.src("www/libs/ionic/fonts/*")
        .pipe(gulp.dest("./www/assets/fonts/"));
});

gulp.task("images", function () {
    return gulp.src("www/imgs/*")
        .pipe(gulp.dest("./www/assets/imgs/"));
});

gulp.task("watch", function () {
    plugins.livereload.listen();
    gulp.watch("www/styles/*.less", ["css"]).on("change", plugins.livereload.changed);
    gulp.watch(["www/components/*.js", "www/controllers/*.js"], ["js"]).on("change", plugins.livereload.changed);
    gulp.watch(["www/**/*.html"]).on("change", plugins.livereload.changed);
});

gulp.task("compile", ["css", "js", "fonts", "images"]);

// cordova plugins

/**
 * @param action - "add" or "rm"
 */
function initPlugins(action) {
    var cmd = "cordova plugin ";
    plugins.run(cmd + action + " https://github.com/katzer/cordova-plugin-local-notifications.git").exec();
    plugins.run(cmd + action + " https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git").exec();
    plugins.run(cmd + action + " https://github.com/VersoSolutions/CordovaClipboard").exec();
    plugins.run(cmd + action + " https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git").exec();
    plugins.run(cmd + action + " https://github.com/danwilson/google-analytics-plugin.git").exec();
    plugins.run(cmd + action + " cordova plugin add com.google.cordova.admob").exec();
    plugins.run(cmd + action + " org.apache.cordova.file").exec(function () {
        plugins.run(cmd + action + " org.apache.cordova.media").exec();
    });
}

gulp.task("add-plugins", function () {
    initPlugins("add");
});

gulp.task("rm-plugins", function () {
    initPlugins("rm");
});

// Android Environment

gulp.task("build-android", ["compile"], function () {
    plugins.run("cordova build android").exec();
});

gulp.task("run-android", ["compile"], function () {
    plugins.run("cordova run android").exec();
});

gulp.task("release-android", ["compile"], function () {
    var args = process.argv.slice(3);
    var apkPath = "platforms/android/ant-build/";

    if (args[0] === "-p") {
        plugins.run("cordova build --release android").exec(function () {
            plugins.run("jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release-key.keystore -storepass " + args[1] + " " + apkPath + "CordovaApp-release-unsigned.apk alias_name").exec(function () {
                plugins.run("rm " + apkPath + "cgb.apk").exec(function () {
                    var opts = " -v 4 " + apkPath + "CordovaApp-release-unsigned.apk " + apkPath + "cgb.apk";
                    if (process.platform === "win32") {
                        plugins.run("zipalign" + opts).exec();
                    }
                    else if(process.platform === "darwin") {
                        plugins.run("./zipalign" + opts).exec();
                    }
                });
            });
        });
    }
    else {
        console.log("ERROR: Please provide storepass with [-p] arg");
    }
});

// iOS Environment

gulp.task("build-ios", ["compile"], function () {
    plugins.run("cordova build ios").exec();
});