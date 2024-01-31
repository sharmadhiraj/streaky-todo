import React, {useState} from 'react';
import ToDo from "../ToDo/ToDo";
import './App.css';

interface AppProps {
}

const App: React.FC<AppProps> = ({}) => {
    const [todos, setTodos] = useState<any[]>([]);

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
                        <ToDo
                            key={index}
                            text={todo.text}
                            completed={todo.completed}
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
