import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, useAnimation } from 'framer-motion';
import { FaCalendar, FaArrowRight, FaSpinner } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import EventCard from '../../Components/EventCard';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const eventsPerPage = 6;
    const axiosSecure = useAxiosSecure();
    
    // Framer Motion controls
    const heroControls = useAnimation();
    const eventsControls = useAnimation();

    useEffect(() => {
        fetchEvents();
        heroControls.start('visible');
        eventsControls.start('visible');
    }, [currentPage]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Use your existing '/events/all' API
            const response = await axiosSecure.get(`/events/all?limit=${eventsPerPage * currentPage}`);
            
            if (response.data.success) {
                // Filter for upcoming events (events with future dates)
                const now = new Date();
                const upcoming = response.data.events.filter(event => {
                    const eventDate = new Date(event.eventDate);
                    return eventDate > now;
                });
                
                // Sort by date (closest first)
                upcoming.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
                
                // Take only events for current page
                const startIndex = 0;
                const endIndex = currentPage * eventsPerPage;
                const paginatedEvents = upcoming.slice(startIndex, endIndex);
                
                setEvents(paginatedEvents);
                setTotalEvents(upcoming.length);
            } else {
                setError('Failed to fetch events');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        setCurrentPage(prev => prev + 1);
    };

    const hasMoreEvents = events.length < totalEvents;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    const cardVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: 'spring', damping: 15 }
        }
    };

    const heroVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
            {/* Hero Section */}
            <motion.section
                initial="hidden"
                animate={heroControls}
                variants={heroVariants}
                className="hero bg-gradient-to-r from-primary/10 to-secondary/10 py-16"
            >
                <div className="hero-content text-center">
                    <div className="max-w-3xl">
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-bold mb-6"
                        >
                            Upcoming <span className="text-primary">Events</span>
                        </motion.h1>
                        
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl mb-8 text-gray-600"
                        >
                            Discover exciting events happening soon. 
                            Don't miss out on these amazing opportunities!
                        </motion.p>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link to="/events" className="btn btn-primary btn-lg">
                                Browse All Events <FaArrowRight className="ml-2" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Events Section */}
            <section className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={eventsControls}
                    variants={itemVariants}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <FaCalendar className="text-3xl text-primary" />
                        <h2 className="text-4xl font-bold">
                            Upcoming Events
                        </h2>
                    </div>
                    
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        Check out these upcoming events and register now to secure your spot
                    </p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="alert alert-error max-w-2xl mx-auto mb-8"
                    >
                        <div className="flex-1">
                            <label>{error}</label>
                        </div>
                        <button onClick={fetchEvents} className="btn btn-sm">Retry</button>
                    </motion.div>
                )}

                {/* Events Grid */}
                {loading && events.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center py-20"
                    >
                        <FaSpinner className="animate-spin text-4xl text-primary" />
                    </motion.div>
                ) : events.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-gray-400 text-6xl mb-4">📅</div>
                        <h3 className="text-2xl font-semibold mb-2">No Upcoming Events</h3>
                        <p className="text-gray-500 mb-6">
                            There are no upcoming events at the moment. Check back later!
                        </p>
                        <Link to="/events" className="btn btn-primary">
                            Browse All Events
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {events.map((event, index) => (
                                <motion.div
                                    key={event._id || index}
                                    variants={cardVariants}
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <EventCard event={event} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Load More Button */}
                        {hasMoreEvents && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mt-12"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="btn btn-outline btn-primary btn-lg"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More Events'
                                    )}
                                </motion.button>
                                <p className="text-gray-500 mt-2">
                                    Showing {events.length} of {totalEvents} upcoming events
                                </p>
                            </motion.div>
                        )}

                        {/* No More Events Message */}
                        {!hasMoreEvents && events.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center mt-12"
                            >
                                <p className="text-gray-500">
                                    You've seen all {totalEvents} upcoming events!
                                </p>
                            </motion.div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default UpcomingEvents;