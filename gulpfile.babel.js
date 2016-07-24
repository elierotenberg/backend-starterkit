import './src/prelude';
Promise.config({
  warnings: true,
  longStackTraces: true,
  monitoring: true,
});

import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import mocha from 'gulp-mocha';
import parseArgs from 'minimist';
import pgp from 'pg-promise';
import rimraf from 'rimraf';
import sloc from 'gulp-sloc';
import sourcemaps from 'gulp-sourcemaps';

import { migrate, createMigration } from './src/migrations';

import Config from './src/Config';
const config = Config.guess({
  pg: {
    poolIdleTimeout: 1,
  },
});

const IGNORE_ARGS = 2;
const args = parseArgs(process.argv.slice(IGNORE_ARGS));
const db = pgp(config.pgp)(config.pg);

const sources = 'src/**/*.js';
const copy = ['src/**/*.sql', 'src/**/*.json'];
const tests = 'dist/**/*.test.js';

const dist = 'dist';

gulp.task('clean', (cb) => rimraf('dist', cb));

gulp.task('sloc', () => gulp.src([sources, ...copy]).pipe(sloc({ tolerant: true })));

gulp.task('copy', () => gulp.src(copy).pipe(gulp.dest(dist)));

gulp.task('lint', () => gulp.src([sources, tests, __filename])
  .pipe(eslint())
  .pipe(eslint.format())
);

gulp.task('test', ['lint', 'compile'], () => gulp.src(tests)
  .pipe(mocha({ timeout: 10000 }))
);

gulp.task('compile', ['lint', 'copy'], () => gulp.src(sources)
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(dist))
);

gulp.task('database:migrate', ['compile'], () =>
  migrate(db, args.from || 'none', args.to || 'current', args.action || 'up')
);

gulp.task('database:create-migration', () => createMigration(args.from || 'none', args.to || 'current'));

gulp.task('default', ['compile']);
