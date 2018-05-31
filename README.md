```
const webpackCompiler = webpack(runtimeWebpackConfig);
import { hotMiddleware, devMiddleware } from 'koa-webpack-hmr';

// webpack 热更新
devApp.use(devMiddleware(webpackCompiler, {
  // display no info to console (only warnings and errors)
  noInfo: false,

  // display nothing to the console
  quiet: false,

  // switch into lazy mode
  // that means no watching, but recompilation on every request
  lazy: false,

  // watch options (only lazy: false)
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },

  // public path to bind the middleware to
  // use the same as in webpack
  publicPath: runtimeConfig.publicPath,

  // custom headers
  // headers: { "X-Custom-Header": "yes" },

  // options for formating the statistics
  stats: {
    // do not log child plugin outputs
    children: false,
    // Makes the build much quieter
    chunks: false,
    // Shows colors in the console
    colors: true
  }
}));

devApp.use(hotMiddleware(webpackCompiler, {
  // log: console.log,
  // path: '/__webpack_hmr',
  // heartbeat: 10 * 1000
}));
```