import type {ToastMessage} from "../hooks/useToast";

interface ToastProps {
    toast: ToastMessage | null;
    onDismiss: () => void;
}

const Toast = ({toast, onDismiss}: ToastProps) => (
    <div className="toast-region" role="status" aria-live="polite">
        {toast && (
            <div className="toast">
                <span>{toast.message}</span>
                {toast.onAction && (
                    <button
                        className="link"
                        onClick={() => {
                            toast.onAction?.();
                            onDismiss();
                        }}>
                        {toast.actionLabel}
                    </button>
                )}
            </div>
        )}
    </div>
);

export default Toast;
