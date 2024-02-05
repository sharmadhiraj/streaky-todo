import {useState} from 'react';
import {ToDoItem} from "../types/ToDo";

const useToDoState = (initialState: ToDoItem) => {
    const [toDo, setToDo] = useState<ToDoItem>(initialState);

    const updateToDo = (updatedFields: Partial<ToDoItem>) => {
        setToDo({
            ...toDo,
            ...updatedFields,
        });
    };

    return [toDo, updateToDo] as const;
};

export default useToDoState;
