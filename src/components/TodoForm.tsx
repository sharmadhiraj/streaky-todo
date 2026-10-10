import {type FormEvent, useState} from "react";
import {MIN_DATE, today, WEEKDAY_NAMES} from "../lib/dates";
import type {Frequency, Todo} from "../lib/todo";

interface TodoFormProps {
    todo: Todo;
    isNew: boolean;
    onSave: (todo: Todo) => void;
    onDelete: (todo: Todo) => void;
    onCancel: () => void;
}

const FREQUENCIES: {value: Frequency; label: string}[] = [
    {value: "daily", label: "Daily"},
    {value: "weekly", label: "Weekly"},
];

const TodoForm = ({todo, isNew, onSave, onDelete, onCancel}: TodoFormProps) => {
    const [title, setTitle] = useState(todo.title);
    const [frequency, setFrequency] = useState<Frequency>(todo.frequency);
    const [weekdays, setWeekdays] = useState(todo.weekdays);
    const [weeklyGoal, setWeeklyGoal] = useState(todo.weeklyGoal);
    const [startDate, setStartDate] = useState(todo.startDate);
    const [completed, setCompleted] = useState(todo.completed);
    const [error, setError] = useState("");
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const toggleWeekday = (index: number) =>
        setWeekdays((prev) => prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index].sort());

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!title.trim()) return setError("Title is required.");
        if (startDate < MIN_DATE || startDate > today()) return setError("Start date must be a valid date that is not in the future.");
        if (frequency === "daily" && weekdays.length === 0) return setError("Select at least one tracked day.");
        onSave({...todo, title: title.trim(), frequency, weekdays, weeklyGoal, startDate, completed});
    };

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <h2>{isNew ? "New goal" : "Edit goal"}</h2>

            <label>
                Title
                <input
                    className="title-input"
                    value={title}
                    placeholder="What do you want to keep up?"
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    maxLength={100}
                />
            </label>

            <fieldset>
                <legend>Type</legend>
                <div className="segmented" role="radiogroup" aria-label="Type">
                    {FREQUENCIES.map(({value, label}) => (
                        <button
                            type="button"
                            key={value}
                            role="radio"
                            aria-checked={frequency === value}
                            className={frequency === value ? "selected" : ""}
                            onClick={() => setFrequency(value)}>
                            {label}
                        </button>
                    ))}
                </div>
            </fieldset>

            {frequency === "daily" ? (
                <fieldset>
                    <legend>Tracked days</legend>
                    <div className="weekdays">
                        {WEEKDAY_NAMES.map((name, index) => (
                            <button
                                type="button"
                                key={name}
                                className={weekdays.includes(index) ? "pill selected" : "pill"}
                                aria-pressed={weekdays.includes(index)}
                                aria-label={name}
                                onClick={() => toggleWeekday(index)}>
                                {name.slice(0, 3)}
                            </button>
                        ))}
                    </div>
                </fieldset>
            ) : (
                <fieldset>
                    <legend>Times per week</legend>
                    <div className="stepper">
                        <button
                            type="button"
                            aria-label="Decrease"
                            disabled={weeklyGoal <= 1}
                            onClick={() => setWeeklyGoal(weeklyGoal - 1)}>-
                        </button>
                        <output aria-live="polite">{weeklyGoal}</output>
                        <button
                            type="button"
                            aria-label="Increase"
                            disabled={weeklyGoal >= 7}
                            onClick={() => setWeeklyGoal(weeklyGoal + 1)}>+
                        </button>
                    </div>
                </fieldset>
            )}

            <label>
                Start date
                <input type="date" value={startDate} min={MIN_DATE} max={today()} onChange={(e) => setStartDate(e.target.value)}/>
            </label>

            <fieldset>
                <legend>Status</legend>
                <div className="segmented" role="radiogroup" aria-label="Status">
                    {[false, true].map((value) => (
                        <button
                            type="button"
                            key={String(value)}
                            role="radio"
                            aria-checked={completed === value}
                            className={completed === value ? "selected" : ""}
                            onClick={() => setCompleted(value)}>
                            {value ? "Completed" : "Ongoing"}
                        </button>
                    ))}
                </div>
            </fieldset>

            {error && <p className="error" role="alert">{error}</p>}

            {confirmingDelete ? (
                <div className="form-actions" role="alertdialog" aria-label="Confirm delete">
                    <span>Delete this goal and its history?</span>
                    <button type="button" className="danger" onClick={() => onDelete(todo)}>Yes, delete</button>
                    <button type="button" onClick={() => setConfirmingDelete(false)}>Keep</button>
                </div>
            ) : (
                <div className="form-actions">
                    <button type="submit" className="primary">Save</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                    {!isNew && <button type="button" className="danger" onClick={() => setConfirmingDelete(true)}>Delete</button>}
                </div>
            )}
        </form>
    );
};

export default TodoForm;
