import {describe, expect, it} from "vitest";
import {parseBackup, serializeBackup} from "./backup";
import {createTodo} from "./todo";

describe("backup", () => {
    it("round-trips items", () => {
        const todo = {...createTodo(), title: "Stretch"};
        expect(parseBackup(serializeBackup([todo]))).toEqual([todo]);
    });

    it("accepts the raw array from the first app version", () => {
        const legacy = [{id: "1", text: "Old", type: "daily", completedDates: [], trackingDetails: {daily: ["Monday"]}}];
        expect(parseBackup(JSON.stringify(legacy))).toHaveLength(1);
    });

    it("rejects invalid files", () => {
        expect(() => parseBackup("not json")).toThrow("not valid JSON");
        expect(() => parseBackup(JSON.stringify({foo: 1}))).toThrow("not a Streaky ToDo backup");
    });
});
