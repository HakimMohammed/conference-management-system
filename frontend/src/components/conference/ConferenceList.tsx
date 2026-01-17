import React from 'react';
import { Conference } from '../../types/conference';
import { Link } from 'react-router-dom';

interface ConferenceListProps {
    conferences: Conference[];
    onEdit: (conference: Conference) => void;
    onDelete: (id: string) => void;
}

const ConferenceList: React.FC<ConferenceListProps> = ({ conferences, onEdit, onDelete }) => {
    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold">Conferences</h2>
            <ul className="mt-2">
                {conferences.map((conference) => (
                    <li key={conference.conferenceId} className="flex items-center justify-between p-2 border-b">
                        <div>
                            <Link to={`/conferences/${conference.conferenceId}`}>
                                <p className="font-bold">{conference.title}</p>
                            </Link>
                            <p>{conference.type} - {new Date(conference.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => onEdit(conference)}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(conference.conferenceId)}
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

export default ConferenceList;
