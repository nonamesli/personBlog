import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    message,
    Card,
    Typography,
    Space,
    Tag,
    Switch,
    Alert,
    Spin
} from 'antd';
import { getArticleDetailById_request, updateArticle_request } from 'api/request';
import BreadCrumb from 'components/BreadCrumb';
import { useHistory, useParams } from 'react-router-dom';
import {
    EditOutlined,
    SaveOutlined,
    RollbackOutlined,
    CodeOutlined,
    HeartOutlined,
} from '@ant-design/icons';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { isLogin, getUserInfo } from 'utils/auth';
import './index.scss';

const { TextArea } = Input;
const { Title } = Typography;

// 类型配置
const TYPE_OPTIONS = [
    { value: '1', label: '技术', icon: <CodeOutlined />, color: '#6366f1', slug: 'tech' },
    { value: '2', label: '生活', icon: <HeartOutlined />, color: '#10b981', slug: 'live' },
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

const EditArticle = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const history = useHistory();
    const [submitting, setSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState('1');
    const [htmlContent, setHtmlContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // 编辑器实例引用
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        if (!isLogin()) {
            message.warning('请先登录');
            history.replace('/login');
            return;
        }
        const currentUser = getUserInfo();
        const adminFlag = currentUser?.role === 'admin';
        setIsAdmin(adminFlag);

        setLoading(true);
        getArticleDetailById_request({ id }).then((res) => {
            if (res?.meta?.code === 0 && res.data?.[0]) {
                const data = res.data[0];
                const ownerFlag = Number(data.user_id) === Number(currentUser?.id);
                if (!ownerFlag && !adminFlag) {
                    message.warning('没有权限编辑该文章');
                    history.replace('/');
                    return;
                }
                setArticle(data);
                setIsOwner(ownerFlag);
                setSelectedType(String(data.type));
                setIsPublic(data.is_public === 1 || data.is_public === undefined);
                setHtmlContent(data.content || '');
                form.setFieldsValue({
                    title: data.title,
                    description: data.description,
                    time: data.time,
                });
            } else {
                message.error('文章不存在');
                history.replace('/');
            }
        }).catch(() => {
            message.error('加载文章失败');
        }).finally(() => {
            setLoading(false);
        });
    }, [id, form, history]);

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
            const { description, ...rest } = values;
            const res = await updateArticle_request({
                id: Number(id),
                ...rest,
                content: htmlContent,
                desc: description,
                type: selectedType,
                is_public: isPublic ? 1 : 0,
            });

            if (res?.meta?.code === 0) {
                message.success('文章更新成功！');
                const typeSlug = TYPE_OPTIONS.find(t => t.value === selectedType)?.slug || 'tech';
                history.push(`/${typeSlug}/article/${id}`);
            } else {
                message.error(res?.meta?.msg || '更新失败，请重试');
            }
        } catch {
            message.error('网络错误，请检查连接');
        } finally {
            setSubmitting(false);
        }
    };

    const pathList = [
        { name: '首页', path: '/' },
        { name: article?.title || '编辑文章', path: `/article/edit/${id}` },
    ];

    if (loading) {
        return <div className='article-edit-page'><Spin tip='加载中...' /></div>;
    }

    if (!isOwner && !isAdmin) {
        return (
            <div className='article-edit-page'>
                <Alert
                    message='没有权限'
                    description='只有文章作者可以编辑该文章'
                    type='warning'
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className='article-edit-page'>
            <BreadCrumb pathList={pathList} />

            {/* 页面标题 */}
            <div className='edit-header'>
                <EditOutlined className='header-icon' />
                <Title level={3} className='header-title'>编辑文章</Title>
                <p className='header-sub'>修改文章内容后保存</p>
                {isAdmin && !isOwner && (
                    <Alert
                        style={{ marginTop: 16, textAlign: 'left' }}
                        message='管理员正在编辑他人文章'
                        description={`原作者：${article?.submiter || article?.author || '未知'}。保存后原作者信息保持不变。`}
                        type='info'
                        showIcon
                    />
                )}
            </div>

            {/* 表单主体 */}
            <Form
                form={form}
                layout='vertical'
                className='edit-form'
                onFinish={handleFinish}
                requiredMark={false}
            >
                <Card className='form-card' bordered={false}>
                    {/* 文章标题 */}
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

                    {/* 文章类型（卡片式） */}
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

                    {/* 公开/非公开设置 */}
                    <Form.Item
                        label='公开状态'
                        style={{ marginBottom: 16 }}
                    >
                        <div className='public-switch-row'>
                            <Switch
                                checked={isPublic}
                                onChange={setIsPublic}
                                checkedChildren='公开'
                                unCheckedChildren='非公开'
                            />
                            <span className='public-switch-tip'>
                                {isPublic ? '所有人都可以看到这篇文章' : '仅自己可以看到这篇文章'}
                            </span>
                        </div>
                    </Form.Item>

                    {/* 操作按钮 */}
                    <div className='form-actions'>
                        <Space size={16}>
                            <Button
                                type='primary'
                                icon={<SaveOutlined />}
                                htmlType='submit'
                                loading={submitting}
                                className='btn-submit'
                                size='large'
                            >
                                保存修改
                            </Button>
                            <Button
                                icon={<RollbackOutlined />}
                                onClick={() => history.goBack()}
                                size='large'
                                className='btn-reset'
                            >
                                返回
                            </Button>
                        </Space>
                        <Tag color='#6366f1' className='action-tip'><EditOutlined /> 富文本编辑</Tag>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default EditArticle;
