import {useEffect, useState} from "react";
import {type ISODate, today} from "../lib/dates";

/** Current local date, refreshed when the tab regains focus or the day rolls over. */
export const useToday = (): ISODate => {
    const [now, setNow] = useState(today);

    useEffect(() => {
        const refresh = () => setNow(today());
        const timer = window.setInterval(refresh, 60_000);
        document.addEventListener("visibilitychange", refresh);
        window.addEventListener("focus", refresh);
        return () => {
            window.clearInterval(timer);
            document.removeEventListener("visibilitychange", refresh);
            window.removeEventListener("focus", refresh);
        };
    }, []);

    return now;
};
