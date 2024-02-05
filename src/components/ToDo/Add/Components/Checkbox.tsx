import React from 'react';

interface CheckboxProps {
    id: string;
    value: string;
    checked: boolean;
    onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({id, value, checked, onChange}) => (
    <div className="day-checkbox">
        <input type="checkbox" id={id} value={value} checked={checked} onChange={onChange} className="input-checkbox"/>
        <label htmlFor={id} className="input-checkbox-label">
            {value}
        </label>
    </div>
);

export default Checkbox;