import React, {useEffect, useState} from 'react';
import Todo from "../ToDo/ToDo";
import './App.css';
import {TodoItem} from "../../types/ToDo";


interface AppProps {
}

const loadTodos = (): TodoItem[] => {
    const todosJSON = localStorage.getItem('todos');
    return todosJSON ? JSON.parse(todosJSON) : [];
};

const saveTodos = (todos: TodoItem[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

const App: React.FC<AppProps> = () => {
    const [todos, setTodos] = useState<TodoItem[]>(loadTodos);

    useEffect(() => {
        saveTodos(todos);
    }, [todos]);

    const addTodo = (text: string) => {
        if (text.length === 0) return;
        setTodos([...todos, {text, completed: false}]);
    };

    const completeTodo = (index: number) => {
        const updatedTodos = [...todos];
        updatedTodos[index].completed = true;
        setTodos(updatedTodos);
    };

    const editTodo = (index: number, newText: string) => {
        if (newText.length === 0) return;
        const updatedTodos = [...todos];
        updatedTodos[index].text = newText;
        setTodos(updatedTodos);
    };

    return (
        <div className="container">
            <h2>StreakyToDo</h2>
            <h4>ToDo app with streak tracking for daily or weekly goals.</h4>
            <hr/>
            <button className="add-todo-button" onClick={() => addTodo(prompt("Enter ToDo:") || "")}>Add ToDo</button>
            {todos.length === 0 ? (
                <p className="empty-todo">You don't have any items. Please add a todo.</p>
            ) : (
                <ul style={{margin: 0, padding: 0}}>
                    {todos.map((todo, index) => (
                        <Todo
                            key={index}
                            todo={todo}
                            onComplete={() => completeTodo(index)}
                            onEdit={() => editTodo(index, prompt("Edit Todo:", todo.text) || '')}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;