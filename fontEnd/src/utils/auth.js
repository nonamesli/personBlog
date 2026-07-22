const TOKEN_KEY = 'token';
const USER_KEY = 'userInfo';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUserInfo = () => {
    const info = localStorage.getItem(USER_KEY);
    try {
        return info ? JSON.parse(info) : null;
    } catch {
        return null;
    }
};

export const setUserInfo = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));

export const removeUserInfo = () => localStorage.removeItem(USER_KEY);

export const clearAuth = () => {
    removeToken();
    removeUserInfo();
};

export const isLogin = () => !!getToken();
