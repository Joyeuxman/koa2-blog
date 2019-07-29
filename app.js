const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const morgan = require('koa-morgan');
const path = require('path');
const fs = require('fs');

const index = require('./routes/index');
const users = require('./routes/users');
const blog = require('./routes/blog');
const user = require('./routes/user');
const { REDIS_CONF } = require('./conf/db');

// error handler
onerror(app);

// middlewares
// A body parser for koa, base on co-body. support json, form and text type body.
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
// JSON pretty-printed response middleware
app.use(json());

// Development style logger middleware for koa 美化console控制台的输出
app.use(logger());

// Koa static file serving middleware, wrapper for koa-send
// 静态资源文件夹
app.use(require('koa-static')(__dirname + '/public'));

// Template rendering middleware for koa@2.
app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 日志配置
// HTTP request logger middleware for koa.
// morgan wrapper for koa's middleware.
// https://github.com/expressjs/morgan
// morgan(format,options)
if (process.env.NODE_ENV !== 'prd') {
  app.use(morgan('dev'));
} else {
  const fileName = path.resolve(__dirname, 'log', 'access.log');
  const writeStream = fs.createWriteStream(fileName, {
    flags: 'a'
  });
  app.use(
    morgan('combined', {
      stream: writeStream
    })
  );
}

// 用来加密cookie
app.keys = ['!@#$%^^&&****'];
// session 配置
app.use(
  session({
    // 配置cookie
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    },
    // 配置redis
    store: redisStore({
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
    })
  })
);

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(blog.routes(), blog.allowedMethods());
app.use(user.routes(), user.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
