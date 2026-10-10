import {migrateLegacyTodos} from "./migrate";
import {STORAGE_VERSION} from "./storage";
import {parseTodos, type Todo} from "./todo";

export const serializeBackup = (todos: Todo[]): string =>
    JSON.stringify({app: "streaky-todo", version: STORAGE_VERSION, exportedAt: new Date().toISOString(), todos}, null, 2);

/** Accepts a current backup or the raw array saved by the first app version. Throws on anything else. */
export const parseBackup = (text: string): Todo[] => {
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error("This file is not valid JSON.");
    }
    if (Array.isArray(data)) {
        return migrateLegacyTodos(data);
    }
    if (typeof data === "object" && data !== null && "todos" in data) {
        return parseTodos((data as {todos: unknown}).todos);
    }
    throw new Error("This file is not a Streaky ToDo backup.");
};
