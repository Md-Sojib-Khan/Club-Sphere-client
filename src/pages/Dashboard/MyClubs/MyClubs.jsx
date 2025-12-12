import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaTrash, FaPlus, FaImage, FaMapMarkerAlt, FaMoneyBillWave, FaTag, FaCalendar, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdCategory, MdDescription } from 'react-icons/md';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router';

const MyClubs = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClub, setEditingClub] = useState(null);

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            clubName: '',
            description: '',
            category: '',
            location: '',
            membershipFee: 0,
            bannerImage: '',
            status: 'pending'
        }
    });

    // Fetch clubs where managerEmail equals logged-in user
    const { data: clubs = [], isLoading, refetch } = useQuery({
        queryKey: ['myClubs', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/clubs?managerEmail=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Create Club Mutation
    const createClubMutation = useMutation({
        mutationFn: async (clubData) => {
            // Add manager email and timestamps
            clubData.managerEmail = user.email;
            clubData.createdAt = new Date().toISOString();
            clubData.updatedAt = new Date().toISOString();

            return axiosSecure.post('/clubs', clubData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myClubs']);
            Swal.fire({
                icon: 'success',
                title: 'Club Created!',
                text: 'Your club has been created successfully and is pending approval.',
                timer: 2000
            });
            handleCloseModal();
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Create Club',
                text: error.message
            });
        }
    });

    // Update Club Mutation - SIMPLIFIED
    const updateClubMutation = useMutation({
        mutationFn: async ({ id, clubData }) => {
            // Update timestamp
            clubData.updatedAt = new Date().toISOString();

            return axiosSecure.patch(`/clubs/${id}`, clubData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myClubs']);
            refetch(); // Direct refetch
            Swal.fire({
                icon: 'success',
                title: 'Club Updated!',
                text: 'Your club has been updated successfully.',
                timer: 2000
            });
            handleCloseModal();
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Update Club',
                text: error.message
            });
        }
    });

    // Delete Club Mutation
    const deleteClubMutation = useMutation({
        mutationFn: async (clubId) => {
            return axiosSecure.delete(`/clubs/${clubId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myClubs']);
            refetch(); // Direct refetch
            Swal.fire({
                icon: 'success',
                title: 'Club Deleted!',
                text: 'Your club has been deleted successfully.',
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Delete Club',
                text: error.message
            });
        }
    });

    // Categories for dropdown
    const categories = [
        'Photography',
        'Sports',
        'Tech',
        'Art & Design',
        'Music',
        'Gaming',
        'Business',
        'Academic',
        'Social',
        'Book Club',
        'Food & Cooking',
        'Health & Fitness',
        'Travel',
        'Environmental',
        'Volunteering',
        'Other'
    ];

    const statusColors = {
        pending: 'badge-warning',
        approved: 'badge-success',
        rejected: 'badge-error',
        active: 'badge-info',
        inactive: 'badge-neutral'
    };

    const handleOpenModal = (club = null) => {
        if (club) {
            setEditingClub(club);
            // Set form values for editing
            setValue('clubName', club.clubName || '');
            setValue('description', club.description || '');
            setValue('category', club.category || '');
            setValue('location', club.location || '');
            setValue('membershipFee', club.membershipFee || 0);
            setValue('bannerImage', club.bannerImage || '');
            setValue('status', club.status || 'pending');
        } else {
            setEditingClub(null);
            reset({
                clubName: '',
                description: '',
                category: '',
                location: '',
                membershipFee: 0,
                bannerImage: '',
                status: 'pending'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClub(null);
        reset({
            clubName: '',
            description: '',
            category: '',
            location: '',
            membershipFee: 0,
            bannerImage: '',
            status: 'pending'
        });
    };

    const onSubmit = (data) => {
        console.log('Form Data:', data); // Debugging
        
        // Convert membershipFee to number
        if (data.membershipFee) {
            data.membershipFee = parseFloat(data.membershipFee);
        }

        if (editingClub) {
            // Update club - send only the data that's changed
            const updateData = {
                clubName: data.clubName,
                description: data.description,
                category: data.category,
                location: data.location,
                membershipFee: data.membershipFee,
                bannerImage: data.bannerImage,
                status: data.status,
                updatedAt: new Date().toISOString()
            };
            
            console.log('Update Data:', updateData); // Debugging
            updateClubMutation.mutate({ id: editingClub._id, clubData: updateData });
        } else {
            // Create new club - include all data
            const createData = {
                ...data,
                managerEmail: user.email,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                members: [],
                totalMembers: 0,
                events: []
            };
            
            console.log('Create Data:', createData); // Debugging
            createClubMutation.mutate(createData);
        }
    };

    const handleDeleteClub = (clubId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteClubMutation.mutate(clubId);
            }
        });
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold">My Clubs</h2>
                    <p className="text-gray-600">Manage your clubs</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary"
                    disabled={createClubMutation.isLoading}
                >
                    <FaPlus /> Create New Club
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="stat bg-base-100 shadow rounded-lg p-4">
                    <div className="stat-title">Total Clubs</div>
                    <div className="stat-value">{clubs.length}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-lg p-4">
                    <div className="stat-title">Approved</div>
                    <div className="stat-value">
                        {clubs.filter(c => c.status === 'approved').length}
                    </div>
                </div>
                <div className="stat bg-base-100 shadow rounded-lg p-4">
                    <div className="stat-title">Pending</div>
                    <div className="stat-value">
                        {clubs.filter(c => c.status === 'pending').length}
                    </div>
                </div>
                <div className="stat bg-base-100 shadow rounded-lg p-4">
                    <div className="stat-title">Active</div>
                    <div className="stat-value">
                        {clubs.filter(c => c.status === 'active').length}
                    </div>
                </div>
            </div>

            {/* Clubs Grid */}
            {clubs.length === 0 ? (
                <div className="text-center py-12 bg-base-100 rounded-2xl shadow">
                    <div className="max-w-md mx-auto">
                        <div className="text-6xl mb-4 opacity-20">🏢</div>
                        <h3 className="text-xl font-semibold mb-2">No Clubs Yet</h3>
                        <p className="text-gray-600 mb-6">Create your first club to get started!</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn btn-primary"
                            disabled={createClubMutation.isLoading}
                        >
                            <FaPlus /> Create Your First Club
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map(club => (
                        <div key={club._id} className="card bg-base-100 shadow-xl">
                            <figure className="h-48 overflow-hidden">
                                <img
                                    src={club.bannerImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'}
                                    alt={club.clubName}
                                    className="w-full h-full object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="card-title">{club.clubName}</h2>
                                        <div className={`badge ${statusColors[club.status] || 'badge-neutral'}`}>
                                            {club.status}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(club)}
                                            className="btn btn-sm btn-outline"
                                            disabled={updateClubMutation.isLoading}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClub(club._id)}
                                            className="btn btn-sm btn-outline btn-error"
                                            disabled={deleteClubMutation.isLoading}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-600 line-clamp-2">{club.description}</p>

                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MdCategory className="text-gray-500" />
                                        <span>{club.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaMapMarkerAlt className="text-gray-500" />
                                        <span>{club.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaMoneyBillWave className="text-gray-500" />
                                        <span>
                                            {club.membershipFee === 0 || !club.membershipFee ? 'Free' : `$${club.membershipFee}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaCalendar className="text-gray-500" />
                                        <span>Created: {formatDate(club.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    <Link to={`/clubs/${club._id}`} className="btn btn-sm btn-outline">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6">
                            {editingClub ? 'Edit Club' : 'Create New Club'}
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Club Name */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Club Name *</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("clubName", { required: "Club name is required" })}
                                        className="input input-bordered"
                                        placeholder="Enter club name"
                                    />
                                    {errors.clubName && (
                                        <span className="text-red-500 text-sm">{errors.clubName.message}</span>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Category *</span>
                                    </label>
                                    <select
                                        {...register("category", { required: "Category is required" })}
                                        className="select select-bordered"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <span className="text-red-500 text-sm">{errors.category.message}</span>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Location *</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("location", { required: "Location is required" })}
                                        className="input input-bordered"
                                        placeholder="City/Area"
                                    />
                                    {errors.location && (
                                        <span className="text-red-500 text-sm">{errors.location.message}</span>
                                    )}
                                </div>

                                {/* Membership Fee */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Membership Fee ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        {...register("membershipFee")}
                                        className="input input-bordered"
                                        placeholder="0 for free"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Description *</span>
                                </label>
                                <textarea
                                    {...register("description", { 
                                        required: "Description is required",
                                        minLength: { value: 20, message: "Description must be at least 20 characters" }
                                    })}
                                    className="textarea textarea-bordered h-32"
                                    placeholder="Describe your club"
                                ></textarea>
                                <div className="label">
                                    <span className="label-text-alt">
                                        {watch('description')?.length || 0} characters
                                    </span>
                                    {errors.description && (
                                        <span className="text-red-500 text-sm">{errors.description.message}</span>
                                    )}
                                </div>
                            </div>

                            {/* Banner Image */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Banner Image URL</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("bannerImage")}
                                    placeholder='https://example.com/image.jpg'
                                    className="input input-bordered w-full"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Leave empty for default image
                                </p>
                            </div>

                            {/* Status (for editing) */}
                            {editingClub && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Status</span>
                                    </label>
                                    <select
                                        {...register("status")}
                                        className="select select-bordered"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-outline"
                                    disabled={createClubMutation.isLoading || updateClubMutation.isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={createClubMutation.isLoading || updateClubMutation.isLoading}
                                >
                                    {createClubMutation.isLoading || updateClubMutation.isLoading ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            {editingClub ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        editingClub ? 'Update Club' : 'Create Club'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyClubs;