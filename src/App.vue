<script setup lang="ts">
import { RouterView } from 'vue-router';
import axios from 'axios';
import {getApiInstance} from "@/utils/api";

const doTest = () => {
  getApiInstance()
    .post('/member/test', {})
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
};
</script>

<template>
  <header>
    <div class="wrapper"></div>
  </header>

  <div>프로젝트 시작</div>
  <button @click="doTest" class="w-[100px]"><span class="bg-amber-400">test1</span></button>

  <RouterView />
</template>

<style scoped></style>
