const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'myproject_jwt_secret_key';

// 验证 token 中间件
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send({ data: null, meta: { code: 401, msg: '请先登录' } });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({ data: null, meta: { code: 401, msg: '登录已过期，请重新登录' } });
    }
}

// 生成 token
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { authMiddleware, generateToken, JWT_SECRET };
