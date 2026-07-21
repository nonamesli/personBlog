import React, { useEffect } from 'react';
import Giscus from '@giscus/react'
import BreadCrumb from 'components/BreadCrumb';
import './index.scss';


let pathList = [
    {
        name: '首页',
        path: '/'
    },
    {
        name: '雁过留声',
        path: '/guestbook'
    }
];

const Index = () => {


    return <div className='guest-book-page'>
        <BreadCrumb pathList={pathList}/>
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
}

export default Index;