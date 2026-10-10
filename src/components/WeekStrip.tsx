import {formatDisplayDate, weekDates, weekdayIndex, WEEKDAY_NAMES} from "../lib/dates";
import type {ISODate} from "../lib/dates";
import type {Todo} from "../lib/todo";

interface WeekStripProps {
    todo: Todo;
    now: ISODate;
    onToggle: (date: ISODate) => void;
}

const WeekStrip = ({todo, now, onToggle}: WeekStripProps) => {
    const dates = weekDates(now);
    const done = new Set(todo.completedDates);
    const tracked = new Set(todo.weekdays);
    const doneThisWeek = dates.filter((date) => done.has(date)).length;
    const percent = Math.min(100, Math.round((doneThisWeek / todo.weeklyGoal) * 100));

    return (
        <div className="week">
            <div className="week-days">
                {dates.map((date) => {
                    const isDone = done.has(date);
                    const missed = !isDone && date < now && todo.frequency === "daily" && tracked.has(weekdayIndex(date));
                    const classes = ["day", isDone && "done", date === now && "today", missed && "missed"];
                    const label = `${formatDisplayDate(date)}: ${isDone ? "done" : "not done"}`;
                    return (
                        <button
                            key={date}
                            className={classes.filter(Boolean).join(" ")}
                            disabled={date > now || date < todo.startDate}
                            aria-pressed={isDone}
                            aria-label={label}
                            title={label}
                            onClick={() => onToggle(date)}>
                            {WEEKDAY_NAMES[weekdayIndex(date)][0]}
                        </button>
                    );
                })}
            </div>
            {todo.frequency === "weekly" && (
                <div className="progress-row">
                    <div
                        className="progress"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={todo.weeklyGoal}
                        aria-valuenow={doneThisWeek}
                        aria-label="Progress this week">
                        <div className="progress-bar" style={{width: `${percent}%`}}/>
                    </div>
                    <span className="meta">{doneThisWeek}/{todo.weeklyGoal} this week</span>
                </div>
            )}
        </div>
    );
};

export default WeekStrip;
