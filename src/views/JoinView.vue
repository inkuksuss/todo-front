<script lang="ts">
export default {
    name: 'LoginView'
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { getTodoManager, TODO_EVENT, type TodoInterface } from '@/libs/todo-manager';
import TodoInput from '@/components/common/todo-input.vue';
import { getApiInstance } from '@/utils/api';
import { getUserInfo, saveLocalStorage } from '@/utils/common';
import { useRouter } from 'vue-router';
import { CONSTANTS } from '../../constants';
import { useStore } from 'vuex';
import { MUTATION_TYPE, UserInfoState } from '@/store/store';

const router = useRouter();
const inputName = ref<string | undefined>();
const inputEmail = ref<string | undefined>();
const inputPassword = ref<string | undefined>();

const handleChangeName = (v: string | undefined) => {
    inputName.value = v;
};

const handleChangeEmail = (v: string | undefined) => {
    inputEmail.value = v;
};

const handleChangePassword = (v: string | undefined) => {
    inputPassword.value = v;
};

const handleClickJoin = () => {
    const params = {
        name: inputName.value,
        email: inputEmail.value,
        password: inputPassword.value
    };
    getApiInstance()
        .post('/member/join', params)
        .then((res) => {
            if (res.data.code == 0) {
                window.alert('회원가입 완료');
                router.push({ name: 'LoginView' });
            } else {
                if (res.data.code == 1) {
                    window.alert('이메일 중복');
                }
            }
        })
        .catch((e) => console.log(e));
};

onMounted(() => {});

onUnmounted(() => {});
</script>

<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <div class="mb-[50px]">회원가입</div>
        <span>이름: </span>
        <todo-input :value="inputName" :change-handler="handleChangeName"></todo-input>
        <span>이메일: </span>
        <todo-input :value="inputEmail" :change-handler="handleChangeEmail"></todo-input>
        <span>비밀번호: </span>
        <todo-input :value="inputPassword" :change-handler="handleChangePassword"></todo-input>
        <button @click="handleClickJoin">회원가입</button>
    </div>
</template>

<style scoped></style>
