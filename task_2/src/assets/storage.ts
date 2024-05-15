import {CACHED_KEYS} from "./consts";
class StorageProvider {
    private __RAMCache: {[index: string]:string} = {};
    constructor() {
        this.__RAMCache = {};
        let serialized_keys = localStorage.getItem(CACHED_KEYS);
        if(serialized_keys === null) {
            localStorage.setItem(CACHED_KEYS, this.__serialize([]))
        } else {
            let keys = this.__deserialize(serialized_keys);
            for(const key of keys) {
                let storageCache = localStorage.getItem(key);
                if(storageCache !== null) {
                    this.__RAMCache[key] = storageCache;
                }
            }
        }
    }
    public getCachedKeys() {
        return Object.keys(this.__RAMCache);
    }
    public get(key: string): any {
        if(this.__RAMCache[key] !== undefined) {
            return this.__deserialize(this.__RAMCache[key]);
        }
        return null;
    }
    public set(key: string, data: any) {
        if(this.__RAMCache[key] === undefined) {
            this.__RAMCache[key] = this.__serialize(data);
            localStorage.setItem(CACHED_KEYS, this.__serialize(Object.keys(this.__RAMCache)));
            localStorage.setItem(key, this.__RAMCache[key]);
        } else {
            this.__RAMCache[key] = this.__serialize(data);
            localStorage.setItem(key, this.__RAMCache[key]);
        }
    }
    public delete(key: string) {
        localStorage.removeItem(key);
        delete this.__RAMCache[key];
        // this.__cachedKeys.splice(this.__cachedKeys.indexOf(key), 1);
        // localStorage.setItem(CACHED_KEYS, this.__serialize(this.__cachedKeys));
    }
    private __serialize(data: any): string {
        return JSON.stringify(data);
    }
    private __deserialize(data: string): any {
        return JSON.parse(data);
    }
}
export const storage = new StorageProvider();