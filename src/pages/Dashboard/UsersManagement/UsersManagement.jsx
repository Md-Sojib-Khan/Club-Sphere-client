import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaUserShield, FaUser, FaUsers, FaUserTie } from 'react-icons/fa';
import { FiShieldOff } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../Components/Loading';

const UsersManagement = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ['users', searchText],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?searchText=${searchText}`);
            return res.data;
        }
    });

    // Confirmation modal function
    const showConfirmation = (title, text, confirmButtonText, callback) => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        });
    };

    const updateRoleMember = (user) => {
        showConfirmation(
            'Make Member',
            `Are you sure you want to make ${user.displayName} a member?`,
            'Yes, make member!',
            () => {
                const roleInfo = { role: 'member' };
                axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
                    .then(res => {
                        if (res.data.modifiedCount) {
                            refetch();
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: `${user.displayName} is now a Member`,
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to update role'
                        });
                    });
            }
        );
    };

    const updateRoleManager = (user) => {
        showConfirmation(
            'Make Club Manager',
            `Are you sure you want to make ${user.displayName} a Club Manager?`,
            'Yes, make manager!',
            () => {
                const roleInfo = { role: 'clubManager' };
                axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
                    .then(res => {
                        if (res.data.modifiedCount) {
                            refetch();
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: `${user.displayName} is now a Club Manager`,
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to update role'
                        });
                    });
            }
        );
    };

    const updateRoleAdmin = (user) => {
        showConfirmation(
            'Make Admin',
            `Are you sure you want to make ${user.displayName} an Admin?`,
            'Yes, make admin!',
            () => {
                const roleInfo = { role: 'admin' };
                axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
                    .then(res => {
                        if (res.data.modifiedCount) {
                            refetch();
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: `${user.displayName} is now an Admin`,
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to update role'
                        });
                    });
            }
        );
    };

    // Role badge with colors
    const getRoleBadge = (role) => {
        const roleConfig = {
            admin: { color: 'badge-success', icon: <FaUserShield className="mr-1" /> },
            clubManager: { color: 'badge-warning', icon: <FaUserTie className="mr-1" /> },
            member: { color: 'badge-error', icon: <FaUser className="mr-1" /> },
            user: { color: 'badge-info', icon: <FaUsers className="mr-1" /> }
        };
        
        const config = roleConfig[role] || roleConfig.user;
        
        return (
            <div className={`badge ${config.color} gap-1 p-3`}>
                {config.icon}
                {role}
            </div>
        );
    };

    if (isLoading) {
        return <Loading></Loading>;
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Manage Users</h2>
                    <p className="text-gray-600 mt-2">Total Users: {users.length}</p>
                </div>
                
                {/* Search Input */}
                <div className="w-full md:w-auto">
                    <label className="input input-bordered flex items-center gap-2 w-full md:w-96">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            className="grow"
                            placeholder="Search users by name or email..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        {searchText && (
                            <button 
                                className="btn btn-ghost btn-sm"
                                onClick={() => setSearchText('')}
                            >
                                Clear
                            </button>
                        )}
                    </label>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* Table Head */}
                        <thead className="bg-base-200">
                            <tr>
                                <th className="hidden md:table-cell">#</th>
                                <th>User</th>
                                <th className="hidden md:table-cell">Email</th>
                                <th className="hidden md:table-cell">Creation Date</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8">
                                        <div className="flex flex-col items-center justify-center">
                                            <FiShieldOff className="w-16 h-16 text-gray-400 mb-4" />
                                            <p className="text-gray-500 text-lg">No users found</p>
                                            {searchText && (
                                                <p className="text-gray-400">Try a different search term</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-base-100">
                                        <td className="hidden md:table-cell font-medium">{index + 1}</td>
                                        
                                        {/* User Info */}
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-10 h-10 md:w-12 md:h-12">
                                                        <img
                                                            src={user.photoURL || 'https://i.pravatar.cc/150?img=3'}
                                                            alt={user.displayName}
                                                            onError={(e) => {
                                                                e.target.src = 'https://i.pravatar.cc/150?img=3';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.displayName}</div>
                                                    <div className="text-sm opacity-70 md:hidden">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Email (hidden on mobile) */}
                                        <td className="hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                {user.email}
                                                {/* {user.emailVerified && (
                                                    <span className="badge badge-success badge-xs">Verified</span>
                                                )} */}
                                            </div>
                                        </td>
                                        {/* Creation Date (hidden on mobile) */}
                                        <td className="hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                {new Date(user.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        
                                        {/* Role */}
                                        <td>
                                            {getRoleBadge(user.role)}
                                        </td>
                                        
                                        {/* Action Buttons */}
                                        <td>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => updateRoleMember(user)}
                                                    disabled={user.role === 'member'}
                                                    className={`btn btn-xs md:btn-sm ${user.role === 'member' ? 'btn-disabled' : 'btn-error'}`}
                                                >
                                                    <FaUser className="mr-1" />
                                                    <span className="hidden md:inline">Member</span>
                                                </button>
                                                
                                                <button
                                                    onClick={() => updateRoleManager(user)}
                                                    disabled={user.role === 'clubManager'}
                                                    className={`btn btn-xs md:btn-sm ${user.role === 'clubManager' ? 'btn-disabled' : 'btn-warning'}`}
                                                >
                                                    <FaUserTie className="mr-1" />
                                                    <span className="hidden md:inline">Manager</span>
                                                </button>
                                                
                                                <button
                                                    onClick={() => updateRoleAdmin(user)}
                                                    disabled={user.role === 'admin'}
                                                    className={`btn btn-xs md:btn-sm ${user.role === 'admin' ? 'btn-disabled' : 'btn-success'}`}
                                                >
                                                    <FaUserShield className="mr-1" />
                                                    <span className="hidden md:inline">Admin</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (optional) */}
                {users.length > 0 && (
                    <div className="flex justify-between items-center p-4 border-t">
                        <div className="text-sm text-gray-600">
                            Showing {users.length} of {users.length} users
                        </div>
                        <div className="join">
                            <button className="join-item btn btn-sm">«</button>
                            <button className="join-item btn btn-sm btn-active">1</button>
                            <button className="join-item btn btn-sm">»</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaUsers className="text-3xl" />
                        </div>
                        <div className="stat-title">Total Users</div>
                        <div className="stat-value">{users.length}</div>
                    </div>
                </div>
                
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-error">
                            <FaUserShield className="text-3xl" />
                        </div>
                        <div className="stat-title">Admins</div>
                        <div className="stat-value">
                            {users.filter(u => u.role === 'admin').length}
                        </div>
                    </div>
                </div>
                
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <FaUserTie className="text-3xl" />
                        </div>
                        <div className="stat-title">Managers</div>
                        <div className="stat-value">
                            {users.filter(u => u.role === 'clubManager').length}
                        </div>
                    </div>
                </div>
                
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-success">
                            <FaUser className="text-3xl" />
                        </div>
                        <div className="stat-title">Members</div>
                        <div className="stat-value">
                            {users.filter(u => u.role === 'member').length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;