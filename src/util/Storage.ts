import {TodoItem} from "../types/ToDo";

export const loadTodos = (): TodoItem[] => {
    const todosJSON = localStorage.getItem('todos');
    return todosJSON ? JSON.parse(todosJSON) : [];
};

export const saveTodos = (todos: TodoItem[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
};


export const saveTodo = (todo: Partial<TodoItem>) => {
    localStorage.setItem('todos', JSON.stringify([todo, ...loadTodos()]));
};

export const getTodoById = (id: string): TodoItem | undefined => {
    const todos = loadTodos();
    return todos.find(todo => todo.id === id);
};

export const updateTodo = (id: string, updatedTodo: Partial<TodoItem>) => {
    const todos = loadTodos();
    const updatedTodos = todos.map(todo => (todo.id === id ? {...todo, ...updatedTodo} : todo));
    saveTodos(updatedTodos);
};