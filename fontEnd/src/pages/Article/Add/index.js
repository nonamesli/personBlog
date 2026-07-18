import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    message,
    Card,
    Typography,
    Space,
    Tag
} from 'antd';
import { addArticle_request } from 'api/request';
import BreadCrumb from 'components/BreadCrumb';
import { useHistory } from 'react-router-dom';
import { EditOutlined,
    SendOutlined,
    ClearOutlined,
    CodeOutlined,
    HeartOutlined,
} from '@ant-design/icons';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import './index.scss';

const { TextArea } = Input;
const { Title } = Typography;

// 类型配置
const TYPE_OPTIONS = [
    { value: '1', label: '技术', icon: <CodeOutlined />, color: '#6366f1', slug: 'tech' },
    { value: '2', label: '生活', icon: <HeartOutlined />, color: '#10b981', slug: 'live' },
];

let pathList = [
    { name: '首页', path: '/' },
    { name: '写文章', path: '/write' },
];

// 编辑器工具栏配置
const toolbarConfig = {
    toolbarKeys: [
        'headerSelect',
        'bold',
        'italic',
        'underline',
        'through',
        '|',
        'color',
        'bgColor',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        '|',
        'insertTable',
        'insertLink',
        '|',
        'undo',
        'redo',
        '|',
        'fullScreen'
    ]
};

// 编辑器内容配置
const editorConfig = {
    placeholder: '开始撰写你的文章...',
};

const Index = () => {

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState('1');
    const [htmlContent, setHtmlContent] = useState('');
    const history = useHistory();

    // 编辑器实例引用
    const [editor, setEditor] = useState(null);

    // 组件销毁时销毁编辑器
    useEffect(() => {
        return () => {
            if (editor) {
                editor.destroy();
                setEditor(null);
            }
        };
    }, [editor]);

    // 提交文章
    const handleFinish = async (values) => {
        if (!htmlContent || htmlContent === '<p><br></p>') {
            message.warning('请输入正文内容');
            return;
        }

        setSubmitting(true);

        try {
            const res = await addArticle_request({
                ...values,
                content: htmlContent,
                desc: values.description,
                type: selectedType,
                submitTime: new Date().toLocaleDateString().replace(/\//g, '-'),
            });

            if (res?.meta?.code === 0) {
                message.success('文章发布成功！');
                // 获取新文章 ID 和类型对应的 slug
                const articleId = res.data?.id;
                const typeSlug = TYPE_OPTIONS.find(t => t.value === selectedType)?.slug || 'tech';
                if (articleId) {
                    history.push(`/${typeSlug}/article/${articleId}`);
                } else {
                    form.resetFields();
                    setHtmlContent('');
                    setSelectedType('1');
                    if (editor) editor.clear();
                }
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
        setHtmlContent('');
        setSelectedType('1');
        if (editor) editor.clear();
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

                    {/* 第四行：富文本正文 */}
                    <Form.Item
                        label='正文内容'
                        required
                        style={{ marginBottom: 8 }}
                    >
                        <div className='rich-editor-wrapper'>
                            <Toolbar
                                editor={editor}
                                defaultConfig={toolbarConfig}
                                mode="default"
                                className='rich-toolbar'
                            />
                            <Editor
                                defaultConfig={editorConfig}
                                value={htmlContent}
                                onCreated={setEditor}
                                onChange={(editor) => setHtmlContent(editor.getHtml())}
                                mode="default"
                                className='rich-editor'
                            />
                        </div>
                        <span className='content-hint'>支持富文本格式：标题、加粗、列表、表格、链接等</span>
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
                        <Tag color='#6366f1' className='action-tip'><EditOutlined /> 富文本编辑</Tag>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default Index;
