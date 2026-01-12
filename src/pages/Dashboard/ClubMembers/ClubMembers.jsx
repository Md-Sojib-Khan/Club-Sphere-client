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
    FaExclamationTriangle,
    FaChartBar,
    FaUsers,
    FaCheckCircle,
    FaClock,
    FaBan
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

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
            confirmButtonText: 'Yes, change it!',
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
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
            confirmButtonText: 'Yes, remove!',
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
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
                return 'badge-success text-success-content dark:bg-green-900/30 dark:text-green-400';
            case 'inactive':
                return 'badge-warning text-warning-content dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'expired':
                return 'badge-error text-error-content dark:bg-red-900/30 dark:text-red-400';
            case 'suspended':
                return 'badge-secondary text-secondary-content dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'badge-info text-info-content dark:bg-blue-900/30 dark:text-blue-400';
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
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                        <FaUserFriends className="text-2xl text-primary dark:text-primary/90" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            Club Members Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage your club members, view their details, and update membership status
                        </p>
                    </div>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>

            {/* Club Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-4 md:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="font-bold mb-3 text-gray-800 dark:text-white">Select Club</h2>
                <div className="flex flex-wrap gap-4">
                    {clubsLoading ? (
                        <div className="flex items-center justify-center w-full py-8">
                            <div className="loading loading-spinner text-primary dark:text-primary/80"></div>
                        </div>
                    ) : clubs.length === 0 ? (
                        <div className="alert alert-warning dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 w-full">
                            <FaExclamationTriangle />
                            <span className="dark:text-amber-400">You don't have any approved clubs. Create a club first!</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                            {clubs.map(club => (
                                <button
                                    key={club._id}
                                    onClick={() => setSelectedClub(club._id)}
                                    className={`p-4 rounded-xl text-left transition-all duration-300 border ${
                                        selectedClub === club._id 
                                            ? 'bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 border-primary dark:border-primary/50 shadow-lg' 
                                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className={`font-bold ${
                                            selectedClub === club._id 
                                                ? 'text-primary dark:text-primary/90' 
                                                : 'text-gray-800 dark:text-white'
                                        }`}>
                                            {club.clubName}
                                        </h3>
                                        <span className="badge bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90">
                                            {club.totalMembers || 0} members
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {club.category}
                                    </p>
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
                    <div className="bg-gradient-to-r from-primary to-secondary dark:from-primary/90 dark:to-secondary/90 text-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold">{getClubName(selectedClub)}</h2>
                                <p className="opacity-90">
                                    {membersData?.club?.totalMembers || 0} total members • {membersData?.club?.category || 'No category'}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`btn btn-sm rounded-full px-4 ${viewMode === 'list' 
                                        ? 'bg-white text-primary hover:bg-gray-100' 
                                        : 'bg-white/20 hover:bg-white/30 border-white/30'
                                    }`}
                                >
                                    <FaUsers className="mr-2" /> List View
                                </button>
                                <button
                                    onClick={() => setViewMode('stats')}
                                    className={`btn btn-sm rounded-full px-4 ${viewMode === 'stats' 
                                        ? 'bg-white text-primary hover:bg-gray-100' 
                                        : 'bg-white/20 hover:bg-white/30 border-white/30'
                                    }`}
                                >
                                    <FaChartBar className="mr-2" /> Statistics
                                </button>
                                <button
                                    onClick={() => refetchMembers()}
                                    className="btn btn-sm rounded-full px-4 bg-white/20 hover:bg-white/30 border-white/30"
                                >
                                    <FaSync /> Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistics View */}
                    {viewMode === 'stats' && statsData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <FaCheckCircle className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                                            {statsData.stats?.find(s => s.status === 'active')?.count || 0}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Members</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Currently active in the club
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                        <FaClock className="text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                                            {statsData.stats?.find(s => s.status === 'inactive')?.count || 0}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Inactive</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Haven't been active recently
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                        <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                                            {statsData.stats?.find(s => s.status === 'expired')?.count || 0}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Expired</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Membership has expired
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <FaBan className="text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                                            {statsData.stats?.find(s => s.status === 'suspended')?.count || 0}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Suspended</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Temporarily suspended
                                </div>
                            </div>
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === 'list' && (
                        <>
                            {/* Filters and Search */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-4 md:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Search */}
                                    <div className="flex-1">
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Search by name or email..."
                                                className="input input-bordered dark:input-bordered-dark pl-10 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="w-full md:w-48">
                                        <div className="relative">
                                            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                            <select
                                                className="select select-bordered dark:select-bordered-dark pl-10 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                {membersLoading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="loading loading-spinner loading-lg text-primary dark:text-primary/80"></div>
                                    </div>
                                ) : filteredMembers.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaUserFriends className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">No members found</p>
                                        {searchTerm && (
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                                Try a different search term
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                                <tr>
                                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Member</th>
                                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Email</th>
                                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Joined Date</th>
                                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredMembers.map((member) => (
                                                    <tr key={member._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                                                        {/* Member Info */}
                                                        <td>
                                                            <div className="flex items-center gap-3">
                                                                <div className="avatar">
                                                                    <div className="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700">
                                                                        {member.userDetails?.photoURL ? (
                                                                            <img 
                                                                                src={member.userDetails.photoURL} 
                                                                                alt={member.userDetails.displayName}
                                                                                className="rounded-full"
                                                                            />
                                                                        ) : (
                                                                            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                                                                                {member.userDetails?.displayName?.charAt(0) || 'U'}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-gray-800 dark:text-white">
                                                                        {member.userDetails?.displayName || 'Unknown User'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Email */}
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">{member.userEmail}</span>
                                                            </div>
                                                        </td>

                                                        {/* Joined Date */}
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">
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
                                                                        className="btn btn-xs btn-outline border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                    >
                                                                        Change Status
                                                                    </label>
                                                                    <ul 
                                                                        tabIndex={0} 
                                                                        className="dropdown-content z-[1] menu p-2 shadow bg-white dark:bg-gray-700 rounded-box w-40 border border-gray-200 dark:border-gray-600"
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
                                                                                    className={`text-sm ${
                                                                                        member.status === status 
                                                                                            ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400' 
                                                                                            : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                                                                                    }`}
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
                                                                    className="btn btn-xs btn-error bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-800/40"
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
                                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/20">
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Showing {filteredMembers.length} of {membersData?.members?.length || 0} members
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400"></div>
                                                    <span className="text-gray-600 dark:text-gray-400">Active</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
                                                    <span className="text-gray-600 dark:text-gray-400">Inactive</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400"></div>
                                                    <span className="text-gray-600 dark:text-gray-400">Expired</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* No Club Selected Message */}
            {!selectedClub && clubs.length > 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700">
                    <FaUserFriends className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Select a Club</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Choose a club from the list above to view and manage its members</p>
                </div>
            )}
        </div>
    );
};

export default ClubMembers;