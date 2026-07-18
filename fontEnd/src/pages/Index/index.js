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
        desc: '记录前端开发、工具链等领域的实践与思考。从 React 到 Node.js，从 Webpack 到数据库优化，每一篇都是真实项目中踩坑后的沉淀。'
    },
    {
        title: '生活',
        href: '/live',
        icon: <HeartOutlined />,
        tag: 'LIFE',
        desc: '生活不止代码，还有诗和远方。这里分享日常感悟、读书笔记、旅行见闻，以及那些与技术无关却同样珍贵的瞬间。'
    },
    {
        title: '留言',
        href: '/guestbook',
        icon: <MessageOutlined />,
        tag: 'TALK',
        desc: '无论你是路过还是常驻，都欢迎留下你的足迹。有问题想问？有想法要交流？或者只是想说声你好？雁过留声，人过留名，期待你的到来。'
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
