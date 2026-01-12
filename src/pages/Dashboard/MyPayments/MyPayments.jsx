// MyPayments.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaMoneyBillWave, 
    FaCalendarAlt, 
    FaSpinner,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaDownload,
    FaFilter,
    FaReceipt
} from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyPayments = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch user's payment history
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['userPayments', user?.email],
        queryFn: async () => {
            if (!user?.email) throw new Error('Please login');
            
            const response = await axiosSecure.get(
                `/api/user/payments?userEmail=${user.email}`
            );
            return response.data;
        },
        enabled: !!user?.email
    });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed':
                return (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium flex items-center w-fit">
                        <FaCheckCircle className="mr-2" /> Completed
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium flex items-center w-fit">
                        <FaClock className="mr-2" /> Pending
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium flex items-center w-fit">
                        <FaTimesCircle className="mr-2" /> Failed
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading payment history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <p className="text-red-500 dark:text-red-400 mb-4">Error loading payments</p>
                    <button 
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { payments = [], summary = {} } = data || {};

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <FaMoneyBillWave className="text-2xl text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                My Payment History
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                All your past payment transactions
                            </p>
                        </div>
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {formatCurrency(summary.totalAmount || 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <FaMoneyBillWave className="text-2xl text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Across all payments
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Payments</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                    {summary.totalPayments || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <FaReceipt className="text-2xl text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Payment transactions
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Payment</p>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                                    {formatCurrency(
                                        summary.totalPayments 
                                            ? (summary.totalAmount / summary.totalPayments) 
                                            : 0
                                    )}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <FaMoneyBillWave className="text-2xl text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Per transaction
                        </div>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    {payments.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <FaMoneyBillWave className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                No Payment History Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Join clubs to make payments and see them here
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                            Payment History
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {summary.totalPayments || 0} transactions
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => refetch()}
                                        className="btn btn-outline dark:btn-outline-dark btn-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <FaSpinner className="mr-2" /> Refresh
                                    </button>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Details
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Type
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Club
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Date
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {payments.map((payment) => (
                                            <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-green-600 dark:text-green-400">
                                                        {formatCurrency(payment.amount)}
                                                    </div>
                                                    {payment.transactionId && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                            ID: {payment.transactionId}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        payment.type === 'membership' 
                                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                                                            : payment.type === 'event'
                                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {payment.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm text-gray-800 dark:text-gray-300">
                                                        {payment.clubName}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <FaCalendarAlt className="mr-2 text-gray-400 dark:text-gray-500" />
                                                        {formatDate(payment.date)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                {/* Payment Summary */}
                {payments.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Payment Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Membership Fees</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {formatCurrency(
                                            payments
                                                .filter(p => p.type === 'membership' && p.status === 'completed')
                                                .reduce((sum, p) => sum + p.amount, 0)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Event Payments</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {formatCurrency(
                                            payments
                                                .filter(p => p.type === 'event' && p.status === 'completed')
                                                .reduce((sum, p) => sum + p.amount, 0)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed Payments</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {payments.filter(p => p.status === 'completed').length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {payments.filter(p => p.status === 'pending').length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
                            <div className="space-y-3">
                                {payments.slice(0, 3).map(payment => (
                                    <div key={payment._id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                {payment.clubName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(payment.date)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(payment.amount)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {payment.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {payments.length > 3 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                        + {payments.length - 3} more transactions
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPayments;