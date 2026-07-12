import React, { useEffect } from 'react';
import Valine from 'valine';
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

    useEffect(() => {
        new Valine({
            el: '#vcomments',
            appId: 'IFsVf70TbAptJ28I0K59r7l2-gzGzoHsz',
            appKey: '2NkqnBKChsNxVLPxIlXqzDWA',
            visitor: true, //阅读量
            placeholder: '欢迎大家来评论哈，记得填写昵称和邮箱哦，啦啦啦啦啦啦啦！！！',
            path: 'guestbook'
        })
    }, []);

    return <div className='guest-book-page'>
         <BreadCrumb pathList={pathList}/>
        <div id="vcomments"></div>
        {/* <!-- id 将作为查询条件 --> */}
        <span id="guestbook" className="leancloud_visitors" data-flag-title="Your Article Title">
            <em className="post-meta-item-text">阅读量 </em>
            <i className="leancloud-visitors-count">1000000</i>
        </span>
    </div>
}

export default Index;