import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Button, Avatar, Dropdown, Menu, message, Tag } from 'antd';
import ErrorBoundary from 'components/ErrorBoundary';
import ChangePasswordModal from 'components/ChangePassword';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { getUserInfo, isLogin, clearAuth } from 'utils/auth';
import './index.scss';

const { Header, Footer, Content } = Layout;

const LazyIndexPage = React.lazy(() => import('pages/Index'));
const LazyTechPage = React.lazy(() => import('pages/Tech'));
const LazyLivePage = React.lazy(() => import('pages/Live'));
const LazyGuestBookPage = React.lazy(() => import('pages/GuestBook'));
const LazyConcatPage = React.lazy(() => import('pages/Concat'));
const LazyArticleAddPage = React.lazy(() => import('pages/Article/Add'));
const LazyArticleEditPage = React.lazy(() => import('pages/Article/Edit'));
const LazyArticleDetail = React.lazy(() => import('components/Article/Detail'));
const LazyLoginPage = React.lazy(() => import('pages/Login'));

const HeaderUser = () => {
    const history = useHistory();
    const [login, setLogin] = useState(isLogin());
    const [user, setUser] = useState(getUserInfo());
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);

    useEffect(() => {
        const onStorage = () => {
            setLogin(isLogin());
            setUser(getUserInfo());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const handleLogout = () => {
        clearAuth();
        message.success('已退出登录');
        window.location.href = '/';
    };

    const menu = (
        <Menu>
            <Menu.Item key='changePassword' onClick={() => setChangePasswordVisible(true)}>修改密码</Menu.Item>
            <Menu.Divider />
            <Menu.Item key='logout' onClick={handleLogout}>退出登录</Menu.Item>
        </Menu>
    );

    if (!login) {
        return (
            <div className='header-right'>
                <Link to='/write' className='header-write-btn'>
                    <EditOutlined />
                    <span>写文章</span>
                </Link>
                <Button type='primary' ghost onClick={() => history.push('/login')}>
                    登录 / 注册
                </Button>
            </div>
        );
    }

    return (
        <div className='header-right'>
            <Link to='/write' className='header-write-btn'>
                <EditOutlined />
                <span>写文章</span>
            </Link>
            <Dropdown overlay={menu} placement='bottomRight'>
                <div className='header-user'>
                    <Avatar size='small' icon={<UserOutlined />} />
                    <span className='header-username'>{user?.nickname || user?.username || '用户'}</span>
                    {user?.role === 'admin' && <Tag color='red' size='small' style={{ marginLeft: 8 }}>管理员</Tag>}
                </div>
            </Dropdown>
            <ChangePasswordModal visible={changePasswordVisible} onCancel={() => setChangePasswordVisible(false)} />
        </div>
    );
};

const App = () => {
    return <Suspense fallback={<div>loading...</div>}><Router>
        <Layout>
            <Header>
                <div className='header-inner'>
                    <Link to='/'><span className='logo-title'>青春的脚步的博客</span></Link>
                    <HeaderUser />
                </div>
            </Header>
            <Content>
                <ErrorBoundary>
                    <Switch>
                        <Route path='/' exact component={LazyIndexPage} />
                        <Route path='/tech' exact component={LazyTechPage} />
                        <Route path='/live' exact component={LazyLivePage} />
                        <Route path='/:pageType/article/:id' exact component={LazyArticleDetail} />
                        <Route path='/article/edit/:id' exact component={LazyArticleEditPage} />
                        <Route path='/guestbook' exact component={LazyGuestBookPage} />
                        <Route path='/concat' exact component={LazyConcatPage} />
                        <Route path='/write' exact component={LazyArticleAddPage} />
                        <Route path='/login' exact component={LazyLoginPage} />
                    </Switch>
                </ErrorBoundary>
            </Content>
            <Footer>footer</Footer>
        </Layout>
    </Router>
    </Suspense>
}

ReactDOM.render(<App />, document.getElementById('root'));