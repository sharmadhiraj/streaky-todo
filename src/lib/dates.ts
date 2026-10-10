export type ISODate = string;

const MS_PER_DAY = 86_400_000;
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const toUtcMs = (date: ISODate): number => {
    const [year, month, day] = date.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
};

const fromUtcMs = (ms: number): ISODate => new Date(ms).toISOString().slice(0, 10);

export const MIN_DATE: ISODate = "2000-01-01";

export const isISODate = (value: unknown): value is ISODate =>
    typeof value === "string" && ISO_PATTERN.test(value) && value >= MIN_DATE && fromUtcMs(toUtcMs(value)) === value;

export const formatLocalDate = (date: Date): ISODate => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
};

export const today = (): ISODate => formatLocalDate(new Date());

export const addDays = (date: ISODate, days: number): ISODate => fromUtcMs(toUtcMs(date) + days * MS_PER_DAY);

export const diffInDays = (from: ISODate, to: ISODate): number => Math.round((toUtcMs(to) - toUtcMs(from)) / MS_PER_DAY);

/** Monday is 0, Sunday is 6. */
export const weekdayIndex = (date: ISODate): number => (new Date(toUtcMs(date)).getUTCDay() + 6) % 7;

export const weekStart = (date: ISODate): ISODate => addDays(date, -weekdayIndex(date));

export const weekDates = (date: ISODate): ISODate[] => daysBetween(weekStart(date), addDays(weekStart(date), 6));

export const formatMonth = (date: ISODate): string =>
    new Date(toUtcMs(date)).toLocaleDateString(undefined, {month: "short", timeZone: "UTC"});

export const daysBetween = (start: ISODate, end: ISODate): ISODate[] => {
    const count = diffInDays(start, end) + 1;
    return Array.from({length: Math.max(count, 0)}, (_, i) => addDays(start, i));
};

export const formatDisplayDate = (date: ISODate): string =>
    new Date(toUtcMs(date)).toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
