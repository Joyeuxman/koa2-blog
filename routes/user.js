const router = require('koa-router')();
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.prefix('/api/user');

// 登录
router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body;
  const data = await login(username, password);
  if (data.username) {
    ctx.session.username = data.username;
    ctx.session.realname = data.realname;
    ctx.body = new SuccessModel();
  } else {
    ctx.body = new ErrorModel('登录失败');
  }
});

// session 测试 (记录用户浏览次数)
router.get('/session-test', async (ctx, next) => {
  if (ctx.session.viewCount == null) {
    ctx.session.viewCount = 0;
  } else {
    ctx.session.viewCount++;
  }
  ctx.body = {
    errno: 0,
    viewCount: ctx.session.viewCount
  };
});

module.exports = router;
