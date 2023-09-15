<script lang="ts">
export default {
    name: 'HomeView'
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

onMounted(() => {
    console.log('home');
    console.log('store', store.state.userInfo);
});

onUnmounted(() => {});
</script>

<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <div class="mb-[50px]">HOME</div>
    </div>
</template>

<style scoped></style>
