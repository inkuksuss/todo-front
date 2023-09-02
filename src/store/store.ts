import { createStore } from 'vuex';

export enum MUTATION_TYPE {
    SET_USER_INFO = 'setUserInfo'
}

export interface UserInfoState {
    username: string;
    token: string;
}

export interface StoreState {
    userInfo: UserInfoState | null;
}

export default createStore<StoreState>({
    state() {
        return {
            userInfo: null
        };
    },
    mutations: {
        [MUTATION_TYPE.SET_USER_INFO](state: any, payload: UserInfoState) {
            console.log('call mute');
            state.userInfo = payload;
        }
    }
});
