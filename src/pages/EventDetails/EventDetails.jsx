import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaDollarSign } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';


const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    // Fetch event details
    const { data: event, isLoading } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/events/${id}`);
            return res.data;
        }
    });

    // Fetch club details for this event
    const { data: club } = useQuery({
        queryKey: ['club-for-event', event?.clubId],
        queryFn: async () => {
            if (!event?.clubId) return null;
            const res = await axiosSecure.get(`/clubs/${event.clubId}`);
            return res.data;
        },
        enabled: !!event?.clubId
    });

    // Handle RSVP
    const handleRSVP = async () => {
        if (!user) {
            Swal.fire('Login Required', 'Please login to RSVP', 'warning');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            // Add your RSVP logic here
            await axiosSecure.patch(`/events/${id}/rsvp`, {
                userEmail: user.email
            });
            
            Swal.fire('Success!', 'You have RSVPed for this event!', 'success');
            // Refetch event to update attendee count
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
                <button onClick={() => navigate('/events')} className="btn btn-primary">
                    Back to Events
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button 
                onClick={() => navigate(-1)}
                className="btn btn-outline mb-6"
            >
                <FaArrowLeft /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Event Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="relative h-96">
                            <img
                                src={event.eventImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="badge badge-primary text-lg px-4 py-2">
                                    {event.category || 'Event'}
                                </span>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                                    {club && (
                                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                                            <span>Hosted by</span>
                                            <button 
                                                onClick={() => navigate(`/club/${club._id}`)}
                                                className="font-semibold text-primary hover:underline"
                                            >
                                                {club.clubName}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${event.isPaid ? 'text-secondary' : 'text-green-600'}`}>
                                        {event.isPaid ? `$${event.eventFee}` : 'FREE'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {event.isPaid ? 'Paid Event' : 'Free Entry'}
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none mb-8">
                                <p className="text-gray-700 leading-relaxed">{event.description}</p>
                            </div>

                            {/* Event Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <FaCalendarAlt className="text-2xl text-primary" />
                                    <div>
                                        <p className="font-semibold">Date</p>
                                        <p className="text-gray-600">{formatDate(event.eventDate)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <FaClock className="text-2xl text-primary" />
                                    <div>
                                        <p className="font-semibold">Time</p>
                                        <p className="text-gray-600">{formatTime(event.eventDate)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <FaMapMarkerAlt className="text-2xl text-primary" />
                                    <div>
                                        <p className="font-semibold">Location</p>
                                        <p className="text-gray-600">{event.location}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <FaUsers className="text-2xl text-primary" />
                                    <div>
                                        <p className="font-semibold">Attendees</p>
                                        <p className="text-gray-600">
                                            {event.attendees?.length || 0} people attending
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Action Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                        <h2 className="text-xl font-bold mb-4">Event Details</h2>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className={`badge ${new Date(event.eventDate) > new Date() ? 'badge-success' : 'badge-error'}`}>
                                    {new Date(event.eventDate) > new Date() ? 'Upcoming' : 'Past Event'}
                                </span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Type</span>
                                <span className="font-medium">{event.eventType || 'Social'}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Capacity</span>
                                <span className="font-medium">
                                    {event.maxAttendees ? `${event.currentAttendees || 0}/${event.maxAttendees}` : 'Unlimited'}
                                </span>
                            </div>
                        </div>

                        {/* RSVP Button */}
                        <button
                            onClick={handleRSVP}
                            disabled={loading || new Date(event.eventDate) < new Date()}
                            className={`btn w-full mb-4 ${
                                new Date(event.eventDate) < new Date() 
                                    ? 'btn-disabled' 
                                    : event.isPaid ? 'btn-secondary' : 'btn-primary'
                            }`}
                        >
                            {loading ? 'Processing...' : 
                             new Date(event.eventDate) < new Date() ? 'Event Ended' :
                             event.isPaid ? `Pay $${event.eventFee} to Join` : 'RSVP for Free'}
                        </button>

                        {/* Additional Info */}
                        {event.additionalInfo && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-bold mb-2">Additional Information</h3>
                                <p className="text-sm text-gray-700">{event.additionalInfo}</p>
                            </div>
                        )}

                        {/* Club Info */}
                        {club && (
                            <div className="mt-6 border-t pt-6">
                                <h3 className="font-bold mb-3">Hosted By</h3>
                                <div 
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => navigate(`/club/${club._id}`)}
                                >
                                    <img
                                        src={club.bannerImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'}
                                        alt={club.clubName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{club.clubName}</h4>
                                        <p className="text-sm text-gray-600">{club.category}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;