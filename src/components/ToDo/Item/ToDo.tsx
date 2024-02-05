import React from 'react';
import {ToDoItem} from "../../../types/ToDo";
import './ToDo.css';
import {useNavigate} from "react-router-dom";
import {calculateCurrentStreak, calculateLongestStreak} from "../../../util/Streak";

interface TodoProps {
    todo: ToDoItem;
}

const Todo: React.FC<TodoProps> = ({todo}) => {
    const navigate = useNavigate();
    return (
        <li className="todo-list-item">
            <div>
                <p><b>{todo.text}</b></p>
                <span className="streak-capsule">Longest Streak: {calculateLongestStreak(todo)}</span>
                <span className="streak-capsule">Current Streak: {calculateCurrentStreak(todo)}</span>
            </div>
            <button className="edit-todo-button" onClick={() => navigate(`/add?id=${todo.id}`)}>
                Edit
            </button>
        </li>
    )
};

export default Todo;
