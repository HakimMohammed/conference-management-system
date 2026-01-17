import React, { useState, useEffect } from 'react';
import { Keynote } from '../../types/keynote';
import { getKeynotes, createKeynote, updateKeynote, deleteKeynote } from '../../services/keynoteService';
import KeynoteList from '../../components/keynote/KeynoteList';
import KeynoteForm from '../../components/keynote/KeynoteForm';

const KeynotesPage: React.FC = () => {
    const [keynotes, setKeynotes] = useState<Keynote[]>([]);
    const [keynoteToEdit, setKeynoteToEdit] = useState<Keynote | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadKeynotes();
    }, []);

    const loadKeynotes = () => {
        getKeynotes().then(setKeynotes);
    };

    const handleSave = (keynote: Omit<Keynote, 'keynoteId'>) => {
        if (keynoteToEdit) {
            updateKeynote(keynoteToEdit.keynoteId, keynote).then(() => {
                loadKeynotes();
                setShowForm(false);
                setKeynoteToEdit(null);
            });
        } else {
            createKeynote(keynote).then(() => {
                loadKeynotes();
                setShowForm(false);
            });
        }
    };

    const handleEdit = (keynote: Keynote) => {
        setKeynoteToEdit(keynote);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        deleteKeynote(id).then(() => {
            loadKeynotes();
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        setKeynoteToEdit(null);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Keynote Management</h1>
            <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                {showForm ? 'Cancel' : 'Add Keynote'}
            </button>

            {showForm && (
                <KeynoteForm
                    keynoteToEdit={keynoteToEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}

            <KeynoteList
                keynotes={keynotes}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default KeynotesPage;
