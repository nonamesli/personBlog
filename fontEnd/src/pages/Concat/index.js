import React from 'react';
import {
    Avatar,
    Typography,
    Divider,
    Tag,
    Row,
    Col,
    Card,
    Timeline,
    Space
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
    ProjectOutlined
} from '@ant-design/icons';
import BreadCrumb from 'components/BreadCrumb';
import './index.scss';

const { Title, Paragraph, Text } = Typography;

const pathList = [
    { name: '首页', path: '/' },
    { name: '个人简历', path: '/concat' }
];

const profile = {
    name: '李正东',
    title: '前端工程师',
    birth: '1994.7.14',
    experience: '9 年',
    location: '武汉-洪山区-张家湾街道-景瑞天赋滨江',
    hometown: '湖北省十堰市',
    phone: '18372620459',
    email: '18372620459@163.com',
    jobType: '全职',
    expectCity: '武汉',
    salary: '面议'
};

const workExperience = [
    {
        id: 1,
        period: '2017.03 - 2020.10',
        company: '杭州软通动力科技有限公司',
        position: '前端开发工程师',
        tech: ['jQuery', 'Velocity', 'Handlebars', 'AJAX', 'Webpack', 'UXCode'],
        products: ['法务诉讼系统'],
        duties: [
            '负责公司项目中 Web 页面制作、实现页面上各种交互效果、交互逻辑的实现和样式优化',
            '与后端开发团队合作，进行接口联调，确保前后端数据正确交互',
            '对现有功能进行持续性的优化和迭代'
        ],
        projectDesc: [
            '诉讼系统共分为立案流程（主诉/被诉）、诉讼费用统计、外部反馈三大模块',
            '立案流程模块记录阿里诉讼从立案到归档的全过程，包含立案、供应商管理、委托供应商、裁判登记、委案结算、结案、归档等模块',
            '诉讼费用统计模块包含委案结算、法院结算、结算单管理等模块',
            '外部反馈模块接收外部系统传输的案件反馈信息，对案件信息和用户评价做记录',
            '先后参与案件标准化项目（整体主流程开发）、铁炉堡项目（新增模块兼容老模块+外部反馈）、智能化结算项目（诉讼费用统计模块）、OCR 项目（扫描件自动填充立案登记）'
        ]
    },
    {
        id: 2,
        period: '2020.10 - 2022.08',
        company: '科瑞国际人力资源有限公司',
        position: '前端开发工程师',
        tech: ['React', 'Axios', 'Webpack', 'Ant Design', 'Git', 'ECharts'],
        products: ['滴滴奖金平台', '滴滴沧海数据统计平台'],
        duties: [
            '参与需求评审会议的讨论，测试用例的评审',
            '完成页面交互逻辑，样式还原',
            '与后台同学完成接口联调，bug 修复',
            '优化代码逻辑，解决页面渲染次数过多等问题',
            '通过 Webpack、Git 等优化 JS 压缩包，提交代码',
            '对线上问题做到及时排查，维护老项目的正常运转'
        ],
        projectDesc: [
            '滴滴奖金平台：发放奖金的统计平台，涵盖滴滴晋升平台、股权占用统计平台，支持项目统计、负责人评审、成员评价、奖金发放及高层股权占用审批查看',
            '沧海数据统计平台：对滴滴人员进行统计，分为看组织、看人才、看变动等模块，使用 ECharts 绘制各类图表，输出组织数据流动走向'
        ]
    },
    {
        id: 3,
        period: '2022.08 - 2023.07',
        company: '腾讯云科技有限公司 - 教育产品部',
        position: '前端开发工程师',
        tech: ['React', 'Redux', 'Axios', 'Webpack', 'Ant Design', 'TDesign', 'Git', 'Node.js', 'CSS Modules'],
        products: ['腾讯课堂（ke.qq.com）', 'H5 / PC Web / 小程序 / 证书服务'],
        duties: [
            '积极参与需求评审会议，与产品经理、开发团队和测试团队一起讨论和评估新的功能需求',
            '作为需求 owner，全面负责需求的进度管理和质量控制，定期更新进度并评估项目风险',
            '负责机构管理后台的功能开发，确保后台系统的稳定性和用户友好性',
            '处理客户关于课程创建和数据展示的问题，与客户沟通以理解其需求，快速定位并解决问题',
            '协调并管理产品的发布流程，确保所有功能按计划上线，上线后进行系统监控',
            '负责现有组件的维护和新组件的开发，不断优化组件库以提高开发效率和用户体验',
            '负责历史遗留问题的修复工作，确保系统的稳定性和安全性'
        ],
        projectDesc: [
            '腾讯课堂是腾讯教育产品部的主要电商项目，分为移动端、客户端、PC Web 端、小程序多个平台',
            '支持各公司在平台进行授课、发课、卖课等操作，方便学校及培训机构推广',
            '平台按照合同约定进行收益分成及相关功能使用'
        ]
    },
    {
        id: 4,
        period: '2023.08 - 2024.09',
        company: '腾讯云科技有限公司 - 内容安全产品二部',
        position: '前端开发工程师',
        tech: ['React', 'Redux', 'Axios', 'Webpack', 'Ant Design', 'TDesign', 'Git', 'Node.js', 'Sass', 'Go'],
        products: ['运营平台', '洛书流程平台', '私有化项目'],
        duties: [
            '负责整个洛书平台的开发，保证运营同学能够顺利使用审核流程，提高工作效率',
            '负责运营平台业务分析模块的新功能开发，对历史问题进行修复',
            '搭建私有化前端项目，负责整个私有化需求的开发，根据设计稿和视觉稿完成页面开发',
            '引入 ESLint、StyleLint、Prettier、Husky 等工具规范代码，引入 Volta 管理 Node 版本',
            '使用 Go 语言进行接口开发，完成简单的 CRUD 操作'
        ],
        projectDesc: [
            '运营平台：供客户和内部运营使用，统计文本、图片、音频、长音频、视频、直播视频审核明细数据，支持策略配置、账号关联策略送审、业务分析查看数据详情',
            '洛书平台：流程平台，配置流程、数据源、插件、系统变量等模块，支持大批量送审时上传 Excel 一键审核，并下载 Excel 进行分析对比',
            '私有化项目：将运营平台和云有空功能整合为单独系统，使用 Docker 打包生成相关物料包，交付部署人员进行客户部署'
        ]
    }
];

