import Cookies from 'js-cookie';

// set in cookie - during sign in
export const setCookie = (key, value) => {
    if (window !== undefined) {
        Cookies.set(key, value, { expires: 1 });
    }
}

// remove from cookie - during sign out
export const removeCookie = (key) => {
    if (window !== undefined) {
        Cookies.remove(key, { expires: 1 });
    }
}

// get from cookie - stored session token
// required when making request to server with token
export const getCookie = (key) => {
    if (window !== undefined) {
        return Cookies.get(key);
    }
}
 
// set in localstorage
export const setLocalStorage = (key, value) => {
    if (window !== undefined) {
       localStorage.setItem(key, JSON.stringify(value));
    }
}

// remove from localstorage
export const removeLocalStorage= (key) => {
    if (window !== undefined) {
       localStorage.removeItem(key);
    }
}

// authenticate user by passing data to cookie and local storage during sign in
export const authenticate = (response, next) => {
    setCookie('sessionToken', response.data.token);
    setLocalStorage('user', response.data.user);
    next();
}

// access user info from local storage
export const isAuth = () => {
    if (window !== undefined) {
        const tokenCookie = getCookie('sessionToken');
        if(tokenCookie) {
            const userItem = localStorage.getItem('user');
            if(userItem) {
                return JSON.parse(userItem)
            }
        }
    }
    return false;
}

export const signOut = () => {
    if(window !== undefined) {
        removeCookie('sessionToken');
        removeLocalStorage('user');
    }
}
