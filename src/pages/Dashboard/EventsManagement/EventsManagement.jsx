import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const EventsManagement = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // Fetch manager's clubs
    const { data: clubs = [] , refetch } = useQuery({
        queryKey: ['managerClubs', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/clubs?managerEmail=${user?.email}&status=approved`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Fetch events for manager's clubs
    const { data: events = [], isLoading } = useQuery({
        queryKey: ['managerEvents', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/events/manager?managerEmail=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Create Event
    const createEvent = async (eventData) => {
        try {
            const res = await axiosSecure.post('/events', eventData);
            if (res.data.insertedId) {
                queryClient.invalidateQueries(['managerEvents']);
                Swal.fire('Success!', 'Event created', 'success');
                setShowForm(false);
            }
        } catch (error) {
            Swal.fire('Error!', error.message, 'error');
        }
    };

    // Update Event
    const updateEvent = async (id, eventData) => {
        try {
            const res = await axiosSecure.patch(`/events/${id}`, eventData);
            if (res.data.modifiedCount) {
                queryClient.invalidateQueries(['managerEvents']);
                Swal.fire('Success!', 'Event updated', 'success');
                setShowForm(false);
                setEditingEvent(null);
            }
        } catch (error) {
            Swal.fire('Error!', error.message, 'error');
        }
    };

    // Delete Event
    const deleteEvent = async (id) => {
        Swal.fire({
            title: 'Delete?',
            text: 'Delete this event?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/events/${id}`);
                    if (res.data.deletedCount) {
                        refetch()
                        queryClient.invalidateQueries(['managerEvents']);
                        Swal.fire('Deleted!', 'Event deleted', 'success');
                    }
                } catch (error) {
                    Swal.fire('Error!', error.message, 'error');
                }
            }
        });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        
        const eventData = {
            clubId: form.clubId.value,
            title: form.title.value,
            description: form.description.value,
            eventDate: form.eventDate.value,
            location: form.location.value,
            maxAttendees: form.maxAttendees.value || 0
        };

        if (editingEvent) {
            updateEvent(editingEvent._id, eventData);
        } else {
            createEvent(eventData);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Events Management</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary btn-sm"
                    disabled={clubs.length === 0}
                >
                    <FaPlus /> Create Event
                </button>
            </div>

            {clubs.length === 0 ? (
                <div className="alert alert-warning">
                    No approved clubs found. You need an approved club to create events.
                </div>
            ) : (
                <>
                    {/* Events Table */}
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Event Title</th>
                                    <th>Club</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
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
                                    events.map((event, index) => {
                                        const club = clubs.find(c => c._id === event.clubId);
                                        return (
                                            <tr key={event._id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div>
                                                        <div className="font-medium">{event.title}</div>
                                                        {/* <div className="text-sm text-gray-500">{event.description}</div> */}
                                                    </div>
                                                </td>
                                                <td>{club?.clubName || 'Unknown Club'}</td>
                                                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                                                <td>{event.location}</td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingEvent(event);
                                                                setShowForm(true);
                                                            }}
                                                            className="btn btn-xs btn-outline"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteEvent(event._id)}
                                                            className="btn btn-xs btn-error"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Event Form Modal */}
            {showForm && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold mb-4">
                            {editingEvent ? 'Edit Event' : 'Create Event'}
                        </h3>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                <div>
                                    <label className="label">Select Club *</label>
                                    <select 
                                        name="clubId" 
                                        className="select select-bordered w-full"
                                        defaultValue={editingEvent?.clubId}
                                        required
                                    >
                                        <option value="">Choose Club</option>
                                        {clubs.map(club => (
                                            <option key={club._id} value={club._id}>
                                                {club.clubName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="label">Event Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="input input-bordered w-full"
                                        defaultValue={editingEvent?.title}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="label">Description *</label>
                                    <textarea
                                        name="description"
                                        className="textarea textarea-bordered w-full"
                                        defaultValue={editingEvent?.description}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="label">Date *</label>
                                        <input
                                            type="date"
                                            name="eventDate"
                                            className="input input-bordered w-full"
                                            defaultValue={editingEvent?.eventDate?.split('T')[0]}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="label">Location *</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="input input-bordered w-full"
                                            defaultValue={editingEvent?.location}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="label">Max Attendees</label>
                                    <input
                                        type="number"
                                        name="maxAttendees"
                                        className="input input-bordered w-full"
                                        placeholder="Unlimited"
                                        min="0"
                                        defaultValue={editingEvent?.maxAttendees || 0}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">0 = Unlimited</p>
                                </div>
                                
                                <div className="modal-action mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingEvent(null);
                                        }}
                                        className="btn btn-outline btn-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
                                    >
                                        {editingEvent ? 'Update' : 'Create'}
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