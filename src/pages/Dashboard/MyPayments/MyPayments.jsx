// MyPayments.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaMoneyBillWave, 
    FaCalendarAlt, 
    FaSpinner,
    FaCheckCircle,
    FaClock,
    FaTimesCircle
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
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center">
                        <FaCheckCircle className="mr-1" /> Completed
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs flex items-center">
                        <FaClock className="mr-1" /> Pending
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs flex items-center">
                        <FaTimesCircle className="mr-1" /> Failed
                    </span>
                );
        }
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
                    <p className="text-red-500">Error loading payments</p>
                    <button 
                        onClick={() => refetch()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { payments = [], summary = {} } = data || {};

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaMoneyBillWave className="mr-3 text-green-500" />
                        My Payment History
                    </h1>
                    <p className="text-gray-600">
                        All your past payment transactions
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Spent</h3>
                        <div className="text-3xl font-bold text-green-600">
                            {formatCurrency(summary.totalAmount || 0)}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            Across all payments
                        </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Payments</h3>
                        <div className="text-3xl font-bold text-blue-600">
                            {summary.totalPayments || 0}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            Payment transactions
                        </p>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {payments.length === 0 ? (
                        <div className="p-8 text-center">
                            <FaMoneyBillWave className="text-4xl text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600">No payment history found</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Join clubs to make payments and see them here
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b">
                                <h2 className="font-semibold text-gray-700">
                                    Payment History ({summary.totalPayments || 0})
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                Amount
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                Type
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                Club
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                <FaCalendarAlt className="inline mr-1" /> Date
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody className="divide-y divide-gray-200">
                                        {payments.map((payment) => (
                                            <tr key={payment._id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-green-600">
                                                        {formatCurrency(payment.amount)}
                                                    </div>
                                                    {payment.transactionId && (
                                                        <div className="text-xs text-gray-500 truncate max-w-xs">
                                                            ID: {payment.transactionId.substring(0, 20)}...
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        payment.type === 'membership' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {payment.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-700">
                                                    {payment.clubName}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <FaCalendarAlt className="mr-2 text-gray-400" />
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
            </div>
        </div>
    );
};

export default MyPayments;