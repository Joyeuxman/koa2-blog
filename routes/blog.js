const router = require('koa-router')();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog');
const loginCheck = require('../middle/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.prefix('/api/blog');

//获取博客列表
router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || '';
  const keyword = ctx.query.keyword || '';

  if (ctx.query.isadmin) {
    //管理员界面
    if (ctx.session.username == null) {
      return (ctx.body = new ErrorModel('未登录'));
    }
    //强制查询自己的博客
    author = ctx.session.username;
  }
  const data = await getList(author, keyword);
  ctx.body = new SuccessModel(data);
});

// 获取博客详情
router.get('/detail', async function(ctx, next) {
  const data = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(data);
});

// 新建一篇博客
router.post('/new', loginCheck, async function(ctx, next) {
  ctx.request.body.author = ctx.session.username;
  const data = await newBlog(ctx.request.body);
  ctx.body = new SuccessModel(data);
});

// 更新一篇博客
router.post('/update', loginCheck, async function(ctx, next) {
  const data = await updateBlog(ctx.query.id, ctx.request.body);
  ctx.body = data ? new SuccessModel() : new ErrorModel('更新博客失败');
});

// 删除一篇博客
router.post('/del', loginCheck, async function(ctx, next) {
  const data = await delBlog(ctx.query.id,ctx.session.username);
  ctx.body = data ? new SuccessModel() : new ErrorModel('删除博客失败');
});

module.exports = router;
