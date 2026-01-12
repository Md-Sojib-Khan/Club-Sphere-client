import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import EventCard from '../../Components/EventCard';
import Loading from '../../Components/Loading';

const AllEventsPage = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');

    // Fetch all events
    const { data: events = [], isLoading } = useQuery({
        queryKey: ['all-events'],
        queryFn: async () => {
            // First get all clubs
            const clubsRes = await axiosSecure.get('/clubs/all?limit=100');
            const clubs = clubsRes.data;
            const clubIds = clubs.map(club => club._id);
            
            // Then get events for all clubs
            const allEvents = [];
            for (const clubId of clubIds) {
                try {
                    const eventsRes = await axiosSecure.get(`/events?clubId=${clubId}`);
                    if (eventsRes.data && eventsRes.data.length > 0) {
                        // Add club info to each event
                        const club = clubs.find(c => c._id === clubId);
                        const eventsWithClubInfo = eventsRes.data.map(event => ({
                            ...event,
                            clubName: club?.clubName || 'Unknown Club',
                            clubCategory: club?.category,
                            clubImage: club?.bannerImage
                        }));
                        allEvents.push(...eventsWithClubInfo);
                    }
                } catch (error) {
                    console.error(`Error fetching events for club ${clubId}:`, error);
                }
            }
            
            // Sort by date (upcoming first)
            return allEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        }
    });

    // Get unique categories from events
    const categories = ['all', ...new Set(events
        .map(event => event.category)
        .filter(Boolean))];

    // Filter events
    const filteredEvents = events.filter(event => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.clubName.toLowerCase().includes(searchTerm.toLowerCase());

        // Category filter
        const matchesCategory = categoryFilter === 'all' || 
            event.category === categoryFilter ||
            event.clubCategory === categoryFilter;

        // Date filter
        const eventDate = new Date(event.eventDate);
        const now = new Date();
        const matchesDate = dateFilter === 'all' ||
            (dateFilter === 'upcoming' && eventDate >= now) ||
            (dateFilter === 'past' && eventDate < now);

        // Price filter
        const matchesPrice = priceFilter === 'all' ||
            (priceFilter === 'free' && !event.isPaid) ||
            (priceFilter === 'paid' && event.isPaid);

        return matchesSearch && matchesCategory && matchesDate && matchesPrice;
    });

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('all');
        setDateFilter('all');
        setPriceFilter('all');
    };

    if (isLoading) {
        return <Loading></Loading>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                        Discover Events
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Explore exciting events from all clubs. Join workshops, social gatherings, 
                        and networking sessions that match your interests.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700/20 p-6 mb-8 transition-colors duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Search Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="input input-bordered dark:input-bordered-dark w-full pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            className="select select-bordered dark:select-bordered-dark w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.filter(cat => cat !== 'all').map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        {/* Date Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <select
                                className="select select-bordered dark:select-bordered-dark w-full pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            >
                                <option value="all">All Dates</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past Events</option>
                            </select>
                        </div>

                        {/* Price Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaFilter className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <select
                                className="select select-bordered dark:select-bordered-dark w-full pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                            >
                                <option value="all">All Prices</option>
                                <option value="free">Free Events</option>
                                <option value="paid">Paid Events</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Showing <span className="font-bold text-gray-800 dark:text-gray-200">
                                    {filteredEvents.length}
                                </span> of{' '}
                                <span className="font-bold text-gray-800 dark:text-gray-200">
                                    {events.length}
                                </span> events
                            </p>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="btn btn-outline dark:btn-outline-dark btn-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-700/20 transition-colors duration-300">
                        <div className="text-6xl mb-4 opacity-20 dark:opacity-10">📅</div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                            No Events Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your search or filters to find more events.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="btn btn-primary dark:bg-primary dark:text-white hover:bg-primary/90"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stats shadow dark:shadow-gray-700/20 bg-white dark:bg-gray-800 transition-colors duration-300">
                        <div className="stat">
                            <div className="stat-title text-gray-600 dark:text-gray-400">Total Events</div>
                            <div className="stat-value text-primary dark:text-primary/90">{events.length}</div>
                            <div className="stat-desc text-gray-500 dark:text-gray-400">Across all clubs</div>
                        </div>
                    </div>
                    
                    <div className="stats shadow dark:shadow-gray-700/20 bg-white dark:bg-gray-800 transition-colors duration-300">
                        <div className="stat">
                            <div className="stat-title text-gray-600 dark:text-gray-400">Upcoming Events</div>
                            <div className="stat-value text-secondary dark:text-secondary/90">
                                {events.filter(e => new Date(e.eventDate) > new Date()).length}
                            </div>
                            <div className="stat-desc text-gray-500 dark:text-gray-400">In the next 30 days</div>
                        </div>
                    </div>
                    
                    <div className="stats shadow dark:shadow-gray-700/20 bg-white dark:bg-gray-800 transition-colors duration-300">
                        <div className="stat">
                            <div className="stat-title text-gray-600 dark:text-gray-400">Free Events</div>
                            <div className="stat-value text-green-600 dark:text-green-500">
                                {events.filter(e => !e.isPaid).length}
                            </div>
                            <div className="stat-desc text-gray-500 dark:text-gray-400">No cost to attend</div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Summary */}
                {filteredEvents.length > 0 && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {filteredEvents.filter(e => new Date(e.eventDate) > new Date()).length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {filteredEvents.filter(e => new Date(e.eventDate) <= new Date()).length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Past</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {filteredEvents.filter(e => !e.isPaid).length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Free</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {new Set(filteredEvents.map(e => e.category)).size}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllEventsPage;