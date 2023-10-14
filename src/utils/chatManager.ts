import { type User } from '@/utils/type';
import sockjs from 'sockjs-client/dist/sockjs';
import Stomp, { Client, Message } from 'webstomp-client';
import { getUserId } from '@/utils/common';

export interface ChatManagerInterface {
    connect(): void;
    init(): void;
    join(roomId: number): void;
    leave(): void;
    sendMessage(msg: Message): void;
    update(): void;
}

export interface Message {
    id: number;
    body: string;
    type: string;
    memberId: number;
    roomId: number;
    created: string;
}

export interface Room {
    roomId: number;
    hasNext: boolean;
    messageList: Array<Message>;
    userList: Array<User>;
}

export enum CHAT_EVENT {
    CONNECT = 'CONNECT',
    INIT = 'INIT',
    UPDATE = 'UPDATE',
    DISCONNECT = 'DISCONNECT'
}

export class ChatManager extends EventTarget implements ChatManagerInterface {
    private _currentRoomId: number | null;
    private _roomList: Room[];
    private _socket: Client | null;
    private _connected: boolean;
    private _isDebug = true;

    constructor() {
        super();
        this._currentRoomId = null;
        this._roomList = [];
        this._socket = null;
        this._connected = false;
    }

    init(): void {
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.connect();
    }

    private connect(): void {
        if (this._socket || this._connected) {
            return window.alert('socket is already connect');
        }
        this.doConnect();
        console.log('user info', getUserId());
    }

    private doConnect() {
        let serverURL = 'http://localhost:3003/chat-server';
        serverURL += '?authentication=' + getUserId();
        this._socket = Stomp.over(
            new sockjs(serverURL, null, {
                transports: ['websocket', 'xhr-streaming', 'xhr-polling']
            })
        );
        this._socket.connect(
            {},
            (frame) => {
                if (this._isDebug) console.log('connect', frame);
                this._connected = true;
                this._socket?.subscribe('/queue/init-user' + this.getSessionId(), (res) => {
                    if (this._isDebug) console.log('init-user', res);
                    if (res.body) {
                        const body = JSON.parse(res.body);
                        if (body.actionType === 'ROOM_INIT') {
                            const roomInfoList: Array<{ roomId: number; memberList: User[] }> =
                                body['data'];
                            const roomIdList = roomInfoList.map((v) => v.roomId);

                            for (const room of roomIdList) {
                                this._socket?.subscribe('/topic/room/' + room, this.handleUpdate, {
                                    token: getUserId()
                                });
                            }
                            this.dispatchEvent(new CustomEvent(CHAT_EVENT.INIT));
                        } else {
                            console.log('action type = ', body.actionType);
                        }
                    }
                });
                this.initChat();
                this.dispatchEvent(new CustomEvent(CHAT_EVENT.CONNECT));
            },
            (error) => {
                console.log('소켓 연결 실패', error);
                if (error instanceof CloseEvent) return this.handleDisconnect();
            }
        );
    }

    private initChat(): void {
        if (this._connected)
            this._socket?.send('/app/chat/init', JSON.stringify({ token: getUserId() }));
    }

    private handleUpdate(res: Message): any {
        const { body } = res;
        const data = JSON.parse(body);
        console.log('handleUpdate', data);

        switch (data.actionType) {
            case 'ROOM_JOIN':
                break;
            case 'ROOM_DD':
                break;
            default:
                break;
        }
    }

    private handleDisconnect() {
        if (this._isDebug) console.log('disconnectss');
        this._socket = null;
        this._connected = false;
    }

    private getSessionId(): string {
        let url = this._socket?.ws._transport.url;
        url = url.replace(
            'ws://localhost:3003/chat-server/websocket?authentication=' + getUserId(),
            ''
        );
        url = url.replace(/^[0-9]+\//, '');
        return url;
    }

    join(roomId: number): void {
        if (this._connected)
            this._socket?.send(
                '/app/chat/join',
                JSON.stringify({ token: getUserId(), roomId: roomId })
            );
    }

    leave(): void {
        if (this._connected && this._currentRoomId)
            this._socket?.send(
                '/app/chat/leave',
                JSON.stringify({ token: getUserId(), roomId: this._currentRoomId })
            );
    }

    sendMessage(msg: Message): void {
        if (this._connected && this._currentRoomId)
            this._socket?.send(
                '/app/chat/message',
                JSON.stringify({ token: getUserId(), roomId: this._currentRoomId, data: 'test' })
            );
    }

    update(): void {}
}

let chatManager: ChatManager | undefined;

export const getChatManager = (): ChatManagerInterface => {
    if (!chatManager) chatManager = new ChatManager();
    return chatManager;
};
