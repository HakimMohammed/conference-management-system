import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Conference, Review } from '../../types/conference';
import { getConferenceById, addReview } from '../../services/conferenceService';
import ReviewList from '../../components/review/ReviewList';
import ReviewForm from '../../components/review/ReviewForm';

const ConferenceDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [conference, setConference] = useState<Conference | null>(null);

    useEffect(() => {
        if (id) {
            loadConference(id);
        }
    }, [id]);

    const loadConference = (conferenceId: string) => {
        getConferenceById(conferenceId).then(setConference);
    };

    const handleAddReview = (review: Omit<Review, 'reviewId' | 'conference' | 'date'>) => {
        if (id) {
            addReview(id, review).then(() => {
                loadConference(id);
            });
        }
    };

    if (!conference) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{conference.title}</h1>
            <p>{conference.type}</p>
            <p>{new Date(conference.date).toLocaleString()}</p>
            <p>Duration: {conference.duration} minutes</p>
            <p>Registered: {conference.registeredCount}</p>
            <p>Score: {conference.score}</p>

            <ReviewForm onSave={handleAddReview} />
            <ReviewList reviews={conference.reviews} />
        </div>
    );
};

export default ConferenceDetailsPage;
