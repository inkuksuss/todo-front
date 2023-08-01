<script lang="ts">
export default {
    name: 'TodoView'
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { getTodoManager, TODO_EVENT, type TodoInterface } from '@/libs/todo-manager';
import TodoInput from '@/components/common/todo-input.vue';
import { getApiInstance } from '@/utils/api';
import { getUserInfo } from '@/utils/common';

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
};

const handleClickSave = () => {
    const params = {
        userId: getUserInfo().id,
        todoId: getTodoManager().todoId,
        content: JSON.stringify(getTodoManager().todoList)
    };

    getApiInstance()
        .post('/todo/save', params)
        .then((res) => {
            const tm = getTodoManager();
            if (!tm.todoId) tm.todoId = res.data.todoId;
            tm.changeTodoList(res.data.content);
            window.alert('저장되었습니다');
        })
        .catch((e) => console.log(e));
};

const handleClickDelete = (uuid: string) => {
    getTodoManager().removeTodo(uuid);
    todoList.value = getTodoManager().getTodoList();
};

const updateTodoList = () => {
    todoList.value = getTodoManager().getTodoList();
};

getTodoManager().addEventListener(TODO_EVENT.UPDATE, updateTodoList);

onMounted(() => {
    updateTodoList();
});

onUnmounted(() => {
    getTodoManager().removeEventListener(TODO_EVENT.UPDATE, updateTodoList);
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
    <button @click="handleClickSave">저장하기</button>
</template>

<style scoped></style>
