import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import ClubCard from '../../Components/ClubCard';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../Components/Loading';

const AllClubsPage = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [inputValue, setInputValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(inputValue);
        }, 1000); // 500ms delay

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Fetch all public clubs with sorting
    const { data: clubs = [], isLoading } = useQuery({
        queryKey: ['allClubs', categoryFilter, debouncedSearch, sortOption],
        queryFn: async () => {
            try {
                let url = '/clubs/all';
                const params = new URLSearchParams();
                
                // Add category filter
                if (categoryFilter !== 'all') {
                    params.append('category', categoryFilter);
                }
                
                // Add search text
                if (debouncedSearch) {
                    params.append('search', debouncedSearch);
                }
                
                // Add sorting parameters based on sortOption
                if (sortOption) {
                    params.append('sort', sortOption);
                }
                
                // If we have any params, use the regular clubs endpoint
                if (params.toString()) {
                    url = `/clubs?${params.toString()}`;
                }
                
                const res = await axiosSecure.get(url);
                return res.data.filter(club =>
                    club.status === 'approved' || club.status === 'active'
                );
            } catch (error) {
                console.error('Error fetching clubs:', error);
                return [];
            }
        }
    });

    // Sort clubs locally if needed (fallback)
    const sortedClubs = React.useMemo(() => {
        if (!clubs.length) return [];
        
        const clubsCopy = [...clubs];
        
        switch (sortOption) {
            case 'newest':
                return clubsCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return clubsCopy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'highest-fee':
                return clubsCopy.sort((a, b) => (b.membershipFee || 0) - (a.membershipFee || 0));
            case 'lowest-fee':
                return clubsCopy.sort((a, b) => (a.membershipFee || 0) - (b.membershipFee || 0));
            case 'most-members':
                return clubsCopy.sort((a, b) => (b.totalMembers || 0) - (a.totalMembers || 0));
            case 'least-members':
                return clubsCopy.sort((a, b) => (a.totalMembers || 0) - (b.totalMembers || 0));
            default:
                return clubsCopy;
        }
    }, [clubs, sortOption]);

    // Get unique categories for filter
    const categories = ['all', ...new Set(clubs.map(club => club.category).filter(Boolean))];

    // Sort options
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'highest-fee', label: 'Highest Fee First' },
        { value: 'lowest-fee', label: 'Lowest Fee First' },
        { value: 'most-members', label: 'Most Members First' },
        { value: 'least-members', label: 'Least Members First' }
    ];

    // Clear all filters
    const clearFilters = () => {
        setInputValue('');
        setDebouncedSearch('');
        setCategoryFilter('all');
        setSortOption('newest');
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            setDebouncedSearch(inputValue);
        }
    };

    if (isLoading) {
        return <Loading />;
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search Input */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search clubs by name, category, or location..."
                                    className="input input-bordered pl-12 w-full"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleSearchSubmit}
                                />
                                {(inputValue || debouncedSearch) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setInputValue('');
                                            setDebouncedSearch('');
                                        }}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    >
                                        <FaTimes className="text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <div className="flex items-center gap-2">
                                <FaFilter className="text-gray-500" />
                                <select
                                    className="select select-bordered w-full"
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

                        {/* Sort Filter */}
                        <div>
                            <div className="flex items-center gap-2">
                                <FaSortAmountDown className="text-gray-500" />
                                <select
                                    className="select select-bordered w-full"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(debouncedSearch || categoryFilter !== 'all' || sortOption !== 'newest') && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {debouncedSearch && (
                                <span className="badge badge-outline">
                                    Search: {debouncedSearch}
                                </span>
                            )}
                            {categoryFilter !== 'all' && (
                                <span className="badge badge-outline">
                                    Category: {categoryFilter}
                                </span>
                            )}
                            {sortOption !== 'newest' && (
                                <span className="badge badge-outline">
                                    Sort: {sortOptions.find(opt => opt.value === sortOption)?.label}
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="btn btn-outline btn-xs ml-auto"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* Clubs Count and Sort Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">
                        {sortedClubs.length} {sortedClubs.length === 1 ? 'Club' : 'Clubs'} Found
                    </h2>
                    
                    {sortOption !== 'newest' && (
                        <div className="text-sm text-gray-600">
                            Sorted by: <span className="font-semibold">
                                {sortOptions.find(opt => opt.value === sortOption)?.label}
                            </span>
                        </div>
                    )}
                </div>

                {/* Clubs Grid */}
                {sortedClubs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4 opacity-20">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">No Clubs Found</h3>
                            <p className="text-gray-600 mb-6">
                                {debouncedSearch || categoryFilter !== 'all' 
                                    ? 'Try changing your search criteria' 
                                    : 'No clubs available at the moment'}
                            </p>
                            {(debouncedSearch || categoryFilter !== 'all') && (
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
                        {sortedClubs.map(club => (
                            <ClubCard key={club._id} club={club} />
                        ))}
                    </div>
                )}

                {/* Stats Section */}
                {sortedClubs.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-bold mb-4">Club Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="stat bg-white shadow rounded-lg p-4">
                                <div className="stat-title">Total Clubs</div>
                                <div className="stat-value">{sortedClubs.length}</div>
                            </div>
                            <div className="stat bg-white shadow rounded-lg p-4">
                                <div className="stat-title">Categories</div>
                                <div className="stat-value">
                                    {new Set(sortedClubs.map(c => c.category)).size}
                                </div>
                            </div>
                            <div className="stat bg-white shadow rounded-lg p-4">
                                <div className="stat-title">Total Members</div>
                                <div className="stat-value">
                                    {sortedClubs.reduce((sum, club) => sum + (club.totalMembers || 0), 0)}
                                </div>
                            </div>
                            <div className="stat bg-white shadow rounded-lg p-4">
                                <div className="stat-title">Free Clubs</div>
                                <div className="stat-value">
                                    {sortedClubs.filter(c => (c.membershipFee || 0) === 0).length}
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