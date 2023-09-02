<script lang="ts">
export default {
    name: 'OauthRedirect'
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getApiInstance, setApiAccessToken } from '@/utils/api';
import router from '@/router';
import { MUTATION_TYPE, type UserInfoState } from '@/store/store';
import { useStore } from 'vuex';
import { saveLocalStorage } from '@/utils/common';
import { CONSTANTS } from '../../constants';
import HomeView from '@/views/HomeView.vue';

const store = useStore();
const route = useRoute();
const token = ref<string>();

const getQueryParam = () => {
    const query = route.query as any;
    token.value = query.token;

    if (token.value) {
        setApiAccessToken(token.value);
        getApiInstance()
            .get('/member/info')
            .then((res) => {
                const userInfo = {
                    username: res.data.data.name,
                    token: token.value
                } as UserInfoState;
                store.commit(MUTATION_TYPE.SET_USER_INFO, userInfo);
                saveLocalStorage(CONSTANTS.KEY.USER_INFO, JSON.stringify(userInfo));
                console.log('save data');
                router.push({ name: 'HomeView' });
            })
            .catch((e) => console.log(e));
    } else {
        window.alert('로그인에 실패하였습니다.');
        router.push({ name: 'LoginView' });
    }
};

onMounted(() => {
    getQueryParam();
});

onUnmounted(() => {});
</script>

<template>
    <div>hello</div>
</template>

<style scoped></style>
