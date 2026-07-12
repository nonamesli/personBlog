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
        name: '技术',
        path: '/tech'
    }
];

const Index = () => {

    return <div className='tech-page'>
        <BreadCrumb pathList={pathList} />
        <ArticleList type='1'/>
    </div>
}

export default Index;