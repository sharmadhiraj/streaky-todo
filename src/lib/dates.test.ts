import {describe, expect, it} from "vitest";
import {addDays, daysBetween, diffInDays, formatLocalDate, isISODate, weekDates, weekdayIndex, weekStart} from "./dates";

describe("isISODate", () => {
    it("accepts real dates only", () => {
        expect(isISODate("2024-02-29")).toBe(true);
        expect(isISODate("2023-02-29")).toBe(false);
        expect(isISODate("2024-13-01")).toBe(false);
        expect(isISODate("Mon,Jan 01,2024")).toBe(false);
        expect(isISODate(20240101)).toBe(false);
    });
});

describe("addDays and diffInDays", () => {
    it("crosses month and year boundaries", () => {
        expect(addDays("2024-12-31", 1)).toBe("2025-01-01");
        expect(addDays("2024-03-01", -1)).toBe("2024-02-29");
        expect(diffInDays("2024-12-25", "2025-01-05")).toBe(11);
    });

    it("is not affected by daylight saving changes", () => {
        expect(addDays("2024-03-09", 2)).toBe("2024-03-11");
        expect(addDays("2024-11-02", 2)).toBe("2024-11-04");
    });
});

describe("weekdayIndex and weekStart", () => {
    it("treats Monday as the first day", () => {
        expect(weekdayIndex("2024-01-01")).toBe(0);
        expect(weekdayIndex("2024-01-07")).toBe(6);
        expect(weekStart("2024-01-07")).toBe("2024-01-01");
        expect(weekStart("2024-01-01")).toBe("2024-01-01");
    });

    it("groups weeks across years correctly", () => {
        expect(weekStart("2025-01-01")).toBe("2024-12-30");
        expect(weekStart("2024-12-30")).toBe(weekStart("2025-01-05"));
    });
});

describe("daysBetween", () => {
    it("is inclusive and empty when reversed", () => {
        expect(daysBetween("2024-01-30", "2024-02-01")).toEqual(["2024-01-30", "2024-01-31", "2024-02-01"]);
        expect(daysBetween("2024-02-02", "2024-02-01")).toEqual([]);
    });
});

describe("formatLocalDate", () => {
    it("pads month and day", () => {
        expect(formatLocalDate(new Date(2024, 0, 5))).toBe("2024-01-05");
    });
});

describe("weekDates", () => {
    it("returns Monday to Sunday around the date", () => {
        const week = weekDates("2025-01-01");
        expect(week[0]).toBe("2024-12-30");
        expect(week[6]).toBe("2025-01-05");
        expect(week).toHaveLength(7);
    });
});
