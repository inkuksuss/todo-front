import { type BaseInterface, OBJECT_TYPE } from '@/utils/type';
import { getUuid } from '@/utils/common';

export const TODO_EVENT = {
  UPDATE: 'UPDATE'
};

export interface TodoInterface extends BaseInterface {
  uuid: string;
  title: string;
  description: string | null;
  info: string | number | Date | null | undefined;

  // 중요도 표시??
}

export interface TodoManagerInterface {
  getTodoList(): Array<TodoInterface>;
  getTodoByUuId(uuid: string): TodoInterface | null;
  addTodo(v: TodoInterface): void;
  addTodoAt(v: TodoInterface, index: number): void;
  removeTodo(uuid: string): void;
  updateTodo(v: TodoInterface, uuid: string): void;
  clearTodo(): void;
  destroy(): void;

  createDefault(): TodoInterface;
}

class TodoManager extends EventTarget implements TodoManagerInterface {
  private todoList: Array<TodoInterface> = [];
  private createdAt: Date;
  private updatedAt: Date;
  constructor() {
    super();
    const current = new Date();
    this.createdAt = current;
    this.updatedAt = current;
  }

  getTodoList(): Array<TodoInterface> {
    const todoList = this.todoList ?? [];

    return todoList.filter((todo) => !todo.isDelete);
  }
  getTodoByUuId(uuid: string): TodoInterface | null {
    const todoList = this.todoList ?? [];
    const findTodo = todoList.filter((todo) => todo.uuid === uuid).filter((todo) => !todo.isDelete);

    return findTodo.length > 0 ? findTodo[0] : null;
  }

  addTodo(todo: TodoInterface): void {
    // TODO error 처리 필요??
    if (!todo.title || todo.title.trim() === '') return;

    this.todoList.push(Object.assign({}, this.createDefault(), todo));

    // this.dispatchEvent(TODO_EVENT.UPDATE);
  }
  addTodoAt(todo: TodoInterface, seq: number): void {
    if (!todo.title || todo.title.trim() === '') return;

    this.todoList.splice(seq, 0, Object.assign({}, this.createDefault(), todo));
  }
  removeTodo(uuid: string): void {
    const findIndex = this.todoList.findIndex((todo) => todo.uuid === uuid);

    // if (findIndex > -1) this.todoList.splice(findIndex, 1);
    if (findIndex > -1) {
      this.todoList[findIndex].isDelete = true;
      this.todoList[findIndex].updatedAt = new Date();
    }
  }
  updateTodo(todo: TodoInterface, uuid: string): void {
    const findIndex = this.todoList.findIndex((todo) => todo.uuid === uuid);

    if (findIndex > -1) {
      this.todoList[findIndex] = todo;
      this.todoList[findIndex].updatedAt = new Date();
    }
  }

  clearTodo(): void {
    this.todoList = [];
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
}

let tdm: TodoManagerInterface | undefined;

export const createTodoManager = (): TodoManagerInterface => {
  if (!tdm) tdm = new TodoManager();
  return tdm;
};

export const getTodoManager = (): TodoManagerInterface => {
  if (!tdm) createTodoManager();
  return tdm as TodoManagerInterface;
};

export const removeTodoManager = (): void => {
  if (tdm) {
    tdm.destroy();
    tdm = undefined;
  }
};
