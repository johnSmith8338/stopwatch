import { Injectable } from "@angular/core";
import { StorageEngine } from "./storage-engine";
import { DATABASE_NAME, DATABASE_VERSION, DbStore } from "./database";

@Injectable({
    providedIn: 'root'
})
export class IndexedDbEngine extends StorageEngine {
    private readonly db = this.openDatabase();

    private openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = () => {
                const db = request.result;
                Object.values(DbStore).forEach(store => {
                    if (!db.objectStoreNames.contains(store)) {
                        db.createObjectStore(store);
                    }
                })
            }
        })
    }

    private async getStore(store: DbStore, mode: IDBTransactionMode) {
        const db = await this.db;
        return db.transaction(store, mode).objectStore(store);
    }

    async get<T>(store: DbStore, key: IDBValidKey): Promise<T | undefined> {
        const objectStore = await this.getStore(store, 'readonly');
        console.log("[IDB] load", key);

        return new Promise((resolve, reject) => {
            const request = objectStore.get(key);
            request.onsuccess = () => resolve(request.result as T | undefined);
            request.onerror = () => reject(request.error);
        })
    }

    async set<T>(store: DbStore, key: IDBValidKey, value: T): Promise<void> {
        const objectStore = await this.getStore(store, 'readwrite');
        console.log("[IDB] save", key, value);

        return new Promise((resolve, reject) => {
            const request = objectStore.put(value, key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        })
    }

    async delete(store: DbStore, key: IDBValidKey): Promise<void> {
        const objectStore = await this.getStore(store, 'readwrite');

        return new Promise((resolve, reject) => {
            const request = objectStore.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        })
    }

    async getAll<T>(store: DbStore): Promise<T[]> {
        const objectStore = await this.getStore(store, 'readonly');

        return new Promise((resolve, reject) => {
            const request = objectStore.getAll();
            request.onsuccess = () => resolve(request.result as T[]);
            request.onerror = () => reject(request.error);
        })
    }

    async clear(store: DbStore): Promise<void> {
        const objectStore = await this.getStore(store, 'readwrite');

        return new Promise((resolve, reject) => {
            const request = objectStore.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        })
    }
}