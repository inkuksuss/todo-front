<script setup lang="ts">
import { RouterView } from 'vue-router';
import axios from 'axios';

const doTest = () => {
  axios
    .post('http://localhost:8080/member/test', {})
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
};
</script>

<template>
  <header>
    <div class="wrapper"></div>
  </header>

  <div>프로젝트 시작</div>
  <button @click="doTest"></button>

  <RouterView />
</template>

<style scoped></style>
