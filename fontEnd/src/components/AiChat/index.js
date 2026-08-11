import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Input, Button, Spin, Empty, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { aiChat_request } from 'api/request';
import './index.scss';

const AiChat = ({ visible, onClose }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '你好，我是博客 AI 助手，可以帮你总结文章、答疑解惑，有什么问题尽管问～' }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

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

    return (
        <Drawer
            title={
                <span className='ai-chat-title'>
                    <RobotOutlined /> AI 助手
                </span>
            }
            placement='right'
            width={480}
            onClose={onClose}
            visible={visible}
            className='ai-chat-drawer'
        >
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
