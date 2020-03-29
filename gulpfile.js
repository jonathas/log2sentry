/* eslint-disable */
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const vfs = require("vinyl-fs");

const paths = {
    tocopy: ["./lambda/package.json", "./lambda/yarn.lock"],
    tsfiles: ["./lambda"]
};

gulp.task("copy", () => {
    return vfs.src(paths.tocopy, {
            dot: true, allowEmpty: true
        })
        .pipe(vfs.dest("./dist"));
});

gulp.task("transpile", () => {
    const tsProject = require("gulp-typescript").createProject("./tsconfig.json");
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("default", ["copy", "transpile"], done => done());

gulp.task("watch", () => {
    gulp.watch(paths.tsfiles, ["transpile"]);
});
