import React, { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login_request, register_request } from 'api/request';
import { setToken, setUserInfo } from 'utils/auth';
import './index.scss';

const { Title } = Typography;
const { TabPane } = Tabs;

const Login = () => {
    const [activeKey, setActiveKey] = useState('login');
    const [loading, setLoading] = useState(false);
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const res = await login_request(values);
            if (res?.meta?.code === 0) {
                setToken(res.data.token);
                setUserInfo(res.data);
                message.success('登录成功');
                window.location.href = '/';
            } else {
                message.error(res?.meta?.msg || '登录失败');
            }
        } catch {
            message.error('网络错误');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            const res = await register_request({
                username: values.username,
                password: values.password,
                nickname: values.nickname
            });
            if (res?.meta?.code === 0) {
                message.success('注册成功，请登录');
                setActiveKey('login');
                registerForm.resetFields();
            } else {
                message.error(res?.meta?.msg || '注册失败');
            }
        } catch {
            message.error('网络错误');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-page'>
            <Card className='login-card' bordered={false}>
                <div className='login-header'>
                    <Title level={3}>博客后台</Title>
                    <p>登录后可发布、编辑文章</p>
                </div>
                <Tabs activeKey={activeKey} onChange={setActiveKey} centered>
                    <TabPane tab='登录' key='login'>
                        <Form
                            form={loginForm}
                            layout='vertical'
                            onFinish={handleLogin}
                        >
                            <Form.Item
                                name='username'
                                rules={[{ required: true, message: '请输入用户名' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder='用户名' size='large' />
                            </Form.Item>
                            <Form.Item
                                name='password'
                                rules={[{ required: true, message: '请输入密码' }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder='密码' size='large' />
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' htmlType='submit' block size='large' loading={loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab='注册' key='register'>
                        <Form
                            form={registerForm}
                            layout='vertical'
                            onFinish={handleRegister}
                        >
                            <Form.Item
                                name='username'
                                rules={[{ required: true, message: '请输入用户名' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder='用户名' size='large' />
                            </Form.Item>
                            <Form.Item
                                name='nickname'
                            >
                                <Input prefix={<UserOutlined />} placeholder='昵称（可选）' size='large' />
                            </Form.Item>
                            <Form.Item
                                name='password'
                                rules={[
                                    { required: true, message: '请输入密码' },
                                    { min: 6, message: '密码至少 6 位' }
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder='密码' size='large' />
                            </Form.Item>
                            <Form.Item
                                name='confirmPassword'
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: '请确认密码' },
                                    ({ getFieldValue }) => ({
                                        validator (_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('两次输入的密码不一致'));
                                        }
                                    })
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder='确认密码' size='large' />
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' htmlType='submit' block size='large' loading={loading}>
                                    注册
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default Login;
