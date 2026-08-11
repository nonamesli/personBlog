import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Space,
    message,
    Spin,
    Alert,
    Tabs,
    Divider,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    MinusCircleOutlined,
    SaveOutlined,
    RollbackOutlined,
    UserOutlined,
    SolutionOutlined,
    TrophyOutlined,
    ToolOutlined,
    BankOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import BreadCrumb from 'components/BreadCrumb';
import { getResume_request, updateResume_request } from 'api/request';
import { getUserInfo } from 'utils/auth';
import { defaultResumeData } from 'utils/resumeSchema';
import './index.scss';

const { Title } = Typography;
const { TextArea } = Input;

const pathList = [
    { name: '首页', path: '/' },
    { name: '个人简历', path: '/concat' },
    { name: '编辑简历', path: '/resume/edit' }
];

const ResumeEdit = () => {
    const [form] = Form.useForm();
    const history = useHistory();
    const userInfo = getUserInfo();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 非管理员禁止访问
    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            message.warning('仅管理员可编辑简历');
            history.replace('/concat');
        }
    }, [history, userInfo]);

    useEffect(() => {
        setLoading(true);
        getResume_request()
            .then(res => {
                const base = res?.meta?.code === 0 ? { ...defaultResumeData, ...res.data } : defaultResumeData;
                form.setFieldsValue(toFormValues(base));
                if (res?.meta?.code !== 0) {
                    message.warning('加载简历数据失败，使用默认内容');
                }
            })
            .catch(() => {
                message.warning('加载简历数据失败，使用默认内容');
                form.setFieldsValue(toFormValues(defaultResumeData));
            })
            .finally(() => setLoading(false));
    }, [form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            const payload = toResumeData(values);
            const res = await updateResume_request({ data: payload });
            if (res?.meta?.code === 0) {
                message.success('简历保存成功');
                history.push('/concat');
            } else {
                message.error(res?.meta?.msg || '保存失败');
            }
        } catch (err) {
            message.error('表单校验失败，请检查填写内容');
        } finally {
            setSubmitting(false);
        }
    };

    if (!userInfo || userInfo.role !== 'admin') {
        return null;
    }

    return (
        <div className='resume-edit-page'>
            <BreadCrumb pathList={pathList} />

            <div className='edit-header'>
                <Title level={3} className='header-title'>编辑个人简历</Title>
                <p className='header-sub'>仅管理员可见，修改后即时生效</p>
            </div>

            {loading ? (
                <div className='loading-wrap'>
                    <Spin size='large' tip='加载简历数据中...' />
                </div>
            ) : (
                <Form
                    form={form}
                    layout='vertical'
                    className='resume-form'
                    initialValues={defaultResumeData}
                    onFinish={handleSubmit}
                >
                    <Tabs
                        defaultActiveKey='profile'
                        type='card'
                        className='resume-tabs'
                        items={[
                            {
                                key: 'profile',
                                label: (
                                    <span>
                                        <UserOutlined /> 个人信息
                                    </span>
                                ),
                                children: <ProfileTab />
                            },
                            {
                                key: 'work',
                                label: (
                                    <span>
                                        <SolutionOutlined /> 工作经历
                                    </span>
                                ),
                                children: <WorkExperienceTab />
                            },
                            {
                                key: 'contributions',
                                label: (
                                    <span>
                                        <TrophyOutlined /> 项目贡献
                                    </span>
                                ),
                                children: <StringListTab name='contributions' label='贡献描述' />
                            },
                            {
                                key: 'skills',
                                label: (
                                    <span>
                                        <ToolOutlined /> 专业技能
                                    </span>
                                ),
                                children: <SkillsTab />
                            },
                            {
                                key: 'evaluation',
                                label: (
                                    <span>
                                        <BankOutlined /> 自我评价
                                    </span>
                                ),
                                children: <StringListTab name='selfEvaluation' label='评价内容' />
                            }
                        ]}
                    />

                    <Card className='form-actions-card' bordered={false}>
                        <Space size={16}>
                            <Button
                                type='primary'
                                icon={<SaveOutlined />}
                                loading={submitting}
                                htmlType='submit'
                                size='large'
                            >
                                保存简历
                            </Button>
                            <Button
                                icon={<RollbackOutlined />}
                                onClick={() => history.push('/concat')}
                                size='large'
                            >
                                取消返回
                            </Button>
                        </Space>
                    </Card>
                </Form>
            )}
        </div>
    );
};

// ========== 个人信息 Tab ==========
const ProfileTab = () => {
    return (
        <Card className='tab-card' bordered={false}>
            <Row gutter={[24, 0]}>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'name']} label='姓名' rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input placeholder='姓名' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'title']} label='职位' rules={[{ required: true, message: '请输入职位' }]}>
                        <Input placeholder='职位' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'birth']} label='出生年月'>
                        <Input placeholder='例如：1994.7.14' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'experience']} label='工作年限'>
                        <Input placeholder='例如：9 年' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'phone']} label='手机'>
                        <Input placeholder='手机号' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'email']} label='邮箱'>
                        <Input placeholder='邮箱' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'location']} label='现居地'>
                        <Input placeholder='现居地' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'hometown']} label='户口/籍贯'>
                        <Input placeholder='户口/籍贯' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'jobType']} label='工作性质'>
                        <Input placeholder='例如：全职' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'expectCity']} label='期望城市'>
                        <Input placeholder='例如：武汉' />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name={['profile', 'salary']} label='期望月薪'>
                        <Input placeholder='例如：面议' />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};

