import React from 'react';
import { withRouter, Link } from 'react-router-dom'
import './index.scss';

//路由地址配置
const routerConfig = [
    {
        title: '首页',
        path: '/',
        children: [
            {
                title: '技术',
                path: '/tech',
                children: [
                    {
                        title: '文章详情',
                        path: '/article',
                        children: []
                    }
                ]
            },
            {
                title: '生活',
                path: '/live',
                children: [
                    {
                        title: '文章详情',
                        path: '/article',
                        children: []
                    }
                ]
            },
            {
                title: '留言',
                path: '/guestbook',
                children: []
            },
            {
                title: '个人简介',
                path: '/concat',
                children: []
            }
        ]
    }
];

const Index = (props) => {

    const { pathList = [] } = props;

    const handleClick = (href) => {
        props.history.push(href);
    }

    // const renderItem = (list, path) => {
    //     let res = [<><span onClick={() => handleClick('/')}>首页</span><span>/</span></>];
    //     const fn = (iList, path) => {
    //         let innerRes = [];
    //         for (let i = 0; i < iList.length; i++) {
    //             let item = iList[i];
    //             if (path == item.path) {
    //                 innerRes.push(<span onClick={() => handleClick(item.path)}>{item.title}</span>);
    //             } else {
    //                 innerRes.push(...fn(item.children, path));
    //             }
    //         }
    //         return innerRes;
    //     }
    //     res.push(...fn(list, path));
    //     return res;
    // }

    const renderItem = (list) => {
        let res = list.map((item, index) => {
            if (index === list.length - 1) {
                return <span key={item.path}>{item.name}</span>
            } else {
                return <React.Fragment key={item.path}><span className='hover-path' onClick={() => handleClick(item.path)}>{item.name}</span><span style={{ margin: '0px 4px' }}>/</span></React.Fragment>
            }
        })
        return res;
    }

    return <div className='breadcrumb-box'>
        <span className='title'>当前位置：</span>
        <span className='path'>
            {/* {renderItem(routerConfig, path)} */}
            {
                renderItem(pathList)
            }
        </span>
    </div>
}

export default withRouter(Index);