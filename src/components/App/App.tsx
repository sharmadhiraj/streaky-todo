import './App.css';
import ToDoList from "../ToDo/List/ToDoList";
import React from "react";
import {Route, Routes} from 'react-router-dom';
import AddToDo from "../ToDo/Add/AddToDo";


interface AppProps {
}

const App: React.FC<AppProps> = () => {


    return (
        <div className="container">
            <h1>StreakyToDo</h1>
            <h4>ToDo app with streak tracking for daily or weekly goals.</h4>
            <hr/>
            <Routes>
                <Route path="/" element={<ToDoList/>}/>
                <Route path="/add" element={<AddToDo/>}/>
            </Routes>

        </div>
    );
};

export default App;