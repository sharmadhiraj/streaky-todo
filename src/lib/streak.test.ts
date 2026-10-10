import {describe, expect, it} from "vitest";
import {calculateStreak, isMilestone} from "./streak";
import {ALL_WEEKDAYS} from "./todo";

// 2024-01-01 is a Monday.
const daily = (completedDates: string[], weekdays = ALL_WEEKDAYS, startDate = "2024-01-01") =>
    ({frequency: "daily" as const, weekdays, weeklyGoal: 1, startDate, completedDates});

const weekly = (completedDates: string[], weeklyGoal: number, startDate = "2024-01-01") =>
    ({frequency: "weekly" as const, weekdays: ALL_WEEKDAYS, weeklyGoal, startDate, completedDates});

describe("daily streak", () => {
    it("is zero with no completions", () => {
        expect(calculateStreak(daily([]), "2024-01-05")).toMatchObject({current: 0, longest: 0, unit: "day"});
    });

    it("counts consecutive days including today", () => {
        const result = calculateStreak(daily(["2024-01-03", "2024-01-04", "2024-01-05"]), "2024-01-05");
        expect(result).toMatchObject({current: 3, longest: 3});
    });

    it("does not break when today is not done yet", () => {
        const result = calculateStreak(daily(["2024-01-03", "2024-01-04"]), "2024-01-05");
        expect(result.current).toBe(2);
    });

    it("breaks on a missed tracked day", () => {
        const result = calculateStreak(daily(["2024-01-01", "2024-01-02", "2024-01-04", "2024-01-05"]), "2024-01-05");
        expect(result).toMatchObject({current: 2, longest: 2});
    });

    it("keeps the longest streak after the current one breaks", () => {
        const result = calculateStreak(daily(["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-05"]), "2024-01-06");
        expect(result).toMatchObject({current: 1, longest: 3});
    });

    it("skips untracked weekdays without breaking", () => {
        const weekdaysOnly = [0, 1, 2, 3, 4];
        const result = calculateStreak(daily(["2024-01-04", "2024-01-05", "2024-01-08"], weekdaysOnly), "2024-01-08");
        expect(result.current).toBe(3);
    });

    it("works across a year boundary", () => {
        const result = calculateStreak(daily(["2024-12-30", "2024-12-31", "2025-01-01"], ALL_WEEKDAYS, "2024-12-29"), "2025-01-01");
        expect(result.current).toBe(3);
    });

    it("updates when a past day is backfilled", () => {
        const gap = ["2024-01-01", "2024-01-03", "2024-01-04"];
        expect(calculateStreak(daily(gap), "2024-01-04").current).toBe(2);
        expect(calculateStreak(daily([...gap, "2024-01-02"]), "2024-01-04").current).toBe(4);
    });
});

describe("weekly streak", () => {
    it("counts consecutive weeks that reach the goal", () => {
        const dates = ["2024-01-01", "2024-01-03", "2024-01-08", "2024-01-10", "2024-01-15", "2024-01-16"];
        const result = calculateStreak(weekly(dates, 2), "2024-01-17");
        expect(result).toMatchObject({current: 3, longest: 3, unit: "week"});
    });

    it("does not break on the running week when the goal is not met yet", () => {
        const dates = ["2024-01-01", "2024-01-02", "2024-01-08"];
        const result = calculateStreak(weekly(dates, 2), "2024-01-09");
        expect(result.current).toBe(1);
    });

    it("breaks on a past week that missed the goal", () => {
        const dates = ["2024-01-01", "2024-01-02", "2024-01-08", "2024-01-15", "2024-01-16"];
        const result = calculateStreak(weekly(dates, 2), "2024-01-16");
        expect(result).toMatchObject({current: 1, longest: 1});
    });

    it("groups weeks correctly across years", () => {
        const dates = ["2024-12-30", "2025-01-02", "2025-01-06", "2025-01-08"];
        const result = calculateStreak(weekly(dates, 2, "2024-12-30"), "2025-01-08");
        expect(result.current).toBe(2);
    });

    it("ignores completions in the future", () => {
        const result = calculateStreak(weekly(["2024-01-20", "2024-01-21"], 1), "2024-01-10");
        expect(result).toMatchObject({current: 0, longest: 0});
    });
});

describe("weekly streak, partial first week", () => {
    it("caps the goal to the days left in the first week", () => {
        // Starts Thursday 2024-01-04: only 4 days left, goal of 5 is capped to 4.
        const dates = ["2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07", "2024-01-08", "2024-01-09", "2024-01-10", "2024-01-11", "2024-01-12"];
        const result = calculateStreak(weekly(dates, 5, "2024-01-04"), "2024-01-12");
        expect(result).toMatchObject({current: 2, longest: 2});
    });
});

describe("isMilestone", () => {
    it("flags round streak counts", () => {
        expect(isMilestone(7)).toBe(true);
        expect(isMilestone(8)).toBe(false);
    });
});
