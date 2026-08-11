require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.AI_API_KEY;
const baseURL = process.env.AI_BASE_URL;
const model = process.env.AI_MODEL;

if (!apiKey || !baseURL || !model) {
    console.error('环境变量未配置完整');
    console.error('AI_API_KEY:', apiKey ? '已设置' : '未设置');
    console.error('AI_BASE_URL:', baseURL || '未设置');
    console.error('AI_MODEL:', model || '未设置');
    process.exit(1);
}

console.log('当前配置:');
console.log('Base URL:', baseURL);
console.log('Model:', model);
console.log('API Key:', apiKey.slice(0, 8) + '...');

async function test() {
    try {
        const res = await axios.post(
            `${baseURL}/chat/completions`,
            {
                model,
                messages: [
                    { role: 'system', content: '你是一个有帮助的助手。' },
                    { role: 'user', content: '你好，请简单回复一句问候。' }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const reply = res.data.choices?.[0]?.message?.content;
        console.log('\n调用成功，AI 回复:');
        console.log(reply);
    } catch (err) {
        console.error('\n调用失败:');
        if (err.response) {
            console.error('状态码:', err.response.status);
            console.error('错误信息:', err.response.data);
        } else {
            console.error(err.message);
        }
        process.exit(1);
    }
}

test();
