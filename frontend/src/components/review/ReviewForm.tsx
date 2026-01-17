import React, { useState } from 'react';
import { Review } from '../../types/conference';

interface ReviewFormProps {
    onSave: (review: Omit<Review, 'reviewId' | 'conference' | 'date'>) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSave }) => {
    const [review, setReview] = useState<Omit<Review, 'reviewId' | 'conference' | 'date'>>({
        text: '',
        stars: 5,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(review);
        setReview({ text: '', stars: 5 });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded">
            <h2 className="text-xl font-bold mb-2">Add a Review</h2>
            <div className="grid grid-cols-1 gap-4">
                <textarea
                    name="text"
                    value={review.text}
                    onChange={handleChange}
                    placeholder="Review text"
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="stars"
                    value={review.stars}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    className="p-2 border rounded"
                />
            </div>
            <div className="mt-4">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submit Review
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;
