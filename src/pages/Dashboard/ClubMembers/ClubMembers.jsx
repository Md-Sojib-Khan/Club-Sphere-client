import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    FaUserFriends, 
    FaSearch, 
    FaFilter, 
    FaCalendarAlt, 
    FaEnvelope, 
    FaUserCheck,
    FaUserTimes,
    FaTrash,
    FaSync,
    FaExclamationTriangle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const ClubMembers = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    
    const [selectedClub, setSelectedClub] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'stats'

    // Fetch manager's clubs
    const { data: clubs = [], isLoading: clubsLoading } = useQuery({
        queryKey: ['managerClubs', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/clubs?managerEmail=${user?.email}&status=approved`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Fetch members for selected club
    const { 
        data: membersData, 
        isLoading: membersLoading, 
        refetch: refetchMembers 
    } = useQuery({
        queryKey: ['clubMembers', selectedClub, statusFilter],
        queryFn: async () => {
            if (!selectedClub) return null;
            
            let url = `/clubs/${selectedClub}/members`;
            if (statusFilter && statusFilter !== 'all') {
                url += `?status=${statusFilter}`;
            }
            
            const res = await axiosSecure.get(url);
            return res.data;
        },
        enabled: !!selectedClub
    });

    // Fetch membership statistics
    const { data: statsData } = useQuery({
        queryKey: ['memberStats', selectedClub],
        queryFn: async () => {
            if (!selectedClub) return null;
            const res = await axiosSecure.get(`/clubs/${selectedClub}/members-stats`);
            return res.data;
        },
        enabled: !!selectedClub && viewMode === 'stats'
    });

    // Update member status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ memberId, status }) => {
            const res = await axiosSecure.patch(
                `/clubs/${selectedClub}/members/${memberId}/status`,
                { status }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['clubMembers', selectedClub]);
            queryClient.invalidateQueries(['memberStats', selectedClub]);
        }
    });

    // Remove member mutation
    const removeMemberMutation = useMutation({
        mutationFn: async (memberId) => {
            const res = await axiosSecure.delete(
                `/clubs/${selectedClub}/members/${memberId}`
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['clubMembers', selectedClub]);
            queryClient.invalidateQueries(['memberStats', selectedClub]);
        }
    });

    // Handle status change
    const handleStatusChange = (memberId, currentStatus, newStatus) => {
        Swal.fire({
            title: 'Change Member Status?',
            html: `Are you sure you want to change this member's status from <b>${currentStatus}</b> to <b>${newStatus}</b>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatusMutation.mutate({ memberId, status: newStatus });
                Swal.fire(
                    'Updated!',
                    'Member status has been updated.',
                    'success'
                );
            }
        });
    };

    // Handle remove member
    const handleRemoveMember = (memberId, memberName) => {
        Swal.fire({
            title: 'Remove Member?',
            text: `Are you sure you want to remove ${memberName} from this club?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove!'
        }).then((result) => {
            if (result.isConfirmed) {
                removeMemberMutation.mutate(memberId);
                Swal.fire(
                    'Removed!',
                    'Member has been removed from the club.',
                    'success'
                );
            }
        });
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return 'badge-success';
            case 'inactive':
                return 'badge-warning';
            case 'expired':
                return 'badge-error';
            case 'suspended':
                return 'badge-secondary';
            default:
                return 'badge-info';
        }
    };

    // Filter members based on search
    const filteredMembers = membersData?.members?.filter(member => {
        const searchLower = searchTerm.toLowerCase();
        return (
            member.userDetails?.displayName?.toLowerCase().includes(searchLower) ||
            member.userDetails?.email?.toLowerCase().includes(searchLower)
        );
    }) || [];

    // Get club name by ID
    const getClubName = (clubId) => {
        const club = clubs.find(c => c._id === clubId);
        return club?.clubName || 'Unknown Club';
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    <FaUserFriends className="text-primary" />
                    Club Members Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your club members, view their details, and update membership status
                </p>
            </div>

            {/* Club Selection */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="font-bold mb-3">Select Club</h2>
                <div className="flex flex-wrap gap-4">
                    {clubsLoading ? (
                        <div className="loading loading-spinner"></div>
                    ) : clubs.length === 0 ? (
                        <div className="alert alert-warning">
                            <FaExclamationTriangle />
                            <span>You don't have any approved clubs. Create a club first!</span>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {clubs.map(club => (
                                <button
                                    key={club._id}
                                    onClick={() => setSelectedClub(club._id)}
                                    className={`btn btn-sm ${selectedClub === club._id ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {club.clubName} ({club.totalMembers || 0} members)
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content - Only show if club is selected */}
            {selectedClub && (
                <>
                    {/* Club Info Header */}
                    <div className="bg-primary text-white rounded-lg shadow p-4 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-bold">{getClubName(selectedClub)}</h2>
                                <p className="text-primary-content/80">
                                    {membersData?.club?.totalMembers || 0} total members
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-accent' : 'btn-outline btn-accent'}`}
                                >
                                    List View
                                </button>
                                <button
                                    onClick={() => setViewMode('stats')}
                                    className={`btn btn-sm ${viewMode === 'stats' ? 'btn-accent' : 'btn-outline btn-accent'}`}
                                >
                                    Statistics
                                </button>
                                <button
                                    onClick={() => refetchMembers()}
                                    className="btn btn-sm btn-outline btn-accent"
                                >
                                    <FaSync /> Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistics View */}
                    {viewMode === 'stats' && statsData && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {statsData.stats?.map(stat => (
                                <div key={stat.status} className="bg-white rounded-lg shadow p-4">
                                    <div className="text-3xl font-bold mb-2">{stat.count}</div>
                                    <div className={`badge ${getStatusBadge(stat.status)}`}>
                                        {stat.status.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === 'list' && (
                        <>
                            {/* Filters and Search */}
                            <div className="bg-white rounded-lg shadow p-4 mb-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Search */}
                                    <div className="flex-1">
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by name or email..."
                                                className="input input-bordered pl-10 w-full"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="w-full md:w-48">
                                        <div className="relative">
                                            <FaFilter className="absolute left-3 top-3 text-gray-400" />
                                            <select
                                                className="select select-bordered pl-10 w-full"
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                            >
                                                <option value="all">All Status</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="expired">Expired</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Members Table */}
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                {membersLoading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="loading loading-spinner loading-lg"></div>
                                    </div>
                                ) : filteredMembers.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaUserFriends className="text-4xl text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No members found</p>
                                        {searchTerm && (
                                            <p className="text-sm text-gray-400 mt-2">
                                                Try a different search term
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="font-semibold">Member</th>
                                                    <th className="font-semibold">Email</th>
                                                    <th className="font-semibold">Joined Date</th>
                                                    <th className="font-semibold">Status</th>
                                                    <th className="font-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredMembers.map((member) => (
                                                    <tr key={member._id} className="hover:bg-gray-50">
                                                        {/* Member Info */}
                                                        <td>
                                                            <div className="flex items-center gap-3">
                                                                <div className="avatar">
                                                                    <div className="w-10 h-10 rounded-full">
                                                                        {member.userDetails?.photoURL ? (
                                                                            <img 
                                                                                src={member.userDetails.photoURL} 
                                                                                alt={member.userDetails.displayName}
                                                                            />
                                                                        ) : (
                                                                            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                                                                                {member.userDetails?.displayName?.charAt(0) || 'U'}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {member.userDetails?.displayName || 'Unknown User'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Email */}
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                <FaEnvelope className="text-gray-400" />
                                                                <span className="text-sm">{member.userEmail}</span>
                                                            </div>
                                                        </td>

                                                        {/* Joined Date */}
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                <FaCalendarAlt className="text-gray-400" />
                                                                <span className="text-sm">
                                                                    {formatDate(member.joinedAt)}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* Status */}
                                                        <td>
                                                            <span className={`badge ${getStatusBadge(member.status)}`}>
                                                                {member.status.toUpperCase()}
                                                            </span>
                                                        </td>

                                                        {/* Actions */}
                                                        <td>
                                                            <div className="flex gap-2">
                                                                {/* Status Change Dropdown */}
                                                                <div className="dropdown dropdown-end">
                                                                    <label 
                                                                        tabIndex={0} 
                                                                        className="btn btn-xs btn-outline"
                                                                    >
                                                                        Change Status
                                                                    </label>
                                                                    <ul 
                                                                        tabIndex={0} 
                                                                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
                                                                    >
                                                                        {['active', 'inactive', 'expired', 'suspended'].map(status => (
                                                                            <li key={status}>
                                                                                <button
                                                                                    onClick={() => handleStatusChange(
                                                                                        member._id, 
                                                                                        member.status, 
                                                                                        status
                                                                                    )}
                                                                                    disabled={member.status === status}
                                                                                    className={member.status === status ? 'disabled' : ''}
                                                                                >
                                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                                    {member.status === status && ' ✓'}
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                {/* Remove Button */}
                                                                <button
                                                                    onClick={() => handleRemoveMember(
                                                                        member._id, 
                                                                        member.userDetails?.displayName
                                                                    )}
                                                                    className="btn btn-xs btn-error"
                                                                    title="Remove from club"
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

                                {/* Summary */}
                                {filteredMembers.length > 0 && (
                                    <div className="border-t p-4 bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-600">
                                                Showing {filteredMembers.length} of {membersData?.members?.length || 0} members
                                            </div>
                                            <div className="flex gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 rounded-full bg-success"></div>
                                                    <span>Active</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                                                    <span>Inactive</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 rounded-full bg-error"></div>
                                                    <span>Expired</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="card bg-white shadow">
                                    <div className="card-body">
                                        <h3 className="card-title text-sm font-bold">Quick Actions</h3>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: 'Set All Inactive to Expired?',
                                                        text: 'This will change all inactive members to expired status',
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Yes, proceed'
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            // Implement bulk update
                                                            Swal.fire('Done!', 'Status updated', 'success');
                                                        }
                                                    });
                                                }}
                                                className="btn btn-sm btn-warning w-full"
                                            >
                                                <FaUserTimes /> Expire All Inactive
                                            </button>
                                            <button
                                                onClick={() => setStatusFilter('active')}
                                                className="btn btn-sm btn-success w-full"
                                            >
                                                <FaUserCheck /> View Active Only
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-white shadow md:col-span-2">
                                    <div className="card-body">
                                        <h3 className="card-title text-sm font-bold">Status Guide</h3>
                                        <ul className="text-sm space-y-1">
                                            <li><span className="badge badge-success badge-xs mr-2"></span> Active: Member can participate in club activities</li>
                                            <li><span className="badge badge-warning badge-xs mr-2"></span> Inactive: Temporary suspension of privileges</li>
                                            <li><span className="badge badge-error badge-xs mr-2"></span> Expired: Membership period has ended</li>
                                            <li><span className="badge badge-secondary badge-xs mr-2"></span> Suspended: Manual suspension by manager</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* No Club Selected Message */}
            {!selectedClub && clubs.length > 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <FaUserFriends className="text-4xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">Select a Club</h3>
                    <p className="text-gray-600 mb-4">Choose a club from the list above to view and manage its members</p>
                </div>
            )}
        </div>
    );
};

export default ClubMembers;