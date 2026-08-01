const fs = require('fs');
const path = require('path');
const https = require('https');

const COOKIE_FILE = path.join(__dirname, '..', 'yuque_cookies.json');
const LOGIN_URL = 'https://www.yuque.com/login';
const API_USER = 'https://www.yuque.com/api/v2/user';

function loadCookies () {
  if (fs.existsSync(COOKIE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf8'));
    } catch (e) {
      return null;
    }
  }
  return null;
}

async function verifyCookies (cookies) {
  if (!cookies || !cookies.length) return false;
  const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  return new Promise((resolve) => {
    const req = https.get(API_USER, {
      headers: {
        'Cookie': cookieString,
        'User-Agent': 'yuque-login-skill/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(res.statusCode === 200 && json.data);
        } catch (e) {
          resolve(false);
        }
      });
    });
    req.on('error', () => resolve(false));
  });
}

function cookieLooksLikeLoggedIn (cookies) {
  const names = cookies.map(c => c.name);
  return names.includes('_yuque_session') && names.includes('yuque_ctoken');
}

async function main () {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (e) {
    console.error('❌ 未检测到 Playwright，请先安装：');
    console.error('   cd .codebuddy/skills/yuque-login');
    console.error('   npm install');
    console.error('   npx playwright install chromium');
    process.exit(1);
  }

  // 先尝试使用已保存的 Cookie
  const savedCookies = loadCookies();
  if (savedCookies) {
    const valid = await verifyCookies(savedCookies);
    if (valid) {
      console.log('✅ 已检测到本地保存的登录态，Cookie 仍有效。');
      console.log(`   Cookie 文件: ${COOKIE_FILE}`);
      return;
    } else {
      console.log('⚠️ 本地 Cookie 已过期，需要重新登录。\n');
    }
  }

  console.log('🚀 正在打开语雀登录页，请在弹出的浏览器中完成登录...');
  console.log('   支持：手机号+验证码 / 手机号+密码 / 支付宝 / 微信 / 钉钉 / GitHub 等');
  console.log('   登录完成后脚本会自动保存 Cookie 并验证（最多等待 2 分钟）。\n');

  const browser = await playwright.chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  let loggedIn = false;
  let userInfo = null;

  // 方式一：监听页面导航，离开 /login 说明可能已登录
  page.on('framenavigated', async (frame) => {
    const url = frame.url();
    if (url && url.startsWith('https://www.yuque.com/') && !url.includes('/login')) {
      loggedIn = true;
    }
  });

  await page.goto(LOGIN_URL);

  // 方式二：轮询调用语雀 API 检测登录态
  const maxAttempts = 40; // 2 分钟
  for (let attempts = 1; attempts <= maxAttempts; attempts++) {
    await new Promise(r => setTimeout(r, 3000));

    try {
      const result = await page.evaluate(async () => {
        try {
          const res = await fetch('https://www.yuque.com/api/v2/user', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
          });
          if (res.status === 200) {
            const data = await res.json();
            return { ok: true, data: data.data };
          }
          return { ok: false, status: res.status };
        } catch (e) {
          return { ok: false, error: e.message };
        }
      });

      if (result.ok) {
        loggedIn = true;
        userInfo = result.data;
        console.log(`✅ 检测到登录成功：${userInfo.name || userInfo.login} (${userInfo.login})`);
        break;
      }
    } catch (e) {
      // 忽略异常，继续等待
    }

    if (attempts % 10 === 0) {
      console.log(`   已等待 ${attempts * 3} 秒，请在浏览器中完成登录...`);
    }
  }

  // 无论是否检测到，都保存当前 cookie 并尝试验证
  const cookies = await context.cookies();

  if (!cookies.length) {
    console.error('❌ 未获取到任何 Cookie，请确认是否已登录。');
    await browser.close();
    process.exit(1);
  }

  fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookies, null, 2));
  console.log(`\n✅ Cookie 已保存到: ${COOKIE_FILE}`);

  const valid = await verifyCookies(cookies);
  await browser.close();

  if (valid) {
    console.log('✅ Cookie 验证成功，登录态有效。');
  } else if (cookieLooksLikeLoggedIn(cookies)) {
    console.log('⚠️ Cookie 已保存，但 API 验证未通过。可能 Cookie 已过期或权限不足。');
  } else {
    console.error('❌ 未检测到语雀登录态，请确认已在浏览器中完成登录。');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ 脚本运行出错:', err.message);
  process.exit(1);
});
