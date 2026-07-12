import React from 'react';
import BreadCrumb from 'components/BreadCrumb';
import './index.scss';

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

    return <div className='concat-page'>
        <BreadCrumb pathList={pathList} />
    </div>
}

export default Index;