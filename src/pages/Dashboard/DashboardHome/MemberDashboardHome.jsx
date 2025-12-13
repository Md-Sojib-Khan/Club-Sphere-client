// MemberDashboardHome.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaUsers, 
    FaCalendarAlt, 
    FaSpinner,
    FaBuilding
} from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Link } from 'react-router';

const MemberDashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch member dashboard data
    const { data, isLoading, error } = useQuery({
        queryKey: ['memberDashboard', user?.email],
        queryFn: async () => {
            if (!user?.email) throw new Error('Please login');
            
            const response = await axiosSecure.get(
                `/api/member/dashboard?userEmail=${user.email}`
            );
            return response.data;
        },
        enabled: !!user?.email
    });
        console.log( data)

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500">Error loading dashboard</p>
                </div>
            </div>
        );
    }

    const { stats = {}, upcomingEvents = [] } = data || {};


    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user?.displayName || 'Member'}!
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening with your clubs and events
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                                <FaBuilding className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Clubs Joined</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {stats.totalClubs || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
                                <FaCalendarAlt className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Events Registered</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.totalEvents || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold text-gray-700">
                            Upcoming Events
                        </h2>
                        <Link 
                            to="/events" 
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            View All
                        </Link>
                    </div>
                    
                    {upcomingEvents.length === 0 ? (
                        <div className="p-8 text-center">
                            <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600">No upcoming events</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Check out events from your clubs
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {upcomingEvents.map((event) => (
                                <div key={event._id} className="p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-800">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {event.clubName} • {event.location}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-blue-600">
                                                {formatDate(event.eventDate)}
                                            </div>
                                            <Link 
                                                to={`/events/${event._id}`}
                                                className="text-xs text-blue-500 hover:text-blue-700"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberDashboardHome;