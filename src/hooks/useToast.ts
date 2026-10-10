import {useCallback, useEffect, useRef, useState} from "react";

export interface ToastMessage {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

const DURATION_MS = 5000;

export const useToast = () => {
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const timer = useRef<number>(undefined);

    const dismiss = useCallback(() => {
        window.clearTimeout(timer.current);
        setToast(null);
    }, []);

    const show = useCallback((next: ToastMessage) => {
        window.clearTimeout(timer.current);
        setToast(next);
        timer.current = window.setTimeout(() => setToast(null), DURATION_MS);
    }, []);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    return {toast, show, dismiss};
};
