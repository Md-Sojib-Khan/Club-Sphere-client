import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaEnvelope, FaCalendarAlt, FaSpinner, FaFilter, FaEye, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const ManagerEventRegistrations = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    // State for filters
    const [selectedClub, setSelectedClub] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [expandedEvent, setExpandedEvent] = useState(null);

    // Fetch ALL registrations for manager's clubs
    const { 
        data: dashboardData, 
        isLoading, 
        isError, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['managerEventRegistrations', user?.email],
        queryFn: async () => {
            if (!user?.email) throw new Error('Please login');
            
            const response = await axiosSecure.get(
                `/api/manager/events/registrations?managerEmail=${user.email}`
            );
            return response.data;
        },
        enabled: !!user?.email,
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to load data');
        }
    });

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get unique clubs and events for filter dropdowns
    const getUniqueClubs = () => {
        if (!dashboardData?.registrations) return [];
        const clubs = dashboardData.registrations.map(r => ({
            id: r.clubId,
            name: r.clubName
        }));
        return [...new Map(clubs.map(c => [c.id, c])).values()];
    };

    const getUniqueEvents = () => {
        if (!dashboardData?.registrations) return [];
        const events = dashboardData.registrations.map(r => ({
            id: r.eventId,
            title: r.eventTitle,
            clubId: r.clubId
        }));
        return [...new Map(events.map(e => [e.id, e])).values()];
    };

    // Apply filters
    const filteredRegistrations = dashboardData?.registrations?.filter(reg => {
        const clubMatch = selectedClub === 'all' || reg.clubId === selectedClub;
        const eventMatch = selectedEvent === 'all' || reg.eventId === selectedEvent;
        const statusMatch = selectedStatus === 'all' || reg.status === selectedStatus;
        return clubMatch && eventMatch && statusMatch;
    }) || [];

    // Group registrations by event for better view
    const groupByEvent = () => {
        const groups = {};
        filteredRegistrations.forEach(reg => {
            if (!groups[reg.eventId]) {
                groups[reg.eventId] = {
                    eventTitle: reg.eventTitle,
                    clubName: reg.clubName,
                    eventDate: reg.eventDate,
                    registrations: []
                };
            }
            groups[reg.eventId].registrations.push(reg);
        });
        return groups;
    };

    const eventGroups = groupByEvent();

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
                    <p className="text-lg">Loading all event registrations...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-error max-w-md">
                    <div>
                        <span>Error: {error.message}</span>
                    </div>
                    <button 
                        className="btn btn-sm btn-outline mt-2" 
                        onClick={() => refetch()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { summary, registrations = [] } = dashboardData || {};

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <ToastContainer />
            
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <h1 className="card-title text-2xl md:text-3xl">
                            <FaUsers className="mr-2" />
                            All Event Registrations
                        </h1>
                        <p className="text-gray-600">
                            View all registrations for all events in clubs you manage
                        </p>
                        
                        {/* Summary Stats */}
                        {summary && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                <div className="stat bg-primary text-primary-content bg-opacity-20">
                                    <div className="stat-title">Clubs Managed</div>
                                    <div className="stat-value">{summary.totalClubs}</div>
                                </div>
                                <div className="stat bg-secondary text-secondary-content bg-opacity-20">
                                    <div className="stat-title">Total Events</div>
                                    <div className="stat-value">{summary.totalEvents}</div>
                                </div>
                                <div className="stat bg-accent text-accent-content bg-opacity-20">
                                    <div className="stat-title">All Registrations</div>
                                    <div className="stat-value">{summary.totalRegistrations}</div>
                                </div>
                                <div className="stat bg-success text-success-content bg-opacity-20">
                                    <div className="stat-title">Active</div>
                                    <div className="stat-value">{summary.activeRegistrations}</div>
                                </div>
                                <div className="stat bg-error text-error-content bg-opacity-20">
                                    <div className="stat-title">Cancelled</div>
                                    <div className="stat-value">{summary.cancelledRegistrations}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <h2 className="card-title text-xl mb-4">
                            <FaFilter className="mr-2" />
                            Filter Registrations
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Club Filter */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter by Club</span>
                                </label>
                                <select 
                                    className="select select-bordered"
                                    value={selectedClub}
                                    onChange={(e) => setSelectedClub(e.target.value)}
                                >
                                    <option value="all">All Clubs</option>
                                    {getUniqueClubs().map(club => (
                                        <option key={club.id} value={club.id}>
                                            {club.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Event Filter */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter by Event</span>
                                </label>
                                <select 
                                    className="select select-bordered"
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    disabled={getUniqueEvents().length === 0}
                                >
                                    <option value="all">All Events</option>
                                    {getUniqueEvents()
                                        .filter(event => 
                                            selectedClub === 'all' || event.clubId === selectedClub
                                        )
                                        .map(event => (
                                            <option key={event.id} value={event.id}>
                                                {event.title}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            
                            {/* Status Filter */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Filter by Status</span>
                                </label>
                                <select 
                                    className="select select-bordered"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="registered">Registered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-500">
                            Showing {filteredRegistrations.length} of {registrations.length} total registrations
                        </div>
                    </div>
                </div>

                {/* Registrations List - Grouped by Event */}
                <div className="space-y-4">
                    {Object.keys(eventGroups).length === 0 ? (
                        <div className="alert alert-info">
                            <FaEye className="text-xl" />
                            <span>No registrations found matching your filters.</span>
                        </div>
                    ) : (
                        Object.entries(eventGroups).map(([eventId, eventData]) => (
                            <div key={eventId} className="card bg-base-100 shadow-xl">
                                <div 
                                    className="card-body cursor-pointer hover:bg-base-200 transition-colors"
                                    onClick={() => setExpandedEvent(
                                        expandedEvent === eventId ? null : eventId
                                    )}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="card-title text-lg">
                                                {eventData.eventTitle}
                                            </h3>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <span className="font-semibold">{eventData.clubName}</span> • 
                                                <FaCalendarAlt className="inline ml-2 mr-1" />
                                                {formatDate(eventData.eventDate)} • 
                                                <span className="ml-2">
                                                    {eventData.registrations.length} registration(s)
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            {expandedEvent === eventId ? (
                                                <FaChevronUp />
                                            ) : (
                                                <FaChevronDown />
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Expanded View - Registration Details */}
                                    {expandedEvent === eventId && (
                                        <div className="mt-4 pt-4 border-t">
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra w-full">
                                                    <thead>
                                                        <tr className="bg-base-300">
                                                            <th>#</th>
                                                            <th>
                                                                <FaEnvelope className="inline mr-2" />
                                                                User Email
                                                            </th>
                                                            <th>Status</th>
                                                            <th>
                                                                <FaCalendarAlt className="inline mr-2" />
                                                                Registered At
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {eventData.registrations.map((reg, idx) => (
                                                            <tr key={reg.registrationId} className="hover:bg-base-200">
                                                                <th>{idx + 1}</th>
                                                                <td className="font-medium">
                                                                    {reg.userEmail}
                                                                </td>
                                                                <td>
                                                                    <span className={`badge ${
                                                                        reg.status === 'registered' 
                                                                            ? 'badge-success' 
                                                                            : 'badge-error'
                                                                    }`}>
                                                                        {reg.status}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {formatDate(reg.registeredAt)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerEventRegistrations;