import { Database } from "../database/Database";

export type TDatabase = {
  [name: string]: Database;
}

export class Context {
  databases: TDatabase;

  constructor() {
    this.databases = {};
  }
}