import React from 'react';
import Info from './Info';
import Controls from './Controls';
import Time from './Time';
import './index.scss';

const Index = () => {


    return <div className='music-player'>
        {/* 标题 */}
        <div>简易音乐播放器</div>
        {/* 编辑图片,以及一些基本信息 */}
        <Info />
        {/* 控制 */}
        <Controls />
        {/* 时间 */}
        <Time />
        {/* 播放器 */}
        <audio src=''/>
    </div>
}

export default Index;