import React from 'react';
import { Avatar, Typography, Divider, Tag, Row, Col } from 'antd';
import { UserOutlined, CodeOutlined, HeartOutlined, ControlOutlined, MessageOutlined } from '@ant-design/icons';
import BreadCrumb from 'components/BreadCrumb';
import './index.scss';

const { Title, Paragraph, Text } = Typography;

let pathList = [
    {
        name: '首页',
        path: '/'
    },
    {
        name: '个人简介',
        path: '/concat'
    }
];

const Index = () => {

    return <div className='about-page'>
        <BreadCrumb pathList={pathList} />

        {/* 头部信息 */}
        <div className='about-header'>
            <Avatar size={96} icon={<UserOutlined />} className='about-avatar' />
            <Title level={2} className='about-name'>青春的脚步</Title>
            <Text className='about-slogan'>一个岌岌无名的社会从业者</Text>
            <Divider className='about-divider' />
        </div>

        {/* 基本信息 */}
        <div className='about-section'>
            <Title level={4} className='section-title'><UserOutlined /> 关于我</Title>
            <Paragraph className='about-intro'>
                三十多岁的年纪，在前端开发这条路上走了将近十年。
                感性大于理性的一个人，平时感触颇多，但不太善于表达——
                不爱和陌生人说话，可一旦成了朋友，话就收不住了。
            </Paragraph>
            <Paragraph className='about-intro'>
                热爱打游戏，那是为数不多的能让我完全放松的事情。
                偶尔会把一些想法敲成文字，留在这里。
                没什么大志向，只想踏踏实实地把眼前的事做好，
                在代码和生活之间找到属于自己的节奏。
            </Paragraph>
        </div>

        {/* 标签 */}
        <div className='about-section'>
            <Title level={4} className='section-title'><CodeOutlined /> 技能 & 兴趣</Title>
            <Row gutter={[12, 12]} className='tag-list'>
                <Col>
                    <Tag color='#6366f1' className='tag-item'><CodeOutlined /> 前端开发</Tag>
                    <Tag color='#6366f1' className='tag-item'>10年+经验</Tag>
                    <Tag color='#10b981' className='tag-item'><ControlOutlined /> 游戏爱好者</Tag>
                    <Tag color='#ec4899' className='tag-item'><HeartOutlined /> 感性派</Tag>
                    <Tag color='#f59e0b' className='tag-item'><MessageOutlined /> 朋友面前话痨</Tag>
                </Col>
            </Row>
        </div>

        {/* 底部签名 */}
        <div className='about-footer'>
            <Text className='footer-text'>「 记录生活，也记录自己 」</Text>
        </div>
    </div>
}

export default Index;
