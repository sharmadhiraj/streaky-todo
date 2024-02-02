import React, {useEffect, useState} from 'react';
import './AddToDo.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {getTodoById, saveTodo, updateTodo} from "../../../util/Storage";
import {generateWeeklyGroupedDates} from "../../../util/Common";

const {v4} = require("uuid");

interface AddTodoFormProps {
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AddToDo: React.FC<AddTodoFormProps> = () => {
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [todoId, setTodoId] = useState<string>('');
    const [todoCreatedAt, setTodoCreatedAt] = useState<string>(new Date().toISOString());
    const [todoText, setTodoText] = useState<string>('');
    const [todoType, setTodoType] = useState<'daily' | 'weekly'>('daily');
    const [todoComplete, setTodoComplete] = useState<boolean>(false);
    const [trackingDays, setTrackingDays] = useState<string[]>(daysOfWeek);
    const [allDates, setAllDates] = useState<Record<number, string[]>>({});
    const [completedDates, setCompletedDates] = useState<string[]>([]);
    const [weeklyCount, setWeeklyCount] = useState<number>(1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const todoId = queryParams.get('id');

        if (todoId) {
            const todoItem = getTodoById(todoId);
            if (todoItem) {
                setTodoId(todoItem.id);
                setTodoCreatedAt(todoItem.createdAt);
                setIsUpdate(true);
                setTodoText(todoItem.text);
                setTodoComplete(todoItem.completed);
                setTodoType(todoItem.type);
                setTrackingDays(todoItem.trackingDetails?.daily || []);
                setWeeklyCount(todoItem.trackingDetails?.weekly || 1);
                setCompletedDates(todoItem.completedDates);
            }
        }
        setAllDates(generateWeeklyGroupedDates(todoCreatedAt));
    }, [location.search]);

    const handleSave = () => {
        if (!todoText.trim()) {
            alert('Title is required.');
            return;
        } else if (todoType === 'daily' && trackingDays.length === 0) {
            alert('Please select at least one tracking day.');
            return;
        } else if (todoType === 'weekly' && (weeklyCount < 1 || weeklyCount > 7)) {
            alert('Please enter weekly count between 1-7.');
            return;
        }

        const newTodo = {
            id: isUpdate ? todoId : v4(),
            text: todoText,
            completed: todoComplete,
            type: todoType,
            completedDates: completedDates,
            trackingDetails: {
                daily: trackingDays,
                weekly: weeklyCount,
            },
            createdAt: todoCreatedAt,
            updatedAt: new Date().toISOString(),
        };

        if (isUpdate) {
            updateTodo(todoId, newTodo);
        } else {
            saveTodo(newTodo);
        }

        setTodoText('');
        setTodoType('daily');
        setTrackingDays([]);
        setWeeklyCount(1);

        navigate(-1);
    };

    return (
        <div className="add-todo-form">
            <div>
                <label className="input-label">Title</label>
                <input type="text" value={todoText} onChange={(e) => setTodoText(e.target.value)}/>
            </div>

            <div>
                <label className="input-label">Type</label>
                <select value={todoType} onChange={(e) => setTodoType(e.target.value as 'daily' | 'weekly')}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>

            {todoType === 'daily' && (
                <div>
                    <label className="input-label"> Tracking Days</label>
                    <div className="tracking-days-container">
                        {daysOfWeek.map((day) => (
                            <div key={`${day}-div`} className="day-checkbox">
                                <input
                                    type="checkbox"
                                    id={day}
                                    value={day}
                                    checked={trackingDays.includes(day)}
                                    onChange={() => toggleTrackingDay(day)}
                                    className="input-checkbox"
                                />
                                <label htmlFor={day}>{day}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {todoType === 'weekly' && (
                <div>
                    <div className="input-label">Weekly Count</div>
                    <input
                        type="number"
                        value={weeklyCount}
                        min={1}
                        max={7}
                        onChange={(e) => setWeeklyCount(parseInt(e.target.value, 10))}
                    />
                </div>
            )}

            <div>
                <label className="input-label">Status</label>
                <select value={todoComplete ? 1 : 0} onChange={(e) => setTodoComplete(e.target.value === "1")}>
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
                                        checked={completedDates.includes(date)}
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
                <button className="save-to-do-button" onClick={handleSave}>{isUpdate ? "Update" : "Save"}</button>
                <button className="cancel-to-do-button" onClick={() => navigate(-1)}>Cancel</button>
            </div>

        </div>
    );

    function toggleTrackingDay(day: string) {
        const updatedDays = trackingDays.includes(day)
            ? trackingDays.filter((d) => d !== day)
            : [...trackingDays, day];

        setTrackingDays(updatedDays);
    }

    function toggleCompletedDate(date: string) {
        const updatedCompletedDates = completedDates.includes(date)
            ? completedDates.filter((d) => d !== date)
            : [...completedDates, date];

        setCompletedDates(updatedCompletedDates);
    }


};

export default AddToDo;
