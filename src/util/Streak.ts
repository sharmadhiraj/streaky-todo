import {generateFlatDates, generateWeeklyGroupedDates} from "./Date";
import {ToDoItem} from "../types/ToDo";

export const DAILY = 'daily';
export const WEEKLY = 'weekly';

export const calculateCurrentStreak = (todo: ToDoItem) => {
    if (todo.type === DAILY) {
        return calculateDailyCurrentStreak(todo.completedDates, todo.trackingDetails?.daily ?? [], generateFlatDates(todo.createdAt));
    } else if (todo.type === WEEKLY) {
        return calculateWeeklyCurrentStreak(todo.completedDates, todo.trackingDetails?.weekly ?? 1, generateWeeklyGroupedDates(todo.createdAt))
    }
    return 0;
};

const calculateDailyCurrentStreak = (completedDates: string[], trackingDays: string[], dateRange: string[]) => {
    let streak = 0;
    const updatedTrackingDays = trackingDays.map(day => day.slice(0, 3));
    for (let i = 0; i < dateRange.length; i++) {
        if (completedDates.includes(dateRange[i])) {
            streak = streak + 1;
        } else if (i !== 0 && updatedTrackingDays.includes(dateRange[i].slice(0, 3))) {
            break;
        }
    }
    return streak;
};

const calculateWeeklyCurrentStreak = (completedDates: string[], weeklyCount: number, dateRange: Record<number, string[]>) => {
    let streak = 0;
    const weeks = Object.keys(dateRange).reverse().map(Number);
    for (let i = 0; i < weeks.length; i++) {
        let weekDaysStreak = 0;
        const weekDays = dateRange[weeks[i]];
        for (let j = 0; j < weekDays.length; j++) {
            if (completedDates.includes(weekDays[j])) {
                weekDaysStreak = weekDaysStreak + 1;
            }
        }
        if (i === 0 || weekDaysStreak >= weeklyCount) {
            streak = streak + weekDaysStreak;
        } else {
            break;
        }
    }
    return streak;
};

export const calculateLongestStreak = (todo: ToDoItem) => {
    if (todo.type === DAILY) {
        return calculateDailyLongestStreak(todo.completedDates, todo.trackingDetails?.daily ?? [], generateFlatDates(todo.createdAt));
    } else if (todo.type === WEEKLY) {
        return calculateWeeklyLongestStreak(todo.completedDates, todo.trackingDetails?.weekly ?? 1, generateWeeklyGroupedDates(todo.createdAt))
    }
    return 0;
};

const calculateDailyLongestStreak = (completedDates: string[], trackingDays: string[], dateRange: string[]) => {
    let streak = 0;
    let longestStreak = calculateDailyCurrentStreak(completedDates, trackingDays, dateRange);
    const updatedTrackingDays = trackingDays.map(day => day.slice(0, 3));
    for (let i = 0; i < dateRange.length; i++) {
        if (completedDates.includes(dateRange[i])) {
            streak = streak + 1;
            if (streak > longestStreak) {
                longestStreak = streak;
            }
        } else if (updatedTrackingDays.includes(dateRange[i].slice(0, 3))) {
            streak = 0;
        }
    }
    return longestStreak;
};

const calculateWeeklyLongestStreak = (completedDates: string[], weeklyCount: number, dateRange: Record<number, string[]>) => {
    let streak = 0;
    let longestStreak = calculateWeeklyCurrentStreak(completedDates, weeklyCount, dateRange);
    const weeks = Object.keys(dateRange).reverse().map(Number);
    for (let i = 0; i < weeks.length; i++) {
        let weekDaysStreak = 0;
        const weekDays = dateRange[weeks[i]];
        for (let j = 0; j < weekDays.length; j++) {
            if (completedDates.includes(weekDays[j])) {
                weekDaysStreak = weekDaysStreak + 1;
            }
        }
        if (weekDaysStreak >= weeklyCount) {
            streak = streak + weekDaysStreak;
            if (streak > longestStreak) {
                longestStreak = streak;
            }
        } else {
            streak = 0;
        }
    }
    return longestStreak;
};