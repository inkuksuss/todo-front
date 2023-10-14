export enum OBJECT_TYPE {
    TODO,
    MESSAGE
}

export interface User {
    id: string;
    name: string;
    isOnline: boolean;
}

export interface BaseInterface {
    type: OBJECT_TYPE;
    createdAt: Date;
    updatedAt: Date;
    isDelete: boolean;
}
