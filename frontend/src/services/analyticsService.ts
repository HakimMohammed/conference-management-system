import api from './api';
import { ReviewStats } from '../types/analytics';

export const getReviewStats = (): Promise<ReviewStats[]> => {
    return api.get('/analytics/reviews/window').then(res => res.data);
};
