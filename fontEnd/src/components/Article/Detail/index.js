import React, { useState, useEffect } from 'react';
import { getArticleDetailById_request } from 'api/request';
import { withRouter } from 'react-router-dom';
import BreadCrumb from 'components/BreadCrumb';
import './index.scss';

const Index = (props) => {

    const { match: { params: { id, pageType } } } = props;

    const [articleMsg, setArticleMsg] = useState(null);

    useEffect(() => {
        getArticleDetailById_request({
            id
        }).then((res) => {
            if(res?.meta?.code === 0) {
                setArticleMsg(res.data[0]);
            }
        });
    }, []);

    let getPathList = (pageType) => {
        switch(pageType) {
            case 'live':
                return [
                    {
                        name: '首页',
                        path: '/'
                    },
                    {
                        name: '生活',
                        path: '/live'
                    },
                    {
                        name: '文章详情',
                        path: '/articleDetail'
                    }
                ];
            case 'tech':
                return [
                    {
                        name: '首页',
                        path: '/'
                    },
                    {
                        name: '技术',
                        path: '/tech'
                    },
                    {
                        name: '文章详情',
                        path: '/articleDetail'
                    }
                ];
            default:
                return [
                    {
                        name: '首页',
                        path: '/'
                    },
                    {
                        name: '文章详情',
                        path: '/articleDetail'
                    }
                ];
        }
    }

    return <div className='article-content'>
        <BreadCrumb pathList={getPathList(pageType)}/>
        <div className='title'>{articleMsg?.title}</div>
        <div dangerouslySetInnerHTML={{ __html: articleMsg?.content }}></div>
        <div className='footer'>
            <span>
                <span>提交人：</span>
                <span>{articleMsg?.submiter}</span>
            </span>
            <span>
                <span>提交时间：</span>
                <span>{articleMsg?.submitTime}</span>
            </span>
        </div>
    </div>
}

export default withRouter(Index);

