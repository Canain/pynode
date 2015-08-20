var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var fs = require('fs');
var mkdirp = require('mkdirp');
var rename = require("gulp-rename");
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;

var isWin = /^win/.test(process.platform);

function getNpmBin(done) {
	exec('npm bin', function(error, stdout, stderr) { 
		npmBin = stdout.toString().trim();
		done();
	});
}

var npmBin;

function run(program, args, done, global) {
	if (npmBin === undefined) {
		getNpmBin(function () {
			run(program, args, done, global);
		});
	} else {
		if (!global) {
			program = npmBin + '/' + program;
		}
		var process;
		if (isWin) {
			args.unshift(program);
			args.unshift('/c');
			process = spawn('cmd', args);
		} else {
			process = spawn(program, args);
		}
		process.stdout.on('data', function (data) {
			console.log(data.toString().trim());
		});
		process.stderr.on('data', function (data) {
			console.error(data.toString().trim());
		});
		process.on('exit', function (code) {
			done(code);
		});
	}
}

function getSpacedPath(path) {
	return path.substring(1, path.length - 1).replace(/,/g, ' ');
}

gulp.task('clean', function (done) {
	del(['out'], done);
});

gulp.task('tsd', function (done) {
	run('tsd', ['install'], done);
});

gulp.task('ts', function (done) {
	run('tsc', [], done);
});

gulp.task('js', function (done) {
	runSequence('tsd', 'ts', done);
});

gulp.task('build', function (done) {
	runSequence('clean', 'js', done);
});

gulp.task('run', function (done) {
	run('npm', ['start'], done, true);
});

gulp.task('test', function (done) {
	runSequence('build', 'run', done);
});