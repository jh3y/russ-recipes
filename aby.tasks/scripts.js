module.exports = [
  {
    name: 'compile:scripts',
    doc : 'compiles runtime JavaScript files',
    deps: [
      'fs',
      'path',
      'glob',
      'mkdirp',
      'uglify-js'
    ],
    func: function(fs, path, glob, mkdirp, uglify, aby) {
      const isDist = aby.env === 'dist';
      const outputDir = aby.config.paths.destinations.scripts;
      const pushToServe = (filePath) => {
        mkdirp.sync(`${outputDir}src/js`);
        const content = fs.readFileSync(filePath);
        fs.writeFileSync(`${outputDir}${filePath}`, content);
      };
      mkdirp.sync(outputDir);
      glob(aby.config.paths.sources.scripts, (err, files) => {
        if (!isDist) files.map(pushToServe);
        const res = uglify.minify(files, {
          outSourceMap: (!isDist) ? 'source.js.map' : null,
          wrap: 'aby-recipes',
          beautify: true
        });
        fs.writeFileSync('public/js/scripts.js', res.code);
        if (!isDist) fs.writeFileSync('public/js/source.js.map', res.map);
        aby.resolve();
      });
    }
  },
  {
    name: 'lint:scripts',
    doc: 'lints scripts using eslint',
    func: function(aby) {
      setTimeout(() => {
        aby.reject('hhhhmmm');
      }, 1000);
    }
  },
  {
    name: 'watch:scripts',
    doc: 'watch for script source changes then run and compile',
    deps: [
      'gaze'
    ],
    func: function(gaze, aby) {
      gaze(aby.config.paths.sources.scripts, (err, watcher) => {
        watcher.on('changed', (filepath) => {
          aby.log.info(`${filepath} changed!`);
          aby.run('compile:scripts');
        });
      });
    }
  }
];
