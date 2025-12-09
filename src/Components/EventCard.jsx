import React from 'react';
import { Link } from 'react-router';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';

const EventCard = ({ event }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <figure className="h-48 overflow-hidden">
                <img
                    src={event.eventImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </figure>
            <div className="card-body p-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-primary">
                        {event.category || 'Event'}
                    </span>
                    {event.isPaid ? (
                        <span className="badge badge-secondary">${event.eventFee}</span>
                    ) : (
                        <span className="badge badge-success">Free</span>
                    )}
                </div>
                
                <h2 className="card-title text-xl font-bold mb-2 hover:text-primary transition-colors">
                    <Link to={`/events/${event._id}`}>{event.title}</Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        <span>{formatDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock className="text-primary" />
                        <span>{formatTime(event.eventDate)}</span>
                    </div>
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
                </div>
                
                <div className="card-actions justify-between items-center mt-4">
                    <div className="text-sm">
                        <span className="font-medium">Host:</span> {event.hostedBy || 'Club'}
                    </div>
                    <Link 
                        to={`/events/${event._id}`}
                        className="btn btn-primary btn-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;