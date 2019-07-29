const http = require('http');

class LikeKoa2 {
  constructor() {
    // 存放中间件
    this.middleList = [];
  }

  use(fn) {
    this.middleList.push(fn);
    return this;
  }

  createCtx(req, res) {
    const ctx = { req, res };
    ctx.query = req.query;
    return ctx;
  }

  // next核心机制
  compose(middleList) {
    return ctx => {
      const dispatch = i => {
        try {
          const fn = middleList[i];
          if (fn) {
            return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
          }
        } catch (err) {
          return Promise.reject(err);
        }
      };
      dispatch(0);
    };
  }

  callback() {
    return (req, res) => {
      const fn = this.compose(this.middleList);
      const ctx = this.createCtx(req, res);
      return fn(ctx);
    };
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

module.exports = LikeKoa2;
