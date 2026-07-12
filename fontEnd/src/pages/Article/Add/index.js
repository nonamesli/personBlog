import React, { useState } from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    message,
    Card,
    Typography,
    Space,
    Tag
} from 'antd';
import { addArticle_request } from 'api/request';
import BreadCrumb from 'components/BreadCrumb';
import {
    EditOutlined,
    SendOutlined,
    ClearOutlined,
    CodeOutlined,
    HeartOutlined,
} from '@ant-design/icons';
import './index.scss';

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

// 类型配置（value 对应后端查询的 type 参数，label 用于展示）
const TYPE_OPTIONS = [
    { value: '1', label: '技术', icon: <CodeOutlined />, color: '#6366f1' },
    { value: '2', label: '生活', icon: <HeartOutlined />, color: '#10b981' },
];

let pathList = [
    { name: '首页', path: '/' },
    { name: '写文章', path: '/write' },
];

const Index = () => {

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState('1');

    // 提交文章
    const handleFinish = async (values) => {
        setSubmitting(true);

        try {
            const res = await addArticle_request({
                ...values,
                desc: values.description,
                type: selectedType,
                submitTime: new Date().toLocaleDateString().replace(/\//g, '-'),
            });

            if (res?.meta?.code === 0) {
                message.success('文章发布成功！');
                form.resetFields();
                setSelectedType('1');
            } else {
                message.error('发布失败，请重试');
            }
        } catch {
            message.error('网络错误，请检查连接');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        form.resetFields();
        setSelectedType('1');
    };

    return (
        <div className='article-add-page'>
            <BreadCrumb pathList={pathList} />

            {/* 页面标题 */}
            <div className='add-header'>
                <EditOutlined className='header-icon' />
                <Title level={3} className='header-title'>撰写新文章</Title>
                <p className='header-sub'>填写下方表单内容，发布你的新文章</p>
            </div>

            {/* 表单主体 */}
            <Form
                form={form}
                layout='vertical'
                className='add-form'
                onFinish={handleFinish}
                requiredMark={false}
            >
                <Card className='form-card' bordered={false}>
                    {/* 第一行：标题 + 作者 */}
                    <div className='form-row'>
                        <Form.Item
                            name='title'
                            label='文章标题'
                            rules={[
                                { required: true, message: '请输入标题' },
                                { max: 200, message: '标题不超过 200 字符' }
                            ]}
                        >
                            <Input size='large' placeholder='请输入文章标题...' showCount maxLength={200} />
                        </Form.Item>
                        <Form.Item
                            name='author'
                            label='作者'
                            initialValue='青春的脚步'
                        >
                            <Input size='large' placeholder='作者名称' />
                        </Form.Item>
                    </div>

                    {/* 第二行：类型选择（卡片式） */}
                    <Form.Item label='文章类型' required>
                        <div className='type-select-group'>
                            {TYPE_OPTIONS.map(opt => (
                                <div
                                    key={opt.value}
                                    className={`type-option ${selectedType === opt.value ? 'type-option--active' : ''}`}
                                    onClick={() => setSelectedType(opt.value)}
                                    style={{ '--accent-color': opt.color }}
                                >
                                    <span className='type-option-icon'>{opt.icon}</span>
                                    <span className='type-option-label'>{opt.label}</span>
                                </div>
                            ))}
                        </div>
                        {/* 隐藏字段用于提交 */}
                        <input type='hidden' name='type' value={selectedType} />
                    </Form.Item>

                    {/* 第三行：描述 */}
                    <Form.Item
                        name='description'
                        label='文章描述'
                        rules={[{ max: 500, message: '描述不超过 500 字符' }]}
                    >
                        <TextArea
                            rows={2}
                            placeholder='简要描述这篇文章的内容...'
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    {/* 第四行：正文 */}
                    <Form.Item
                        name='content'
                        label='正文内容'
                        rules={[{ required: true, message: '请输入正文内容' }]}
                    >
                        <TextArea
                            rows={14}
                            placeholder={'支持 HTML 内容编写\n\n示例：<h2>标题</h2>\n<p>段落内容...</p>'}
                            className='content-editor'
                        />
                    </Form.Item>

                    {/* 操作按钮 */}
                    <div className='form-actions'>
                        <Space size={16}>
                            <Button
                                type='primary'
                                icon={<SendOutlined />}
                                htmlType='submit'
                                loading={submitting}
                                className='btn-submit'
                                size='large'
                            >
                                发布文章
                            </Button>
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleReset}
                                size='large'
                                className='btn-reset'
                            >
                                重置清空
                            </Button>
                        </Space>
                        <Tag color='blue' className='action-tip'>支持 HTML 格式正文</Tag>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default Index;
