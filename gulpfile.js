var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var streamqueue = require("streamqueue");

gulp.task("js", function () {
    var lib = gulp.src(["src/libs/ionic/js/ionic.bundle.min.js", "src/libs/firebase/firebase.js", "src/libs/firebase/angularfire.min.js"]);

    var custom = gulp.src(["src/components/*.js", "src/controllers/*.js"])
        .pipe(plugins.uglify({ preserveComments: "some" }));

    return streamqueue({ objectMode: true })
        .queue(lib).queue(custom).done()
        .pipe(plugins.concat("script.js"))
        .pipe(gulp.dest("./src/assets/js/"));
});

gulp.task("css", function () {
    var lib = gulp.src("src/libs/ionic/css/ionic.min.css");

    var custom = gulp.src("src/styles/*.less")
        .pipe(plugins.less())
        .pipe(plugins.minifyCss({ keepSpecialComments: 1 }));

    return streamqueue({ objectMode: true })
        .queue(lib).queue(custom).done()
        .pipe(plugins.concat("style.css"))
        .pipe(gulp.dest("./src/assets/css/"));
});

gulp.task("fonts", function () {
    return gulp.src("src/libs/ionic/fonts/*")
        .pipe(gulp.dest("./src/assets/fonts/"));
});

gulp.task("watch", function () {
    plugins.livereload.listen();
    gulp.watch("src/styles/*.less", ["css"]).on("change", plugins.livereload.changed);
    gulp.watch(["src/components/*.js", "src/controllers/*.js"], ["js"]).on("change", plugins.livereload.changed);
    gulp.watch(["src/**/*.html"]).on("change", plugins.livereload.changed);
});

gulp.task("compile", ["css", "js", "fonts"]);