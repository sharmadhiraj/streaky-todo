import {ToDoItem} from "../types/ToDo";

const {v4} = require("uuid");

export const loadTodos = (): ToDoItem[] => {
    const todosJSON = localStorage.getItem('todos');
    return todosJSON ? JSON.parse(todosJSON) : [];
};

const saveTodos = (todos: ToDoItem[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

export const saveTodo = (todo: ToDoItem) => {
    todo.updatedAt = new Date().toISOString();
    if (todo.id?.length === 0) {
        todo.id = v4();
        todo.createdAt = new Date().toISOString();
        saveTodos([todo, ...loadTodos()]);
    } else {
        const todos = loadTodos();
        const updatedTodos = todos.map(item => (item.id === todo.id ? {...item, ...todo} : item));
        saveTodos(updatedTodos);
    }
};

export const getTodoById = (id: string | null): ToDoItem | undefined => {
    const todos = loadTodos();
    return todos.find(todo => todo.id === id);
};
