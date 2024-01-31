import React from 'react';
import {TodoItem} from "../../types/ToDo";

interface TodoProps {
    todo: TodoItem;
    onComplete: () => void;
    onEdit: () => void;
}

const Todo: React.FC<TodoProps> = ({todo, onComplete, onEdit}) => (
    <li className="todo-list-item">
        <div className="todo-text-container">
            <p>{todo.text}</p>
            <span className={`todo-status-capsule ${todo.completed ? 'todo-status-completed' : 'todo-status-pending'}`}>
                {todo.completed ? 'Completed' : 'Pending'}
            </span>
        </div>
        {!todo.completed && (
            <div className="todo-button-container">
                <button className="todo-button" onClick={onEdit}>Edit</button>
                <button className="todo-button" onClick={onComplete}>Complete</button>
            </div>
        )}
    </li>
);

export default Todo;
