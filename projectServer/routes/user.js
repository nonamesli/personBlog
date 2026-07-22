const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const connection = require('../mysql/connect');
const { generateToken, authMiddleware } = require('../middleware/auth');
const { addUser, findUserByUsername, updateUserPassword } = require('../mysql/sql');

// 用户注册
router.post('/api/register', function (req, res) {
    const { username, password, nickname } = req.body;

    if (!username || !password) {
        return res.send({ data: null, meta: { code: 1, msg: '用户名和密码不能为空' } });
    }

    if (password.length < 6) {
        return res.send({ data: null, meta: { code: 1, msg: '密码长度不能少于 6 位' } });
    }

    connection.query(findUserByUsername, [username], function (err, results) {
        if (err) {
            return res.send({ data: null, meta: { code: 1, msg: err.message } });
        }
        if (results.length > 0) {
            return res.send({ data: null, meta: { code: 1, msg: '用户名已存在' } });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        connection.query(addUser, [username, hashedPassword, nickname || username], function (err2, result) {
            if (err2) {
                return res.send({ data: null, meta: { code: 1, msg: err2.message } });
            }
            res.send({
                data: { id: result.insertId, username },
                meta: { code: 0, msg: '注册成功' }
            });
        });
    });
});

// 用户登录
router.post('/api/login', function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send({ data: null, meta: { code: 1, msg: '用户名和密码不能为空' } });
    }

    connection.query(findUserByUsername, [username], function (err, results) {
        if (err) {
            return res.send({ data: null, meta: { code: 1, msg: err.message } });
        }
        if (results.length === 0) {
            return res.send({ data: null, meta: { code: 1, msg: '用户名或密码错误' } });
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.send({ data: null, meta: { code: 1, msg: '用户名或密码错误' } });
        }

        const token = generateToken({ userId: user.id, username: user.username, role: user.role });
        res.send({
            data: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                role: user.role,
                token
            },
            meta: { code: 0, msg: '登录成功' }
        });
    });
});

// 获取当前登录用户信息
router.get('/api/getUserInfo', authMiddleware, function (req, res) {
    connection.query(findUserByUsername, [req.user.username], function (err, results) {
        if (err || results.length === 0) {
            return res.send({ data: null, meta: { code: 1, msg: '用户不存在' } });
        }
        const user = results[0];
        res.send({
            data: { id: user.id, username: user.username, nickname: user.nickname, role: user.role },
            meta: { code: 0 }
        });
    });
});

// 修改当前登录用户密码
router.post('/api/changePassword', authMiddleware, function (req, res) {
    const { oldPassword, newPassword } = req.body;
    const username = req.user.username;

    if (!oldPassword || !newPassword) {
        return res.send({ data: null, meta: { code: 1, msg: '旧密码和新密码不能为空' } });
    }

    if (newPassword.length < 6) {
        return res.send({ data: null, meta: { code: 1, msg: '新密码长度不能少于 6 位' } });
    }

    if (oldPassword === newPassword) {
        return res.send({ data: null, meta: { code: 1, msg: '新密码不能与旧密码相同' } });
    }

    connection.query(findUserByUsername, [username], function (err, results) {
        if (err || results.length === 0) {
            return res.send({ data: null, meta: { code: 1, msg: '用户不存在' } });
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            return res.send({ data: null, meta: { code: 1, msg: '旧密码错误' } });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        connection.query(updateUserPassword, [hashedPassword, username], function (err2) {
            if (err2) {
                return res.send({ data: null, meta: { code: 1, msg: err2.message } });
            }
            res.send({ data: null, meta: { code: 0, msg: '密码修改成功，请重新登录' } });
        });
    });
});

module.exports = router;