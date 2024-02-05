import {generateFlatDates, generateWeeklyGroupedDates, getWeekNumber, parseDate} from "../../util/Date";

describe("generateWeeklyGroupedDates",
    () => {
        it("generates weekly grouped dates correctly for date in past",
            () => {
                const startDateString = "2024-01-01";
                const result: Record<number, string[]> = generateWeeklyGroupedDates(startDateString);

                expect(result).toHaveProperty("1");
                expect(result["1"]).toContain("Mon,Jan 01,2024");
            });
    });

describe("parseDate",
    () => {
        it("parses a valid date string correctly",
            () => {
                const validDateString = "2024-02-05";
                const parsedDate: Date = parseDate(validDateString);

                expect(parsedDate.toISOString().split('T')[0]).toEqual(validDateString);
            });

        it("returns current date for an invalid date string",
            () => {
                const invalidDateString = "invalid-date";
                const parsedDate: Date = parseDate(invalidDateString);

                const today: Date = new Date();
                expect(parsedDate.getFullYear()).toEqual(today.getFullYear());
            });
    });

describe("getWeekNumber",
    () => {
        it("calculates week number correctly for the first day of the year",
            () => {
                const date = new Date("2024-01-01");
                const weekNumber = getWeekNumber(date);

                expect(weekNumber).toBe(1);
            });

        it("calculates week number correctly for a day in the middle of the year",
            () => {
                const date = new Date("2024-06-15");
                const weekNumber = getWeekNumber(date);

                expect(weekNumber).toBe(24);
            });

        it("calculates week number correctly for the last day of the year",
            () => {
                const date = new Date("2024-12-31");
                const weekNumber = getWeekNumber(date);

                expect(weekNumber).toBe(53);
            });

        it("calculates week number correctly for a leap year",
            () => {
                const leapYearDate = new Date("2024-02-29");
                const nonLeapYearDate = new Date("2023-02-28");

                const leapYearWeekNumber = getWeekNumber(leapYearDate);
                const nonLeapYearWeekNumber = getWeekNumber(nonLeapYearDate);

                expect(leapYearWeekNumber).toBe(9);
                expect(nonLeapYearWeekNumber).toBe(9);
            });
    });

describe("generateFlatDates",
    () => {
        it("generates flat dates correctly for a specific start date",
            () => {
                const startDateString = "2024-01-01";
                const result = generateFlatDates(startDateString);

                expect(result).toContain("Mon,Jan 01,2024");
            });
    });