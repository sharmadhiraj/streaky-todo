import React, {useState} from 'react';
import Todo from "../Item/ToDo";
import './ToDoList.css';
import {ToDoItem} from "../../../types/ToDo";
import {useNavigate} from 'react-router-dom';
import {loadTodos} from "../../../util/Storage";


const ToDoList: React.FC = () => {
    const [todos] = useState<ToDoItem[]>(loadTodos);
    const [showCompleted, setShowCompleted] = useState<boolean>(false);
    const navigate = useNavigate();

    const ongoingTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    return (
        <div>
            <div className="add-todo-button-container">
                <div className="tab-container">
                    <button
                        onClick={() => setShowCompleted(false)}
                        className={!showCompleted ? "selected-tab" : ""}>
                        Show Ongoing Items
                    </button>
                    <button
                        onClick={() => setShowCompleted(true)}
                        className={showCompleted ? "selected-tab" : ""}>
                        Show Completed Items
                    </button>
                </div>

                <button
                    className="add-todo-button"
                    onClick={() => navigate('/add')}>
                    Add New ToDo Item
                </button>
            </div>

            <ul className="todo-list">
                {(showCompleted ? completedTodos : ongoingTodos).length === 0 ? (
                    <p className="empty-todo">
                        {showCompleted ? "You don't have any completed items." : "You don't have any ongoing items."}
                    </p>
                ) : (
                    (showCompleted ? completedTodos : ongoingTodos).map((todo, index) => (
                        <Todo key={index}
                              todo={todo}/>
                    ))
                )}
            </ul>

        </div>
    );
};

export default ToDoList;