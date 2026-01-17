import React, { useState, useEffect } from 'react';
import { Conference } from '../../types/conference';
import { getConferences, createConference, updateConference, deleteConference } from '../../services/conferenceService';
import ConferenceList from '../../components/conference/ConferenceList';
import ConferenceForm from '../../components/conference/ConferenceForm';

const ConferencesPage: React.FC = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [conferenceToEdit, setConferenceToEdit] = useState<Conference | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadConferences();
    }, []);

    const loadConferences = () => {
        getConferences().then(setConferences);
    };

    const handleSave = (conference: Omit<Conference, 'conferenceId' | 'reviews'>) => {
        if (conferenceToEdit) {
            updateConference(conferenceToEdit.conferenceId, conference).then(() => {
                loadConferences();
                setShowForm(false);
                setConferenceToEdit(null);
            });
        } else {
            createConference(conference).then(() => {
                loadConferences();
                setShowForm(false);
            });
        }
    };

    const handleEdit = (conference: Conference) => {
        setConferenceToEdit(conference);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        deleteConference(id).then(() => {
            loadConferences();
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        setConferenceToEdit(null);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Conference Management</h1>
            <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                {showForm ? 'Cancel' : 'Add Conference'}
            </button>

            {showForm && (
                <ConferenceForm
                    conferenceToEdit={conferenceToEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}

            <ConferenceList
                conferences={conferences}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default ConferencesPage;
