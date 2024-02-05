import React from 'react';
import {ToDoItem} from "../../../../types/ToDo";

interface StatusSectionProps {
    todo: ToDoItem;
    onToggleStatus: (status: boolean) => void;
}

const StatusSection: React.FC<StatusSectionProps> = ({todo, onToggleStatus}) => (
    <div>
        <label className="input-label">Status</label>
        <select value={todo.completed ? 1 : 0} onChange={(e) => onToggleStatus(e.target.value === '1')}>
            <option value="0">Ongoing</option>
            <option value="1">Completed</option>
        </select>
    </div>
);

export default StatusSection;