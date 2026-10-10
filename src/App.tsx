import {useState} from "react";
import BackupControls from "./components/BackupControls";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import {useTodos} from "./hooks/useTodos";
import {useToast} from "./hooks/useToast";
import {useToday} from "./hooks/useToday";
import type {ISODate} from "./lib/dates";
import {calculateStreak, isMilestone} from "./lib/streak";
import {createTodo, type Todo} from "./lib/todo";

const App = () => {
    const {todos, saveFailed, saveTodo, deleteTodo, toggleDate, importTodos} = useTodos();
    const {toast, show, dismiss} = useToast();
    const now = useToday();
    const [editing, setEditing] = useState<Todo | null>(null);

    const closeForm = () => setEditing(null);

    const handleToggleDate = (id: string, date: ISODate) => {
        const todo = todos.find((item) => item.id === id);
        if (!todo) return;
        toggleDate(id, date);
        if (todo.completedDates.includes(date)) return;

        const before = calculateStreak(todo, now);
        const after = calculateStreak({...todo, completedDates: [...todo.completedDates, date]}, now);
        if (after.current > before.current && isMilestone(after.current)) {
            show({message: `🎉 ${after.current} ${after.unit} streak on "${todo.title}"!`});
        }
    };

    const handleDelete = (todo: Todo) => {
        deleteTodo(todo.id);
        closeForm();
        show({message: `Deleted "${todo.title}".`, actionLabel: "Undo", onAction: () => saveTodo(todo)});
    };

    return (
        <main className="container">
            <header className="app-header">
                <span className="logo" aria-hidden="true">🔥</span>
                <div>
                    <h1>Streaky ToDo</h1>
                    <p className="subtitle">Daily and weekly goals with streak tracking.</p>
                </div>
                {!editing && <BackupControls todos={todos} onImport={importTodos} onMessage={(message) => show({message})}/>}
            </header>

            {saveFailed && (
                <p className="error" role="alert">
                    Could not save to this browser. Export a backup so you don't lose your changes.
                </p>
            )}

            {editing ? (
                <TodoForm
                    key={editing.id}
                    todo={editing}
                    isNew={!todos.some((todo) => todo.id === editing.id)}
                    onSave={(todo) => {
                        saveTodo(todo);
                        closeForm();
                    }}
                    onDelete={handleDelete}
                    onCancel={closeForm}
                />
            ) : (
                <TodoList
                    todos={todos}
                    now={now}
                    onAdd={(preset) => setEditing(preset ?? createTodo())}
                    onEdit={setEditing}
                    onToggleDate={handleToggleDate}
                />
            )}

            <Footer/>

            <Toast toast={toast} onDismiss={dismiss}/>
        </main>
    );
};

export default App;
