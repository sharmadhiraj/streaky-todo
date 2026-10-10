import {useCallback, useEffect, useState} from "react";
import type {ISODate} from "../lib/dates";
import {loadTodos, saveTodos} from "../lib/storage";
import {mergeTodos, type Todo} from "../lib/todo";

const touch = (todo: Todo): Todo => ({...todo, updatedAt: new Date().toISOString()});

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>(loadTodos);

    const [saveFailed, setSaveFailed] = useState(false);

    useEffect(() => setSaveFailed(!saveTodos(todos)), [todos]);

    const saveTodo = useCallback((todo: Todo) => {
        setTodos((prev) =>
            prev.some((item) => item.id === todo.id)
                ? prev.map((item) => (item.id === todo.id ? touch(todo) : item))
                : [touch(todo), ...prev]);
    }, []);

    const deleteTodo = useCallback((id: string) => {
        setTodos((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const toggleDate = useCallback((id: string, date: ISODate) => {
        setTodos((prev) => prev.map((item) => {
            if (item.id !== id) return item;
            const completedDates = item.completedDates.includes(date)
                ? item.completedDates.filter((d) => d !== date)
                : [...item.completedDates, date].sort();
            return touch({...item, completedDates});
        }));
    }, []);

    const importTodos = useCallback((incoming: Todo[]) => {
        setTodos((prev) => mergeTodos(prev, incoming));
    }, []);

    return {todos, saveFailed, saveTodo, deleteTodo, toggleDate, importTodos};
};
