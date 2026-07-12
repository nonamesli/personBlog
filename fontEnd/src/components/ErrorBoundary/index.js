import React from 'react';
import { Button } from 'antd';

/**
 * 错误边界：捕获子树渲染期抛出的错误，
 * 避免单个页面崩溃导致整页白屏、导航失效。
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // 生产环境可上报到监控平台
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '64px 24px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: 12 }}>页面出错了</h2>
                    <p style={{ color: '#888', marginBottom: 24 }}>
                        {this.state.error?.message || '发生未知错误'}
                    </p>
                    <Button type='primary' onClick={this.handleReset}>重试</Button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
