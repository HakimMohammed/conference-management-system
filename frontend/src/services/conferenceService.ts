import api from './api';
import { Conference, Review } from '../types/conference';

export const getConferences = (): Promise<Conference[]> => {
    return api.get('/conferences/queries/all').then(res => res.data);
};

export const getConferenceById = (id: string): Promise<Conference> => {
    return api.get(`/conferences/queries/${id}`).then(res => res.data);
};

export const createConference = (conference: Omit<Conference, 'conferenceId' | 'reviews'>): Promise<string> => {
    return api.post('/conferences/commands/create', conference).then(res => res.data);
};

export const updateConference = (id: string, conference: Omit<Conference, 'conferenceId' | 'reviews'>): Promise<string> => {
    return api.put(`/conferences/commands/update/${id}`, conference).then(res => res.data);
};

export const deleteConference = (id: string): Promise<string> => {
    return api.delete(`/conferences/commands/delete/${id}`).then(res => res.data);
};

export const addReview = (conferenceId: string, review: Omit<Review, 'reviewId' | 'conference'>): Promise<string> => {
    return api.post(`/conferences/commands/${conferenceId}/reviews`, review).then(res => res.data);
};
