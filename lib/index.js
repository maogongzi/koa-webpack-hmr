// Based on https://github.com/leecade/koa-webpack-middleware
//
// Since the original Repo is out of maintaince for a relatively long time
// and can't work together with koa2 and Webpack 3, I decided to create a
// new one based on it(Dylan)
//
// Currently there are no significant changes, simply upgraded Webpack
// middlewares to there latest versions.

import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { PassThrough } from 'stream';

function hotMiddleware(compiler, opts) {
  const expressHotMiddleware = webpackHotMiddleware(compiler, opts);

  return async (ctx, next) => {
    let stream = new PassThrough();

    ctx.body = stream;

    await expressHotMiddleware(ctx.req, {
      write: stream.write.bind(stream),

      writeHead: (status, headers) => {
        ctx.status = status;
        ctx.set(headers);
      }
    }, next);
  };
}

function devMiddleware(compiler, opts) {
  const expressDevMiddleware = webpackDevMiddleware(compiler, opts);

  async function middleware (ctx, next) {
    await expressDevMiddleware(ctx.req, {
      end: (content) => {
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

export {
  hotMiddleware,
  devMiddleware
};
