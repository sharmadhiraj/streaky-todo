import React from 'react';
import Checkbox from './Checkbox';
import {ToDoItem} from "../../../../types/ToDo";
import {generateWeeklyGroupedDates} from "../../../../util/Date";

interface CompletedDaysSectionProps {
    todo: ToDoItem;
    onToggleCompletedDate: (date: string) => void;
}

const CompletedDaysSection: React.FC<CompletedDaysSectionProps> = ({todo, onToggleCompletedDate}) => {
    const allDates = generateWeeklyGroupedDates(todo.createdAt);

    return (
        <div>
            <label>Completed Days</label>
            <div className="completed-days-container">
                {Object.keys(allDates)
                    .reverse()
                    .map((weekNumber) => (
                        <div key={weekNumber} className="completed-days-week-container">
                            <b>Week {weekNumber}</b>
                            <div className="completed-days-week-days-container">
                                {allDates[parseInt(weekNumber)].map((date) => (
                                    <Checkbox
                                        key={date}
                                        id={date}
                                        value={date}
                                        checked={todo.completedDates.includes(date)}
                                        onChange={() => onToggleCompletedDate(date)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CompletedDaysSection;
