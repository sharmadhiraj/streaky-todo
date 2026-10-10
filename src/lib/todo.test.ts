import {describe, expect, it} from "vitest";
import {ALL_WEEKDAYS, createTodo, mergeTodos, parseTodo, parseTodos} from "./todo";

describe("parseTodo", () => {
    it("rejects values without id or title", () => {
        expect(parseTodo(null)).toBeNull();
        expect(parseTodo({id: "1"})).toBeNull();
        expect(parseTodo([])).toBeNull();
    });

    it("fills defaults and drops invalid fields", () => {
        const todo = parseTodo({
            id: "1", title: "T", frequency: "other", weekdays: [], weeklyGoal: 99,
            startDate: "bad", completedDates: ["2024-01-02", "nope", "2024-01-02", "2024-01-01"],
        });
        expect(todo).toMatchObject({
            frequency: "daily", weekdays: ALL_WEEKDAYS, weeklyGoal: 1,
            completedDates: ["2024-01-01", "2024-01-02"], completed: false,
        });
    });
});

describe("parseTodos", () => {
    it("drops invalid and duplicate entries", () => {
        const todo = {...createTodo(), title: "A"};
        expect(parseTodos([todo, todo, {bad: true}])).toHaveLength(1);
        expect(parseTodos("nope")).toEqual([]);
    });
});

describe("mergeTodos", () => {
    it("lets incoming items replace existing ones with the same id", () => {
        const a = {...createTodo(), title: "A"};
        const b = {...createTodo(), title: "B"};
        const merged = mergeTodos([a, b], [{...a, title: "A2"}]);
        expect(merged.map((t) => t.title)).toEqual(["A2", "B"]);
    });
});

describe("parseTodo dates", () => {
    it("replaces implausible or future start dates", () => {
        const base = {id: "1", title: "T"};
        expect(parseTodo({...base, startDate: "0001-01-01"})?.startDate).not.toBe("0001-01-01");
        expect(parseTodo({...base, startDate: "2999-01-01"})?.startDate).not.toBe("2999-01-01");
    });
});
