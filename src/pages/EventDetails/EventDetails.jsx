import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { 
    FaArrowLeft, 
    FaCalendarAlt, 
    FaMapMarkerAlt, 
    FaUsers, 
    FaClock, 
    FaUserCheck,
    FaUserPlus 
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    // 1. Fetch event details
    const { data: event, isLoading, refetch: refetchEvent } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/events/${id}`);
            return res.data.event;
        }
    });

    // 2. Fetch club details
    const { data: club } = useQuery({
        queryKey: ['club-for-event', event?.clubId],
        queryFn: async () => {
            if (!event?.clubId) return null;
            const res = await axiosSecure.get(`/clubs/${event.clubId}`);
            return res.data;
        },
        enabled: !!event?.clubId
    });

    // 3. Check registration status
    const { 
        data: registrationStatus, 
        refetch: refetchStatus,
    } = useQuery({
        queryKey: ['registration-status', id, user?.email],
        queryFn: async () => {
            if (!user?.email) return null;
            const res = await axiosSecure.get(`/events/${id}/can-register?userEmail=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // 4. Handle Register
    const handleRegister = async () => {
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login first to register for events'
            });
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await axiosSecure.post(`/events/${id}/register`, {
                userEmail: user.email
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: res.data.message
            });

            // Refresh data
            refetchEvent();
            refetchStatus();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.message || 'Something went wrong'
            });
        } finally {
            setLoading(false);
        }
    };

    // 5. Handle Cancel Registration
    const handleCancel = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to cancel your registration?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const res = await axiosSecure.delete(`/events/${id}/cancel-registration?userEmail=${user.email}`);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Cancelled!',
                        text: res.data.message
                    });

                    // Refresh data
                    refetchEvent();
                    refetchStatus();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Cancellation Failed',
                        text: error.response?.data?.message || 'Something went wrong'
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format Time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    // Event Not Found
    if (!event) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4">Event Not Found</h2>
                <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
                <button 
                    onClick={() => navigate('/events')}
                    className="btn btn-primary"
                >
                    Browse All Events
                </button>
            </div>
        );
    }

    const isPastEvent = new Date(event.eventDate) < new Date();
    const isClubMember = registrationStatus?.isClubMember || false;
    const alreadyRegistered = registrationStatus?.alreadyRegistered || false;
    const canRegister = registrationStatus?.canRegister || false;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="btn btn-outline btn-sm mb-6"
                >
                    <FaArrowLeft /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Event Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Event Banner */}
                            <div className="relative h-64 md:h-80">
                                <img
                                    src={event.eventImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                                    {club && (
                                        <div className="flex items-center gap-2">
                                            <span>by</span>
                                            <button 
                                                onClick={() => navigate(`/club/${club._id}`)}
                                                className="font-semibold hover:underline"
                                            >
                                                {club.clubName}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Event Content */}
                            <div className="p-6">
                                <p className="text-gray-700 mb-8 leading-relaxed">
                                    {event.description}
                                </p>

                                {/* Event Info Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <FaCalendarAlt className="text-xl text-primary" />
                                        <div>
                                            <p className="font-semibold">Date</p>
                                            <p className="text-gray-600">{formatDate(event.eventDate)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <FaClock className="text-xl text-primary" />
                                        <div>
                                            <p className="font-semibold">Time</p>
                                            <p className="text-gray-600">{formatTime(event.eventDate)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <FaMapMarkerAlt className="text-xl text-primary" />
                                        <div>
                                            <p className="font-semibold">Location</p>
                                            <p className="text-gray-600">{event.location}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <FaUsers className="text-xl text-primary" />
                                        <div>
                                            <p className="font-semibold">Attending</p>
                                            <p className="text-gray-600">
                                                {event.currentAttendees || 0} people
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Registration Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-6">Registration</h2>

                            {/* Registration Status */}
                            {user ? (
                                <div className="mb-6 space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">Club Member:</span>
                                        <span className={`badge ${isClubMember ? 'badge-success' : 'badge-error'}`}>
                                            {isClubMember ? 'Yes' : 'No'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">Registered:</span>
                                        <span className={`badge ${alreadyRegistered ? 'badge-success' : 'badge-secondary'}`}>
                                            {alreadyRegistered ? 'Yes' : 'No'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">Event Status:</span>
                                        <span className={`badge ${isPastEvent ? 'badge-error' : 'badge-success'}`}>
                                            {isPastEvent ? 'Ended' : 'Upcoming'}
                                        </span>
                                    </div>
                                </div>
                            ) : null}

                            {/* Registration Buttons */}
                            <div className="mb-6">
                                {!user ? (
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="btn btn-primary w-full"
                                    >
                                        <FaUserPlus /> Login to Register
                                    </button>
                                ) : isPastEvent ? (
                                    <button 
                                        disabled 
                                        className="btn btn-disabled w-full"
                                    >
                                        Event Has Ended
                                    </button>
                                ) : alreadyRegistered ? (
                                    <button 
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="btn btn-error w-full"
                                    >
                                        {loading ? 'Cancelling...' : 'Cancel Registration'}
                                    </button>
                                ) : !isClubMember ? (
                                    <div className="text-center">
                                        <div className="alert alert-warning mb-4">
                                            <FaUserCheck className="text-lg" />
                                            <span>You must join the club first!</span>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/clubs/${event.clubId}`)}
                                            className="btn btn-warning w-full"
                                        >
                                            Join Club to Register
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handleRegister}
                                        disabled={loading || !canRegister}
                                        className="btn btn-primary w-full"
                                    >
                                        {loading ? 'Registering...' : 'Register for Event'}
                                    </button>
                                )}
                            </div>

                            {/* Registration Rules */}
                            <div className="border-t pt-4">
                                <h3 className="font-bold mb-3">Registration Rules</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Must be a club member to register</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>All events are FREE</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>One registration per member</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Can cancel anytime before event</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Club Info */}
                            {club && (
                                <div className="mt-6 border-t pt-6">
                                    <h3 className="font-bold mb-3">Host Club</h3>
                                    <div 
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
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
        </div>
    );
};

export default EventDetails;