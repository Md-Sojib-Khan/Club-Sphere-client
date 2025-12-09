import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Loading from '../../Components/Loading';

const ClubDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

     // Fetch club details
    const { data: club, isLoading, refetch: refetchClub } = useQuery({
        queryKey: ['club', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/clubs/${id}`);
            return res.data;
        }
    });

    // Check membership
    const { data: membership, refetch: refetchMembership } = useQuery({
        queryKey: ['membership', id, user?.email],
        queryFn: async () => {
            if (!user) return null;
            const res = await axiosSecure.get(`/memberships/check?clubId=${id}&userEmail=${user.email}`);
            return res.data;
        },
        enabled: !!user
    });

    // Handle Join/Payment
    const handleJoin = async () => {
        if (!user) {
            Swal.fire('Login Required', 'Please login first', 'warning');
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            if (club.membershipFee === 0) {
                // Free club - direct join
                const res = await axiosSecure.post('/memberships', {
                    userEmail: user.email,
                    clubId: id,
                    status: 'active',
                    joinedAt: new Date()
                });

                if (res.data) {
                    await refetchMembership();
                    await refetchClub();
                    Swal.fire('Success!', 'You have joined the club!', 'success');
                }
            } else {
                // Paid club - Stripe payment
                const res = await axiosSecure.post('/create-checkout-session', {
                    userEmail: user.email,
                    amount: club.membershipFee,
                    clubId: id,
                    clubName: club.clubName
                });

                // Redirect to Stripe Checkout
                window.location.href = res.data.url;
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', error.response?.data?.error || error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle Leave
    const handleLeave = async () => {
        Swal.fire({
            title: 'Leave Club?',
            text: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, leave'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/memberships/${id}?userEmail=${user.email}`);
                    refetchMembership();
                    Swal.fire('Success!', 'You left the club', 'success');
                } catch (error) {
                    Swal.fire('Error!', error.message, 'error');
                }
            }
        });
    };

    if (isLoading) {
        return <Loading></Loading> ;
    }

    if (!club) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Club Not Found</h2>
                <button onClick={() => navigate('/all-clubs')} className="btn btn-primary">
                    Back to Clubs
                </button>
            </div>
        );
    }

    const isMember = membership?.isMember;

    return (
        <div className="container mx-auto px-4 py-8">
            <button onClick={() => navigate('/all-clubs')} className="btn btn-outline mb-6">
                <FaArrowLeft /> Back
            </button>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="md:w-1/3">
                    <img
                        src={club.bannerImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'}
                        alt={club.clubName}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                </div>

                <div className="md:w-2/3">
                    <h1 className="text-3xl font-bold mb-2">{club.clubName}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="badge badge-success">{club.status}</span>
                        <span className="badge badge-outline">{club.category}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{club.description}</p>

                    {/* Action Button */}
                    <div className="mb-6">
                        {user ? (
                            isMember ? (
                                <button onClick={handleLeave} className="btn btn-error">
                                    Leave Club
                                </button>
                            ) : (
                                <button 
                                    onClick={handleJoin}
                                    disabled={loading}
                                    className="btn btn-primary"
                                >
                                    {loading ? 'Processing...' : 
                                     club.membershipFee === 0 ? 'Join Free' : `Join for $${club.membershipFee}`}
                                </button>
                            )
                        ) : (
                            <button onClick={() => navigate('/login')} className="btn btn-primary">
                                Login to Join
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <span className="font-medium">Location</span>
                    <p>{club.location}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <span className="font-medium">Membership Fee</span>
                    <p className={club.membershipFee === 0 ? 'text-green-600 font-bold' : ''}>
                        {club.membershipFee === 0 ? 'Free' : `$${club.membershipFee}`}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <span className="font-medium">Members</span>
                    <p>{club.totalMembers || 0} members</p>
                </div>
            </div>
        </div>
    );
};

export default ClubDetails;