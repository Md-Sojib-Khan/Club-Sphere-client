import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { FaUsers, FaCalendar } from 'react-icons/fa';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';


const MyMemberships = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch user's memberships
    const { data: memberships = [], isLoading } = useQuery({
        queryKey: ['myMemberships', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/memberships/user/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Fetch club details for each membership
    const { data: clubs = [] } = useQuery({
        queryKey: ['myClubsDetails', memberships],
        queryFn: async () => {
            const clubIds = memberships.map(m => m.clubId);
            if (clubIds.length === 0) return [];
            
            const promises = clubIds.map(clubId => 
                axiosSecure.get(`/clubs/${clubId}`)
            );
            
            const results = await Promise.all(promises);
            return results.map(r => r.data);
        },
        enabled: memberships.length > 0
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">My Memberships</h2>

            {memberships.length === 0 ? (
                <div className="text-center py-12">
                    <FaUsers className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">You haven't joined any clubs yet</p>
                    <Link to="/clubs" className="btn btn-primary">
                        Browse Clubs
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map(club => {
                        const membership = memberships.find(m => m.clubId === club._id);
                        return (
                            <div key={club._id} className="card bg-base-100 shadow">
                                <div className="card-body">
                                    <h3 className="card-title">{club.clubName}</h3>
                                    <p className="text-gray-600">{club.category}</p>
                                    
                                    <div className="space-y-2 mt-4">
                                        <div className="flex items-center gap-2">
                                            <FaCalendar className="text-gray-500" />
                                            <span>Joined: {new Date(membership.joinedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="badge badge-success">
                                            Active Member
                                        </div>
                                    </div>

                                    <div className="card-actions mt-4">
                                        <Link to={`/clubs/${club._id}`} className="btn btn-outline btn-sm">
                                            View Club
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyMemberships;