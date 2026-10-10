import {type ChangeEvent, useRef} from "react";
import {today} from "../lib/dates";
import {parseBackup, serializeBackup} from "../lib/backup";
import type {Todo} from "../lib/todo";

interface BackupControlsProps {
    todos: Todo[];
    onImport: (todos: Todo[]) => void;
    onMessage: (message: string) => void;
}

const BackupControls = ({todos, onImport, onMessage}: BackupControlsProps) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const url = URL.createObjectURL(new Blob([serializeBackup(todos)], {type: "application/json"}));
        const link = document.createElement("a");
        link.href = url;
        link.download = `streaky-todo-backup-${today()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        onMessage("Backup downloaded.");
    };

    const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        try {
            const imported = parseBackup(await file.text());
            onImport(imported);
            onMessage(`Imported ${imported.length} item${imported.length === 1 ? "" : "s"}.`);
        } catch (error) {
            onMessage(error instanceof Error ? error.message : "Import failed.");
        }
    };

    return (
        <div className="backup" role="group" aria-label="Backup">
            <button className="link" onClick={handleExport} disabled={todos.length === 0}>Export</button>
            <button className="link" onClick={() => fileInput.current?.click()}>Import</button>
            <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={handleFile}/>
        </div>
    );
};

export default BackupControls;
