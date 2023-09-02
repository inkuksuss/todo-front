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
import {getUserInfo, saveLocalStorage} from '@/utils/common';
import {useRouter} from "vue-router";
import {CONSTANTS} from "../../constants";
import {useStore} from "vuex";
import {MUTATION_TYPE, UserInfoState} from "@/store/store";

const store = useStore();
const router = useRouter();
const inputEmail = ref<string | undefined>();
const inputPassword = ref<string | undefined>();


const handleChangeEmail = (v: string | undefined) => {
    inputEmail.value = v;
};

const handleChangePassword = (v: string | undefined) => {
    inputPassword.value = v;
};

const handleClickLogin = () => {
    const params = {
        email: inputEmail.value,
        password: inputPassword.value
    };
    getApiInstance()
        .post('/member/login', params)
        .then((res) => {
            const userInfo = {
              username: res.data.data.username,
              token: res.data.data.token
            }

            saveLocalStorage(CONSTANTS.KEY.USER_INFO, JSON.stringify(userInfo));
            store.commit(MUTATION_TYPE.SET_USER_INFO, userInfo as UserInfoState);
            router.push("/");
        })
        .catch((e) => console.log(e));
};

onMounted(() => {});

onUnmounted(() => {});
</script>

<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
      <div class="mb-[50px]">LOGIN</div>
      <span>email</span>
      <todo-input :value="inputEmail" :change-handler="handleChangeEmail"></todo-input>
      <span>password</span>
      <todo-input :value="inputPassword" :change-handler="handleChangePassword"></todo-input>
      <button @click="handleClickLogin">Login</button>

      <a href="http://localhost:8082/api/oauth2/authorization/google">구글 로그인</a>
      <a href="http://localhost:8082/api/oauth2/authorization/naver">네이버 로그인</a>
    </div>

</template>

<style scoped></style>
