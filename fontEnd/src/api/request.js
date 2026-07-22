import http from 'utils/http';

//加载导航
export const router_request = (params) => {
    return http({
        url: '/api/getRouterConfig',
        method: 'get',
        params
    });
}

export const index_request = (params) => {
    return http({
        url: '/api/users',
        method: 'get',
        params
    });
}

export const getArticleDetailById_request = (params) => {
    return http({
        url: '/api/getArticleDetailById',
        method: 'get',
        params
    });
}

export const getArticleList_request = (params) => {
    return http({
        url: '/api/getArticleList',
        method: 'get',
        params
    });
}

export const addArticle_request = (params) => {
    return http({
        url: '/api/addArticle',
        method: 'post',
        data: params
    });
}

//最新文章
export const getLatestArticles_request = (params) => {
    return http({
        url: '/api/getLatestArticles',
        method: 'get',
        params
    });
}

// 用户登录
export const login_request = (data) => {
    return http({
        url: '/api/login',
        method: 'post',
        data
    });
}

// 用户注册
export const register_request = (data) => {
    return http({
        url: '/api/register',
        method: 'post',
        data
    });
}

// 获取当前用户信息
export const getUserInfo_request = () => {
    return http({
        url: '/api/getUserInfo',
        method: 'get'
    });
}

// 修改密码
export const changePassword_request = (data) => {
    return http({
        url: '/api/changePassword',
        method: 'post',
        data
    });
}

// 更新文章
export const updateArticle_request = (data) => {
    return http({
        url: '/api/updateArticle',
        method: 'post',
        data
    });
}

// 删除文章
export const deleteArticle_request = (data) => {
    return http({
        url: '/api/deleteArticle',
        method: 'post',
        data
    });
}