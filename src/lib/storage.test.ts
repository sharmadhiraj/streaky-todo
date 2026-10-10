import {beforeEach, describe, expect, it} from "vitest";
import {loadTodos, saveTodos, type Store} from "./storage";
import {createTodo} from "./todo";

const memoryStore = (): Store & {data: Record<string, string>} => {
    const data: Record<string, string> = {};
    return {
        data,
        getItem: (key) => data[key] ?? null,
        setItem: (key, value) => {
            data[key] = value;
        },
    };
};

describe("storage", () => {
    let store: ReturnType<typeof memoryStore>;

    beforeEach(() => {
        store = memoryStore();
    });

    it("returns an empty list when nothing is saved", () => {
        expect(loadTodos(store)).toEqual([]);
    });

    it("round-trips saved items", () => {
        const todo = {...createTodo(), title: "Run", completedDates: ["2024-01-01"]};
        saveTodos([todo], store);
        expect(loadTodos(store)).toEqual([todo]);
    });

    it("keeps unreadable data under a separate key", () => {
        store.data["streaky-todo:v2"] = "{broken";
        expect(loadTodos(store)).toEqual([]);
        expect(store.data["streaky-todo:corrupt"]).toBe("{broken");
    });

    it("migrates first-version data and leaves the old key in place", () => {
        const legacy = JSON.stringify([{
            id: "x", text: "Old", completed: false, type: "weekly", completedDates: ["Mon,Jan 01,2024"],
            trackingDetails: {weekly: 2}, createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
        }]);
        store.data["todos"] = legacy;

        const [todo] = loadTodos(store);

        expect(todo).toMatchObject({id: "x", title: "Old", frequency: "weekly", weeklyGoal: 2});
        expect(store.data["todos"]).toBe(legacy);
        expect(store.data["streaky-todo:v2"]).toBeDefined();
    });
});

describe("storage failures", () => {
    it("reports a failed write instead of throwing", () => {
        const full: Store = {getItem: () => null, setItem: () => {throw new Error("quota");}};
        expect(saveTodos([], full)).toBe(false);
    });

    it("keeps data written by a newer app version", () => {
        const store = memoryStore();
        store.data["streaky-todo:v2"] = JSON.stringify({version: 3, items: []});
        expect(loadTodos(store)).toEqual([]);
        expect(store.data["streaky-todo:corrupt"]).toContain("\"version\":3");
    });
});
