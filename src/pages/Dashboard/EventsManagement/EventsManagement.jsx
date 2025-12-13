import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
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
            Swal.fire('Success!', 'Event created successfully', 'success');
            handleCloseModal();
        },
        onError: (error) => {
            Swal.fire('Error!', error.message, 'error');
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
            Swal.fire('Success!', 'Event updated successfully', 'success');
            handleCloseModal();
        },
        onError: (error) => {
            Swal.fire('Error!', error.message, 'error');
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
            Swal.fire('Deleted!', 'Event deleted successfully', 'success');
        },
        onError: (error) => {
            Swal.fire('Error!', error.message, 'error');
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
            confirmButtonText: 'Yes, delete it!'
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
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Events Management</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary btn-sm"
                    disabled={clubs.length === 0}
                >
                    <FaPlus /> Create Event
                </button>
            </div>

            {/* No clubs message */}
            {clubs.length === 0 && (
                <div className="alert alert-warning">
                    No approved clubs found. You need an approved club to create events.
                </div>
            )}

            {/* Events Table */}
            {clubs.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="table w-full">
                        {/* Table header */}
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="font-semibold">#</th>
                                <th className="font-semibold">Event Title</th>
                                <th className="font-semibold">Club</th>
                                <th className="font-semibold">Date</th>
                                <th className="font-semibold">Location</th>
                                <th className="font-semibold">Actions</th>
                            </tr>
                        </thead>
                        
                        {/* Table body */}
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <div className="loading loading-spinner loading-md"></div>
                                    </td>
                                </tr>
                            ) : events.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No events found. Create your first event!
                                    </td>
                                </tr>
                            ) : (
                                events.map((event, index) => (
                                    <tr key={event._id} className="hover:bg-gray-50">
                                        <td className="font-medium">{index + 1}</td>
                                        <td>
                                            <div>
                                                <div className="font-medium">{event.title}</div>
                                                <div className="text-sm text-gray-500 line-clamp-1">
                                                    {event.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{getClubName(event.clubId)}</td>
                                        <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                                        <td>{event.location}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(event)}
                                                    className="btn btn-xs btn-outline"
                                                    disabled={updateEventMutation.isLoading}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event._id)}
                                                    className="btn btn-xs btn-error"
                                                    disabled={deleteEventMutation.isLoading}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Event Form Modal */}
            {showForm && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold mb-4">
                            {editingEvent ? 'Edit Event' : 'Create Event'}
                        </h3>
                        
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                {/* Club Selection */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Select Club *</span>
                                    </label>
                                    <select 
                                        {...register("clubId", { required: "Club is required" })}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Choose Club</option>
                                        {clubs.map(club => (
                                            <option key={club._id} value={club._id}>
                                                {club.clubName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.clubId && (
                                        <span className="text-red-500 text-sm">{errors.clubId.message}</span>
                                    )}
                                </div>
                                
                                {/* Event Title */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Event Title *</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("title", { 
                                            required: "Title is required",
                                            minLength: { value: 3, message: "Title must be at least 3 characters" }
                                        })}
                                        className="input input-bordered w-full"
                                        placeholder="Event title"
                                    />
                                    {errors.title && (
                                        <span className="text-red-500 text-sm">{errors.title.message}</span>
                                    )}
                                </div>
                                
                                {/* Description */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Description *</span>
                                    </label>
                                    <textarea
                                        {...register("description", { 
                                            required: "Description is required",
                                            minLength: { value: 10, message: "Description must be at least 10 characters" }
                                        })}
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Event description"
                                        rows="3"
                                    />
                                    {errors.description && (
                                        <span className="text-red-500 text-sm">{errors.description.message}</span>
                                    )}
                                </div>
                                
                                {/* Date and Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Event Date *</span>
                                        </label>
                                        <input
                                            type="date"
                                            {...register("eventDate", { required: "Date is required" })}
                                            className="input input-bordered w-full"
                                        />
                                        {errors.eventDate && (
                                            <span className="text-red-500 text-sm">{errors.eventDate.message}</span>
                                        )}
                                    </div>
                                    
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Location *</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register("location", { required: "Location is required" })}
                                            className="input input-bordered w-full"
                                            placeholder="Event location"
                                        />
                                        {errors.location && (
                                            <span className="text-red-500 text-sm">{errors.location.message}</span>
                                        )}
                                    </div>
                                </div>
                                
                                {/*Event Image URL*/}
                                <div className="form-control">
                                    <label className="label">
                                    <span className="label-text font-semibold">Event Image URL</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("eventImage")}
                                    placeholder='https://example.com/image.jpg'
                                    className="input input-bordered w-full"
                                />
                                    {/* {errors.maxAttendees && (
                                        <span className="text-red-500 text-sm">{errors.maxAttendees.message}</span>
                                    )} */}
                                </div>
                                
                                {/* Modal Actions */}
                                <div className="modal-action mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="btn btn-outline btn-sm"
                                        disabled={createEventMutation.isLoading || updateEventMutation.isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
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
                </div>
            )}
        </div>
    );
};

export default EventsManagement;