import './App.css';
import ToDoList from "../ToDo/List/ToDoList";
import React from "react";


interface AppProps {
}

const App: React.FC<AppProps> = () => {

    const addTodo = (text: string) => {
    };


    return (
        <div className="container">
            <h1>StreakyToDo</h1>
            <h4>ToDo app with streak tracking for daily or weekly goals.</h4>

            <ToDoList/>
            {/*<AddToDoForm onAddTodo={addTodo}/>*/}

        </div>
    );
};

export default App;