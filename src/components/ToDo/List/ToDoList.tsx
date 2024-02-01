import React, {useEffect, useState} from 'react';
import Todo from "../Item/ToDo";
import './ToDoList.css';
import {TodoItem} from "../../../types/ToDo";


interface ToDoListProps {
}

const loadTodos = (): TodoItem[] => {
    const todosJSON = localStorage.getItem('todos');
    return todosJSON ? JSON.parse(todosJSON) : [];
};

const saveTodos = (todos: TodoItem[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

const ToDoList: React.FC<ToDoListProps> = () => {
    const [todos, setTodos] = useState<TodoItem[]>(loadTodos);
    const [showCompleted, setShowCompleted] = useState<boolean>(false);

    useEffect(() => {
        saveTodos(todos);
    }, [todos]);


    const addTodo = (text: string) => {
        if (text.length === 0) return;
        setTodos([...todos, {
            text,
            completed: false,
            type: 'daily',
            completedDates: [],
            trackingDetails: {
                daily: [],
                weekly: 1,
            },
        }]);
    };

    const editTodo = (index: number, newText: string) => {
        if (newText.length === 0) return;
        const updatedTodos = [...todos];
        updatedTodos[index].text = newText;
        setTodos(updatedTodos);
    };

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
                    onClick={() => addTodo(prompt("Enter ToDo:") || "")}>
                    Add New ToDo Item
                </button>
            </div>
            <hr/>
            <ul style={{margin: 0, padding: 0}}>
                {(showCompleted ? completedTodos : ongoingTodos).length === 0 ? (
                    <p className="empty-todo">
                        {showCompleted ? "You don't have any completed items." : "You don't have any ongoing items."}
                    </p>
                ) : (
                    (showCompleted ? completedTodos : ongoingTodos).map((todo, index) => (
                        <Todo
                            key={index}
                            todo={todo}
                            onEdit={() => editTodo(index, prompt("Edit Todo:", todo.text) || '')}
                        />
                    ))
                )}
            </ul>

        </div>
    );
};

export default ToDoList;