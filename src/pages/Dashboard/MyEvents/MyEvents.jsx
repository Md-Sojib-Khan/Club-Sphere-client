// MyEvents.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaCalendarAlt, 
    FaBuilding, 
    FaSpinner,
    FaCheckCircle,
    FaTimesCircle,
    FaArrowRight,
    FaRegCalendarCheck,
    FaCalendarDay,
    FaHistory,
    FaMapMarkerAlt,
    FaClock
} from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import { Link } from 'react-router';

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
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get relative time
    const getRelativeTime = (dateString) => {
        if (!dateString) return 'N/A';
        const eventDate = new Date(dateString);
        const now = new Date();
        const diffTime = eventDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Past event';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `${diffDays} days`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
        return `${Math.floor(diffDays / 30)} months`;
    };

    // Get status badge
    const getStatusBadge = (status, eventDate) => {
        const isPast = new Date(eventDate) < new Date();
        
        if (isPast) {
            return (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium flex items-center w-fit">
                    <FaHistory className="mr-2" /> Completed
                </span>
            );
        }
        
        if (status === 'registered') {
            return (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium flex items-center w-fit">
                    <FaCheckCircle className="mr-2" /> Registered
                </span>
            );
        }
        
        return (
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium flex items-center w-fit">
                <FaTimesCircle className="mr-2" /> Cancelled
            </span>
        );
    };

    // Filter events by status
    const filterEvents = (status) => {
        if (!data?.events) return [];
        
        const now = new Date();
        return data.events.filter(event => {
            const eventDate = new Date(event.eventDate);
            if (status === 'upcoming') return eventDate >= now && event.status === 'registered';
            if (status === 'past') return eventDate < now && event.status === 'registered';
            if (status === 'cancelled') return event.status === 'cancelled';
            return true;
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <p className="text-red-500 dark:text-red-400 mb-4">Error loading events</p>
                    <button 
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { events = [], total = 0 } = data || {};
    const upcomingEvents = filterEvents('upcoming');
    const pastEvents = filterEvents('past');
    const cancelledEvents = filterEvents('cancelled');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <FaRegCalendarCheck className="text-2xl text-primary dark:text-primary/90" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                My Events
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Events you have registered for
                            </p>
                        </div>
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                    {total}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <FaCalendarAlt className="text-2xl text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            All registered events
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {upcomingEvents.length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <FaCalendarDay className="text-2xl text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Future events
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                                    {pastEvents.length}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <FaHistory className="text-2xl text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Past events attended
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                                    {cancelledEvents.length}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                <FaTimesCircle className="text-2xl text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Cancelled registrations
                        </div>
                    </div>
                </div>

                {/* Events Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 mb-6 border border-gray-100 dark:border-gray-700">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <div className="flex overflow-x-auto">
                            <button className="px-6 py-4 text-sm font-medium text-primary dark:text-primary/90 border-b-2 border-primary dark:border-primary/90 whitespace-nowrap">
                                All Events ({total})
                            </button>
                        </div>
                    </div>

                    {/* Events List */}
                    {events.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <FaCalendarAlt className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                No Events Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You haven't registered for any events yet
                            </p>
                            <Link 
                                to="/all-events"
                                className="btn btn-primary dark:bg-primary dark:text-white"
                            >
                                Browse Events
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {events.map((event) => (
                                <div key={event.registrationId} className="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                                                <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-2 md:mb-0">
                                                    {event.eventTitle}
                                                </h3>
                                                {getStatusBadge(event.status, event.eventDate)}
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-1">
                                                    <FaBuilding className="text-xs" />
                                                    {event.clubName}
                                                </span>
                                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full flex items-center gap-1">
                                                    <FaCalendarAlt className="text-xs" />
                                                    {formatDate(event.eventDate)}
                                                </span>
                                                {event.location && (
                                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full flex items-center gap-1">
                                                        <FaMapMarkerAlt className="text-xs" />
                                                        {event.location}
                                                    </span>
                                                )}
                                                <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full flex items-center gap-1">
                                                    <FaClock className="text-xs" />
                                                    {getRelativeTime(event.eventDate)}
                                                </span>
                                            </div>
                                            
                                            {event.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <Link 
                                                to={`/events/${event.eventId}`}
                                                className="btn btn-outline dark:btn-outline-dark btn-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
                                            >
                                                View Details
                                                <FaArrowRight className="ml-2" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Events Summary */}
                {events.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Upcoming Events Summary */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <FaCalendarDay className="text-blue-500 dark:text-blue-400" />
                                Upcoming Events
                            </h3>
                            {upcomingEvents.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-400 text-sm">No upcoming events</p>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingEvents.slice(0, 3).map(event => (
                                        <div key={event.registrationId} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                    {event.eventTitle}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(event.eventDate)}
                                                </p>
                                            </div>
                                            <FaArrowRight className="text-gray-400 dark:text-gray-500 text-sm" />
                                        </div>
                                    ))}
                                    {upcomingEvents.length > 3 && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                            + {upcomingEvents.length - 3} more events
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Recent Past Events */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <FaHistory className="text-purple-500 dark:text-purple-400" />
                                Recent Activities
                            </h3>
                            {pastEvents.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-400 text-sm">No past events</p>
                            ) : (
                                <div className="space-y-3">
                                    {pastEvents.slice(0, 3).map(event => (
                                        <div key={event.registrationId} className="p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                {event.eventTitle}
                                            </p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(event.eventDate)}
                                                </p>
                                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                                    Attended
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link 
                                    to="/all-events"
                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-all duration-300"
                                >
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Find More Events</span>
                                    <FaArrowRight className="text-gray-400 dark:text-gray-500" />
                                </Link>
                                <Link 
                                    to="/all-clubs"
                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-all duration-300"
                                >
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Join New Clubs</span>
                                    <FaArrowRight className="text-gray-400 dark:text-gray-500" />
                                </Link>
                                <button 
                                    onClick={() => refetch()}
                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-all duration-300 w-full"
                                >
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Refresh Events</span>
                                    <FaSpinner className="text-gray-400 dark:text-gray-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Events Calendar View (Placeholder) */}
                {events.length > 0 && (
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Event Calendar</h3>
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                            <FaCalendarAlt className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400">Calendar view coming soon!</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                View your events in a calendar format
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;