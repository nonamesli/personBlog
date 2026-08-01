const https = require('https');

const token = process.argv[2];

if (!token) {
  console.error('用法：node verify_yuque_token.js <your_yuque_token>');
  process.exit(1);
}

const options = {
  hostname: 'www.yuque.com',
  path: '/api/v2/user',
  method: 'GET',
  headers: {
    'X-Auth-Token': token,
    'User-Agent': 'yuque-login-skill/1.0'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (res.statusCode === 200 && json.data) {
        const user = json.data;
        console.log('✅ Token 验证成功');
        console.log(`   用户: ${user.name || user.login} (${user.login})`);
        console.log(`   邮箱: ${user.email || '未公开'}`);
        console.log(`   ID: ${user.id}`);
      } else {
        console.error(`❌ 验证失败 (HTTP ${res.statusCode})`);
        console.error(data.substring(0, 500));
        process.exit(1);
      }
    } catch (e) {
      console.error('❌ 无法解析响应:', e.message);
      console.error(data.substring(0, 500));
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ 请求出错:', err.message);
  process.exit(1);
});

req.end();
