import {describe, expect, it} from "vitest";
import {convertLegacyDate, migrateLegacyTodos} from "./migrate";

describe("convertLegacyDate", () => {
    it("converts the old locale format", () => {
        expect(convertLegacyDate("Mon,Jan 01,2024")).toBe("2024-01-01");
        expect(convertLegacyDate("Sun,Dec 31,2023")).toBe("2023-12-31");
    });

    it("rejects other values", () => {
        expect(convertLegacyDate("2024-01-01")).toBeNull();
        expect(convertLegacyDate("Mon,Foo 01,2024")).toBeNull();
        expect(convertLegacyDate(null)).toBeNull();
    });
});

describe("migrateLegacyTodos", () => {
    const legacyDaily = {
        id: "a",
        text: "Read",
        completed: false,
        type: "daily",
        completedDates: ["Tue,Jan 02,2024", "Mon,Jan 01,2024", "garbage"],
        trackingDetails: {daily: ["Monday", "Tuesday"], weekly: 1},
        createdAt: "2024-01-03T10:00:00.000Z",
        updatedAt: "2024-01-03T10:00:00.000Z",
    };

    it("maps fields and starts at the earliest known date", () => {
        const [todo] = migrateLegacyTodos([legacyDaily]);
        expect(todo).toMatchObject({
            id: "a",
            title: "Read",
            frequency: "daily",
            weekdays: [0, 1],
            startDate: "2024-01-01",
            completedDates: ["2024-01-01", "2024-01-02"],
            completed: false,
        });
    });

    it("keeps the weekly goal", () => {
        const [todo] = migrateLegacyTodos([{...legacyDaily, type: "weekly", trackingDetails: {weekly: 4}}]);
        expect(todo).toMatchObject({frequency: "weekly", weeklyGoal: 4});
    });

    it("skips invalid entries and non-arrays", () => {
        expect(migrateLegacyTodos([null, 5, {}])).toEqual([]);
        expect(migrateLegacyTodos("nope")).toEqual([]);
    });
});
