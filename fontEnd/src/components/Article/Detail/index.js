import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getArticleDetailById_request, deleteArticle_request } from 'api/request';
import { withRouter } from 'react-router-dom';
import { Button, Space, Tag, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import BreadCrumb from 'components/BreadCrumb';
import { getUserInfo, isLogin } from 'utils/auth';
import './index.scss';

const Index = (props) => {

    const { match: { params: { id, pageType } } } = props;
    const history = useHistory();

    const [articleMsg, setArticleMsg] = useState(null);
    const [currentUser, setCurrentUser] = useState(getUserInfo());

    useEffect(() => {
        setCurrentUser(getUserInfo());
        getArticleDetailById_request({
            id
        }).then((res) => {
            if (res?.meta?.code === 0) {
                setArticleMsg(res.data[0]);
            }
        });
    }, [id]);

    const isOwner = currentUser && articleMsg && Number(currentUser.id) === Number(articleMsg.user_id);
    const isAdmin = currentUser?.role === 'admin';
    const canEdit = isOwner || isAdmin;
    const isPublic = articleMsg?.is_public === 1 || articleMsg?.is_public === undefined;
    const canView = isPublic || isOwner || isAdmin;

    const handleDelete = () => {
        Modal.confirm({
            title: '确认删除',
            content: '删除后无法恢复，是否继续？',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const res = await deleteArticle_request({ id });
                    if (res?.meta?.code === 0) {
                        message.success('删除成功');
                        history.push(`/${pageType || 'tech'}`);
                    } else {
                        message.error(res?.meta?.msg || '删除失败');
                    }
                } catch {
                    message.error('网络错误');
                }
            }
        });
    };

    let getPathList = (pageType) => {
        switch (pageType) {
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

    if (!canView && articleMsg) {
        return <div className='article-content'>
            <BreadCrumb pathList={getPathList(pageType)} />
            <div className='article-private-tip'>
                <LockOutlined className='private-icon' />
                <h2>该文章为非公开状态</h2>
                <p>只有文章作者可以查看，请先登录作者账号</p>
                {!isLogin() && <Button type='primary' onClick={() => history.push('/login')}>去登录</Button>}
            </div>
        </div>
    }

    return <div className='article-content'>
        <BreadCrumb pathList={getPathList(pageType)} />
        <div className='article-title-row'>
            <div className='title'>{articleMsg?.title}</div>
            {canEdit && (
                <Space className='article-actions'>
                    {!isOwner && isAdmin && <Tag color='blue'>管理员：他人文章</Tag>}
                    {isOwner && <Tag color='purple'>我的文章</Tag>}
                    <Tag color={isPublic ? 'success' : 'warning'}>{isPublic ? '公开' : '非公开'}</Tag>
                    <Button type='primary' icon={<EditOutlined />} onClick={() => history.push(`/article/edit/${id}`)}>
                        编辑
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                        删除
                    </Button>
                </Space>
            )}
        </div>
        <div dangerouslySetInnerHTML={{ __html: articleMsg?.content }}></div>

        {/* 上一篇 / 下一篇 导航 */}
        {(articleMsg?.prevArticle || articleMsg?.nextArticle) && (
            <div className={`article-nav${articleMsg?.prevArticle && articleMsg?.nextArticle ? ' has-both' : ''}`}>
                {/* 上一篇：id更大/更新的文章 */}
                {articleMsg?.prevArticle && (
                    <Link to={`/${pageType}/article/${articleMsg.prevArticle.id}`} className='nav-item nav-prev'>
                        <span className='nav-label'>← 上一篇</span>
                        <span className='nav-title'>{articleMsg.prevArticle.title}</span>
                    </Link>
                )}
                {/* 下一篇：id更小/更旧的文章 */}
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
                {isAdmin && !isOwner && <Tag color='blue' style={{ marginLeft: 8 }}>他人文章</Tag>}
                {isOwner && <Tag color='purple' style={{ marginLeft: 8 }}>我的文章</Tag>}
            </span>
            <span>
                <span>提交时间：</span>
                <span>{articleMsg?.submitTime}</span>
            </span>
        </div>
    </div>
}

export default withRouter(Index);

