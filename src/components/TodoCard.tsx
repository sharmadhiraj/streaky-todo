import {useState} from "react";
import {addDays, WEEKDAY_NAMES} from "../lib/dates";
import type {ISODate} from "../lib/dates";
import {calculateStreak} from "../lib/streak";
import type {Todo} from "../lib/todo";
import Heatmap from "./Heatmap";
import WeekStrip from "./WeekStrip";

interface TodoCardProps {
    todo: Todo;
    now: ISODate;
    onEdit: (todo: Todo) => void;
    onToggleDate: (id: string, date: ISODate) => void;
}

const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"}`;

const describe = (todo: Todo): string => {
    if (todo.frequency === "weekly") {
        return `Weekly, ${todo.weeklyGoal}x per week`;
    }
    if (todo.weekdays.length === 7) {
        return "Daily";
    }
    return `Daily, ${todo.weekdays.map((d) => WEEKDAY_NAMES[d].slice(0, 3)).join(" ")}`;
};

const TodoCard = ({todo, now, onEdit, onToggleDate}: TodoCardProps) => {
    const [showHistory, setShowHistory] = useState(false);
    const yesterday = addDays(now, -1);
    const streak = calculateStreak(todo, now);
    const isDone = (date: ISODate) => todo.completedDates.includes(date);
    const toggle = (date: ISODate) => onToggleDate(todo.id, date);

    return (
        <li className="card">
            <div className="card-header">
                <div>
                    <h2>{todo.title}</h2>
                    <p className="meta">{describe(todo)}</p>
                </div>
                <div className="streak" title="Current streak">
                    <span className="streak-count">{streak.current > 0 ? "🔥 " : ""}{streak.current}</span>
                    <span className="meta">
                        {plural(streak.current, streak.unit)} · best {streak.longest}
                    </span>
                </div>
            </div>

            <WeekStrip todo={todo} now={now} onToggle={toggle}/>

            <div className="card-actions">
                {!todo.completed && (
                    <>
                        <button
                            className={isDone(now) ? "check done" : "check"}
                            aria-pressed={isDone(now)}
                            onClick={() => toggle(now)}>
                            {isDone(now) ? "✓ Done today" : "Mark today"}
                        </button>
                        <button
                            className={isDone(yesterday) ? "check done" : "check"}
                            aria-pressed={isDone(yesterday)}
                            onClick={() => toggle(yesterday)}>
                            {isDone(yesterday) ? "✓ Yesterday" : "Yesterday"}
                        </button>
                    </>
                )}
                <button className="link" aria-expanded={showHistory} onClick={() => setShowHistory(!showHistory)}>
                    {showHistory ? "Hide history" : "History"}
                </button>
                <button className="link" onClick={() => onEdit(todo)} aria-label={`Edit ${todo.title}`}>Edit</button>
            </div>

            {showHistory && <Heatmap todo={todo} now={now} onToggle={toggle}/>}
        </li>
    );
};

export default TodoCard;
