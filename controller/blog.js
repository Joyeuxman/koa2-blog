const { exec } = require('../db/mysql');
const xss = require('xss');

const getList = async (author, keyword) => {
  // where 1=1 妙用 保证了sql语句的正确性(无论author/keyword是否存在)
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}'`;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`;
  }
  sql += `order by createtime desc`;

  // 返回promise
  return await exec(sql);
};

const getDetail = async id => {
  const sql = `select * from blogs where id='${id}'`;
  const rows = await exec(sql);
  return rows[0];
};

const newBlog = async (blogData = {}) => {
  // blogData 是一个博客对象，包含title content author 属性

  let { title, content, author } = blogData;
  // 使用xss包来避免XSS攻击
  title = xss(title);
  const createtime = Date.now();
  console.log('预防XSS,title===', title);
  const sql = `
  insert into blogs (title,content,author,createtime)
  values ('${title}','${content}','${author}',${createtime})
  `;
  const insertData = await exec(sql);
  return {
    id: insertData.insertId
  };
};

const updateBlog = async (id, blogData = {}) => {
  // id 即将更新博客的id
  // blogData 是一个博客对象，包含title content 属性

  const { title, content } = blogData;
  const sql = `update blogs set title='${title}', content='${content}' where id='${id}'`;
  const updateData = await exec(sql);
  if (updateData.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
};

const delBlog = async (id, author) => {
  // id 就是要删除博客的id
  const sql = `delete from blogs where id = '${id}' and author='${author}'`;
  const delData = await exec(sql);
  console.log('delData === ', delData);
  if (delData.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};
