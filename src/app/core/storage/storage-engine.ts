import { DbStore } from "./database";

export abstract class StorageEngine {
    abstract get<T>(store: DbStore, key: IDBValidKey): Promise<T | undefined>;
    abstract set<T>(store: DbStore, key: IDBValidKey, value: T): Promise<void>;
    abstract delete(store: DbStore, key: IDBValidKey): Promise<void>;
    abstract getAll<T>(store: DbStore): Promise<T[]>;
    abstract clear(store: DbStore): Promise<void>;
}