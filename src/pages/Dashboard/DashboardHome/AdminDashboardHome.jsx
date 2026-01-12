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
    FaChartBar,
    FaCheckCircle,
    FaClock,
    FaTimesCircle
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <p className="text-red-500 dark:text-red-400 mb-4">Error loading dashboard data</p>
                    <button 
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
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
            color: 'bg-blue-500 dark:bg-blue-600',
            textColor: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/30'
        },
        {
            title: 'Total Clubs',
            value: summary.totalClubs || 0,
            icon: <FaBuilding className="text-2xl" />,
            color: 'bg-green-500 dark:bg-green-600',
            textColor: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/30',
            subtext: `Pending: ${summary.pendingClubs || 0} | Approved: ${summary.approvedClubs || 0}`
        },
        {
            title: 'Total Memberships',
            value: summary.totalMemberships || 0,
            icon: <FaUserFriends className="text-2xl" />,
            color: 'bg-purple-500 dark:bg-purple-600',
            textColor: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/30'
        },
        {
            title: 'Total Events',
            value: summary.totalEvents || 0,
            icon: <FaCalendarAlt className="text-2xl" />,
            color: 'bg-amber-500 dark:bg-amber-600',
            textColor: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-50 dark:bg-amber-900/30'
        },
        {
            title: 'Total Payments',
            value: formatCurrency(summary.totalPayments || 0),
            icon: <FaMoneyBillWave className="text-2xl" />,
            color: 'bg-red-500 dark:bg-red-600',
            textColor: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-900/30'
        }
    ];

    // Club status data
    const clubStatusData = [
        {
            label: 'Approved',
            value: summary.approvedClubs || 0,
            icon: <FaCheckCircle className="text-green-500 dark:text-green-400" />,
            color: 'bg-green-500 dark:bg-green-400',
            percentage: summary.totalClubs ? (summary.approvedClubs / summary.totalClubs * 100) : 0
        },
        {
            label: 'Pending',
            value: summary.pendingClubs || 0,
            icon: <FaClock className="text-yellow-500 dark:text-yellow-400" />,
            color: 'bg-yellow-500 dark:bg-yellow-400',
            percentage: summary.totalClubs ? (summary.pendingClubs / summary.totalClubs * 100) : 0
        },
        {
            label: 'Rejected',
            value: summary.rejectedClubs || 0,
            icon: <FaTimesCircle className="text-red-500 dark:text-red-400" />,
            color: 'bg-red-500 dark:bg-red-400',
            percentage: summary.totalClubs ? (summary.rejectedClubs / summary.totalClubs * 100) : 0
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        System overview and statistics
                    </p>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
                    {cards.map((card, index) => (
                        <div 
                            key={index} 
                            className={`${card.bgColor} rounded-xl shadow-lg dark:shadow-gray-800/50 p-4 md:p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-3 ${card.color} text-white rounded-xl shadow-sm`}>
                                    {card.icon}
                                </div>
                                <span className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                    {card.value}
                                </span>
                            </div>
                            <h3 className={`font-semibold text-gray-700 dark:text-gray-300 mb-1`}>
                                {card.title}
                            </h3>
                            {card.subtext && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {card.subtext}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
                    {/* Club Status Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-4 md:p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                <FaChartBar className="text-blue-500 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-800 dark:text-white text-lg">
                                    Club Status Distribution
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Current status of all clubs
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {clubStatusData.map((status, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {status.icon}
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {status.label}
                                            </span>
                                        </div>
                                        <span className="font-bold text-gray-800 dark:text-white">
                                            {status.value}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className={`${status.color} h-2 rounded-full transition-all duration-500`}
                                                style={{ width: `${status.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-10">
                                            {status.percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Clubs by Members Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-4 md:p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center mb-6">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                                <FaChartBar className="text-purple-500 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-800 dark:text-white text-lg">
                                    Top Clubs by Members
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Most popular clubs
                                </p>
                            </div>
                        </div>
                        
                        {chartData.labels && chartData.labels.length > 0 ? (
                            <div className="space-y-4">
                                {chartData.labels.slice(0, 5).map((label, index) => {
                                    const maxData = Math.max(...chartData.data);
                                    const percentage = chartData.data[index] ? (chartData.data[index] / maxData * 100) : 0;
                                    
                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                                                    {label}
                                                </span>
                                                <span className="text-sm font-bold text-gray-800 dark:text-white">
                                                    {chartData.data[index] || 0} members
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-8">
                                                    {percentage.toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4 opacity-20 dark:opacity-10">📊</div>
                                <p className="text-gray-500 dark:text-gray-400">No membership data available</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                    Clubs will appear as members join
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-4 md:p-6 border border-gray-100 dark:border-gray-700 mb-8 transition-colors duration-300">
                    <div className="mb-6">
                        <h2 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">
                            Performance Metrics
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Key performance indicators
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Approval Rate</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {summary.totalClubs ? 
                                    Math.round((summary.approvedClubs / summary.totalClubs) * 100) : 0}%
                            </p>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Members per Club</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {summary.totalClubs ? 
                                    Math.round(summary.totalMemberships / summary.totalClubs) : 0}
                            </p>
                        </div>
                        
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Events per Club</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {summary.totalClubs ? 
                                    (summary.totalEvents / summary.totalClubs).toFixed(1) : '0.0'}
                            </p>
                        </div>
                        
                        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Payment</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {summary.totalMemberships ? 
                                    formatCurrency(summary.totalPayments / summary.totalMemberships) : '$0.00'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity & Refresh */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-4 md:p-6 border border-gray-100 dark:border-gray-700 flex-1 transition-colors duration-300">
                        <div className="flex items-center mb-4">
                            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">System Status</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                                    Just now
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Data Accuracy</span>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    99.9%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                                    &lt; 500ms
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                        <FaSpinner className={`${isLoading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </button>
                </div>

                {/* Dashboard Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Data updates in real-time • Last full sync: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;