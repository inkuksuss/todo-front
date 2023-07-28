<script setup lang="ts">
import { RouterView } from 'vue-router';
import axios from 'axios';

const doTest = () => {
  axios
    .post('http://18.222.21.148:8080/api/member/test', {})
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
};

const doTest2 = () => {
  axios
      .post('http://middleware:8080/api/member/test', {})
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
};
const doTest3 = () => {
  axios
      .post('http://127.0.0.1:8080/api/member/test', {})
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
};
const doTest4 = () => {
  axios
      .post('http://localhost:8080/api/member/test', {})
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
};
</script>

<template>
  <header>
    <div class="wrapper"></div>
  </header>

  <div>프로젝트 시작</div>
  <button @click="doTest">test1</button>
  <button @click="doTest3">test3</button>
  <button @click="doTest4">test4</button>

  <RouterView />
</template>

<style scoped></style>
