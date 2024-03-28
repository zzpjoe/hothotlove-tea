const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./db');

module.exports = function (passport) {
    // 配置Passport本地策略
    passport.use(User.createStrategy());

    // 序列化和反序列化用户
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    return {
        register: async (username, password) => {
            try {
                // 检查用户名是否已存在
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new Error('Username already exists');
                }

                // 创建新用户
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({ username, password: hashedPassword });
                await newUser.save();

                return true;
            } catch (error) {
                console.error('Registration error', error);
                throw new Error('Registration failed');
            }
        },

        login: async (username, password) => {
            try {
                // 查找用户
                const user = await User.findOne({ username });
                if (!user) {
                    throw new Error('Invalid username or password');
                }

                // 验证密码
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    throw new Error('Invalid username or password');
                }

                // 生成JWT令牌
                const token = jwt.sign({ userId: user._id }, 'secret-key');

                return token;
            } catch (error) {
                console.error('Login error', error);
                throw new Error('Login failed');
            }
        }
    };
};