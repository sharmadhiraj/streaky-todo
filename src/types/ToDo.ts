export interface ToDoItem {
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
