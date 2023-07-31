<script lang="ts">
export default {
  name: 'App'
};
</script>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import {createTodoManager, TodoInterface, TodoManager, type TodoManagerDataInterface} from '@/libs/todo-manager';
import { getApiInstance } from '@/utils/api';
import { saveLocalStorage} from "@/utils/common";
import {CONSTANTS} from "../constants";

const getUserInfo = () => {
  getApiInstance()
      .post('/member/get-default-member')
      .then((res) => {
        const userInfo = res.data;
        saveLocalStorage(CONSTANTS.KEY.USER_INFO, JSON.stringify(userInfo));
        createTodoManager().initialize();
      })
      .catch((e) => {
        window.alert('사용자 정보를 가져오지 못함')
        createTodoManager();
      });
};

onMounted(() => {
  getUserInfo();
});
</script>

<template>
  <header>
    <div class="wrapper"></div>
  </header>

  <div>
    <a href="/todo">Todo 바로가기</a>
  </div>

  <RouterView />
</template>

<style scoped></style>
