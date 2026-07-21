import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
import ErrorBoundary from 'components/ErrorBoundary';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import './index.scss';

const { Header, Footer, Content } = Layout;

const LazyIndexPage = React.lazy(() => import('pages/Index'));
const LazyTechPage = React.lazy(() => import('pages/Tech'));
const LazyLivePage = React.lazy(() => import('pages/Live'));
const LazyGuestBookPage = React.lazy(() => import('pages/GuestBook'));
const LazyConcatPage = React.lazy(() => import('pages/Concat'));
const LazyArticleAddPage = React.lazy(() => import('pages/Article/Add'));
const LazyArticleDetail = React.lazy(() => import('components/Article/Detail'));

const App = () => {
    return <Suspense fallback={<div>loading...</div>}><Router>
        <Layout>
            <Header>
                <div className='header-inner'>
                    <Link to='/'><span className='logo-title'>青春的脚步的博客</span></Link>
                    <Link to='/write' className='header-write-btn'>
                        <EditOutlined />
                        <span>写文章</span>
                    </Link>
                </div>
            </Header>
            <Content>
                <ErrorBoundary>
                <Switch>
                    <Route path='/' exact component={LazyIndexPage} />
                    <Route path='/tech' exact component={LazyTechPage} />
                    <Route path='/live' exact component={LazyLivePage} />
                    <Route path='/:pageType/article/:id' exact component={LazyArticleDetail} />
                    <Route path='/guestbook' exact component={LazyGuestBookPage} />
                    <Route path='/concat' exact component={LazyConcatPage} />
                    <Route path='/write' exact component={LazyArticleAddPage} />
                </Switch>
                </ErrorBoundary>
            </Content>
            <Footer>footer</Footer>
        </Layout>
    </Router>
    </Suspense>
}

ReactDOM.render(<App />, document.getElementById('root'));