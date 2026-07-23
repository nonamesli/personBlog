import React, { useEffect, useRef, useState } from 'react';
import Giscus from '@giscus/react'
import { Skeleton, Spin } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import BreadCrumb from 'components/BreadCrumb';
import './index.scss';


let pathList = [
    {
        name: '首页',
        path: '/'
    },
    {
        name: '留言',
        path: '/guestbook'
    }
];

const Index = () => {
    const [loading, setLoading] = useState(true);
    const giscusRef = useRef(null);

    useEffect(() => {
        // 兜底：最多 5 秒后自动隐藏 loading
        const fallbackTimer = setTimeout(() => {
            setLoading(false);
        }, 5000);

        // 监听 giscus 加载完成事件
        const handleMessage = (event) => {
            if (event.origin !== 'https://giscus.app') return;
            if (typeof event.data !== 'object' || event.data === null) return;

            // giscus 加载完成会发送类似 { giscus: {...} } 的消息
            if (event.data.giscus) {
                setLoading(false);
                clearTimeout(fallbackTimer);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(fallbackTimer);
        };
    }, []);

    return <div className='guest-book-page'>
        <BreadCrumb pathList={pathList} />
        <div className='giscus-wrapper' ref={giscusRef}>
            {loading && (
                <div className='giscus-skeleton'>
                    <div className='giscus-loading-tip'>
                        <Spin size='small' />
                        <span>评论组件加载中，请稍候...</span>
                    </div>
                    <Skeleton active avatar paragraph={{ rows: 4 }} />
                    <Skeleton active avatar paragraph={{ rows: 3 }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                </div>
            )}
            <div className={`giscus-container ${loading ? 'giscus-hidden' : ''}`}>
                <Giscus
                    key="guestbook"
                    id="comments"                    // DOM id，用于锚点跳转
                    repo="nonamesli/personBlog"           // ⚠️ 必填
                    repoId="R_kgDOTWAL1A"           // ⚠️ 必填，从 giscus.app 复制
                    category="Q&A"         // ⚠️ 讨论分类，从 giscus.app 复制
                    categoryId="DIC_kwDOTWAL1M4DBpDz"   // ⚠️ 必填，从 giscus.app 复制
                    mapping="pathname"               // 页面 ↔ discussion 的映射方式
                    strict="0"                       // 是否严格匹配
                    reactionsEnabled="1"             // 是否启用表情反应
                    emitMetadata="0"                 // 是否发送评论元数据
                    inputPosition="bottom"           // 输入框位置：top | bottom
                    theme="preferred_color_scheme"    // 主题：light | dark | preferred_color_scheme | 自定义
                    lang="zh-CN"                     // 语言
                    loading="lazy"                   // 懒加载
                    crossorigin="anonymous"
                />
            </div>
        </div>
    </div>
}

export default Index;
