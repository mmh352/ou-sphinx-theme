function get(obj: any, path: string[], deflt: any) {
    if (obj) {
        if (path.length === 0) {
            return deflt;
        } else if (path.length === 1) {
            if (obj[path[0]]) {
                return obj[path[0]];
            } else {
                return deflt;
            }
        } else {
            return get(obj[path[0]], path.slice(1), deflt);
        }
    } else {
        return deflt;
    }
}

function load(storage: Storage, key: string) {
    const value = storage.getItem(key);
    if (value) {
        return JSON.parse(value);
    } else {
        return null;
    }
}

function getConfig(storage: Storage, key: string, path: string, deflt: any) {
    const store = load(storage, key);
    return get(store, path.split('.'), deflt);
}

export function getLocalConfig(key: string, path: string, deflt: any) {
    return getConfig(localStorage, key, path, deflt);
}

function set(obj: any, path: string[], value: any) {
    if (path.length === 0) {
    } else if (path.length === 1) {
        obj[path[0]] = value;
    } else {
        if (obj[path[0]]) {
            set(obj[path[0]], path.slice(1), value);
        } else {
            const subObj = {};
            set(subObj, path.slice(1), value);
            obj[path[0]] = subObj;
        }
    }
}

function save(storage: Storage, key: string, value: any) {
    storage.setItem(key, JSON.stringify(value));
}

function setConfig(storage: Storage, key: string, path: string, value: any) {
    let store = load(storage, key);
    if (store === null) {
        store = {};
    }
    set(store, path.split('.'), value);
    save(storage, key, store);
}

export function setLocalConfig(key: string, path: string, value: any) {
    setConfig(localStorage, key, path, value);
}
