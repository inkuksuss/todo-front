<script setup lang="ts">
import { RouterView } from 'vue-router';
import TodoInput from '@/components/common/todo-input.vue';
import { ref, watch } from 'vue';
import {getTodoManager, TodoInterface} from "@/libs/todo-manager";

const todoList = ref<Array<TodoInterface>>([]);

const todoInput = ref<String | undefined>();

const handleChangeInput = (v: String | undefined) => {
  todoInput.value = v;
};

const handleEnter = (v: String | undefined) => {
  if (!todoInput.value || todoInput.value?.trim() === "") return;

  const todo = getTodoManager().createDefault();
  todo.title = "제목";
  todo.description = v as string;

  getTodoManager().addTodo(todo);
  todoList.value = getTodoManager().getTodoList();

  todoInput.value = "";
}
</script>

<template>
  <header>
    <div class="wrapper"></div>
  </header>

  <div>TODO LIST</div>
  <div v-for="(todo, index) in todoList" class="flex flex-col border-2 border-black">
    <span>번호: {{index}}</span>
    <span>제목: {{todo.title}}</span>
    <span>내용: {{todo.description}}</span>
  </div>
  <todo-input :value="todoInput" :change-handler="handleChangeInput" :enter-handler="handleEnter"></todo-input>

  <RouterView />
</template>

<style scoped></style>
