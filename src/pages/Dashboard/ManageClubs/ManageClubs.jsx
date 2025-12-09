import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaChartBar, FaUsers, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageClubs = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewClub, setViewClub] = useState(null);

    // Fetch all clubs
    const { data: clubs = [], isLoading, refetch } = useQuery({
        queryKey: ['allClubs', searchText, statusFilter],
        queryFn: async () => {
            let url = '/clubs';
            const params = [];
            
            if (searchText) params.push(`search=${searchText}`);
            if (statusFilter && statusFilter !== 'all') params.push(`status=${statusFilter}`);
            
            if (params.length > 0) {
                url = `/clubs?${params.join('&')}`;
            }
            
            const res = await axiosSecure.get(url);
            return res.data;
        }
    });

    // Update club status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ clubId, status }) => {
            return axiosSecure.patch(`/clubs/${clubId}/status`, { status });
        },
        onSuccess: () => {
            refetch()
            queryClient.invalidateQueries(['allClubs']);
            Swal.fire({
                icon: 'success',
                title: 'Status Updated!',
                text: 'Club status has been updated successfully.',
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message
            });
        }
    });

    // Handle approve club
    const handleApprove = (club) => {
        Swal.fire({
            title: 'Approve Club',
            text: `Are you sure you want to approve "${club.clubName}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, approve it!'
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatusMutation.mutate({ clubId: club._id, status: 'approved' });
            }
        });
    };

    // Handle reject club
    const handleReject = (club) => {
        Swal.fire({
            title: 'Reject Club',
            text: `Are you sure you want to reject "${club.clubName}"?`,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#6B7280',
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'Yes, reject it!',
            input: 'text',
            inputLabel: 'Reason for rejection (optional)',
            inputPlaceholder: 'Enter reason...'
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatusMutation.mutate({ clubId: club._id, status: 'rejected' });
            }
        });
    };

    // Handle view club details
    const handleViewClub = (club) => {
        setViewClub(club);
    };

    // Close view modal
    const closeViewModal = () => {
        setViewClub(null);
    };

    // Status badge with colors
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'badge-warning', icon: <MdPendingActions className="mr-1" /> },
            approved: { color: 'badge-success', icon: <FaCheck className="mr-1" /> },
            rejected: { color: 'badge-error', icon: <FaTimes className="mr-1" /> },
            active: { color: 'badge-info', icon: <FaCheck className="mr-1" /> },
            inactive: { color: 'badge-neutral', icon: <FaTimes className="mr-1" /> }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        
        return (
            <div className={`badge ${config.color} gap-1 p-3`}>
                {config.icon}
                {status}
            </div>
        );
    };

    // Calculate statistics
    const calculateStats = () => {
        const totalClubs = clubs.length;
        const pendingClubs = clubs.filter(c => c.status === 'pending').length;
        const approvedClubs = clubs.filter(c => c.status === 'approved').length;
        const activeClubs = clubs.filter(c => c.status === 'active').length;
        const totalMembers = clubs.reduce((sum, club) => sum + (club.totalMembers || 0), 0);
        
        return {
            totalClubs,
            pendingClubs,
            approvedClubs,
            activeClubs,
            totalMembers,
            avgMembers: totalClubs > 0 ? (totalMembers / totalClubs).toFixed(1) : 0
        };
    };

    const stats = calculateStats();

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
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Manage Clubs</h2>
                <p className="text-gray-600">Approve, reject and manage all clubs</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="stat bg-base-100 shadow rounded-lg p-4">
                    <div className="stat-figure text-primary">
                        <FaChartBar className="text-3xl" />
                    </div>
                    <div className="stat-title">Total Clubs</div>
                    <div className="stat-value">{stats.totalClubs}</div>
                </div>
                
                <div className="stat bg-base-100 shadow rounded-lg p-4">
                    <div className="stat-figure text-warning">
                        <MdPendingActions className="text-3xl" />
                    </div>
                    <div className="stat-title">Pending</div>
                    <div className="stat-value">{stats.pendingClubs}</div>
                </div>
                
                <div className="stat bg-base-100 shadow rounded-lg p-4">
                    <div className="stat-figure text-success">
                        <FaUsers className="text-3xl" />
                    </div>
                    <div className="stat-title">Total Members</div>
                    <div className="stat-value">{stats.totalMembers}</div>
                </div>
                
                <div className="stat bg-base-100 shadow rounded-lg p-4">
                    <div className="stat-figure text-info">
                        <FaUsers className="text-3xl" />
                    </div>
                    <div className="stat-title">Avg. Members</div>
                    <div className="stat-value">{stats.avgMembers}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            className="grow"
                            placeholder="Search clubs..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </label>
                </div>
                
                <div className="w-full md:w-48">
                    <select 
                        className="select select-bordered w-full"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Clubs Table */}
            <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead className="bg-base-200">
                            <tr>
                                <th>#</th>
                                <th>Club Name</th>
                                <th>Manager Email</th>
                                <th>Status</th>
                                <th>Membership Fee</th>
                                <th>Members</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clubs.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8">
                                        <div className="flex flex-col items-center justify-center">
                                            <MdPendingActions className="w-12 h-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500">No clubs found</p>
                                            {searchText && (
                                                <p className="text-gray-400 text-sm">Try a different search term</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                clubs.map((club, index) => (
                                    <tr key={club._id} className="hover:bg-base-100">
                                        <td className="font-medium">{index + 1}</td>
                                        
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-10 h-10">
                                                        <img
                                                            src={club.bannerImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=200&auto=format&fit=crop'}
                                                            alt={club.clubName}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{club.clubName}</div>
                                                    <div className="text-sm opacity-70">{club.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td>
                                            <div className="text-sm">{club.managerEmail}</div>
                                        </td>
                                        
                                        <td>
                                            {getStatusBadge(club.status)}
                                        </td>
                                        
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <FaMoneyBillWave className="text-green-500" />
                                                <span>
                                                    {club.membershipFee === 0 || !club.membershipFee ? 'Free' : `$${club.membershipFee}`}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <FaUsers className="text-blue-500" />
                                                <span>{club.totalMembers || 0}</span>
                                            </div>
                                        </td>
                                        
                                        <td>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleViewClub(club)}
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    <FaEye />
                                                    <span className="hidden md:inline">View</span>
                                                </button>
                                                
                                                {club.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(club)}
                                                            className="btn btn-sm btn-success"
                                                            disabled={updateStatusMutation.isLoading}
                                                        >
                                                            <FaCheck />
                                                            <span className="hidden md:inline">Approve</span>
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => handleReject(club)}
                                                            className="btn btn-sm btn-error"
                                                            disabled={updateStatusMutation.isLoading}
                                                        >
                                                            <FaTimes />
                                                            <span className="hidden md:inline">Reject</span>
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {club.status === 'approved' && (
                                                    <button
                                                        onClick={() => updateStatusMutation.mutate({ clubId: club._id, status: 'active' })}
                                                        className="btn btn-sm btn-info"
                                                        disabled={updateStatusMutation.isLoading}
                                                    >
                                                        <FaCheck />
                                                        <span className="hidden md:inline">Activate</span>
                                                    </button>
                                                )}
                                                
                                                {club.status === 'active' && (
                                                    <button
                                                        onClick={() => updateStatusMutation.mutate({ clubId: club._id, status: 'inactive' })}
                                                        className="btn btn-sm btn-warning"
                                                        disabled={updateStatusMutation.isLoading}
                                                    >
                                                        <FaTimes />
                                                        <span className="hidden md:inline">Deactivate</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Club Details Modal */}
            {viewClub && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold">Club Details</h3>
                            <button
                                onClick={closeViewModal}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-16 h-16">
                                        <img
                                            src={viewClub.bannerImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=200&auto=format&fit=crop'}
                                            alt={viewClub.clubName}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold">{viewClub.clubName}</h4>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(viewClub.status)}
                                        <span className="badge badge-outline">{viewClub.category}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Manager Email</span>
                                    </label>
                                    <div className="input input-bordered">{viewClub.managerEmail}</div>
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Location</span>
                                    </label>
                                    <div className="input input-bordered">{viewClub.location}</div>
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Membership Fee</span>
                                    </label>
                                    <div className="input input-bordered">
                                        {viewClub.membershipFee === 0 || !viewClub.membershipFee ? 'Free' : `$${viewClub.membershipFee}`}
                                    </div>
                                </div>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Total Members</span>
                                    </label>
                                    <div className="input input-bordered flex items-center gap-2">
                                        <FaUsers className="text-blue-500" />
                                        <span>{viewClub.totalMembers || 0}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Description</span>
                                </label>
                                <div className="textarea textarea-bordered min-h-[100px] p-3">
                                    {viewClub.description}
                                </div>
                            </div>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Created At</span>
                                </label>
                                <div className="input input-bordered">
                                    {new Date(viewClub.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            
                            <div className="modal-action">
                                <button
                                    onClick={closeViewModal}
                                    className="btn btn-outline"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageClubs;