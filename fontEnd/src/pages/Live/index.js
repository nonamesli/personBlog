import React from 'react';
import BreadCrumb from 'components/BreadCrumb';
import ArticleList from 'components/Article/List';
import './index.scss';

let pathList = [
    {
        name: '首页',
        path: '/'
    },
    {
        name: '生活',
        path: '/live'
    }
];

const Index = () => {

    const description = '生活不止代码，还有诗和远方。这里分享日常感悟、读书笔记、旅行见闻，以及那些与技术无关却同样珍贵的瞬间。';

    return <div className='live-page'>
        <BreadCrumb pathList={pathList} />
        <ArticleList type='2' description={description} />
    </div>
}

export default Index;
