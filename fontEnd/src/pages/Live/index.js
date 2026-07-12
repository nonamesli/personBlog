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

    return <div className='live-page'>
        <BreadCrumb pathList={pathList} />
        <ArticleList type='2' />
    </div>
}

export default Index;
