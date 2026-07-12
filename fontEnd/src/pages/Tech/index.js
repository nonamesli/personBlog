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

    const description = '记录前端开发、工具链等领域的实践与思考。从 React 到 Node.js，从 Webpack 到数据库优化，每一篇都是真实项目中踩坑后的沉淀。';

    return <div className='tech-page'>
        <BreadCrumb pathList={pathList} />
        <ArticleList type='1' description={description}/>
    </div>
}

export default Index;