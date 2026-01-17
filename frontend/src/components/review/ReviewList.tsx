import React from 'react';
import { Review } from '../../types/conference';

interface ReviewListProps {
    reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold">Reviews</h2>
            <ul className="mt-2">
                {reviews.map((review) => (
                    <li key={review.reviewId} className="p-2 border-b">
                        <p className="font-bold">{review.stars} stars</p>
                        <p>{review.text}</p>
                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewList;
