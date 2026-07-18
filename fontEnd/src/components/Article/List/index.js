import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import { List, Tag, Empty, Spin, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import {
    CalendarOutlined,
    UserOutlined,
    ArrowRightOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { getArticleList_request } from 'api/request';
import './index.scss';

const PAGE_SIZE = 5;

const Index = (props) => {

    const { type, match: { path }, description } = props;

    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getArticleList_request({
            type,
            pageNum: String(currentPage),
            pageSize: String(PAGE_SIZE)
        }).then((res) => {
            if (!mounted) return;
            if (res?.meta?.code === 0) {
                setList(res.data || []);
                setTotal(res.total || 0);
            }
        }).catch(() => {}).finally(() => {
            if (mounted) setLoading(false);
        });
        return () => { mounted = false; };
    }, [type, currentPage]);

    const onPageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 类型标签颜色映射
const typeColorMap = {
    '1': 'processing',   // tech -> 蓝
    '2': 'success',     // live -> 绿
    '4': 'purple'       // guestbook -> 紫
};

    return <div className='article-list-page'>
        {/* 栏目描述区 */}
        {description && (
            <div className='category-desc-banner'>
                <p className='category-desc-text'>{description}</p>
            </div>
        )}

        {/* 页面标题区 */}
        <div className='list-header'>
            <FileTextOutlined className='list-header-icon' />
            <h2 className='list-header-title'>文章列表</h2>
            <span className='list-header-count'>共 {total} 篇</span>
        </div>

        <Spin spinning={loading}>
            <List
                className='article-list'
                dataSource={list}
                locale={{ emptyText: <Empty description='暂无文章，敬请期待' /> }}
                renderItem={item => (
                    <List.Item className='article-card'>
                        <Link to={`${path}/article/${item.id}`} className='article-card-link'>
                            <div className='article-card-body'>
                                <h3 className='article-title'>{item.title}</h3>
                                <p className='article-desc'>{item.description}</p>
                                <div className='article-meta'>
                                    <span className='meta-item'><UserOutlined /> {item.author || '青春的脚步'}</span>
                                    <span className='meta-divider'>·</span>
                                    <span className='meta-item'><CalendarOutlined /> {item.submitTime || item.time || ''}</span>
                                    <span className='meta-divider'>·</span>
                                    <Tag color={typeColorMap[type] || 'default'} className='meta-tag'>
                                        {type === '1' ? '技术' : type === '2' ? '生活' : item.type}
                                    </Tag>
                                </div>
                            </div>
                            <div className='article-card-action'>
                                <span className='read-more'>阅读全文 <ArrowRightOutlined /></span>
                            </div>
                        </Link>
                    </List.Item>
                )}
            />

            {/* 分页器 */}
            {total > PAGE_SIZE && (
                <div className='pagination-wrapper'>
                    <Pagination
                        current={currentPage}
                        total={total}
                        pageSize={PAGE_SIZE}
                        onChange={onPageChange}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(t, range) => `第 ${range[0]}-${range[1]} 篇 / 共 ${t} 篇`}
                    />
                </div>
            )}
        </Spin>
    </div>
}

export default withRouter(Index);
