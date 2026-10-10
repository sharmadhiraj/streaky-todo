import {useState} from "react";
import type {ISODate} from "../lib/dates";
import {createTodo, type Todo} from "../lib/todo";
import TodoCard from "./TodoCard";

interface TodoListProps {
    todos: Todo[];
    now: ISODate;
    onAdd: (preset?: Todo) => void;
    onEdit: (todo: Todo) => void;
    onToggleDate: (id: string, date: ISODate) => void;
}

const EXAMPLES = [
    {title: "Read for 20 minutes"},
    {title: "Workout", frequency: "weekly" as const, weeklyGoal: 3},
    {title: "Drink enough water"},
];

const TodoList = ({todos, now, onAdd, onEdit, onToggleDate}: TodoListProps) => {
    const [showCompleted, setShowCompleted] = useState(false);
    const ongoingCount = todos.filter((todo) => !todo.completed).length;
    const doneToday = (todo: Todo) => todo.completedDates.includes(now);
    const visible = todos
        .filter((todo) => todo.completed === showCompleted)
        .sort((a, b) => (showCompleted ? 0 : Number(doneToday(a)) - Number(doneToday(b))));

    return (
        <section>
            <div className="toolbar">
                <div className="tabs" role="tablist">
                    <button role="tab" aria-selected={!showCompleted} onClick={() => setShowCompleted(false)}>
                        Ongoing ({ongoingCount})
                    </button>
                    <button role="tab" aria-selected={showCompleted} onClick={() => setShowCompleted(true)}>
                        Completed ({todos.length - ongoingCount})
                    </button>
                </div>
                <button className="primary add-button" aria-label="Add new goal" onClick={() => onAdd()}>
                    <span aria-hidden="true">+</span><span className="add-label"> New</span>
                </button>
            </div>

            {visible.length > 0 ? (
                <ul className="todo-list">
                    {visible.map((todo) => (
                        <TodoCard key={todo.id} todo={todo} now={now} onEdit={onEdit} onToggleDate={onToggleDate}/>
                    ))}
                </ul>
            ) : showCompleted || todos.length > 0 ? (
                <p className="empty">{showCompleted ? "No completed items yet." : "All goals are completed. Add a new one to keep going."}</p>
            ) : (
                <div className="empty">
                    <p>Add a goal to start your first streak, or try one of these:</p>
                    <div className="examples">
                        {EXAMPLES.map((example) => (
                            <button key={example.title} onClick={() => onAdd(createTodo(example))}>{example.title}</button>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default TodoList;
