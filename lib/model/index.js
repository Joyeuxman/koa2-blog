/*
调用格式
//  ()
//  (data)
//  (msg)
//  (data,msg)

模板消息格式
{
  success: true | false,
  statusCode:'',
  msg: '',
  data: {}
}
*/

class BaseModel {
  constructor(data, msg) {
    if (typeof data === 'string') {
      this.msg = data;
      data = null;
      msg = null;
    }
    if (data) {
      this.data = data;
    }
    if (msg) {
      this.msg = msg;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, msg) {
    super(data, msg);
    this.success = true;
    this.statusCode = 200;
    this.msg = this.msg || '请求成功';
  }
}

class ErrorModel extends BaseModel {
  constructor(data, msg) {
    super(data, msg);
    this.success = false;
    this.statusCode = 1000;
    this.msg = this.msg || '请求失败';
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
};

// export { SuccessModel, ErrorModel };
/*
module.exports  = {a,b}
const {a,b} = require('')

export {a,b}
import {a,b} from ''
*/