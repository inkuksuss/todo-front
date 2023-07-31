import { type BaseInterface, OBJECT_TYPE } from '@/utils/type';
import { getUserInfo, getUuid, loadLocalStorage } from '@/utils/common';
import { CONSTANTS } from '../../constants';

export const TODO_EVENT = {
    UPDATE: 'UPDATE',
    CLEAR: 'CLEAR'
};

export interface TodoInterface extends BaseInterface {
    uuid: string;
    title: string;
    description: string | null;
    info: string | number | Date | null | undefined;

    // 중요도 표시??
}

export interface TodoManagerInterface extends EventTarget {
    initialize(): void;
    getTodoList(): Array<TodoInterface>;
    getTodoByUuId(uuid: string): TodoInterface | null;
    addTodo(v: TodoInterface): void;
    addTodoAt(v: TodoInterface, index: number): void;
    removeTodo(uuid: string): void;
    updateTodo(v: TodoInterface, uuid: string): void;
    clearTodo(): void;
    destroy(): void;
    createDefault(): TodoInterface;
    changeTodoList(v: string | null): void;
    getObjectData(): TodoManagerDataInterface;
    setObjectData(obj: TodoManagerDataInterface): void;
}

export interface TodoManagerDataInterface {
    todoId: number | undefined;
    title: string | undefined;
    todoList: Array<TodoInterface>;
    createdAt: Date;
    updatedAt: Date;
}

class TodoManager extends EventTarget implements TodoManagerInterface {
    private _todoId: number | undefined;
    private _title: string | undefined;
    private _todoList: Array<TodoInterface> = [];
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor() {
        super();

        const current = new Date();
        this._createdAt = current;
        this._updatedAt = current;

        const userInfo = getUserInfo();

        if (userInfo) {
            if (userInfo.todoList && userInfo.length > 0) {
                this._todoId = userInfo.todoList[0].id;
                this._title = userInfo.todoList[0].title;
                this._todoList = userInfo.todoList[0].content;
                this._createdAt = userInfo.todoList[0].createdAt;
                this._updatedAt = userInfo.todoList[0].updatedAt;
            }
        }
    }

    initialize() {
        const loadUserInfo = loadLocalStorage(CONSTANTS.KEY.USER_INFO);

        if (!loadUserInfo) return;

        const todoData = loadUserInfo.todoList;
        if (todoData && todoData.length > 0) {
            this.setObjectData({
                todoId: todoData[0].todoId,
                title: todoData[0].title,
                todoList: JSON.parse(todoData[0].content),
                createdAt: todoData[0].createdAt,
                updatedAt: todoData[0].updatedAt
            });
            this.dispatchEvent(new CustomEvent(TODO_EVENT.UPDATE));
        }
    }

    getTodoList(): Array<TodoInterface> {
        const todoList = this._todoList ?? [];

        return todoList.filter((todo) => !todo.isDelete);
    }

    getTodoByUuId(uuid: string): TodoInterface | null {
        const todoList = this._todoList ?? [];
        const findTodo = todoList
            .filter((todo) => todo.uuid === uuid)
            .filter((todo) => !todo.isDelete);

        return findTodo.length > 0 ? findTodo[0] : null;
    }

    addTodo(todo: TodoInterface): void {
        // TODO error 처리 필요??
        if (!todo.title || todo.title.trim() === '') return;

        const newTodo = Object.assign({}, this.createDefault(), todo);

        this._todoList.push(newTodo);
        this._updatedAt = new Date();

        this.dispatchEvent(new CustomEvent(TODO_EVENT.UPDATE, { detail: newTodo.uuid }));
    }

    addTodoAt(todo: TodoInterface, index: number): void {
        if (!todo.title || todo.title.trim() === '') return;

        const newTodo = Object.assign({}, this.createDefault(), todo);
        this._todoList.splice(index, 0, newTodo);
        this._updatedAt = new Date();

        this.dispatchEvent(new CustomEvent(TODO_EVENT.UPDATE, { detail: newTodo.uuid }));
    }

    removeTodo(uuid: string): void {
        const findIndex = this._todoList.findIndex((todo) => todo.uuid === uuid);

        if (findIndex > -1) {
            const removedUuid = this._todoList[findIndex].uuid;
            this._todoList.splice(findIndex, 1);
            this._updatedAt = new Date();
            this.dispatchEvent(new CustomEvent(TODO_EVENT.UPDATE, { detail: removedUuid }));
        }
    }

    updateTodo(todo: TodoInterface, uuid: string): void {
        const findIndex = this._todoList.findIndex((todo) => todo.uuid === uuid);

        if (findIndex > -1) {
            this._todoList[findIndex] = todo;
            this._todoList[findIndex].updatedAt = new Date();

            this.dispatchEvent(
                new CustomEvent(TODO_EVENT.UPDATE, { detail: this._todoList[findIndex].uuid })
            );
        }
    }

    clearTodo(): void {
        this._todoList = [];

        this.dispatchEvent(new CustomEvent(TODO_EVENT.CLEAR));
        this._updatedAt = new Date();
    }

    destroy(): void {
        this.clearTodo();
    }

    createDefault(): TodoInterface {
        const currentTime = new Date();
        const todoObj: TodoInterface = {} as TodoInterface;

        todoObj.uuid = getUuid();
        todoObj.type = OBJECT_TYPE.TODO;
        todoObj.createdAt = currentTime;
        todoObj.updatedAt = currentTime;
        todoObj.isDelete = false;

        return todoObj;
    }

    changeTodoList(v: string | null): void {
        if (!v) return;

        this._todoList = JSON.parse(v);
        this.dispatchEvent(new Event(TODO_EVENT.UPDATE));
    }

    getObjectData(): TodoManager {
        return <TodoManager>{
            todoId: this._todoId,
            title: this._title,
            todoList: this._todoList,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt
        };
    }

    setObjectData(obj: TodoManagerDataInterface): void {
        this._todoId = obj.todoId;
        this._title = obj.title;
        this._todoList = obj.todoList;
        this._createdAt = obj.createdAt;
        this._updatedAt = obj.updatedAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get todoList(): Array<TodoInterface> {
        return this._todoList;
    }

    get title(): string | undefined {
        return this._title;
    }

    get todoId(): number | undefined {
        return this._todoId;
    }

    set todoId(value: number | undefined) {
        this._todoId = value;
    }
}

let tdm: TodoManagerInterface | undefined;

export const createTodoManager = (): TodoManager => {
    if (!tdm) tdm = new TodoManager();
    return tdm as TodoManager;
};

export const getTodoManager = (): TodoManager => {
    if (!tdm) createTodoManager();
    return tdm as TodoManager;
};

export const removeTodoManager = (): void => {
    if (tdm) {
        tdm.destroy();
        tdm = undefined;
    }
};
