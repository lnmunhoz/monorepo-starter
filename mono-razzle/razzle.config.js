'use strict';
const path = require('path');
module.exports = {
  modify(baseConfig, { target, dev }, webpack) {
    const config = Object.assign({}, baseConfig);

    config.resolve.extensions = config.resolve.extensions.concat([
      '.ts',
      '.tsx',
    ]);

    config.devtool = 'cheap-module-source-map';

    // Locate eslint-loader and remove it (we're using tslint instead)
    config.module.rules = config.module.rules.filter(
      rule =>
        !(
          Array.isArray(rule.use) &&
          rule.use.length > 0 &&
          rule.use[0].options &&
          'useEslintrc' in rule.use[0].options
        )
    );

    // Safely locate Babel-Loader in Razzle's webpack internals
    const babelLoader = config.module.rules.findIndex(
      rule => rule.options && rule.options.babelrc
    );

    // Get the correct `include` option, since that hasn't changed.
    // This tells Razzle which directories to transform.
    const { include } = config.module.rules[babelLoader];

    // Declare our TypeScript loader configuration
    const tsLoader = {
      include,
      test: /\.tsx?$/,
      loader: require.resolve('ts-loader'),
      options: {
        // this will make errors clickable in `Problems` tab of VSCode
        visualStudioErrorFormat: true,
      },
    };

    // const tslintLoader = {
    //   include,
    //   enforce: 'pre',
    //   test: /\.tsx?$/,
    //   loader: require.resolve('tslint-loader'),
    //   options: {
    //     emitErrors: true,
    //     configFile: path.resolve('../tslint.json'),
    //   },
    // };

    // config.module.rules.push(tslintLoader);

    // Fully replace babel-loader with ts-loader
    config.module.rules[babelLoader] = tsLoader;

    return config;
  },
};
