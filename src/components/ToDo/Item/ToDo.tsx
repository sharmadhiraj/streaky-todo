import React from 'react';
import {calculateStreak, TodoItem} from "../../../types/ToDo";
import './ToDo.css';

interface TodoProps {
    todo: TodoItem;
    onEdit: () => void;
}

const Todo: React.FC<TodoProps> = ({todo, onEdit}) => (
    <li className="todo-list-item">
        <div>
            <p><b>{todo.text}</b></p>
            <span className="streak-capsule">Streak: {calculateStreak(todo)}</span>
        </div>
        {!todo.completed && (
            <button className="edit-todo-button" onClick={onEdit}>Edit</button>
        )}
    </li>
);

export default Todo;
