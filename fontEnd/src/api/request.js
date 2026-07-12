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