// MemberDashboardHome.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaUsers, 
    FaCalendarAlt, 
    FaSpinner,
    FaBuilding,
    FaArrowRight,
    FaRegCalendarCheck,
    FaUserFriends
} from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Link } from 'react-router';

const MemberDashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch member dashboard data
    const { data, isLoading, error, refetch } = useQuery({
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

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format relative time
    const getRelativeTime = (dateString) => {
        const now = new Date();
        const eventDate = new Date(dateString);
        const diffTime = eventDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Past event';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `${diffDays} days`;
        return `${Math.floor(diffDays / 7)} weeks`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <p className="text-red-500 dark:text-red-400 mb-4">Error loading dashboard data</p>
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

    const { stats = {}, upcomingEvents = [], recentActivity = [], clubs = [] } = data || {};

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <FaUserFriends className="text-2xl text-primary dark:text-primary/90" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                Welcome back, <span className="text-primary dark:text-primary/90">{user?.displayName || 'Member'}</span>!
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Here's what's happening with your clubs and events
                            </p>
                        </div>
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Clubs Joined</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                    {stats.totalClubs || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <FaBuilding className="text-2xl text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Active in {stats.activeClubs || 0} clubs
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Events Registered</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {stats.totalEvents || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <FaRegCalendarCheck className="text-2xl text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            {stats.upcomingEvents || 0} upcoming events
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Memberships</p>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                                    {stats.totalMemberships || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <FaUsers className="text-2xl text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Across all your clubs
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Upcoming Events */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                        <FaCalendarAlt className="text-primary dark:text-primary/90" />
                                        Upcoming Events
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Events you're registered for
                                    </p>
                                </div>
                                <Link 
                                    to="/all-events" 
                                    className="text-sm text-primary dark:text-primary/90 hover:text-primary/80 dark:hover:text-primary/70 font-medium flex items-center gap-1"
                                >
                                    View All
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                            
                            {upcomingEvents.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <FaCalendarAlt className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                        No Upcoming Events
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        You haven't registered for any events yet
                                    </p>
                                    <Link 
                                        to="/all-events"
                                        className="btn btn-primary dark:bg-primary dark:text-white btn-sm"
                                    >
                                        Browse Events
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {upcomingEvents.map((event) => (
                                        <div key={event._id} className="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                                                        {event.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                                                            {event.clubName}
                                                        </span>
                                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded flex items-center gap-1">
                                                            <FaCalendarAlt className="text-xs" />
                                                            {formatDate(event.eventDate)}
                                                        </span>
                                                        <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
                                                            {getRelativeTime(event.eventDate)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                </div>
                                                <Link 
                                                    to={`/events/${event._id}`}
                                                    className="btn btn-outline dark:btn-outline-dark btn-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity & My Clubs */}
                    <div className="space-y-6 md:space-y-8">
                        {/* My Clubs */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                    <FaBuilding className="text-primary dark:text-primary/90" />
                                    My Clubs
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Clubs you've joined
                                </p>
                            </div>
                            
                            {clubs.length === 0 ? (
                                <div className="text-center py-8 px-4">
                                    <FaBuilding className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-600 dark:text-gray-400">You haven't joined any clubs yet</p>
                                </div>
                            ) : (
                                <div className="max-h-64 overflow-y-auto">
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {clubs.slice(0, 5).map((club) => (
                                            <div key={club._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-800 dark:text-white">
                                                            {club.clubName}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {club.category}
                                                        </p>
                                                    </div>
                                                    <Link 
                                                        to={`/clubs/${club._id}`}
                                                        className="text-primary dark:text-primary/90 text-xs font-medium hover:underline"
                                                    >
                                                        Visit
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {clubs.length > 0 && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <Link 
                                        to="/all-clubs"
                                        className="text-sm text-primary dark:text-primary/90 hover:text-primary/80 dark:hover:text-primary/70 font-medium w-full text-center block"
                                    >
                                        Browse All Clubs
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl p-6 border border-primary/20 dark:border-primary/30">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link 
                                    to="/all-clubs"
                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-300"
                                >
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Discover New Clubs</span>
                                    <FaArrowRight className="text-gray-400 dark:text-gray-500" />
                                </Link>
                                <Link 
                                    to="/all-events"
                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-300"
                                >
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Find Events</span>
                                    <FaArrowRight className="text-gray-400 dark:text-gray-500" />
                                </Link>
                                <Link 
                                    to="/my-profile"
                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-300"
                                >
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Edit Profile</span>
                                    <FaArrowRight className="text-gray-400 dark:text-gray-500" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                {recentActivity && recentActivity.length > 0 && (
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                                    <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                                        <FaCalendarAlt className="text-primary dark:text-primary/90" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{activity.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {formatDate(activity.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberDashboardHome;