import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Tag, Empty } from 'antd';
import { Link } from 'react-router-dom';
import {
    CodeOutlined,
    HeartOutlined,
    MessageOutlined,
    UserOutlined,
    RightOutlined
} from '@ant-design/icons';
import { getLatestArticles_request } from 'api/request';
import './index.scss';

const { Title, Paragraph, Text } = Typography;

// 栏目配置：href 对应 app.js 中真实路由
const config = [
    {
        title: '技术',
        href: '/tech',
        icon: <CodeOutlined />,
        tag: 'TECH',
        desc: '技术是解决问题的方法及方法原理，是指人们利用现有事物形成新事物，或是改变现有事物功能、性能的方法。技术应具备明确的使用范围和被其它人认知的形式和载体，如原材料（输入）、产成品（输出）、工艺、工具、设备、设施、标准、规范、指标、计量方法等。技术与科学相比，技术更强调实用，而科学更强调研究；技术与艺术相比，技术更强调功能，艺术更强调表达。'
    },
    {
        title: '生活',
        href: '/live',
        icon: <HeartOutlined />,
        tag: 'LIFE',
        desc: '生活是一个汉语词语，拼音是shēng huó，意思有1、生存；2、使活命；3、指恤养活人；4、指为生存发展而进行各种活动；5、指为生存发展而进行各种活动的经验；6、指衣食住行等方面的情况，境况；7、指生长；8、指家产，生计；9、活儿、工作；10、指生活费用；11、指用品；器物；12、美事；美好的时光；13、笔的别称。出自《孟子·尽心上：“民非水火不生活”。'
    },
    {
        title: '留言',
        href: '/guestbook',
        icon: <MessageOutlined />,
        tag: 'TALK',
        desc: '从字面就可以看出来，很详细的解释也就是一句话：就是用户（访问者）给予版主（或者是吧主 博主等）的留言，访问者看某博客或空间后，有自己的想法，或者其他想跟博主说些什么话，就可以通过留言版，给博主留言'
    },
    {
        title: '个人简介',
        href: '/concat',
        icon: <UserOutlined />,
        tag: 'ABOUT',
        desc: '当我们的Video组件制作完成后，可以把它引入到AppRouter.js文件中，然后配置对应的路由。为了方便你的学习，这里给出了全部代码，并在重用修改的地方给予标注。当我们的Video组件制作完成后，可以把它引入到AppRouter.js文件中，然后配置对应的路由。为了方便你的学习，这里给出了全部代码，并在重用修改的地方给予标注。'
    }
];

// 文章类型 -> 栏目 slug 映射（避免 URL 出现中文；Detail 面包屑只识别 slug）
const TYPE_SLUG = {
    '技术': 'tech', 'tech': 'tech',
    '生活': 'live', 'live': 'live',
    '留言': 'guestbook', 'guestbook': 'guestbook',
    '个人简介': 'concat', 'concat': 'concat'
};

const Index = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // 获取最新文章
    useEffect(() => {
        let mounted = true;
        getLatestArticles_request({ limit: 5 })
            .then(res => {
                if (!mounted) return;
                if (res?.meta?.code === 0) {
                    setArticles(res.data || []);
                }
            })
            .catch(() => {})
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    return (
        <div className='index-page'>
            {/* Hero 欢迎区 */}
            <section className='hero'>
                <div className='hero-inner'>
                    <Text className='hero-eyebrow'>WELCOME TO MY BLOG</Text>
                    <Title className='hero-title' level={1}>青春的脚步的博客</Title>
                    <Paragraph className='hero-sub'>
                        我的小小笔记，用来随笔记录点什么～
                    </Paragraph>
                    <div className='hero-actions'>
                        <Link to='/tech' className='btn btn-primary'>开始阅读</Link>
                        <Link to='/concat' className='btn btn-ghost'>关于我</Link>
                    </div>
                </div>
            </section>

            {/* 栏目网格 */}
            <section className='section'>
                <div className='section-head'>
                    <Title level={2} className='section-title'>探索栏目</Title>
                    <span className='section-line' />
                </div>

                <div className='category-grid'>
                    {
                        config.map(item => (
                            <Link to={item.href} key={item.href} className='category-link'>
                                <Card className='category-card' bordered={false}>
                                    <div className='category-icon'>{item.icon}</div>
                                    <Text className='category-tag'>{item.tag}</Text>
                                    <Title level={4} className='category-title'>{item.title}</Title>
                                    <Paragraph className='category-desc'>{item.desc}</Paragraph>
                                    <span className='category-more'>
                                        进入栏目 <span className='arrow'>→</span>
                                    </span>
                                </Card>
                            </Link>
                        ))
                    }
                </div>
            </section>

            {/* 最新文章 */}
            <section className='section latest-section'>
                <div className='section-head'>
                    <Title level={2} className='section-title'>最新文章</Title>
                    <span className='section-line' />
                </div>

                <List
                    className='article-list'
                    loading={loading}
                    dataSource={articles}
                    locale={{ emptyText: <Empty description='暂无文章' /> }}
                    renderItem={item => (
                        <List.Item className='article-item'>
                            <Link to={`/${TYPE_SLUG[item.type] || item.type}/article/${item.id}`} className='article-link'>
                                <div className='article-main'>
                                    <div className='article-title-row'>
                                        <span className='article-title'>{item.title}</span>
                                        <Tag color='purple'>{item.type}</Tag>
                                    </div>
                                    <Paragraph className='article-desc'>{item.description}</Paragraph>
                                </div>
                                <div className='article-meta'>
                                    <span>{item.author}</span>
                                    <span className='dot'>·</span>
                                    <span>{item.submitTime}</span>
                                    <RightOutlined className='article-arrow' />
                                </div>
                            </Link>
                        </List.Item>
                    )}
                />
            </section>
        </div>
    );
}

export default Index;
