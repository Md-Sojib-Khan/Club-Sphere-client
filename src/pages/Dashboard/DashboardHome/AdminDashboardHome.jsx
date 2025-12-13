// AdminDashboardHome.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaUsers, 
    FaBuilding, 
    FaCalendarAlt, 
    FaMoneyBillWave,
    FaUserFriends,
    FaSpinner,
    FaChartBar
} from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminDashboardHome = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch dashboard data with React Query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['adminDashboard'],
        queryFn: async () => {
            const response = await axiosSecure.get('/api/admin/dashboard');
            return response.data;
        }
    });

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500">Error loading data</p>
                    <button 
                        onClick={() => refetch()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { summary = {}, chartData = {} } = data || {};

    // Summary cards data
    const cards = [
        {
            title: 'Total Users',
            value: summary.totalUsers || 0,
            icon: <FaUsers className="text-2xl" />,
            color: 'bg-blue-500'
        },
        {
            title: 'Total Clubs',
            value: summary.totalClubs || 0,
            icon: <FaBuilding className="text-2xl" />,
            color: 'bg-green-500',
            subtext: `Pending: ${summary.pendingClubs || 0} | Approved: ${summary.approvedClubs || 0}`
        },
        {
            title: 'Total Memberships',
            value: summary.totalMemberships || 0,
            icon: <FaUserFriends className="text-2xl" />,
            color: 'bg-purple-500'
        },
        {
            title: 'Total Events',
            value: summary.totalEvents || 0,
            icon: <FaCalendarAlt className="text-2xl" />,
            color: 'bg-yellow-500'
        },
        {
            title: 'Total Payments',
            value: formatCurrency(summary.totalPayments || 0),
            icon: <FaMoneyBillWave className="text-2xl" />,
            color: 'bg-red-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600">System overview and statistics</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {cards.map((card, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 ${card.color} text-white rounded-lg`}>
                                    {card.icon}
                                </div>
                                <span className="text-2xl font-bold">{card.value}</span>
                            </div>
                            <h3 className="font-semibold text-gray-700">{card.title}</h3>
                            {card.subtext && (
                                <p className="text-sm text-gray-500 mt-1">{card.subtext}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Club Status Chart */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center mb-4">
                            <FaChartBar className="mr-2 text-blue-500" />
                            <h2 className="font-semibold text-gray-700">Club Status</h2>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Approved</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${summary.totalClubs ? (summary.approvedClubs / summary.totalClubs * 100) : 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="font-medium">{summary.approvedClubs || 0}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Pending</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                        <div 
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${summary.totalClubs ? (summary.pendingClubs / summary.totalClubs * 100) : 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="font-medium">{summary.pendingClubs || 0}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Rejected</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                        <div 
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${summary.totalClubs ? (summary.rejectedClubs / summary.totalClubs * 100) : 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="font-medium">{summary.rejectedClubs || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Memberships per Club Chart */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center mb-4">
                            <FaChartBar className="mr-2 text-purple-500" />
                            <h2 className="font-semibold text-gray-700">Top Clubs by Members</h2>
                        </div>
                        
                        {chartData.labels && chartData.labels.length > 0 ? (
                            <div className="space-y-3">
                                {chartData.labels.slice(0, 5).map((label, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="w-32 text-sm truncate mr-2">{label}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="bg-purple-500 h-3 rounded-full"
                                                style={{ 
                                                    width: `${chartData.data[index] ? (chartData.data[index] / Math.max(...chartData.data) * 100) : 0}%` 
                                                }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm font-medium">
                                            {chartData.data[index] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No membership data available</p>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 bg-white rounded-lg shadow p-4">
                    <h2 className="font-semibold text-gray-700 mb-3">Quick Stats</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded">
                            <p className="text-sm text-gray-600">Approval Rate</p>
                            <p className="text-xl font-bold text-blue-600">
                                {summary.totalClubs ? 
                                    Math.round((summary.approvedClubs / summary.totalClubs) * 100) : 0}%
                            </p>
                        </div>
                        
                        <div className="text-center p-3 bg-green-50 rounded">
                            <p className="text-sm text-gray-600">Members per Club</p>
                            <p className="text-xl font-bold text-green-600">
                                {summary.totalClubs ? 
                                    Math.round(summary.totalMemberships / summary.totalClubs) : 0}
                            </p>
                        </div>
                        
                        <div className="text-center p-3 bg-purple-50 rounded">
                            <p className="text-sm text-gray-600">Events per Club</p>
                            <p className="text-xl font-bold text-purple-600">
                                {summary.totalClubs ? 
                                    (summary.totalEvents / summary.totalClubs).toFixed(1) : '0.0'}
                            </p>
                        </div>
                        
                        <div className="text-center p-3 bg-red-50 rounded">
                            <p className="text-sm text-gray-600">Avg. Payment</p>
                            <p className="text-xl font-bold text-red-600">
                                {summary.totalMemberships ? 
                                    formatCurrency(summary.totalPayments / summary.totalMemberships) : '$0.00'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Refresh Data
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboardHome;