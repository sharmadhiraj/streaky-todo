import {generateFlatDates, generateWeeklyGroupedDates} from "../util/Common";

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    type: 'daily' | 'weekly';
    completedDates: string[];
    trackingDetails: {
        daily?: string[];
        weekly?: number;
    };
    createdAt: string;
    updatedAt: string;
}


export const calculateCurrentStreak = (todo: TodoItem) => {
    if (todo.type === 'daily') {
        return calculateDailyCurrentStreak(todo.completedDates, todo.trackingDetails?.daily ?? [], generateFlatDates(todo.createdAt));
    } else if (todo.type === 'weekly') {
        return calculateWeeklyCurrentStreak(todo.completedDates, todo.trackingDetails?.weekly ?? 1, generateWeeklyGroupedDates(todo.createdAt))
    }
    return 0;
};

const calculateDailyCurrentStreak = (completedDates: string[], trackingDays: string[], dateRange: string[]) => {
    let streak = 0;
    trackingDays = trackingDays.map(day => day.slice(0, 3));

    for (let i = 0; i < dateRange.length; i++) {
        if (completedDates.includes(dateRange[i])) {
            streak = streak + 1;
        } else if (i !== 0 && trackingDays.includes(dateRange[i].slice(0, 3))) {
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

export const calculateLongestStreak = (todo: TodoItem) => {
    if (todo.type === 'daily') {
        return calculateDailyLongestStreak(todo.completedDates, todo.trackingDetails?.daily ?? [], generateFlatDates(todo.createdAt));
    } else if (todo.type === 'weekly') {
        return calculateWeeklyLongestStreak(todo.completedDates, todo.trackingDetails?.weekly ?? 1, generateWeeklyGroupedDates(todo.createdAt))
    }
    return 0;
};

const calculateDailyLongestStreak = (completedDates: string[], trackingDays: string[], dateRange: string[]) => {
    let streak = 0;
    let longestStreak = calculateDailyCurrentStreak(completedDates, trackingDays, dateRange);
    trackingDays = trackingDays.map(day => day.slice(0, 3));
    for (let i = 0; i < dateRange.length; i++) {
        if (completedDates.includes(dateRange[i])) {
            streak = streak + 1;
            if (streak > longestStreak) {
                longestStreak = streak;
            }
        } else if (trackingDays.includes(dateRange[i].slice(0, 3))) {
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