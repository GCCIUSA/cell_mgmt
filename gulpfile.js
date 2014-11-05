var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var streamqueue = require("streamqueue");

gulp.task("js", function () {
    var lib = gulp.src([
        "www/libs/jquery/jquery-2.1.1.min.js",
        "www/libs/jquery/jquery.xdomainajax.js",
        "www/libs/ionic/js/ionic.bundle.min.js",
        "www/libs/ionic/js/ng-cordova.min.js",
        "www/libs/firebase/firebase.js",
        "www/libs/firebase/angularfire.min.js"]);

    var custom = gulp.src(["www/components/*.js", "www/controllers/*.js"])
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

gulp.task("init-android", function () {
    plugins.run("cordova platform add android").exec(function () {
        // install cordva plugins
        plugins.run("cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications.git").exec();
        plugins.run("cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git").exec();
        plugins.run("cordova plugin add org.apache.cordova.file").exec();
        plugins.run("cordova plugin add https://github.com/VersoSolutions/CordovaClipboard").exec();
        plugins.run("cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git").exec();
        plugins.run("cordova plugin add org.apache.cordova.media").exec();

        // replace app icons
        console.log("Replacing app icons...");
        gulp.src("resources/icon-96.png")
            .pipe(plugins.rename("icon.png"))
            .pipe(gulp.dest("platforms/android/res/drawable/"))
            .pipe(gulp.dest("platforms/android/res/drawable-xhdpi/"));

        gulp.src("resources/icon-72.png")
            .pipe(plugins.rename("icon.png"))
            .pipe(gulp.dest("platforms/android/res/drawable-hdpi/"));

        gulp.src("resources/icon-48.png")
            .pipe(plugins.rename("icon.png"))
            .pipe(gulp.dest("platforms/android/res/drawable-mdpi/"));

        gulp.src("resources/icon-36.png")
            .pipe(plugins.rename("icon.png"))
            .pipe(gulp.dest("platforms/android/res/drawable-ldpi/"));
    });
});

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
                    plugins.run("zipalign -v 4 " + apkPath + "CordovaApp-release-unsigned.apk " + apkPath + "cgb.apk").exec();
                });
            });
        });
    }
});