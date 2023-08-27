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
import { getUserInfo } from '@/utils/common';

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

    };

    getApiInstance()
        .post('/member/login', params)
        .then((res) => {
            console.log('res',res);
        })
        .catch((e) => console.log(e));
};

const getGoogleLoginUrl = () => {
  let googleEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  const clientId = "?client_id=844025267242-2v64m9eh9r12ur9eqj1lej24l3ur1qd9.apps.googleusercontent.com";
  const redirectUrl = "&redirect_uri=http://localhost:8082/api/oauth/code/google"
  const responseType = "&response_type=code";
  const scope = "&scope=profile email"
  return googleEndpoint + clientId + redirectUrl + responseType + scope;
}

// const handleClickGoogleLogin = () => {
//
//
//   getApiInstance()
//       .get(googleEndpoint + clientId + redirectUrl + responseType + scope)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((e) => console.log(e));
// };

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

      <a :href="getGoogleLoginUrl()">구글 로그인</a>
<!--      <button @click="handleClickGoogleLogin">구글 로그인</button>-->
    </div>

</template>

<style scoped></style>
