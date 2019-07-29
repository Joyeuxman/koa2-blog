/*
测试输出
A1
B1
C1
C2
B2
A2
*/
const koa2 = require('./index');

const app = new koa2();

app.use(async (ctx, next) => {
  console.log('A1');
  await next();
  console.log('A2');
});

app.use(async (ctx, next) => {
  console.log('B1');
  await next();
  console.log('B2');
});

app.use(async (ctx, next) => {
  console.log('C1');
  await next();
  console.log('C2');
});

app.listen(4000, () => {
  console.log('server is running ...');
});
