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
    FaCog,
    FaCheckCircle,
    FaExclamationTriangle,
    FaHistory,
    FaBell,
    FaShieldAlt
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
            month: 'short',
            year: 'numeric'
        });
    };

    const enterEditMode = () => {
        setDisplayName(profileData?.displayName || user?.displayName || user?.email?.split('@')[0] || '');
        setEditMode(true);
    };

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary dark:text-primary/80"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    const userRole = profileData?.role || 'member';
    const userDisplayName = profileData?.displayName || user?.displayName || user?.email?.split('@')[0];
    const userPhotoURL = user?.photoURL || 'https://i.ibb.co.com/prPRyv3K/sojib.jpg';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block mb-4"
                    >
                        <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl">
                            <FaUser className="text-2xl text-primary dark:text-primary/80" />
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-2"></div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Main Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-800/50 p-6 md:p-8 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                    >
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Profile Picture */}
                            <div className="relative">
                                <img
                                    src={userPhotoURL}
                                    alt={userDisplayName}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-secondary text-white p-2 rounded-full">
                                    <FaUser className="text-sm" />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                                    <div>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="text-2xl font-bold bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/80 text-gray-800 dark:text-white w-full"
                                                autoFocus
                                                placeholder="Enter your name"
                                            />
                                        ) : (
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                                {userDisplayName}
                                            </h2>
                                        )}

                                        <div className="flex flex-wrap items-center gap-3 mt-3">
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-gray-400 dark:text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{user?.email}</span>
                                            </div>
                                            <span className={`badge badge-lg ${userRole === 'admin' 
                                                ? 'badge-error text-error-content dark:bg-red-900/30 dark:text-red-400' 
                                                : userRole === 'manager' 
                                                ? 'badge-warning text-warning-content dark:bg-amber-900/30 dark:text-amber-400'
                                                : 'badge-success text-success-content dark:bg-green-900/30 dark:text-green-400'}`}>
                                                {userRole.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Edit/Save Button */}
                                    <div className="flex gap-2">
                                        {editMode ? (
                                            <>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={updateProfileMutation.isPending}
                                                    className="btn btn-success dark:bg-green-600 dark:text-white btn-sm md:btn-md"
                                                >
                                                    <FaSave className="mr-2" />
                                                    {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={() => setEditMode(false)}
                                                    className="btn btn-error dark:bg-red-600 dark:text-white btn-sm md:btn-md"
                                                >
                                                    <FaTimes className="mr-2" />
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={enterEditMode}
                                                className="btn btn-primary dark:bg-gradient-to-r dark:from-primary/90 dark:to-secondary/90 btn-sm md:btn-md"
                                            >
                                                <FaEdit className="mr-2" /> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Email Verification Status */}
                                {!user?.emailVerified && (
                                    <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg mb-4">
                                        <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400" />
                                        <span className="text-yellow-700 dark:text-yellow-300 text-sm">
                                            Please verify your email address to access all features
                                        </span>
                                    </div>
                                )}

                                {/* Member Stats */}
                                {userRole === 'member' && memberStats && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{memberStats.totalClubs || 0}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Clubs</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{memberStats.totalEvents || 0}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Events</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{memberStats.upcomingEvents?.length || 0}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Upcoming</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 rounded-xl p-4 text-center">
                                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                                {memberStats.totalClubs + memberStats.totalEvents || 0}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total</div>
                                        </div>
                                    </div>
                                )}

                                {/* Profile Completion */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        <span>Profile Completion</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" 
                                            style={{ width: '85%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Upcoming Events */}
                            {userRole === 'member' && memberStats?.upcomingEvents?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                            <FaClock className="text-primary dark:text-primary/80" />
                                            Upcoming Events
                                        </h3>
                                        <span className="badge bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/80">
                                            {memberStats.upcomingEvents.length}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {memberStats.upcomingEvents.slice(0, 3).map((event, index) => (
                                            <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
                                                <div className="font-medium text-gray-800 dark:text-white">{event.title}</div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    <FaCalendarAlt className="text-xs" />
                                                    {formatDate(event.eventDate)}
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {event.clubName}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {memberStats.upcomingEvents.length > 3 && (
                                            <Link to="/my-events" className="text-primary dark:text-primary/80 text-sm font-medium hover:underline block text-center pt-2">
                                                View all events →
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Account Settings */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                            >
                                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <FaShieldAlt className="text-primary dark:text-primary/80" />
                                    Account Security
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Email Verified</span>
                                        {user?.emailVerified ? (
                                            <FaCheckCircle className="text-green-500 dark:text-green-400" />
                                        ) : (
                                            <button className="text-xs text-primary dark:text-primary/80 hover:underline">
                                                Verify Now
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Two-Factor Auth</span>
                                        <button className="text-xs text-primary dark:text-primary/80 hover:underline">
                                            Enable
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Password</span>
                                        <button className="text-xs text-primary dark:text-primary/80 hover:underline">
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                            >
                                <h3 className="font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/my-clubs">
                                        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300">
                                            <FaUsers className="text-2xl text-blue-600 dark:text-blue-400 mb-2" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">My Clubs</span>
                                        </div>
                                    </Link>
                                    <Link to="/my-events">
                                        <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-300">
                                            <FaCalendarAlt className="text-2xl text-green-600 dark:text-green-400 mb-2" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">My Events</span>
                                        </div>
                                    </Link>
                                    <Link to="/my-payments">
                                        <div className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-300">
                                            <FaHistory className="text-2xl text-purple-600 dark:text-purple-400 mb-2" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Payments</span>
                                        </div>
                                    </Link>
                                    <Link to="/settings">
                                        <div className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-300">
                                            <FaCog className="text-2xl text-amber-600 dark:text-amber-400 mb-2" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
                                        </div>
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Notifications Settings */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-800/50 p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                            >
                                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <FaBell className="text-primary dark:text-primary/80" />
                                    Notifications
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Event Reminders</span>
                                        <input type="checkbox" className="toggle toggle-sm toggle-primary" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Club Updates</span>
                                        <input type="checkbox" className="toggle toggle-sm toggle-primary" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Payment Receipts</span>
                                        <input type="checkbox" className="toggle toggle-sm toggle-primary" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full btn btn-error dark:bg-primary dark:text-white dark:hover:bg-red-700 mt-6 rounded-xl py-4 text-lg"
                    >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;