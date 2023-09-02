<script setup lang="ts">
import {ref, type PropType, onMounted, computed, watch} from 'vue';
import { CONSTANTS } from '../../constants';
import { removeLocalStorage } from '@/utils/common';
import { useStore } from 'vuex';
import { MUTATION_TYPE, type UserInfoState } from '@/store/store';
import { useRouter } from 'vue-router';

const props = defineProps({
  userInfo: { type: Object as PropType<object | null>  , default: null },
});

const store = useStore();
const router = useRouter();
const compUserInfo = computed(() => props.userInfo);
const username = ref<string | null>();

const handleLogout = () => {
    store.commit(MUTATION_TYPE.SET_USER_INFO, null);
    removeLocalStorage(CONSTANTS.KEY.USER_INFO);
    router.push({ name: 'LoginView' });
};

const getUserInfo = () => {
    if (compUserInfo.value) {
        username.value = (compUserInfo.value as UserInfoState).username;
    }
};

onMounted(() => {
    getUserInfo();
});

</script>

<template>
    <div class="todo-header-wrapper">
        <div>
            <span v-if="compUserInfo">{{compUserInfo.username}}님</span>
        </div>
        <button v-if="compUserInfo" @click="handleLogout">로그아웃</button>
    </div>
</template>
<style scoped></style>
