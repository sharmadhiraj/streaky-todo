import {migrateLegacyTodos} from "./migrate";
import {parseTodos, type Todo} from "./todo";

export const STORAGE_VERSION = 2;
const KEY = "streaky-todo:v2";
const LEGACY_KEY = "todos";
const CORRUPT_KEY = "streaky-todo:corrupt";

export type Store = Pick<Storage, "getItem" | "setItem">;

/** Returns false when the browser refuses the write (quota exceeded, private mode). */
export const saveTodos = (todos: Todo[], store: Store = localStorage): boolean => {
    try {
        store.setItem(KEY, JSON.stringify({version: STORAGE_VERSION, todos}));
        return true;
    } catch {
        return false;
    }
};

/**
 * Loads saved items. Unreadable data is kept under a separate key instead of being lost,
 * and data from the first app version is migrated (the old key is left untouched as a backup).
 */
export const loadTodos = (store: Store = localStorage): Todo[] => {
    const raw = store.getItem(KEY);
    if (raw !== null) {
        try {
            const data = JSON.parse(raw);
            if (data.version > STORAGE_VERSION || !Array.isArray(data.todos)) {
                throw new Error("Unsupported data");
            }
            return parseTodos(data.todos);
        } catch {
            try {
                store.setItem(CORRUPT_KEY, raw);
            } catch {
                // nothing more can be done if storage is full
            }
            return [];
        }
    }

    const legacy = store.getItem(LEGACY_KEY);
    if (legacy === null) {
        return [];
    }
    try {
        const todos = migrateLegacyTodos(JSON.parse(legacy));
        saveTodos(todos, store);
        return todos;
    } catch {
        return [];
    }
};
