import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import ClubCard from '../../Components/ClubCard';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const AllClubsPage = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Fetch all public clubs
    const { data: clubs = [], isLoading } = useQuery({
        queryKey: ['allClubs', categoryFilter, searchText],
        queryFn: async () => {
            let url = '/clubs/all';
            
            // If search or filter, use the regular clubs endpoint
            if (searchText || categoryFilter !== 'all') {
                const params = new URLSearchParams();
                if (searchText) params.append('search', searchText);
                if (categoryFilter !== 'all') params.append('category', categoryFilter);
                
                url = `/clubs?${params.toString()}`;
            }
            
            const res = await axiosSecure.get(url);
            return res.data.filter(club => 
                club.status === 'approved' || club.status === 'active'
            );
        }
    });

    // Get unique categories for filter
    const categories = ['all', ...new Set(clubs.map(club => club.category).filter(Boolean))];

    // Clear all filters
    const clearFilters = () => {
        setSearchText('');
        setCategoryFilter('all');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Discover Amazing Clubs
                    </h1>
                    <p className="text-center text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        Join communities that match your interests. Connect, learn, and grow together.
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search clubs by name, category, or location..."
                                    className="input input-bordered pl-12 w-full"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                {searchText && (
                                    <button
                                        onClick={() => setSearchText('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    >
                                        <FaTimes className="text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="w-full md:w-auto">
                            <div className="flex items-center gap-2">
                                <FaFilter className="text-gray-500" />
                                <select
                                    className="select select-bordered"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {(searchText || categoryFilter !== 'all') && (
                            <button
                                onClick={clearFilters}
                                className="btn btn-outline btn-sm"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Active Filters Display */}
                    {(searchText || categoryFilter !== 'all') && (
                        <div className="mt-4 flex gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {searchText && (
                                <span className="badge badge-outline">
                                    Search: {searchText}
                                </span>
                            )}
                            {categoryFilter !== 'all' && (
                                <span className="badge badge-outline">
                                    Category: {categoryFilter}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Clubs Count */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                        {clubs.length} {clubs.length === 1 ? 'Club' : 'Clubs'} Found
                    </h2>
                </div>

                {/* Clubs Grid */}
                {clubs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4 opacity-20">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">No Clubs Found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchText || categoryFilter !== 'all' 
                                    ? 'Try changing your search criteria' 
                                    : 'No clubs available at the moment'}
                            </p>
                            {(searchText || categoryFilter !== 'all') && (
                                <button
                                    onClick={clearFilters}
                                    className="btn btn-primary"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubs.map(club => (
                            <ClubCard key={club._id} club={club} />
                        ))}
                    </div>
                )}

                {/* Stats Section */}
                {clubs.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-bold mb-4">Club Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="stat bg-white shadow rounded-lg p-4">
                                <div className="stat-title">Total Clubs</div>
                                <div className="stat-value">{clubs.length}</div>
                            </div>
                            <div className="stat bg-white shadow rounded-lg p-4">
                                <div className="stat-title">Categories</div>
                                <div className="stat-value">
                                    {new Set(clubs.map(c => c.category)).size}
                                </div>
                            </div>
                            <div className="stat bg-white shadow rounded-lg p-4">
                                <div className="stat-title">Total Members</div>
                                <div className="stat-value">
                                    {clubs.reduce((sum, club) => sum + (club.totalMembers || 0), 0)}
                                </div>
                            </div>
                            <div className="stat bg-white shadow rounded-lg p-4">
                                <div className="stat-title">Free Clubs</div>
                                <div className="stat-value">
                                    {clubs.filter(c => c.membershipFee === 0).length}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllClubsPage;