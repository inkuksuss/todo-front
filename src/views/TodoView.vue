<script lang="ts">
export default {
  name: 'TodoView'
};
</script>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { getTodoManager, TODO_EVENT, type TodoInterface } from '@/libs/todo-manager';
import TodoInput from '@/components/common/todo-input.vue';
import {getApiInstance} from "@/utils/api";
import {getUserInfo} from "@/utils/common";
import {CONSTANTS} from "../../constants";

const todoList = ref<Array<TodoInterface>>([]);

const inputValue = ref<string | undefined>();

const handleChangeInput = (v: string | undefined) => {
  inputValue.value = v;
};

const handleEnter = (v: string | undefined) => {
  if (!inputValue.value || inputValue.value?.trim() === '') return;

  addTodo(v as string);
  inputValue.value = undefined;
};

const addTodo = (value: string) => {
  const todo = getTodoManager().createDefault();

  todo.title = '제목';
  todo.description = value;
  getTodoManager().addTodo(todo);

  const params = {
    userId: getUserInfo().id as number,
    content: JSON.stringify(getTodoManager().todoList),
  }

  console.log('param', params);

  getApiInstance().post("/todo/add", {
    userId: getUserInfo().id,
    todoId: getTodoManager().todoId,
    content: JSON.stringify(getTodoManager().todoList),
  })
      .then(res => {
        console.log('res', res);

      })
      .catch(e => console.log(e));
};

const handleClickDelete = (uuid: string) => {
  console.log('dele', uuid);
  getTodoManager().removeTodo(uuid);
  todoList.value = getTodoManager().getTodoList();
};


const updateTodoList = () => {
  todoList.value = getTodoManager().getTodoList();
};

onMounted(() => {
  getTodoManager().addEventListener(TODO_EVENT.UPDATE, updateTodoList);
});
</script>

<template>
  <header>
    <div class="wrapper"></div>
  </header>

  <div>TODO LIST</div>
  <div
    v-for="(todo, index) in todoList"
    class="flex flex-col border-2 border-black"
    :key="todo.uuid"
  >
    <span>번호: {{ index }}</span>
    <button @click="handleClickDelete(todo.uuid)">삭제</button>
    <span>제목: {{ todo.title }}</span>
    <span>내용: {{ todo.description }}</span>
  </div>
  <todo-input
    :value="inputValue"
    :change-handler="handleChangeInput"
    :enter-handler="handleEnter"
  ></todo-input>

  <RouterView />
</template>

<style scoped></style>
