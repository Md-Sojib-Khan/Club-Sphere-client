import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    FaUser,
    FaEnvelope,
    FaCalendarAlt,
    FaEdit,
    FaSave,
    FaTimes,
    FaSignOutAlt,
    FaUsers,
    FaClock,
    FaCog
} from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import useAuth from '../../Hooks/useAuth';

const MyProfile = () => {
    const { user, logOutUser, updateUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [editMode, setEditMode] = useState(false);
    const [displayName, setDisplayName] = useState('');

    // Fetch user profile data
    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['userProfile', user?.uid],
        queryFn: async () => {
            if (!user?.uid) return null;

            try {
                const userRes = await axiosSecure.get(`/users/get/${user.uid}`);

                if (userRes.data.success) {
                    return userRes.data.user;
                } else {
                    return {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email?.split('@')[0],
                        photoURL: user.photoURL,
                        role: 'member'
                    };
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                return {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email?.split('@')[0],
                    photoURL: user.photoURL,
                    role: 'member'
                };
            }
        },
        enabled: !!user?.uid,
    });

    // Fetch member stats (only for members)
    const { data: memberStats } = useQuery({
        queryKey: ['memberStats', user?.email],
        queryFn: async () => {
            if (!user?.email) return null;

            try {
                const res = await axiosSecure.get(`/api/member/dashboard?userEmail=${user.email}`);
                if (res.data.success) {
                    return {
                        totalClubs: res.data.stats.totalClubs,
                        totalEvents: res.data.stats.totalEvents,
                        upcomingEvents: res.data.upcomingEvents || []
                    };
                }
                return null;
            } catch (error) {
                console.error('Error fetching member stats:', error);
                return null;
            }
        },
        enabled: !!user?.email,
    });

    // Update profile mutation

    const updateProfileMutation = useMutation({
        mutationFn: async (data) => {
            await updateUser({
                displayName: data.displayName,
                photoURL: data.photoURL || user.photoURL
            });

            const response = await axiosSecure.patch(`/users/${user.uid}`, {
                displayName: data.displayName,
                photoURL: data.photoURL || user.photoURL,
                email: user.email
            });

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['userProfile', user.uid]);
            queryClient.invalidateQueries(['authUser']);

            setEditMode(false);
            toast.success('Profile updated successfully!');

            setTimeout(() => {
                window.location.reload();
            }, 100);
        },
        onError: (error) => {
            console.error('Update error:', error);
            alert('Profile update failed: ' + error.message);
        }
    });

    const handleSaveProfile = () => {
        if (!displayName.trim()) {
            alert('Please enter your name');
            return;
        }

        updateProfileMutation.mutate({
            displayName,
            photoURL: user.photoURL
        });
    };

    const handleLogout = () => {
            logOutUser()
                .then(() => toast.success('Sign-out successful'))
                .catch(e => toast(e.code))
        }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short'
        });
    };

    const enterEditMode = () => {
        setDisplayName(profileData?.displayName || user?.displayName || user?.email?.split('@')[0] || '');
        setEditMode(true);
    };

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }
    console.log(profileData)

    const userRole = profileData?.role || 'member';
    const userDisplayName = profileData?.displayName || user?.displayName || user?.email?.split('@')[0];
    const userPhotoURL = user?.photoURL || 'https://i.ibb.co.com/prPRyv3K/sojib.jpg';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    <p className="text-gray-600">Manage your account</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6 mb-6"
                    >
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img
                                    src={userPhotoURL}
                                    alt={userDisplayName}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="text-xl font-bold bg-gray-100 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                                autoFocus
                                            />
                                        ) : (
                                            <h2 className="text-xl font-bold text-gray-800">
                                                {userDisplayName}
                                            </h2>
                                        )}

                                        <div className="flex items-center gap-2 mt-1">
                                            <FaEnvelope className="text-gray-400 text-sm" />
                                            <span className="text-gray-600 text-sm">{user?.email}</span>
                                            <span className={`badge badge-xs ${userRole === 'admin' ? 'badge-error' : userRole === 'manager' ? 'badge-warning' : 'badge-success'}`}>
                                                {userRole}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        {editMode ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={updateProfileMutation.isPending}
                                                    className="btn btn-success btn-sm"
                                                >
                                                    {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={() => setEditMode(false)}
                                                    className="btn btn-error btn-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={enterEditMode}
                                                className="btn btn-primary btn-sm"
                                            >
                                                <FaEdit className="mr-1" /> Edit
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Stats for members */}
                                {userRole === 'member' && memberStats && (
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <div className="bg-blue-50 rounded p-2 text-center">
                                            <div className="font-bold text-blue-600">{memberStats.totalClubs || 0}</div>
                                            <div className="text-xs text-gray-600">Clubs</div>
                                        </div>
                                        <div className="bg-green-50 rounded p-2 text-center">
                                            <div className="font-bold text-green-600">{memberStats.totalEvents || 0}</div>
                                            <div className="text-xs text-gray-600">Events</div>
                                        </div>
                                        <div className="bg-purple-50 rounded p-2 text-center">
                                            <div className="font-bold text-purple-600">{memberStats.upcomingEvents?.length || 0}</div>
                                            <div className="text-xs text-gray-600">Upcoming</div>
                                        </div>
                                    </div>
                                )}

                                {!user?.emailVerified && (
                                    <div className="text-warning text-sm">
                                        ⚠️ Email not verified
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Upcoming Events */}
                    {userRole === 'member' && memberStats?.upcomingEvents?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6 mb-6"
                        >
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <FaClock className="text-primary" />
                                Upcoming Events ({memberStats.upcomingEvents.length})
                            </h3>
                            <div className="space-y-2">
                                {memberStats.upcomingEvents.slice(0, 2).map((event, index) => (
                                    <div key={index} className="p-2 hover:bg-gray-50 rounded">
                                        <div className="font-medium">{event.title}</div>
                                        <div className="text-sm text-gray-500">
                                            {event.clubName} • {formatDate(event.eventDate)}
                                        </div>
                                    </div>
                                ))}
                                {memberStats.upcomingEvents.length > 2 && (
                                    <Link to="/my-events" className="text-primary text-sm hover:underline">
                                        View all events →
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h3 className="font-bold mb-3">Quick Links</h3>
                            <div className="space-y-2">
                                <Link to="/my-clubs">
                                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                        <FaUsers className="text-primary" />
                                        <span>My Clubs</span>
                                    </div>
                                </Link>
                                <Link to="/my-events">
                                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                        <FaCalendarAlt className="text-primary" />
                                        <span>My Events</span>
                                    </div>
                                </Link>
                                <Link to="/settings">
                                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                        <FaCog className="text-primary" />
                                        <span>Settings</span>
                                    </div>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full btn btn-error"
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;