import React, {useEffect} from 'react';
import './AddToDo.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {getTodoById, saveTodo} from "../../../util/Storage";
import {daysOfWeek} from "../../../util/Date";
import {ToDoItem} from "../../../types/ToDo";
import DailySection from "./Components/DailySection";
import WeeklySection from "./Components/WeeklySection";
import StatusSection from "./Components/StatusSection";
import CompletedDaysSection from "./Components/CompletedDaysSection";
import useToDoState from "../../../hooks/useToDoState";
import {DAILY, WEEKLY} from "../../../util/Streak";


const AddToDo: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const emptyTodo: ToDoItem = {
        id: '',
        text: '',
        completed: false,
        type: DAILY,
        completedDates: [],
        trackingDetails: {
            daily: daysOfWeek,
            weekly: 1,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const [todo, updateTodo] = useToDoState(emptyTodo);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const todoItem = getTodoById(queryParams.get('id'));
        if (todoItem) {
            updateTodo(todoItem);
        }
    }, [location.search]);

    const handleSave = () => {
        if (!todo.text.trim()) {
            alert('Title is required.');
            return;
        } else if (todo.type === DAILY && todo.trackingDetails?.daily?.length === 0) {
            alert('Please select at least one tracking day.');
            return;
        } else if (todo.type === WEEKLY && todo.trackingDetails?.weekly != null && (todo.trackingDetails.weekly < 1 || todo.trackingDetails.weekly > 7)) {
            alert('Please enter weekly count between 1-7.');
            return;
        }

        saveTodo(todo);
        updateTodo(emptyTodo);
        navigate(-1);
    };

    const toggleTrackingDay = (day: string) => {
        const updatedDays = todo.trackingDetails.daily?.includes(day)
            ? todo.trackingDetails.daily.filter((d) => d !== day)
            : [...(todo.trackingDetails.daily || []), day];

        updateTodo({
            ...todo,
            trackingDetails: {
                ...todo.trackingDetails,
                daily: updatedDays,
            },
        });
    };

    const onWeeklyCountChange = (count: number) => {
        updateTodo({
            ...todo,
            trackingDetails: {...todo.trackingDetails, weekly: count}
        })
    };

    const handleTypeChange = (e: any) => {
        updateTodo({...todo, type: e.target.value as 'daily' | 'weekly'})
    }

    const onToggleStatus = (status: boolean) => {
        updateTodo({...todo, completed: status})
    };

    const toggleCompletedDate = (date: string) => {
        const updatedCompletedDates = todo.completedDates.includes(date)
            ? todo.completedDates.filter((d) => d !== date)
            : [...todo.completedDates, date];

        updateTodo({
            ...todo,
            completedDates: updatedCompletedDates,
        });
    };

    return (
        <div className="add-todo-form">
            <div>
                <label className="input-label">Title</label>
                <input
                    type="text"
                    value={todo.text}
                    onChange={(e) => updateTodo({...todo, text: e.target.value})}
                />
            </div>

            <div>
                <label className="input-label">Type</label>
                <select
                    value={todo.type}
                    onChange={handleTypeChange}>
                    <option value={DAILY}>Daily</option>
                    <option value={WEEKLY}>Weekly</option>
                </select>
            </div>

            {todo.type === DAILY && <DailySection todo={todo} onToggleTrackingDay={toggleTrackingDay}/>}

            {todo.type === WEEKLY && <WeeklySection todo={todo} onWeeklyCountChange={onWeeklyCountChange}/>}

            <StatusSection todo={todo} onToggleStatus={onToggleStatus}/>

            <CompletedDaysSection todo={todo} onToggleCompletedDate={toggleCompletedDate}/>

            <div className="button-container">
                <button className="save-to-do-button" onClick={handleSave}>Save</button>
                <button className="cancel-to-do-button" onClick={() => navigate(-1)}>Cancel</button>
            </div>
        </div>
    );
};

export default AddToDo;
