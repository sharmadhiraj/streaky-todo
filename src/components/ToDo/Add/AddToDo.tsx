import React, {useState} from 'react';
import './AddToDo.css';

interface AddTodoFormProps {
    onAddTodo: (todo: any) => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


const AddToDo: React.FC<AddTodoFormProps> = ({onAddTodo}) => {
    const [todoText, setTodoText] = useState<string>('');
    const [todoType, setTodoType] = useState<'daily' | 'weekly'>('daily');
    const [trackingDays, setTrackingDays] = useState<string[]>([]);
    const [weeklyCount, setWeeklyCount] = useState<number>(1);

    const handleAddTodo = () => {
        const newTodo = {
            text: todoText,
            completed: false,
            type: todoType,
            completedDates: [],
            trackingDetails: {
                daily: trackingDays,
                weekly: weeklyCount,
            },
        };

        onAddTodo(newTodo);

        setTodoText('');
        setTodoType('daily');
        setTrackingDays([]);
        setWeeklyCount(1);
    };

    return (
        <div className="add-todo-form">
            <label>
                ToDo Text:
                <input type="text" value={todoText} onChange={(e) => setTodoText(e.target.value)}/>
            </label>

            <label>
                Type:
                <select value={todoType} onChange={(e) => setTodoType(e.target.value as 'daily' | 'weekly')}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
            </label>

            {todoType === 'daily' && (
                <label>
                    Tracking Days:
                    <div className="tracking-days-container">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="day-checkbox">
                                <input
                                    type="checkbox"
                                    id={day}
                                    value={day}
                                    checked={trackingDays.includes(day)}
                                    onChange={() => toggleTrackingDay(day)}
                                />
                                <label htmlFor={day}>{day}</label>
                            </div>
                        ))}
                    </div>
                </label>
            )}


            {todoType === 'weekly' && (
                <label>
                    Weekly Count:
                    <input
                        type="number"
                        value={weeklyCount}
                        onChange={(e) => setWeeklyCount(parseInt(e.target.value, 10))}
                    />
                </label>
            )}

            <button onClick={handleAddTodo}>Save</button>
        </div>
    );

    function toggleTrackingDay(day: string) {
        const updatedDays = trackingDays.includes(day)
            ? trackingDays.filter((d) => d !== day)
            : [...trackingDays, day];

        setTrackingDays(updatedDays);
    }
};

export default AddToDo;
