export const generateWeeklyGroupedDates = (startDateString: string): Record<number, string[]> => {
    let startDate = parseDate(startDateString);
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const groupedDates: Record<number, string[]> = {};

    while (today >= startDate) {
        const weekNumber = getWeekNumber(today);
        const formattedDate = today.toLocaleDateString('en-US',
            {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).replace(/, /g, ',');
        if (!groupedDates[weekNumber]) {
            groupedDates[weekNumber] = [];
        }
        groupedDates[weekNumber].push(formattedDate);
        today.setDate(today.getDate() - 1);
    }
    return groupedDates;
};

export const parseDate = (dateString: string): Date => {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
        return new Date();
    }
    return parsedDate;
};

export const getWeekNumber = (date: Date): number => {
    const copiedDate = new Date(date.getTime());
    copiedDate.setMonth(0, 1);

    const dayOfWeek = copiedDate.getDay();
    const firstDayOffset = dayOfWeek > 0 ? dayOfWeek - 1 : 6;
    const daysToFirstSunday = firstDayOffset > 0 ? 7 - firstDayOffset : 0;

    copiedDate.setDate(1 + daysToFirstSunday);

    const diffInDays = Math.floor((date.getTime() - copiedDate.getTime()) / (24 * 60 * 60 * 1000));

    return Math.ceil((daysToFirstSunday + diffInDays + 1) / 7);
}

export const generateFlatDates = (createdAt: string) => {
    const dateStrings = Object.values(generateWeeklyGroupedDates(createdAt)).flat();
    return dateStrings.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime();
    });
}

export const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];