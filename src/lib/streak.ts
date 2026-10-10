import {addDays, daysBetween, type ISODate, today, weekdayIndex, weekStart} from "./dates";
import type {Todo} from "./todo";

export const MILESTONES = [7, 30, 100, 365];

export const isMilestone = (count: number): boolean => MILESTONES.includes(count);

export interface Streak {
    current: number;
    longest: number;
    unit: "day" | "week";
}

type StreakInput = Pick<Todo, "frequency" | "weekdays" | "weeklyGoal" | "startDate" | "completedDates">;

/**
 * Daily: consecutive completed days, broken by a missed tracked weekday (today is never a miss).
 * Weekly: consecutive weeks that reached the goal (the running week is never a miss).
 */
export const calculateStreak = (todo: StreakInput, now: ISODate = today()): Streak =>
    todo.frequency === "weekly" ? weeklyStreak(todo, now) : dailyStreak(todo, now);

const dailyStreak = (todo: StreakInput, now: ISODate): Streak => {
    const done = new Set(todo.completedDates);
    const tracked = new Set(todo.weekdays);
    const isMiss = (date: ISODate) => date !== now && !done.has(date) && tracked.has(weekdayIndex(date));
    const days = daysBetween(todo.startDate, now);

    let current = 0;
    for (let i = days.length - 1; i >= 0 && !isMiss(days[i]); i--) {
        if (done.has(days[i])) current++;
    }

    let run = 0;
    let longest = 0;
    for (const date of days) {
        if (done.has(date)) {
            longest = Math.max(longest, ++run);
        } else if (isMiss(date)) {
            run = 0;
        }
    }
    return {current, longest, unit: "day"};
};

const weeklyStreak = (todo: StreakInput, now: ISODate): Streak => {
    const counts = new Map<ISODate, number>();
    for (const date of todo.completedDates) {
        if (date >= todo.startDate && date <= now) {
            const week = weekStart(date);
            counts.set(week, (counts.get(week) ?? 0) + 1);
        }
    }

    const thisWeek = weekStart(now);
    const firstWeek = weekStart(todo.startDate);
    const weeks: ISODate[] = [];
    for (let week = firstWeek; week <= thisWeek; week = addDays(week, 7)) {
        weeks.push(week);
    }
    const daysInFirstWeek = 7 - weekdayIndex(todo.startDate);
    const goalFor = (week: ISODate) => (week === firstWeek ? Math.min(todo.weeklyGoal, daysInFirstWeek) : todo.weeklyGoal);
    const isMet = (week: ISODate) => (counts.get(week) ?? 0) >= goalFor(week);
    const isMiss = (week: ISODate) => week !== thisWeek && !isMet(week);

    let current = 0;
    for (let i = weeks.length - 1; i >= 0 && !isMiss(weeks[i]); i--) {
        if (isMet(weeks[i])) current++;
    }

    let run = 0;
    let longest = 0;
    for (const week of weeks) {
        if (isMet(week)) {
            longest = Math.max(longest, ++run);
        } else if (isMiss(week)) {
            run = 0;
        }
    }
    return {current, longest, unit: "week"};
};
