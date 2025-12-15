// MyEvents.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaCalendarAlt, 
    FaBuilding, 
    FaSpinner,
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const MyEvents = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch user's registered events
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['memberEvents', user?.email],
        queryFn: async () => {
            if (!user?.email) throw new Error('Please login');
            
            const response = await axiosSecure.get(
                `/api/member/events?userEmail=${user.email}`
            );
            return response.data;
        },
        enabled: !!user?.email
    });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        if (status === 'registered') {
            return (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center">
                    <FaCheckCircle className="mr-1" /> Registered
                </span>
            );
        }
        return (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs flex items-center">
                <FaTimesCircle className="mr-1" /> Cancelled
            </span>
        );
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
                    <p className="text-red-500">Error loading events</p>
                    <button 
                        onClick={() => refetch()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { events = [], total = 0 } = data || {};

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
                    <p className="text-gray-600">
                        Events you have registered for
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                        Total: {total} events
                    </div>
                </div>

                {/* Events Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {events.length === 0 ? (
                        <div className="p-8 text-center">
                            <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600">You haven't registered for any events yet</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Browse events and register to see them here
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b">
                                <h2 className="font-semibold text-gray-700">
                                    Registered Events ({total})
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                Event Title
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                <FaBuilding className="inline mr-1" /> Club
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                <FaCalendarAlt className="inline mr-1" /> Date
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody className="divide-y divide-gray-200">
                                        {events.map((event) => (
                                            <tr key={event.registrationId} className="hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-800">
                                                        {event.eventTitle}
                                                    </div>
                                                    {event.location && (
                                                        <div className="text-xs text-gray-500">
                                                            {event.location}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-700">
                                                    {event.clubName}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {formatDate(event.eventDate)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(event.status)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Stats */}
                {events.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-700 mb-2">Event Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-white rounded">
                                <p className="text-sm text-gray-600">Total Events</p>
                                <p className="text-xl font-bold text-blue-600">{total}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded">
                                <p className="text-sm text-gray-600">Registered</p>
                                <p className="text-xl font-bold text-green-600">
                                    {events.filter(e => e.status === 'registered').length}
                                </p>
                            </div>
                            <div className="text-center p-3 bg-white rounded">
                                <p className="text-sm text-gray-600">Upcoming</p>
                                <p className="text-xl font-bold text-purple-600">
                                    {events.filter(e => {
                                        const eventDate = new Date(e.eventDate);
                                        return eventDate >= new Date();
                                    }).length}
                                </p>
                            </div>
                            <div className="text-center p-3 bg-white rounded">
                                <p className="text-sm text-gray-600">Past</p>
                                <p className="text-xl font-bold text-gray-600">
                                    {events.filter(e => {
                                        const eventDate = new Date(e.eventDate);
                                        return eventDate < new Date();
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Refresh Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Refresh Events
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MyEvents;