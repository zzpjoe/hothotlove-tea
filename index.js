// 引入依赖库
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cclt = require('coolcoollove-tea');

// 创建Express应用
const app = express();

// 解析请求体
app.use(bodyParser.json());

// 连接到数据库并导入用户模型
require('./db');
const User = require('./db').User;

// 初始化Passport中间件
require('./auth')(passport);

// 注册路由
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// 保护路由
const protectedRoutes = require('./routes/protected');
app.use('/protected', passport.authenticate('jwt', { session: false }), protectedRoutes);

// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});