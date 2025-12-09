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
    const { data: events = [], isLoading, refetch } = useQuery({
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
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore exciting events from all clubs. Join workshops, social gatherings, 
                    and networking sessions that match your interests.
                </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="input input-bordered w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        className="select select-bordered w-full"
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
                    <select
                        className="select select-bordered w-full"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="all">All Dates</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past Events</option>
                    </select>

                    {/* Price Filter */}
                    <select
                        className="select select-bordered w-full"
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                    >
                        <option value="all">All Prices</option>
                        <option value="free">Free Events</option>
                        <option value="paid">Paid Events</option>
                    </select>
                </div>

                {/* Results Info */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600">
                            Showing <span className="font-bold">{filteredEvents.length}</span> of{' '}
                            <span className="font-bold">{events.length}</span> events
                        </p>
                    </div>
                    <button
                        onClick={resetFilters}
                        className="btn btn-outline btn-sm"
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
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-2xl font-bold mb-2">No Events Found</h3>
                    <p className="text-gray-600 mb-6">
                        Try adjusting your search or filters to find more events.
                    </p>
                    <button
                        onClick={resetFilters}
                        className="btn btn-primary"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Events</div>
                        <div className="stat-value text-primary">{events.length}</div>
                        <div className="stat-desc">Across all clubs</div>
                    </div>
                </div>
                
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Upcoming Events</div>
                        <div className="stat-value text-secondary">
                            {events.filter(e => new Date(e.eventDate) > new Date()).length}
                        </div>
                        <div className="stat-desc">In the next 30 days</div>
                    </div>
                </div>
                
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Free Events</div>
                        <div className="stat-value text-green-600">
                            {events.filter(e => !e.isPaid).length}
                        </div>
                        <div className="stat-desc">No cost to attend</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllEventsPage;