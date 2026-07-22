import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { changePassword_request } from 'api/request';
import { clearAuth } from 'utils/auth';
import './index.scss';

const ChangePasswordModal = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            const res = await changePassword_request({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            });
            if (res?.meta?.code === 0) {
                message.success(res.meta.msg || '密码修改成功，请重新登录');
                form.resetFields();
                onCancel();
                clearAuth();
                window.location.href = '/login';
            } else {
                message.error(res?.meta?.msg || '密码修改失败');
            }
        } catch (err) {
            if (err?.errorFields) return;
            message.error('网络错误');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title='修改密码'
            visible={visible}
            onOk={handleOk}
            onCancel={handleClose}
            confirmLoading={submitting}
            okText='确认修改'
            cancelText='取消'
            destroyOnClose
        >
            <Form form={form} layout='vertical' requiredMark={false}>
                <Form.Item
                    name='oldPassword'
                    label='旧密码'
                    rules={[{ required: true, message: '请输入旧密码' }]}
                >
                    <Input.Password placeholder='请输入旧密码' size='large' />
                </Form.Item>
                <Form.Item
                    name='newPassword'
                    label='新密码'
                    rules={[
                        { required: true, message: '请输入新密码' },
                        { min: 6, message: '新密码长度不能少于 6 位' }
                    ]}
                >
                    <Input.Password placeholder='请输入新密码' size='large' />
                </Form.Item>
                <Form.Item
                    name='confirmPassword'
                    label='确认新密码'
                    rules={[
                        { required: true, message: '请确认新密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致'));
                            }
                        })
                    ]}
                >
                    <Input.Password placeholder='请再次输入新密码' size='large' />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal;
