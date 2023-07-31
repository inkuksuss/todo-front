import { CONSTANTS } from '../../constants';

export const getUuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const loadLocalStorage = (key: string): any => {
    const data = window.localStorage.getItem(encodeString(key));
    if (data) return JSON.parse(decodeString(data));

    return null;
};

export const saveLocalStorage = (key: string, value: string) => {
    window.localStorage.setItem(encodeString(key), encodeString(value));
};

export const clearLocalStorage = () => {
    window.localStorage.clear();
};

export const encodeString = (v: string): string => {
    return encodeURIComponent(v);
};

export const decodeString = (v: string): string => {
    return decodeURIComponent(v);
};

export const getUserInfo = () => {
    const loadUserInfo = loadLocalStorage(CONSTANTS.KEY.USER_INFO);

    return loadUserInfo ?? undefined;
};
