import React from 'react';

interface TodoProps {
    text: string;
    completed: boolean;
    onComplete: () => void;
    onEdit: () => void;
}

const Todo: React.FC<TodoProps> = ({text, completed, onComplete, onEdit}) => (
    <li className="todo-list-item">
        <div className="todo-text-container">
            <p>{text}</p>
            <span className={`todo-status-capsule ${completed ? 'todo-status-completed' : 'todo-status-pending'}`}>
                {completed ? 'Completed' : 'Pending'}
            </span>
        </div>
        <div className="todo-button-container">
            <button className="todo-button" onClick={onEdit}>Edit</button>
            <button className="todo-button" onClick={onComplete}>Complete</button>
        </div>
    </li>
);

export default Todo;
