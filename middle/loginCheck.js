const { ErrorModel } = require('../model/resModel');

const loginCheck = async (ctx, next) => {
  console.log('1111', ctx.session);
  if (ctx.session.username) {
    return await next();
  }
  ctx.body = new ErrorModel('未登录');
};

module.exports = loginCheck;
