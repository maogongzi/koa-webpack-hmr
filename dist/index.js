'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.devMiddleware = exports.hotMiddleware = undefined;

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _stream = require('stream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hotMiddleware(compiler, opts) {
  const expressHotMiddleware = (0, _webpackHotMiddleware2.default)(compiler, opts);

  return async (ctx, next) => {
    let stream = new _stream.PassThrough();

    ctx.body = stream;

    await expressHotMiddleware(ctx.req, {
      write: stream.write.bind(stream),

      writeHead: (status, headers) => {
        ctx.status = status;
        ctx.set(headers);
      }
    }, next);
  };
} // Based on https://github.com/leecade/koa-webpack-middleware
//
// Since the original Repo is out of maintaince for a relatively long time
// and can't work together with koa2 and Webpack 3, I decided to create a
// new one based on it(Dylan)
//
// Currently there are no significant changes, simply upgraded Webpack
// middlewares to there latest versions.

function devMiddleware(compiler, opts) {
  const expressDevMiddleware = (0, _webpackDevMiddleware2.default)(compiler, opts);

  async function middleware(ctx, next) {
    await expressDevMiddleware(ctx.req, {
      end: content => {
        ctx.body = content;
      },
      setHeader: (name, value) => {
        ctx.set(name, value);
      }
    }, next);
  }

  let {
    getFilenameFromUrl,
    waitUntilValid,
    invalidate,
    close,
    fileSystem
  } = expressDevMiddleware;

  Object.assign(middleware, {
    getFilenameFromUrl,
    waitUntilValid,
    invalidate,
    close,
    fileSystem
  });

  return middleware;
}

exports.hotMiddleware = hotMiddleware;
exports.devMiddleware = devMiddleware;