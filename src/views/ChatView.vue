<script lang="ts">
export default {
    name: 'ChatView'
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { getChatManager } from '@/utils/chatManager';




onMounted(() => {
    getChatManager().init();
});

onUnmounted(() => {});
</script>

<template>
    <div>hello</div>
    <div class="flex flex-col">
        <button @click="getChatManager().join(1)">join1</button>
    </div>
</template>

<style scoped></style>
