import {formatLocalDate, type ISODate, WEEKDAY_NAMES} from "./dates";
import {parseTodos, type Todo} from "./todo";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEGACY_DATE = /^[A-Za-z]{3},([A-Za-z]{3}) (\d{1,2}),(\d{4})$/;

/** Converts the old "Mon,Jan 01,2024" format to ISO, or null when it doesn't match. */
export const convertLegacyDate = (value: unknown): ISODate | null => {
    const match = typeof value === "string" ? LEGACY_DATE.exec(value) : null;
    const month = match ? MONTHS.indexOf(match[1]) : -1;
    if (!match || month < 0) {
        return null;
    }
    return `${match[3]}-${String(month + 1).padStart(2, "0")}-${match[2].padStart(2, "0")}`;
};

const toLegacyShape = (item: unknown): unknown => {
    if (typeof item !== "object" || item === null) {
        return null;
    }
    const old = item as Record<string, any>;
    const completedDates = (Array.isArray(old.completedDates) ? old.completedDates : [])
        .map(convertLegacyDate)
        .filter((date: ISODate | null): date is ISODate => date !== null)
        .sort();
    const created = new Date(old.createdAt);
    const createdDate = Number.isNaN(created.getTime()) ? null : formatLocalDate(created);
    const startDate = [createdDate, completedDates[0]].filter((d): d is ISODate => d !== null).sort()[0];
    const trackingDays: unknown[] = old.trackingDetails?.daily ?? [];

    return {
        id: old.id,
        title: old.text,
        frequency: old.type,
        weekdays: trackingDays.map((name) => WEEKDAY_NAMES.indexOf(String(name))).filter((i) => i >= 0),
        weeklyGoal: old.trackingDetails?.weekly,
        startDate,
        completedDates,
        completed: old.completed,
        createdAt: old.createdAt,
        updatedAt: old.updatedAt,
    };
};

export const migrateLegacyTodos = (items: unknown): Todo[] =>
    Array.isArray(items) ? parseTodos(items.map(toLegacyShape)) : [];