// ========== 工作经历 Tab ==========
const WorkExperienceTab = () => {
    return (
        <Card className='tab-card' bordered={false}>
            <Form.List name='workExperience'>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} className='work-edit-item'>
                                <div className='work-edit-header'>
                                    <span className='work-edit-index'>工作经历 {name + 1}</span>
                                    <Button
                                        type='text'
                                        danger
                                        icon={<MinusCircleOutlined />}
                                        onClick={() => remove(name)}
                                    >
                                        删除
                                    </Button>
                                </div>
                                <Row gutter={[24, 0]}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item {...restField} name={[name, 'company']} label='公司名称' rules={[{ required: true }]}>
                                            <Input placeholder='公司名称' />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item {...restField} name={[name, 'position']} label='职位' rules={[{ required: true }]}>
                                            <Input placeholder='职位' />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item {...restField} name={[name, 'period']} label='任职时间' rules={[{ required: true }]}>
                                            <Input placeholder='例如：2020.10 - 2022.08' />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item {...restField} name={[name, 'products']} label='产品/项目（用顿号分隔）'>
                                            <Input placeholder='产品A、产品B' />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item {...restField} name={[name, 'tech']} label='技术栈（用顿号分隔）'>
                                            <Input placeholder='React、Webpack、Ant Design' />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item {...restField} name={[name, 'duties']} label='工作描述（每行一条）'>
                                            <TextArea rows={4} placeholder='每行输入一条工作描述' />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item {...restField} name={[name, 'projectDesc']} label='项目描述（每行一条）'>
                                            <TextArea rows={4} placeholder='每行输入一条项目描述' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <Button
                            type='dashed'
                            onClick={() => add({ id: Date.now(), tech: [], products: [], duties: [], projectDesc: [] })}
                            block
                            icon={<PlusOutlined />}
                        >
                            添加工作经历
                        </Button>
                    </>
                )}
            </Form.List>
        </Card>
    );
};

// ========== 字符串数组 Tab（项目贡献、自我评价） ==========
const StringListTab = ({ name, label }) => {
    return (
        <Card className='tab-card' bordered={false}>
            <Alert
                message='提示'
                description='每行输入一条内容，保存时会自动拆分为列表。'
                type='info'
                showIcon
                style={{ marginBottom: 16 }}
            />
            <Form.Item name={name}>
                <TextArea rows={16} placeholder={`每行输入一条${label}`} />
            </Form.Item>
        </Card>
    );
};

// ========== 专业技能 Tab ==========
const SkillsTab = () => {
    return (
        <Card className='tab-card' bordered={false}>
            <Alert
                message='提示'
                description='格式：分类名称 = 技能1、技能2、技能3。每行一个分类。'
                type='info'
                showIcon
                style={{ marginBottom: 16 }}
            />
            <Form.Item name='skills'>
                <TextArea rows={16} placeholder={'基础 = HTML5、CSS3、JavaScript\n框架/库 = React、Vue'} />
            </Form.Item>
        </Card>
    );
};

// 将存储格式转换为表单展示格式（数组 -> 字符串）
function toFormValues (data) {
    const clone = JSON.parse(JSON.stringify(data));
    (clone.workExperience || []).forEach(item => {
        item.tech = Array.isArray(item.tech) ? item.tech.join('、') : item.tech || '';
        item.products = Array.isArray(item.products) ? item.products.join('、') : item.products || '';
        item.duties = Array.isArray(item.duties) ? item.duties.join('\n') : item.duties || '';
        item.projectDesc = Array.isArray(item.projectDesc) ? item.projectDesc.join('\n') : item.projectDesc || '';
    });
    clone.contributions = Array.isArray(clone.contributions) ? clone.contributions.join('\n') : clone.contributions || '';
    clone.selfEvaluation = Array.isArray(clone.selfEvaluation) ? clone.selfEvaluation.join('\n') : clone.selfEvaluation || '';
    clone.skills = objectToSkillsText(clone.skills || {});
    return clone;
}

// 将表单数据转换为存储格式（字符串 -> 数组/对象）
function toResumeData (values) {
    const clone = JSON.parse(JSON.stringify(values));
    (clone.workExperience || []).forEach(item => {
        item.tech = splitText(item.tech);
        item.products = splitText(item.products);
        item.duties = splitLines(item.duties);
        item.projectDesc = splitLines(item.projectDesc);
    });
    clone.contributions = splitLines(clone.contributions);
    clone.selfEvaluation = splitLines(clone.selfEvaluation);
    clone.skills = skillsTextToObject(clone.skills);
    return clone;
}

function splitText (str) {
    if (!str) return [];
    return String(str)
        .split('、')
        .map(s => s.trim())
        .filter(Boolean);
}

function splitLines (str) {
    if (!str) return [];
    return String(str)
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
}

function objectToSkillsText (obj) {
    return Object.entries(obj)
        .map(([category, tags]) => `${category} = ${(tags || []).join('、')}`)
        .join('\n');
}

function skillsTextToObject (text) {
    const result = {};
    if (!text) return result;
    String(text).split('\n').forEach(line => {
        const [category, ...rest] = line.split('=');
        if (category && rest.length) {
            const key = category.trim();
            const tags = rest.join('=').split('、').map(s => s.trim()).filter(Boolean);
            if (key) result[key] = tags;
        }
    });
    return result;
}

export default ResumeEdit;
