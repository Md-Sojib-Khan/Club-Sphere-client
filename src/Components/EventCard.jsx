import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const EventCard = ({ event }) => {

    return (
        <motion.div
            whileHover={{ y: -10 }}
            whileTap={{ scale: 0.98 }}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
            <motion.figure 
                className="h-48 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                <img
                    src={event.eventImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
            </motion.figure>
            
            <div className="card-body p-6">
                <motion.div 
                    className="flex items-center justify-between mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="badge badge-primary">
                        {event.category || 'Event'}
                    </span>
                    {event.isPaid ? (
                        <motion.span 
                            className="badge badge-secondary"
                            whileHover={{ scale: 1.1 }}
                        >
                            ${event.eventFee}
                        </motion.span>
                    ) : (
                        <motion.span 
                            className="badge badge-success"
                            whileHover={{ scale: 1.1 }}
                        >
                            Free
                        </motion.span>
                    )}
                </motion.div>
                
                <motion.h2 
                    className="card-title text-lg font-bold mb-2 hover:text-primary transition-colors h-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link to={`/events/${event._id}`}>{event.title}</Link>
                </motion.h2>
                
                <motion.div 
                    className="space-y-2 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        <span>{event.location}</span>
                    </div>
                    {event.attendees && (
                        <div className="flex items-center gap-2">
                            <FaUsers className="text-primary" />
                            <span>{event.attendees.length} attending</span>
                        </div>
                    )}
                </motion.div>
                
                <motion.div 
                    className="card-actions justify-between items-center mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="text-sm">
                        <span className="font-medium">Host:</span> {event.hostedBy || 'Club'}
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link 
                            to={`/events/${event._id}`}
                            className="btn btn-primary btn-sm"
                        >
                            View Details
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EventCard;