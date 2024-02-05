import React, {useEffect, useState} from 'react';
import './AddToDo.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {getTodoById, saveTodo} from "../../../util/Storage";
import {generateWeeklyGroupedDates} from "../../../util/Common";
import {TodoItem} from "../../../types/ToDo";

interface AddTodoFormProps {
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AddToDo: React.FC<AddTodoFormProps> = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const emptyTodo = {
        id: '',
        text: '',
        completed: false,
        type: 'daily' as 'daily' | 'weekly',
        completedDates: [],
        trackingDetails: {
            daily: daysOfWeek,
            weekly: 1,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const [todo, setTodo] = useState<TodoItem>(emptyTodo);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const todoId = queryParams.get('id');

        if (todoId) {
            const todoItem = getTodoById(todoId);
            if (todoItem) {
                setTodo(todoItem);
            }
        }
    }, [location.search]);

    const handleSave = () => {
        if (!todo.text.trim()) {
            alert('Title is required.');
            return;
        } else if (todo.type === 'daily' && todo.trackingDetails?.daily?.length === 0) {
            alert('Please select at least one tracking day.');
            return;
        } else if (todo.type === 'weekly' && todo.trackingDetails?.weekly != null && (todo.trackingDetails.weekly < 1 || todo.trackingDetails.weekly > 7)) {
            alert('Please enter weekly count between 1-7.');
            return;
        }

        saveTodo(todo);
        setTodo(emptyTodo);
        navigate(-1);
    };

    const toggleTrackingDay = (day: string) => {
        const updatedDays = todo.trackingDetails.daily?.includes(day)
            ? todo.trackingDetails.daily.filter((d) => d !== day)
            : [...(todo.trackingDetails.daily || []), day];

        setTodo({
            ...todo,
            trackingDetails: {
                ...todo.trackingDetails,
                daily: updatedDays,
            },
        });
    };

    const toggleCompletedDate = (date: string) => {
        const updatedCompletedDates = todo.completedDates.includes(date)
            ? todo.completedDates.filter((d) => d !== date)
            : [...todo.completedDates, date];

        setTodo({
            ...todo,
            completedDates: updatedCompletedDates,
        });
    };

    const allDates = generateWeeklyGroupedDates(todo.createdAt);

    return (
        <div className="add-todo-form">
            <div>
                <label className="input-label">Title</label>
                <input type="text" value={todo.text} onChange={(e) => setTodo({...todo, text: e.target.value})}/>
            </div>

            <div>
                <label className="input-label">Type</label>
                <select value={todo.type}
                        onChange={(e) => setTodo({...todo, type: e.target.value as 'daily' | 'weekly'})}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>

            {todo.type === 'daily' && (
                <div>
                    <label className="input-label"> Tracking Days</label>
                    <div className="tracking-days-container">
                        {daysOfWeek.map((day) => (
                            <div key={`${day}-div`} className="day-checkbox">
                                <input
                                    type="checkbox"
                                    id={day}
                                    value={day}
                                    checked={todo.trackingDetails.daily?.includes(day) || false}
                                    onChange={() => toggleTrackingDay(day)}
                                    className="input-checkbox"
                                />
                                <label htmlFor={day}>{day}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {todo.type === 'weekly' && (
                <div>
                    <label className="input-label">Weekly Count</label>
                    <input
                        type="number"
                        value={todo.trackingDetails.weekly || 1}
                        min={1}
                        max={7}
                        onChange={(e) => setTodo({
                            ...todo,
                            trackingDetails: {...todo.trackingDetails, weekly: parseInt(e.target.value, 10)}
                        })}
                    />
                </div>
            )}

            <div>
                <label className="input-label">Status</label>
                <select value={todo.completed ? 1 : 0}
                        onChange={(e) => setTodo({...todo, completed: e.target.value === "1"})}>
                    <option value="0">Ongoing</option>
                    <option value="1">Completed</option>
                </select>
            </div>

            <br/>
            <label>Completed Days</label>
            <div className="completed-days-container">
                {Object.keys(allDates).reverse().map((weekNumber) => (
                    <div key={weekNumber} className="completed-days-week-container">
                        <b>Week {weekNumber}</b>
                        <div className="completed-days-week-days-container">
                            {allDates[parseInt(weekNumber)].map((date) => (
                                <div key={`${date}-div`} className="day-checkbox">
                                    <input
                                        type="checkbox"
                                        id={date}
                                        value={date}
                                        checked={todo.completedDates.includes(date)}
                                        onChange={() => toggleCompletedDate(date)}
                                        className="input-checkbox"
                                    />
                                    <label htmlFor={date} className="input-checkbox-label">{date}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="button-container">
                <button className="save-to-do-button" onClick={handleSave}>Save</button>
                <button className="cancel-to-do-button" onClick={() => navigate(-1)}>Cancel</button>
            </div>

        </div>
    );
};

export default AddToDo;
