import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Typography,
    Divider,
    Tag,
    Row,
    Col,
    Card,
    Timeline,
    Space,
    Button,
    Spin,
    message
} from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    BankOutlined,
    ToolOutlined,
    TrophyOutlined,
    ProfileOutlined,
    IdcardOutlined,
    ClusterOutlined,
    RocketOutlined,
    SolutionOutlined,
    ExperimentOutlined,
    ProjectOutlined,
    EditOutlined
} from '@ant-design/icons';
import BreadCrumb from 'components/BreadCrumb';
import { getResume_request } from 'api/request';
import { getUserInfo } from 'utils/auth';
import { defaultResumeData } from 'utils/resumeSchema';
import { useHistory } from 'react-router-dom';
import './index.scss';

const { Title, Paragraph, Text } = Typography;

const pathList = [
    { name: '首页', path: '/' },
    { name: '个人简历', path: '/concat' }
];

// 兼容后端返回：新结构 { schema, data } 或旧结构直接是简历对象
const pickResumePayload = (resData) => {
    if (!resData) return {};
    if (resData.data && typeof resData.data === 'object') return resData.data;
    return resData;
};

// 空值保护：当字段缺失时使用默认值填充
const mergeResume = (remote = {}) => {
    const base = JSON.parse(JSON.stringify(defaultResumeData));
    if (remote.profile) base.profile = { ...base.profile, ...remote.profile };
    if (Array.isArray(remote.workExperience)) base.workExperience = remote.workExperience;
    if (Array.isArray(remote.contributions)) base.contributions = remote.contributions;
    if (remote.skills) base.skills = remote.skills;
    if (Array.isArray(remote.selfEvaluation)) base.selfEvaluation = remote.selfEvaluation;
    return base;
};

const ContactItem = ({ icon, label, value, href }) => (
    <div className='contact-item'>
        <span className='contact-icon'>{icon}</span>
        <span className='contact-label'>{label}：</span>
        {href ? (
            <a href={href} target='_blank' rel='noreferrer' className='contact-value'>{value}</a>
        ) : (
            <span className='contact-value'>{value}</span>
        )}
    </div>
);

const SectionTitle = ({ icon, title }) => (
    <div className='resume-section-title'>
        <span className='section-icon'>{icon}</span>
        <span className='section-text'>{title}</span>
        <Divider className='section-divider' />
    </div>
);

