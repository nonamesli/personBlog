// 简历默认 JSON Schema 与内容
// 前后端共用约定：此处为服务端初始化/兜底数据，前端同时保留一份副本作为 fallback

const resumeSchema = {
    type: 'object',
    title: '个人简历',
    required: ['profile'],
    properties: {
        profile: {
            type: 'object',
            title: '个人信息',
            required: ['name', 'title', 'phone', 'email'],
            properties: {
                name: { type: 'string', title: '姓名', default: '' },
                title: { type: 'string', title: '职位', default: '' },
                birth: { type: 'string', title: '出生年月', default: '' },
                experience: { type: 'string', title: '工作年限', default: '' },
                location: { type: 'string', title: '现居地', default: '' },
                hometown: { type: 'string', title: '户口/籍贯', default: '' },
                phone: { type: 'string', title: '手机', default: '' },
                email: { type: 'string', title: '邮箱', default: '' },
                jobType: { type: 'string', title: '工作性质', default: '全职' },
                expectCity: { type: 'string', title: '期望城市', default: '' },
                salary: { type: 'string', title: '期望月薪', default: '面议' }
            }
        },
        workExperience: {
            type: 'array',
            title: '工作经历',
            items: {
                type: 'object',
                required: ['company', 'position', 'period'],
                properties: {
                    id: { type: 'number', title: 'ID' },
                    period: { type: 'string', title: '任职时间', default: '' },
                    company: { type: 'string', title: '公司名称', default: '' },
                    position: { type: 'string', title: '职位', default: '' },
                    tech: {
                        type: 'array',
                        title: '技术栈',
                        items: { type: 'string', title: '技术' }
                    },
                    products: {
                        type: 'array',
                        title: '产品/项目',
                        items: { type: 'string', title: '产品' }
                    },
                    duties: {
                        type: 'array',
                        title: '工作描述',
                        items: { type: 'string', title: '职责' }
                    },
                    projectDesc: {
                        type: 'array',
                        title: '项目描述',
                        items: { type: 'string', title: '描述' }
                    }
                }
            }
        },
        contributions: {
            type: 'array',
            title: '项目贡献',
            items: { type: 'string', title: '贡献' }
        },
        skills: {
            type: 'object',
            title: '专业技能',
            additionalProperties: {
                type: 'array',
                items: { type: 'string', title: '技能' }
            }
        },
        selfEvaluation: {
            type: 'array',
            title: '自我评价',
            items: { type: 'string', title: '评价' }
        }
    }
};

const defaultResumeData = {
    profile: {
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
    },
    workExperience: [
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
    ],
    contributions: [
        '在负责滴滴奖金系统时，对页面中不规范的代码进行重构，对地址栏携带的参数进行优化',
        '在负责沧海系统时，对代码进行拆分降低组件耦合度，优化系统加载速度，对表单做统一处理；在开发进度上能把控进度，前端不会成为里程碑的阻塞点',
        '在做腾讯教育产品时，主要负责前端功能开发，作为需求的 owner，及时把控整个需求进度，对需求发布及产品完美交付负责',
        '在做内容安全产品时，引入 ESLint、Prettier、Husky 等工具对代码规范进行严格校验，在 CodeCC 校验时保证代码质量达到 100 分',
        '和后台同学一起开发流程平台，显著减少大批量数据审核时的操作复杂度，提高运营同学工作效率',
        '一个人完成前端私有化项目开发，使用流水线生成 Docker 镜像，打包 Nginx 和项目物料包，交付产品经理进行售卖'
    ],
    skills: {
        '基础': ['HTML5', 'CSS3', 'JavaScript', 'ES6+'],
        '框架/库': ['React', 'Redux', 'React Router', 'Hooks', 'jQuery', 'Vue', 'Angular'],
        'UI 组件库': ['Ant Design', 'TDesign', 'UXCore', 'iView'],
        '工程化': ['Webpack', 'Git', 'SVN', 'RequireJS', 'SeaJS', 'Volta', 'Husky'],
        '规范工具': ['ESLint', 'StyleLint', 'Prettier', 'CodeCC'],
        '服务端/工具': ['Node.js', 'Go', 'Docker', 'Nginx'],
        '数据可视化': ['ECharts'],
        '其他': ['AJAX', 'Fetch', 'Axios', 'JSONP', 'CORS', 'CSS Modules', 'Sass']
    },
    selfEvaluation: [
        '性格开朗，对生活和工作一直保持着积极乐观的态度',
        '有良好的沟通协作能力，工作认真负责',
        '能承受工作上的压力，能在有效时间内完成工作任务'
    ]
};

module.exports = {
    resumeSchema,
    defaultResumeData
};
