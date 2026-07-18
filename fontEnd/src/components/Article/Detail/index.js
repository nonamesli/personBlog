import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    }, [id]);

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
        
        {/* 上一篇 / 下一篇 导航 */}
        {(articleMsg?.prevArticle || articleMsg?.nextArticle) && (
            <div className='article-nav'>
                {articleMsg?.prevArticle && (
                    <Link to={`/${pageType}/article/${articleMsg.prevArticle.id}`} className='nav-item nav-prev'>
                        <span className='nav-label'>← 上一篇</span>
                        <span className='nav-title'>{articleMsg.prevArticle.title}</span>
                    </Link>
                )}
                {articleMsg?.nextArticle && (
                    <Link to={`/${pageType}/article/${articleMsg.nextArticle.id}`} className='nav-item nav-next'>
                        <span className='nav-label'>下一篇 →</span>
                        <span className='nav-title'>{articleMsg.nextArticle.title}</span>
                    </Link>
                )}
            </div>
        )}

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

