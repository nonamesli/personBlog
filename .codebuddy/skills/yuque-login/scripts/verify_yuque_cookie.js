const https = require('https');
const fs = require('fs');
const path = require('path');

const input = process.argv[2];

let cookieString;

if (!input) {
  // 未传参，尝试读取半自动登录保存的 Cookie 文件
  const cookieFile = path.join(__dirname, '..', 'yuque_cookies.json');
  if (fs.existsSync(cookieFile)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(cookieFile, 'utf8'));
      cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      console.log('ℹ️ 已从保存的 Cookie 文件读取登录态。');
    } catch (e) {
      console.error('❌ 读取 Cookie 文件失败:', e.message);
      process.exit(1);
    }
  } else {
    console.error('用法：');
    console.error('  node verify_yuque_cookie.js "<your_yuque_cookie_string>"');
    console.error('或先运行半自动登录脚本：');
    console.error('  node yuque_login_browser.js');
    process.exit(1);
  }
} else if (input.endsWith('.json') && fs.existsSync(input)) {
  // 传入的是 Cookie JSON 文件路径
  try {
    const cookies = JSON.parse(fs.readFileSync(input, 'utf8'));
    cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  } catch (e) {
    console.error('❌ 读取 Cookie 文件失败:', e.message);
    process.exit(1);
  }
} else {
  // 传入的是 Cookie 字符串
  cookieString = input;
}

// 从 Cookie 中提取 yuque_ctoken，语雀部分接口需要放在 x-csrf-token 请求头中
let csrfToken = '';
const csrfMatch = cookieString.match(/yuque_ctoken=([^;]+)/);
if (csrfMatch) {
  csrfToken = decodeURIComponent(csrfMatch[1]);
}

const options = {
  hostname: 'www.yuque.com',
  path: '/api/v2/user',
  method: 'GET',
  headers: {
    'Cookie': cookieString,
    'User-Agent': 'yuque-login-skill/1.0',
    'Accept': 'application/json',
    'Referer': 'https://www.yuque.com/',
    ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
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
        console.log('✅ Cookie 验证成功');
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
