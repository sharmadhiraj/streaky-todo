import {TodoItem} from "../types/ToDo";

const {v4} = require("uuid");

export const loadTodos = (): TodoItem[] => {
    const todosJSON = localStorage.getItem('todos');
    return todosJSON ? JSON.parse(todosJSON) : [];
};

export const saveTodos = (todos: TodoItem[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
};


export const saveTodo = (todo: Partial<TodoItem>) => {
    if (todo.id?.length === 0) {
        todo.id = v4();
        localStorage.setItem('todos', JSON.stringify([todo, ...loadTodos()]));
    } else {
        updateTodo(todo);
    }
};

export const getTodoById = (id: string): TodoItem | undefined => {
    const todos = loadTodos();
    return todos.find(todo => todo.id === id);
};

const updateTodo = (updatedTodo: Partial<TodoItem>) => {
    const todos = loadTodos();
    const updatedTodos = todos.map(todo => (todo.id === updatedTodo.id ? {...todo, ...updatedTodo} : todo));
    saveTodos(updatedTodos);
};