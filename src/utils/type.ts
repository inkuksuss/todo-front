export enum OBJECT_TYPE {
  TODO,
  MESSAGE
}

export interface BaseInterface {
  type: OBJECT_TYPE;
  createdAt: Date;
  updatedAt: Date;
  isDelete: boolean;
}
