<script lang="ts">
export default {
    name: 'App'
};
</script>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { loadLocalStorage, saveLocalStorage } from '@/utils/common';
import { CONSTANTS } from '../constants';
import { useStore } from 'vuex';
import { MUTATION_TYPE, type UserInfoState } from '@/store/store';
import TodoHeader from '@/components/todo-header.vue';

const store = useStore();
const compUserInfo = computed(() => store.state.userInfo);
const userInfo = ref<UserInfoState>();

const initUserInfo = () => {
    console.log('store', compUserInfo.value);
    console.log('storage', loadLocalStorage(CONSTANTS.KEY.USER_INFO));
    if (compUserInfo.value) return;

    const user = loadLocalStorage(CONSTANTS.KEY.USER_INFO);
    if (user) {
        store.commit(MUTATION_TYPE.SET_USER_INFO, user as UserInfoState);
        return;
    }
};

// const getUserInfo = () => {
//     getApiInstance()
//         .post('/member/get-default-member')
//         .then((res) => {
//             const userInfo = res.data;
//             saveLocalStorage(CONSTANTS.KEY.USER_INFO, JSON.stringify(userInfo));
//             createTodoManager().initialize();
//         })
//         .catch((e) => {
//             window.alert('사용자 정보를 가져오지 못함');
//             createTodoManager();
//         });
// };

onMounted(() => {
    initUserInfo();
});

watch(
    () => compUserInfo.value,
    (next, prev) => {
        console.log('call watch', next);
        userInfo.value = next;
    }
);
</script>

<template>
    <header>
        <todo-header :user-info="userInfo"></todo-header>
        <div class="wrapper"></div>
    </header>

    <div class="flex flex-col">
        <a href="/todo">Todo 바로가기</a>
        <a href="/login">Login 바로가기</a>
        <a href="/join">Join 바로가기</a>
        <a href="/chat">Chat 바로가기</a>
    </div>

    <RouterView />
</template>

<style scoped></style>