const contributions = [
    '在负责滴滴奖金系统时，对页面中不规范的代码进行重构，对地址栏携带的参数进行优化',
    '在负责沧海系统时，对代码进行拆分降低组件耦合度，优化系统加载速度，对表单做统一处理；在开发进度上能把控进度，前端不会成为里程碑的阻塞点',
    '在做腾讯教育产品时，主要负责前端功能开发，作为需求的 owner，及时把控整个需求进度，对需求发布及产品完美交付负责',
    '在做内容安全产品时，引入 ESLint、Prettier、Husky 等工具对代码规范进行严格校验，在 CodeCC 校验时保证代码质量达到 100 分',
    '和后台同学一起开发流程平台，显著减少大批量数据审核时的操作复杂度，提高运营同学工作效率',
    '一个人完成前端私有化项目开发，使用流水线生成 Docker 镜像，打包 Nginx 和项目物料包，交付产品经理进行售卖'
];

const skills = {
    '基础': ['HTML5', 'CSS3', 'JavaScript', 'ES6+'],
    '框架/库': ['React', 'Redux', 'React Router', 'Hooks', 'jQuery', 'Vue', 'Angular'],
    'UI 组件库': ['Ant Design', 'TDesign', 'UXCore', 'iView'],
    '工程化': ['Webpack', 'Git', 'SVN', 'RequireJS', 'SeaJS', 'Volta', 'Husky'],
    '规范工具': ['ESLint', 'StyleLint', 'Prettier', 'CodeCC'],
    '服务端/工具': ['Node.js', 'Go', 'Docker', 'Nginx'],
    '数据可视化': ['ECharts'],
    '其他': ['AJAX', 'Fetch', 'Axios', 'JSONP', 'CORS', 'CSS Modules', 'Sass']
};

const selfEvaluation = [
    '性格开朗，对生活和工作一直保持着积极乐观的态度',
    '有良好的沟通协作能力，工作认真负责',
    '能承受工作上的压力，能在有效时间内完成工作任务'
];

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
    return (
        <div className='resume-page'>
            <BreadCrumb pathList={pathList} />

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
                                            <Text>{item.products.join('、')}</Text>
                                        </div>
                                        <div className='work-meta-item'>
                                            <ToolOutlined className='field-icon' />
                                            <Text className='field-label'>技术栈：</Text>
                                            <Space size={[8, 8]} wrap>
                                                {item.tech.map(t => <Tag key={t} className='tech-tag'>{t}</Tag>)}
                                            </Space>
                                        </div>
                                    </div>
                                    <div className='work-block'>
                                        <IdcardOutlined className='field-icon' />
                                        <Text className='field-label'>工作描述</Text>
                                        <ul className='work-desc-list'>
                                            {item.duties.map((d, idx) => <li key={idx}>{d}</li>)}
                                        </ul>
                                    </div>
                                    <div className='work-block'>
                                        <ProfileOutlined className='field-icon' />
                                        <Text className='field-label'>项目描述</Text>
                                        <ul className='work-desc-list'>
                                            {item.projectDesc.map((d, idx) => <li key={idx}>{d}</li>)}
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
                    {contributions.map((item, idx) => (
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
                    {Object.entries(skills).map(([category, tags]) => (
                        <div key={category} className='skill-group'>
                            <Text className='skill-category'>{category}</Text>
                            <Space size={[8, 8]} wrap>
                                {tags.map(tag => <Tag key={tag} className='skill-tag'>{tag}</Tag>)}
                            </Space>
                        </div>
                    ))}
                </div>
            </Card>

            {/* 自我评价 */}
            <Card className='resume-section-card' bordered={false}>
                <SectionTitle icon={<BankOutlined />} title='自我评价' />
                <ul className='evaluation-list'>
                    {selfEvaluation.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
            </Card>
        </div>
    );
};

export default Index;
