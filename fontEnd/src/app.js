import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
import LivePage from 'pages/Live';
import GuestBookPage from 'pages/GuestBook';
import ConcatPage from 'pages/Concat';
import ArticleAddPage from 'pages/Article/Add';
import ArticleDetail from 'components/Article/Detail';
import ErrorBoundary from 'components/ErrorBoundary';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import './index.scss';

const { Header, Footer, Content } = Layout;

const LazyIndexPage = React.lazy(() => import('pages/Index'));
const LazyTechPage = React.lazy(() => import('pages/Tech'));

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
                    <Route path='/live' exact component={LivePage} />
                    <Route path='/:pageType/article/:id' exact component={ArticleDetail} />
                    <Route path='/guestbook' exact component={GuestBookPage} />
                    <Route path='/concat' exact component={ConcatPage} />
                    <Route path='/write' exact component={ArticleAddPage} />
                </Switch>
                </ErrorBoundary>
            </Content>
            <Footer>footer</Footer>
        </Layout>
    </Router>
    </Suspense>
}

ReactDOM.render(<App />, document.getElementById('root'));