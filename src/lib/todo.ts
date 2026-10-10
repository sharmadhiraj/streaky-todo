import {formatLocalDate, isISODate, type ISODate, today} from "./dates";

export type Frequency = "daily" | "weekly";

export interface Todo {
    id: string;
    title: string;
    frequency: Frequency;
    /** Tracked weekdays for daily goals, Monday is 0. */
    weekdays: number[];
    /** Required completions per week for weekly goals. */
    weeklyGoal: number;
    startDate: ISODate;
    completedDates: ISODate[];
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export const createTodo = (overrides: Partial<Todo> = {}): Todo => {
    const now = new Date();
    return {
        id: crypto.randomUUID(),
        title: "",
        frequency: "daily",
        weekdays: ALL_WEEKDAYS,
        weeklyGoal: 3,
        startDate: formatLocalDate(now),
        completedDates: [],
        completed: false,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        ...overrides,
    };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const asTimestamp = (value: unknown): string =>
    typeof value === "string" && !Number.isNaN(Date.parse(value)) ? value : new Date().toISOString();

const unique = <T>(values: T[]): T[] => [...new Set(values)];

export const parseTodo = (value: unknown): Todo | null => {
    if (!isRecord(value) || typeof value.id !== "string" || typeof value.title !== "string") {
        return null;
    }
    const weekdays = Array.isArray(value.weekdays)
        ? unique(value.weekdays.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6))
        : ALL_WEEKDAYS;
    const goal = Number(value.weeklyGoal);
    return {
        id: value.id,
        title: value.title,
        frequency: value.frequency === "weekly" ? "weekly" : "daily",
        weekdays: weekdays.length > 0 ? weekdays.sort() : ALL_WEEKDAYS,
        weeklyGoal: Number.isInteger(goal) && goal >= 1 && goal <= 7 ? goal : 1,
        startDate: isISODate(value.startDate) && value.startDate <= today() ? value.startDate : today(),
        completedDates: Array.isArray(value.completedDates) ? unique(value.completedDates.filter(isISODate)).sort() : [],
        completed: value.completed === true,
        createdAt: asTimestamp(value.createdAt),
        updatedAt: asTimestamp(value.updatedAt),
    };
};

export const parseTodos = (value: unknown): Todo[] => {
    if (!Array.isArray(value)) {
        return [];
    }
    const seen = new Set<string>();
    return value.flatMap((item) => {
        const todo = parseTodo(item);
        if (!todo || seen.has(todo.id)) {
            return [];
        }
        seen.add(todo.id);
        return [todo];
    });
};

/** Items from `incoming` replace items with the same id, new ones are added first. */
export const mergeTodos = (current: Todo[], incoming: Todo[]): Todo[] => {
    const incomingIds = new Set(incoming.map((todo) => todo.id));
    return [...incoming, ...current.filter((todo) => !incomingIds.has(todo.id))];
};
