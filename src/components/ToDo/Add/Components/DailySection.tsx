import React from 'react';
import Checkbox from './Checkbox';
import {ToDoItem} from "../../../../types/ToDo";
import {daysOfWeek} from "../../../../util/Date";

interface DailySectionProps {
    todo: ToDoItem;
    onToggleTrackingDay: (day: string) => void;
}

const DailySection: React.FC<DailySectionProps> = ({todo, onToggleTrackingDay}) => (
    <div>
        <label className="input-label"> Tracking Days</label>
        <div className="tracking-days-container">
            {daysOfWeek.map((day) => (
                <Checkbox
                    key={day}
                    id={day}
                    value={day}
                    checked={todo.trackingDetails.daily?.includes(day) || false}
                    onChange={() => onToggleTrackingDay(day)}
                />
            ))}
        </div>
    </div>
);

export default DailySection;