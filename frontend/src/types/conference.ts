import { Keynote } from "./keynote";

export interface Conference {
    conferenceId: string;
    title: string;
    type: 'ACADEMIC' | 'COMMERCIAL';
    date: string;
    duration: number;
    registeredCount: number;
    score: number;
    keynoteId: string;
    reviews: Review[];
}

export interface Review {
    reviewId: string;
    date: string;
    text: string;
    stars: number;
    conference: Conference;
}
