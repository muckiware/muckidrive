const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
var path = require('path');

module.exports = function(options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    output: {
      filename: 'server.js',
      path: path.resolve(__dirname, 'dist')
    },
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new webpack.HotModuleReplacementPlugin(),
      new RunScriptWebpackPlugin({ name: 'server.js' }),
    ],
  };
};
