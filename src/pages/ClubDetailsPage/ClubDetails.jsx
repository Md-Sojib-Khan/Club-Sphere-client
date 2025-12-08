import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
    FaMapMarkerAlt, 
    FaUsers, 
    FaMoneyBillWave, 
    FaCalendar, 
    FaEnvelope,
    FaPhone,
    FaGlobe,
    FaArrowLeft,
    FaUserPlus,
    FaUserMinus
} from 'react-icons/fa';
import { MdCategory, MdDescription } from 'react-icons/md';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const ClubDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isJoining, setIsJoining] = useState(false);

    // Fetch club details
    const { data: club, isLoading } = useQuery({
        queryKey: ['club', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/clubs/${id}`);
            return res.data;
        }
    });

    // Check if current user is already a member
    const isMember = club?.members?.some(member => member.userId === user?._id);

    // Join Club Mutation
    const joinClubMutation = useMutation({
        mutationFn: async () => {
            return axiosSecure.patch(`/clubs/${id}/join`, {
                userId: user._id,
                userEmail: user.email
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['club', id]);
            Swal.fire({
                icon: 'success',
                title: 'Joined Successfully!',
                text: `You have joined ${club?.clubName}`,
                timer: 2000
            });
            setIsJoining(false);
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Join Failed',
                text: error.message
            });
            setIsJoining(false);
        }
    });

    // Leave Club Mutation
    const leaveClubMutation = useMutation({
        mutationFn: async () => {
            return axiosSecure.patch(`/clubs/${id}/leave`, {
                userId: user._id
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['club', id]);
            Swal.fire({
                icon: 'success',
                title: 'Left Club',
                text: `You have left ${club?.clubName}`,
                timer: 2000
            });
        }
    });

    // Handle join club
    const handleJoinClub = () => {
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to join this club'
            });
            return;
        }

        setIsJoining(true);
        joinClubMutation.mutate();
    };

    // Handle leave club
    const handleLeaveClub = () => {
        Swal.fire({
            title: 'Leave Club?',
            text: `Are you sure you want to leave ${club?.clubName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, leave it'
        }).then((result) => {
            if (result.isConfirmed) {
                leaveClubMutation.mutate();
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Club Not Found</h2>
                <button onClick={() => navigate('/clubs')} className="btn btn-primary">
                    Back to Clubs
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/clubs')}
                    className="btn btn-outline mb-6"
                >
                    <FaArrowLeft /> Back to Clubs
                </button>

                {/* Club Banner */}
                <div className="relative mb-8 rounded-xl overflow-hidden">
                    <img
                        src={club.bannerImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'}
                        alt={club.clubName}
                        className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{club.clubName}</h1>
                        <div className="flex items-center gap-4">
                            <div className={`badge ${club.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                                {club.status}
                            </div>
                            <div className="badge badge-outline">{club.category}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Club Details */}
                    <div className="lg:col-span-2">
                        {/* Description */}
                        <div className="bg-white rounded-xl shadow p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MdDescription /> Description
                            </h2>
                            <p className="text-gray-700 whitespace-pre-line">{club.description}</p>
                        </div>

                        {/* Club Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Contact Info */}
                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <FaEnvelope className="text-gray-500" />
                                        <span>{club.managerEmail}</span>
                                    </div>
                                    {club.contactPhone && (
                                        <div className="flex items-center gap-3">
                                            <FaPhone className="text-gray-500" />
                                            <span>{club.contactPhone}</span>
                                        </div>
                                    )}
                                    {club.website && (
                                        <div className="flex items-center gap-3">
                                            <FaGlobe className="text-gray-500" />
                                            <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {club.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Club Stats */}
                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-lg font-bold mb-4">Club Statistics</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <FaUsers className="text-blue-500" />
                                        <span>{club.totalMembers || 0} Members</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaMoneyBillWave className="text-green-500" />
                                        <span>{club.membershipFee === 0 ? 'Free Membership' : `$${club.membershipFee}`}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaCalendar className="text-purple-500" />
                                        <span>Created: {new Date(club.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaMapMarkerAlt className="text-red-500" />
                                        <span>{club.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Members List */}
                        {club.members && club.members.length > 0 && (
                            <div className="bg-white rounded-xl shadow p-6">
                                <h3 className="text-lg font-bold mb-4">Club Members ({club.members.length})</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {club.members.slice(0, 6).map((member, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                    <span>{member.userEmail[0].toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium">{member.userEmail}</p>
                                                <p className="text-sm text-gray-500">
                                                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {club.members.length > 6 && (
                                    <p className="text-center mt-4 text-gray-600">
                                        + {club.members.length - 6} more members
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Action Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow p-6 sticky top-6">
                            {/* Join/Leave Button */}
                            {user ? (
                                isMember ? (
                                    <button
                                        onClick={handleLeaveClub}
                                        className="btn btn-error w-full mb-4"
                                        disabled={leaveClubMutation.isLoading}
                                    >
                                        <FaUserMinus /> Leave Club
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleJoinClub}
                                        className="btn btn-primary w-full mb-4"
                                        disabled={isJoining || joinClubMutation.isLoading}
                                    >
                                        {isJoining ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Joining...
                                            </>
                                        ) : (
                                            <>
                                                <FaUserPlus /> Join Club
                                            </>
                                        )}
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn btn-primary w-full mb-4"
                                >
                                    <FaUserPlus /> Login to Join
                                </button>
                            )}

                            {/* Quick Info */}
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-bold text-blue-800 mb-2">Membership</h4>
                                    <p className="text-blue-700">
                                        {club.membershipFee === 0 ? 'Free to join' : `$${club.membershipFee} membership fee`}
                                    </p>
                                </div>

                                <div className="p-4 bg-green-50 rounded-lg">
                                    <h4 className="font-bold text-green-800 mb-2">Status</h4>
                                    <p className="text-green-700 capitalize">{club.status}</p>
                                </div>

                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <h4 className="font-bold text-purple-800 mb-2">Category</h4>
                                    <p className="text-purple-700">{club.category}</p>
                                </div>

                                <div className="p-4 bg-orange-50 rounded-lg">
                                    <h4 className="font-bold text-orange-800 mb-2">Location</h4>
                                    <p className="text-orange-700">{club.location}</p>
                                </div>
                            </div>

                            {/* Club Manager Info */}
                            <div className="mt-6 pt-6 border-t">
                                <h4 className="font-bold mb-3">Club Manager</h4>
                                <div className="flex items-center gap-3">
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                                            <span>{club.managerEmail[0].toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-medium">Club Owner</p>
                                        <p className="text-sm text-gray-600">{club.managerEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubDetails;