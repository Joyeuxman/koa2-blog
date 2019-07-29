const { exec, escape } = require('../db/mysql');
const { genPassword } = require('../utils/crop');

const login = async (username, password) => {
  // 使用mysql的escape来避免sql注入攻击
  username = escape(username);

  //加密密码
  password = genPassword(password);
  password = escape(password);
  const sql = `
  select username,realname from users
  where username=${username} and password=${password}
  `;
  const rows = await exec(sql);
  console.log('登录的用户===', rows[0]);
  return rows[0] || {};
};

module.exports = {
  login
};
