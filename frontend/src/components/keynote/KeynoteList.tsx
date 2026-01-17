import React from 'react';
import { Keynote } from '../../types/keynote';

interface KeynoteListProps {
    keynotes: Keynote[];
    onEdit: (keynote: Keynote) => void;
    onDelete: (id: string) => void;
}

const KeynoteList: React.FC<KeynoteListProps> = ({ keynotes, onEdit, onDelete }) => {
    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold">Keynotes</h2>
            <ul className="mt-2">
                {keynotes.map((keynote) => (
                    <li key={keynote.keynoteId} className="flex items-center justify-between p-2 border-b">
                        <div>
                            <p className="font-bold">{keynote.firstName} {keynote.lastName}</p>
                            <p>{keynote.email} - {keynote.function}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => onEdit(keynote)}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(keynote.keynoteId)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KeynoteList;
