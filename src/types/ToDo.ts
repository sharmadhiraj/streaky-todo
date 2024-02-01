export interface TodoItem {
    text: string;
    completed: boolean;
    type: 'daily' | 'weekly';
    completedDates: string[];
    trackingDetails: {
        daily?: string[];
        weekly?: number;
    };
}

export const calculateStreak = (todo: TodoItem) => {
    return 1
};