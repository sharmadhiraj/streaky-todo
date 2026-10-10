import {useLayoutEffect, useRef} from "react";
import {addDays, daysBetween, formatDisplayDate, formatMonth, weekdayIndex, weekStart} from "../lib/dates";
import type {ISODate} from "../lib/dates";
import type {Todo} from "../lib/todo";

interface HeatmapProps {
    todo: Todo;
    now: ISODate;
    onToggle: (date: ISODate) => void;
}

const MAX_WEEKS = 26;
const ROW_LABELS = ["M", "", "W", "", "F", "", ""];

const Heatmap = ({todo, now, onToggle}: HeatmapProps) => {
    const scroller = useRef<HTMLDivElement>(null);
    const earliestWeek = addDays(weekStart(now), -7 * (MAX_WEEKS - 1));
    const first = weekStart(todo.startDate) > earliestWeek ? weekStart(todo.startDate) : earliestWeek;
    const dates = daysBetween(first, addDays(weekStart(now), 6));
    const weekCount = dates.length / 7;
    const done = new Set(todo.completedDates);
    const tracked = new Set(todo.weekdays);
    const isDaily = todo.frequency === "daily";

    const monthLabels = Array.from({length: weekCount}, (_, week) => {
        const days = dates.slice(week * 7, week * 7 + 7);
        const firstOfMonth = days.find((date) => date.endsWith("-01"));
        if (firstOfMonth) return formatMonth(firstOfMonth);
        return week === 0 ? formatMonth(days[0]) : "";
    });

    useLayoutEffect(() => {
        scroller.current?.scrollTo({left: scroller.current.scrollWidth});
    }, []);

    return (
        <div className="heatmap-wrap">
            <div className="heatmap" ref={scroller}>
                <div className="heatmap-labels" aria-hidden="true">
                    <span/>
                    {ROW_LABELS.map((label, i) => <span key={i}>{label}</span>)}
                </div>
                <div>
                    <div className="heatmap-months" aria-hidden="true">
                        {monthLabels.map((label, week) => label && <span key={week} style={{gridColumn: week + 1}}>{label}</span>)}
                    </div>
                    <div className="heatmap-grid">
                        {dates.map((date) => {
                            const isDone = done.has(date);
                            const disabled = date < todo.startDate || date > now;
                            const scheduled = isDaily && tracked.has(weekdayIndex(date));
                            const label = `${formatDisplayDate(date)}: ${isDone ? "done" : "not done"}`;
                            return (
                                <button
                                    key={date}
                                    className={`cell${isDone ? " done" : ""}${scheduled && !isDone ? " scheduled" : ""}`}
                                    disabled={disabled}
                                    aria-pressed={isDone}
                                    aria-label={label}
                                    title={label}
                                    onClick={() => onToggle(date)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="legend meta" aria-hidden="true">
                <span><i className="cell done"/> Done</span>
                {isDaily && <span><i className="cell scheduled"/> Tracked day</span>}
                <span><i className="cell"/> Not done</span>
            </div>
        </div>
    );
};

export default Heatmap;