const Index = () => {
    const [resume, setResume] = useState(mergeResume());
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const userInfo = getUserInfo();
    const isAdmin = userInfo?.role === 'admin';

    const { profile, workExperience, contributions, skills, selfEvaluation } = resume;

    useEffect(() => {
        setLoading(true);
        getResume_request()
            .then(res => {
                if (res?.meta?.code === 0) {
                    setResume(mergeResume(pickResumePayload(res.data)));
                } else {
                    message.warning('简历数据加载失败，显示默认内容');
                }
            })
            .catch(() => {
                message.warning('简历数据加载失败，显示默认内容');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className='resume-page'>
                <BreadCrumb pathList={pathList} />
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Spin size='large' tip='加载简历中...' />
                </div>
            </div>
        );
    }

    return (
        <div className='resume-page'>
            <BreadCrumb pathList={pathList} />

            {isAdmin && (
                <div className='resume-admin-bar'>
                    <Button
                        type='primary'
                        icon={<EditOutlined />}
                        onClick={() => history.push('/resume/edit')}
                    >
                        编辑简历
                    </Button>
                </div>
            )}

            {/* 顶部个人信息 */}
            <Card className='resume-header-card' bordered={false}>
                <Row gutter={[32, 24]} align='middle'>
                    <Col xs={24} sm={6} className='header-avatar-col'>
                        <Avatar size={120} icon={<UserOutlined />} className='resume-avatar' />
                    </Col>
                    <Col xs={24} sm={18}>
                        <div className='header-main'>
                            <Title level={2} className='resume-name'>{profile.name}</Title>
                            <Text className='resume-title'>{profile.title} · {profile.experience}工作经验</Text>
                        </div>
                        <Row gutter={[16, 12]} className='contact-row'>
                            <Col xs={24} sm={12}>
                                <ContactItem icon={<PhoneOutlined />} label='手机' value={profile.phone} href={`tel:${profile.phone}`} />
                            </Col>
                            <Col xs={24} sm={12}>
                                <ContactItem icon={<MailOutlined />} label='邮箱' value={profile.email} href={`mailto:${profile.email}`} />
                            </Col>
                            <Col xs={24} sm={12}>
                                <ContactItem icon={<CalendarOutlined />} label='出生年月' value={profile.birth} />
                            </Col>
                            <Col xs={24} sm={12}>
                                <ContactItem icon={<EnvironmentOutlined />} label='现居地' value={profile.location} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>

            {/* 求职意向 */}
            <Card className='resume-section-card' bordered={false}>
                <SectionTitle icon={<RocketOutlined />} title='求职意向' />
                <Row gutter={[16, 12]} className='intent-row'>
                    <Col xs={12} sm={8}><span className='intent-label'>工作性质：</span><span className='intent-value'>{profile.jobType}</span></Col>
                    <Col xs={12} sm={8}><span className='intent-label'>期望职业：</span><span className='intent-value'>{profile.title}</span></Col>
                    <Col xs={12} sm={8}><span className='intent-label'>工作地区：</span><span className='intent-value'>{profile.expectCity}</span></Col>
                    <Col xs={12} sm={8}><span className='intent-label'>期望月薪：</span><span className='intent-value'>{profile.salary}</span></Col>
                    <Col xs={12} sm={8}><span className='intent-label'>工作经验：</span><span className='intent-value'>{profile.experience}</span></Col>
                    <Col xs={12} sm={8}><span className='intent-label'>户口：</span><span className='intent-value'>{profile.hometown}</span></Col>
                </Row>
            </Card>

            {/* 工作经历 */}
            <Card className='resume-section-card' bordered={false}>
                <SectionTitle icon={<SolutionOutlined />} title='工作经历' />
                <div className='work-list-container'>
                    {workExperience.map(item => (
                        <div key={item.id} className='work-item'>
                            <div className='work-timeline-side'>
                                <div className='work-dot' />
                                <div className='work-line' />
                            </div>
                            <div className='work-content'>
                                <div className='work-card'>
                                    <div className='work-card-header'>
                                        <div className='work-title-group'>
                                            <Text className='work-company'>{item.company}</Text>
                                            <Text className='work-position'>{item.position}</Text>
                                        </div>
                                        <Text className='work-period'>{item.period}</Text>
                                    </div>
                                    <div className='work-meta'>
                                        <div className='work-meta-item'>
                                            <ProjectOutlined className='field-icon' />
                                            <Text className='field-label'>产品：</Text>
                                            <Text>{(item.products || []).join('、')}</Text>
                                        </div>
                                        <div className='work-meta-item'>
                                            <ToolOutlined className='field-icon' />
                                            <Text className='field-label'>技术栈：</Text>
                                            <Space size={[8, 8]} wrap>
                                                {(item.tech || []).map(t => <Tag key={t} className='tech-tag'>{t}</Tag>)}
                                            </Space>
                                        </div>
                                    </div>
                                    <div className='work-block'>
                                        <IdcardOutlined className='field-icon' />
                                        <Text className='field-label'>工作描述</Text>
                                        <ul className='work-desc-list'>
                                            {(item.duties || []).map((d, idx) => <li key={idx}>{d}</li>)}
                                        </ul>
                                    </div>
                                    <div className='work-block'>
                                        <ProfileOutlined className='field-icon' />
                                        <Text className='field-label'>项目描述</Text>
                                        <ul className='work-desc-list'>
                                            {(item.projectDesc || []).map((d, idx) => <li key={idx}>{d}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* 项目贡献 */}
            <Card className='resume-section-card' bordered={false}>
                <SectionTitle icon={<TrophyOutlined />} title='项目贡献' />
                <ul className='contribution-list'>
                    {(contributions || []).map((item, idx) => (
                        <li key={idx}>
                            <ExperimentOutlined className='contrib-icon' />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            {/* 专业技能 */}
            <Card className='resume-section-card' bordered={false}>
                <SectionTitle icon={<ToolOutlined />} title='专业技能' />
                <div className='skill-groups'>
                    {Object.entries(skills || {}).map(([category, tags]) => (
                        <div key={category} className='skill-group'>
                            <Text className='skill-category'>{category}</Text>
                            <Space size={[8, 8]} wrap>
                                {(tags || []).map(tag => <Tag key={tag} className='skill-tag'>{tag}</Tag>)}
                            </Space>
                        </div>
                    ))}
                </div>
            </Card>

            {/* 自我评价 */}
            <Card className='resume-section-card' bordered={false}>
                <SectionTitle icon={<BankOutlined />} title='自我评价' />
                <ul className='evaluation-list'>
                    {(selfEvaluation || []).map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
            </Card>
        </div>
    );
};

export default Index;
