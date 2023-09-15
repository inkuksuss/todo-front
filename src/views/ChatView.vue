<script lang="ts">
export default {
    name: 'ChatView'
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Stomp, { Client } from 'webstomp-client';
import sockjs from 'sockjs-client/dist/sockjs';

let stompClient: Client;
let connected = false;

const connect = (value: number) => {
    let serverURL = 'http://localhost:3003/chat-server';
    serverURL += '?authentication=' + value;
    let socket = new sockjs(serverURL, null, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling']
    });
    stompClient = Stomp.over(socket);

    console.log('client', stompClient);
    stompClient.connect(
        {},
        (frame) => {
            connected = true;
            console.log('소켓 연결 성공', frame);

            stompClient.subscribe('/topic/room/1', (res) => {
                console.log('구독으로 받은 메시지 입니다.', res.body);
              const parse = JSON.parse(res.body);
              console.log(parse)
            });

            if (value === 1) {
                stompClient.send('/app/chat/join', JSON.stringify({ token: 1, data: 'test' }));
            }
        },
        (error) => {
            console.log('소켓 연결 실패', error);
            connected = false;
        }
    );
};

const send = (value: number) => {
    if (stompClient && connected)
        stompClient.send(
            '/app/chat/message',
            JSON.stringify({ token: value, roomId: 1, data: 'test' })
        );
};

onMounted(() => {});

onUnmounted(() => {});
</script>

<template>
    <div>hello</div>
    <div class="flex flex-col">
        <button @click="connect(1)">user1</button>
        <button @click="connect(2)">user2</button>
        <button @click="connect(3)">user3</button>
        <button @click="send(1)">send1</button>
        <button @click="send(2)">send2</button>
        <button @click="send(3)">send3</button>
    </div>
</template>

<style scoped></style>
