import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom'
import { List, Tag, Empty, Spin, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import {
    CalendarOutlined,
    UserOutlined,
    FileTextOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { getArticleList_request } from 'api/request';
import { getUserInfo } from 'utils/auth';
import './index.scss';

const PAGE_SIZE = 5;
const MOBILE_BREAKPOINT = 768;

const Index = (props) => {

    const { type, match: { path }, description } = props;

    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

    const currentUser = getUserInfo();
    const isAdmin = currentUser?.role === 'admin';

    // 监听窗口变化，判断是否为移动端
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 加载文章列表
    const fetchList = useCallback((page, isAppend = false) => {
        if (isAppend) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        return getArticleList_request({
            type,
            pageNum: String(page),
            pageSize: String(PAGE_SIZE)
        }).then((res) => {
            if (res?.meta?.code === 0) {
                const data = res.data || [];
                setTotal(res.total || 0);
                if (isAppend) {
                    setList(prev => [...prev, ...data]);
                } else {
                    setList(data);
                }
            }
        }).catch(() => { }).finally(() => {
            setLoading(false);
            setLoadingMore(false);
        });
    }, [type]);

    // type 变化时重置列表
    useEffect(() => {
        setCurrentPage(1);
        fetchList(1, false);
    }, [type, fetchList]);

    const onPageChange = (page) => {
        setCurrentPage(page);
        fetchList(page, false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 移动端滚动加载
    useEffect(() => {
        if (!isMobile) return;

        const handleScroll = () => {
            if (loading || loadingMore) return;
            if (list.length >= total) return;

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;
            const scrollHeight = document.documentElement.scrollHeight;

            if (scrollTop + clientHeight >= scrollHeight - 100) {
                setCurrentPage(prev => {
                    const nextPage = prev + 1;
                    fetchList(nextPage, true);
                    return nextPage;
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, loading, loadingMore, list.length, total, fetchList]);

    // 类型标签颜色映射
    const typeColorMap = {
        '1': 'processing',   // tech -> 蓝
        '2': 'success',     // live -> 绿
        '4': 'purple'       // guestbook -> 紫
    };

    const hasMore = list.length < total;

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
                renderItem={item => {
                    const isMyArticle = currentUser && Number(item.user_id) === Number(currentUser.id);
                    return (
                        <List.Item className='article-card'>
                            <Link to={`${path}/article/${item.id}`} className='article-card-link'>
                                <div className='article-card-body'>
                                    <div className='article-title-row'>
                                        <h3 className='article-title'>{item.title}</h3>
                                        <div className='article-tags'>
                                            {item.is_public === 0 && <Tag color='warning'>非公开</Tag>}
                                            {isAdmin && !isMyArticle && <Tag color='blue'>他人</Tag>}
                                            {isMyArticle && <Tag color='purple'>我的</Tag>}
                                        </div>
                                    </div>
                                    <p className='article-desc'>{item.description}</p>
                                    <div className='article-meta'>
                                        <span className='meta-item'><UserOutlined /> {item.author || item.submiter || '青春的脚步'}</span>
                                        <span className='meta-divider'>·</span>
                                        <span className='meta-item'><CalendarOutlined /> {item.submitTime || item.time || ''}</span>
                                        <span className='meta-divider'>·</span>
                                        <Tag color={typeColorMap[type] || 'default'} className='meta-tag'>
                                            {type === '1' ? '技术' : type === '2' ? '生活' : item.type}
                                        </Tag>
                                    </div>
                                </div>
                            </Link>
                        </List.Item>
                    );
                }}
            />

            {/* 移动端加载更多提示 */}
            {isMobile && list.length > 0 && (
                <div className='load-more-tip'>
                    {loadingMore ? (
                        <span className='load-more-text'><LoadingOutlined /> 加载中...</span>
                    ) : hasMore ? (
                        <span className='load-more-text'>上拉加载更多</span>
                    ) : (
                        <span className='load-more-text no-more'>— 已经到底了 —</span>
                    )}
                </div>
            )}

            {/* PC 端分页器 */}
            {!isMobile && total > PAGE_SIZE && (
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
