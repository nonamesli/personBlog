import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Input, Button, Spin, Empty, message, Form, Collapse } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { aiChat_request, getAiConfig_request, updateAiConfig_request } from 'api/request';
import { getUserInfo } from 'utils/auth';
import './index.scss';

const { Panel } = Collapse;

const AiChat = ({ visible, onClose }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '你好，我是博客 AI 助手，可以帮你总结文章、答疑解惑，有什么问题尽管问～' }
    ]);
    const [loading, setLoading] = useState(false);
    const [configLoading, setConfigLoading] = useState(false);
    const [configForm] = Form.useForm();
    const [isAdmin, setIsAdmin] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const user = getUserInfo();
        setIsAdmin(user?.role === 'admin');
    }, []);

    useEffect(() => {
        if (visible && isAdmin) {
            loadConfig();
        }
    }, [visible, isAdmin]);

    const loadConfig = async () => {
        try {
            const res = await getAiConfig_request();
            if (res?.meta?.code === 0) {
                configForm.setFieldsValue(res.data);
            }
        } catch (err) {
            console.error('加载 AI 配置失败', err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;

        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.filter(m => m.role !== 'system');
            const res = await aiChat_request({ message: text, history });
            if (res?.meta?.code === 0) {
                setMessages(prev => [...prev, { role: 'assistant', content: res.data }]);
            } else {
                message.error(res?.meta?.msg || 'AI 回复失败');
            }
        } catch (err) {
            const backendMsg = err.response?.data?.meta?.msg;
            const errorMsg = backendMsg || err.message || '请求失败，请稍后重试';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSaveConfig = async (values) => {
        setConfigLoading(true);
        try {
            const res = await updateAiConfig_request(values);
            if (res?.meta?.code === 0) {
                message.success('配置已保存');
                loadConfig();
            } else {
                message.error(res?.meta?.msg || '保存失败');
            }
        } catch (err) {
            const backendMsg = err.response?.data?.meta?.msg;
            message.error(backendMsg || '保存失败');
        } finally {
            setConfigLoading(false);
        }
    };

    return (
        <Drawer
            title={
                <span className='ai-chat-title'>
                    <RobotOutlined /> AI 助手
                </span>
            }
            placement='right'
            width={520}
            onClose={onClose}
            visible={visible}
            className='ai-chat-drawer'
        >
            {isAdmin && (
                <Collapse className='ai-config-collapse' ghost>
                    <Panel header={<span><SettingOutlined /> AI 配置（仅管理员）</span>} key='config'>
                        <Form form={configForm} layout='vertical' onFinish={handleSaveConfig}>
                            <Form.Item name='AI_BASE_URL' label='Base URL' rules={[{ required: true }]}>
                                <Input placeholder='https://api.siliconflow.cn/v1' />
                            </Form.Item>
                            <Form.Item name='AI_MODEL' label='Model' rules={[{ required: true }]}>
                                <Input placeholder='Qwen/Qwen2.5-7B-Instruct' />
                            </Form.Item>
                            <Form.Item name='AI_API_KEY' label='API Key'>
                                <Input.Password placeholder='留空则保持原配置不变' />
                            </Form.Item>
                            <Button type='primary' htmlType='submit' loading={configLoading} block>
                                保存配置
                            </Button>
                        </Form>
                    </Panel>
                </Collapse>
            )}
            <div className='ai-chat-messages'>
                {messages.length === 0 ? (
                    <Empty description='开始和 AI 对话吧' />
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`ai-chat-message ${msg.role === 'user' ? 'user' : 'assistant'}`}
                        >
                            <div className='ai-chat-avatar'>
                                {msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                            </div>
                            <div className='ai-chat-bubble'>
                                <div className='ai-chat-content'>{msg.content}</div>
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className='ai-chat-message assistant'>
                        <div className='ai-chat-avatar'>
                            <RobotOutlined />
                        </div>
                        <div className='ai-chat-bubble'>
                            <Spin size='small' />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className='ai-chat-footer'>
                <Input.TextArea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='输入问题，按 Enter 发送'
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    disabled={loading}
                />
                <Button
                    type='primary'
                    icon={<SendOutlined />}
                    loading={loading}
                    onClick={handleSend}
                    disabled={!input.trim()}
                />
            </div>
        </Drawer>
    );
};

export default AiChat;
