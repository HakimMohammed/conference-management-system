import React, { useState, useEffect } from 'react';
import { getReviewStats } from '../../services/analyticsService';
import { ReviewStats } from '../../types/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsPage: React.FC = () => {
    const [stats, setStats] = useState<ReviewStats[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            getReviewStats().then(setStats);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Real-time Review Analytics</h1>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={stats}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="windowEnd" tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString()} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Number of Reviews" />
                        <Bar dataKey="averageStars" fill="#82ca9d" name="Average Stars" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsPage;
