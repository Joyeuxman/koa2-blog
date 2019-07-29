// import { SuccessModel, ErrorModel } from './index';
const { SuccessModel, ErrorModel } = require('./index');

console.log(new SuccessModel());
console.log(new ErrorModel());

console.log(new SuccessModel('更新成功'));
console.log(new ErrorModel('更新失败'));

console.log(new SuccessModel({ name: 'test' }));
console.log(new ErrorModel({ name: 'test' }));

console.log(new SuccessModel({ name: 'test' }, '更新成功'));
console.log(new ErrorModel({ name: 'test' }, '更新失败'));
