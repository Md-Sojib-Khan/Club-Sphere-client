import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaTrash, FaPlus, FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const EventsManagement = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue
    } = useForm();

    // Fetch manager's clubs
    const { data: clubs = [] } = useQuery({
        queryKey: ['managerClubs', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/clubs?managerEmail=${user?.email}&status=approved`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Fetch events for manager's clubs
    const { data: events = [], isLoading, refetch } = useQuery({
        queryKey: ['managerEvents', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/events/manager?managerEmail=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Create Event Mutation
    const createEventMutation = useMutation({
        mutationFn: async (eventData) => {
            const res = await axiosSecure.post('/events', eventData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['managerEvents']);
            Swal.fire({
                title: 'Success!',
                text: 'Event created successfully',
                icon: 'success',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            });
            handleCloseModal();
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            });
        }
    });

    // Update Event Mutation
    const updateEventMutation = useMutation({
        mutationFn: async ({ id, eventData }) => {
            const res = await axiosSecure.patch(`/events/${id}`, eventData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['managerEvents']);
            Swal.fire({
                title: 'Success!',
                text: 'Event updated successfully',
                icon: 'success',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            });
            handleCloseModal();
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            });
        }
    });

    // Delete Event Mutation
    const deleteEventMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/events/${id}`);
            return res.data;
        },
        onSuccess: () => {
            refetch()
            queryClient.invalidateQueries(['managerEvents']);
            Swal.fire({
                title: 'Deleted!',
                text: 'Event deleted successfully',
                icon: 'success',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            });
        }
    });

    // Open modal for create/edit
    const handleOpenModal = (event = null) => {
        if (event) {
            setEditingEvent(event);
            // Set form values for editing
            setValue('clubId', event.clubId);
            setValue('title', event.title);
            setValue('description', event.description);
            setValue('eventDate', event.eventDate?.split('T')[0]);
            setValue('location', event.location);
            setValue('maxAttendees', event.maxAttendees || 0);
            setValue('eventImage', event.eventImage || '');
        } else {
            setEditingEvent(null);
            reset();
        }
        setShowForm(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setShowForm(false);
        setEditingEvent(null);
        reset();
    };

    // Form submit handler
    const onSubmit = (data) => {
        const eventData = {
            ...data,
            maxAttendees: parseInt(data.maxAttendees) || 0
        };

        if (editingEvent) {
            updateEventMutation.mutate({ id: editingEvent._id, eventData });
        } else {
            createEventMutation.mutate(eventData);
        }
    };

    // Handle delete event
    const handleDeleteEvent = (id) => {
        Swal.fire({
            title: 'Delete Event?',
            text: 'Are you sure you want to delete this event?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEventMutation.mutate(id);
            }
        });
    };

    // Get club name by ID
    const getClubName = (clubId) => {
        const club = clubs.find(c => c._id === clubId);
        return club?.clubName || 'Unknown Club';
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <FaCalendarAlt className="text-2xl text-primary dark:text-primary/90" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                Events Management
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Create and manage events for your clubs
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn btn-primary btn-sm md:btn-md rounded-full px-6 bg-gradient-to-r from-primary to-secondary dark:from-primary/90 dark:to-secondary/90 hover:shadow-lg transition-all duration-300"
                        disabled={clubs.length === 0}
                    >
                        <FaPlus className="mr-2" /> Create Event
                    </button>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>

            {/* Stats Summary */}
            {clubs.length > 0 && events.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FaCalendarAlt className="text-blue-500 dark:text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">{events.length}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <FaUsers className="text-green-500 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {events.reduce((sum, event) => sum + (event.registeredAttendees?.length || 0), 0)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Attendees</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <FaMapMarkerAlt className="text-purple-500 dark:text-purple-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {new Set(events.map(e => e.clubId)).size}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Active Clubs</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* No clubs message */}
            {clubs.length === 0 && (
                <div className="alert alert-warning dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 mb-6">
                    <FaCalendarAlt />
                    <span className="dark:text-amber-400">No approved clubs found. You need an approved club to create events.</span>
                </div>
            )}

            {/* Events Table */}
            {clubs.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="loading loading-spinner loading-lg text-primary dark:text-primary/80"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <FaCalendarAlt className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                No Events Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Create your first event to get started!
                            </p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="btn btn-primary"
                            >
                                <FaPlus className="mr-2" /> Create First Event
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                {/* Table header */}
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="font-semibold text-gray-700 dark:text-gray-300">Event</th>
                                        <th className="font-semibold text-gray-700 dark:text-gray-300">Club</th>
                                        <th className="font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                                        <th className="font-semibold text-gray-700 dark:text-gray-300">Attendees</th>
                                        <th className="font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                
                                {/* Table body */}
                                <tbody>
                                    {events.map((event, index) => (
                                        <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                                            <td>
                                                <div>
                                                    <div className="font-medium text-gray-800 dark:text-white">{event.title}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                        {event.description}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <FaMapMarkerAlt className="text-xs" />
                                                        {event.location}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-gray-700 dark:text-gray-300">{getClubName(event.clubId)}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        {new Date(event.eventDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <FaUsers className="text-gray-400 dark:text-gray-500" />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        {event.registeredAttendees?.length || 0} / {event.maxAttendees || '∞'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(event)}
                                                        className="btn btn-xs btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        disabled={updateEventMutation.isLoading}
                                                        title="Edit Event"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event._id)}
                                                        className="btn btn-xs btn-error bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-800/40"
                                                        disabled={deleteEventMutation.isLoading}
                                                        title="Delete Event"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Table Footer */}
                    {events.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/20">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {events.length} events
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {events.filter(e => new Date(e.eventDate) > new Date()).length} upcoming events
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Event Form Modal */}
            {showForm && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            {editingEvent ? (
                                <>
                                    <FaEdit className="text-primary dark:text-primary/90" />
                                    Edit Event
                                </>
                            ) : (
                                <>
                                    <FaPlus className="text-primary dark:text-primary/90" />
                                    Create New Event
                                </>
                            )}
                        </h3>
                        
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-6">
                                {/* Club Selection */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Select Club *</span>
                                    </label>
                                    <select 
                                        {...register("clubId", { required: "Club is required" })}
                                        className="select select-bordered dark:select-bordered-dark w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Choose Club</option>
                                        {clubs.map(club => (
                                            <option key={club._id} value={club._id}>
                                                {club.clubName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.clubId && (
                                        <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.clubId.message}</span>
                                    )}
                                </div>
                                
                                {/* Event Title */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Event Title *</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("title", { 
                                            required: "Title is required",
                                            minLength: { value: 3, message: "Title must be at least 3 characters" }
                                        })}
                                        className="input input-bordered dark:input-bordered-dark w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="Enter event title"
                                    />
                                    {errors.title && (
                                        <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title.message}</span>
                                    )}
                                </div>
                                
                                {/* Description */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Description *</span>
                                    </label>
                                    <textarea
                                        {...register("description", { 
                                            required: "Description is required",
                                            minLength: { value: 10, message: "Description must be at least 10 characters" }
                                        })}
                                        className="textarea textarea-bordered dark:input-bordered-dark w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="Describe your event..."
                                        rows="4"
                                    />
                                    {errors.description && (
                                        <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description.message}</span>
                                    )}
                                </div>
                                
                                {/* Date and Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Event Date *</span>
                                        </label>
                                        <input
                                            type="date"
                                            {...register("eventDate", { required: "Date is required" })}
                                            className="input input-bordered dark:input-bordered-dark w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                        {errors.eventDate && (
                                            <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.eventDate.message}</span>
                                        )}
                                    </div>
                                    
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Location *</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register("location", { required: "Location is required" })}
                                            className="input input-bordered dark:input-bordered-dark w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder="Event location"
                                        />
                                        {errors.location && (
                                            <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.location.message}</span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Max Attendees and Event Image */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Max Attendees</span>
                                        </label>
                                        <input
                                            type="number"
                                            {...register("maxAttendees", { 
                                                min: { value: 1, message: "Must be at least 1" },
                                                max: { value: 1000, message: "Maximum 1000 attendees" }
                                            })}
                                            className="input input-bordered dark:input-bordered-dark w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder="Leave empty for unlimited"
                                        />
                                        {errors.maxAttendees && (
                                            <span className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.maxAttendees.message}</span>
                                        )}
                                    </div>
                                    
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Event Image URL</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register("eventImage")}
                                            placeholder="https://example.com/image.jpg"
                                            className="input input-bordered dark:input-bordered-dark w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                                
                                {/* Modal Actions */}
                                <div className="modal-action mt-8">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="btn btn-outline dark:btn-outline-dark border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        disabled={createEventMutation.isLoading || updateEventMutation.isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary dark:bg-gradient-to-r dark:from-primary/90 dark:to-secondary/90"
                                        disabled={createEventMutation.isLoading || updateEventMutation.isLoading}
                                    >
                                        {createEventMutation.isLoading || updateEventMutation.isLoading ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={handleCloseModal}></div>
                </div>
            )}
        </div>
    );
};

export default EventsManagement;