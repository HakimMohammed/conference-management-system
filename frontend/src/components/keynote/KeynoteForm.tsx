import React, { useState, useEffect } from 'react';
import { Keynote } from '../../types/keynote';

interface KeynoteFormProps {
    keynoteToEdit: Keynote | null;
    onSave: (keynote: Omit<Keynote, 'keynoteId'>) => void;
    onCancel: () => void;
}

const KeynoteForm: React.FC<KeynoteFormProps> = ({ keynoteToEdit, onSave, onCancel }) => {
    const [keynote, setKeynote] = useState<Omit<Keynote, 'keynoteId'>>({
        firstName: '',
        lastName: '',
        email: '',
        keynoteFunction: '',
    });

    useEffect(() => {
        if (keynoteToEdit) {
            setKeynote({
                firstName: keynoteToEdit.firstName,
                lastName: keynoteToEdit.lastName,
                email: keynoteToEdit.email,
                keynoteFunction: keynoteToEdit.keynoteFunction,
            });
        } else {
            setKeynote({
                firstName: '',
                lastName: '',
                email: '',
                keynoteFunction: '',
            });
        }
    }, [keynoteToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setKeynote({ ...keynote, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(keynote);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded">
            <h2 className="text-xl font-bold mb-2">{keynoteToEdit ? 'Edit Keynote' : 'Create Keynote'}</h2>
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="firstName"
                    value={keynote.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="lastName"
                    value={keynote.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="p-2 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    value={keynote.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="keynoteFunction"
                    value={keynote.keynoteFunction}
                    onChange={handleChange}
                    placeholder="Function"
                    className="p-2 border rounded"
                />
            </div>
            <div className="mt-4">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Save
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default KeynoteForm;
