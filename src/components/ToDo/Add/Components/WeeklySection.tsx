import React from 'react';
import {ToDoItem} from "../../../../types/ToDo";

interface WeeklySectionProps {
    todo: ToDoItem;
    onWeeklyCountChange: (count: number) => void;
}

const WeeklySection: React.FC<WeeklySectionProps> = ({todo, onWeeklyCountChange}) => (
    <div>
        <label className="input-label">Weekly Count</label>
        <input
            type="number"
            value={todo.trackingDetails.weekly || 1}
            min={1}
            max={7}
            onChange={(e) => onWeeklyCountChange(parseInt(e.target.value, 10))}
        />
    </div>
);

export default WeeklySection;