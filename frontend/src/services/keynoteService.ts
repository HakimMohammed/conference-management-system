import api from './api';
import { Keynote } from '../types/keynote';

export const getKeynotes = (): Promise<Keynote[]> => {
    return api.get('/keynotes/queries/all').then(res => res.data);
};

export const createKeynote = (keynote: Omit<Keynote, 'keynoteId'>): Promise<string> => {
    return api.post('/keynotes/commands/create', keynote).then(res => res.data);
};

export const updateKeynote = (id: string, keynote: Omit<Keynote, 'keynoteId'>): Promise<string> => {
    return api.put(`/keynotes/commands/update/${id}`, keynote).then(res => res.data);
};

export const deleteKeynote = (id: string): Promise<string> => {
    return api.delete(`/keynotes/commands/delete/${id}`).then(res => res.data);
};
