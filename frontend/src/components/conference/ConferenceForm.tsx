import React, { useState, useEffect } from 'react';
import { Conference } from '../../types/conference';
import { Keynote } from '../../types/keynote';
import { getKeynotes } from '../../services/keynoteService';

interface ConferenceFormProps {
    conferenceToEdit: Conference | null;
    onSave: (conference: Omit<Conference, 'conferenceId' | 'reviews'>) => void;
    onCancel: () => void;
}

const ConferenceForm: React.FC<ConferenceFormProps> = ({ conferenceToEdit, onSave, onCancel }) => {
    const [conference, setConference] = useState<Omit<Conference, 'conferenceId' | 'reviews'>>({
        title: '',
        type: 'ACADEMIC',
        date: '',
        duration: 0,
        registeredCount: 0,
        score: 0,
        keynoteId: '',
    });
    const [keynotes, setKeynotes] = useState<Keynote[]>([]);

    useEffect(() => {
        getKeynotes().then(setKeynotes);
    }, []);

    useEffect(() => {
        if (conferenceToEdit) {
            setConference(conferenceToEdit);
        } else {
            setConference({
                title: '',
                type: 'ACADEMIC',
                date: '',
                duration: 0,
                registeredCount: 0,
                score: 0,
                keynoteId: '',
            });
        }
    }, [conferenceToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConference({ ...conference, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(conference);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded">
            <h2 className="text-xl font-bold mb-2">{conferenceToEdit ? 'Edit Conference' : 'Create Conference'}</h2>
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="title"
                    value={conference.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="p-2 border rounded"
                />
                <select name="type" value={conference.type} onChange={handleChange} className="p-2 border rounded">
                    <option value="ACADEMIC">Academic</option>
                    <option value="COMMERCIAL">Commercial</option>
                </select>
                <input
                    type="datetime-local"
                    name="date"
                    value={conference.date}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="duration"
                    value={conference.duration}
                    onChange={handleChange}
                    placeholder="Duration (minutes)"
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="registeredCount"
                    value={conference.registeredCount}
                    onChange={handleChange}
                    placeholder="Registered Count"
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="score"
                    value={conference.score}
                    onChange={handleChange}
                    placeholder="Score"
                    className="p-2 border rounded"
                />
                <select name="keynoteId" value={conference.keynoteId} onChange={handleChange} className="p-2 border rounded">
                    <option value="">Select Keynote</option>
                    {keynotes.map(keynote => (
                        <option key={keynote.keynoteId} value={keynote.keynoteId}>
                            {keynote.firstName} {keynote.lastName}
                        </option>
                    ))}
                </select>
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

export default ConferenceForm;
