// AdminPayments.jsx - Dark/Light Theme Support
import React, { useState, useEffect } from 'react';
import { 
    FaMoneyBillWave, 
    FaCalendarAlt, 
    FaSpinner, 
    FaSync,
    FaDownload,
    FaFilter,
    FaSearch
} from 'react-icons/fa';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminPayments = () => {
    const axiosSecure = useAxiosSecure();
    const [payments, setPayments] = useState([]);
    const [todayRevenue, setTodayRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch all payments
            const paymentsRes = await axiosSecure.get('/api/admin/payments');
            if (paymentsRes.data.success) {
                setPayments(paymentsRes.data.payments);
            }

            // Fetch today's revenue
            const todayRes = await axios.get('/api/admin/payments/today');
            if (todayRes.data.success) {
                setTodayRevenue(todayRes.data.todayRevenue);
            }
            
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Filter payments based on search and type filter
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = searchTerm === '' || 
            payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = paymentTypeFilter === 'all' || 
            payment.type === paymentTypeFilter;

        return matchesSearch && matchesType;
    });

    // Calculate statistics
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalPayments = payments.length;
    const membershipPayments = payments.filter(p => p.type === 'membership').length;
    const eventPayments = payments.filter(p => p.type === 'event').length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading payment data...</p>
                </div>
            </div>
        );
    }

    // Export data function
    const exportToCSV = () => {
        const headers = ['User Email', 'Amount', 'Type', 'Club Name', 'Date', 'Transaction ID'];
        const csvData = filteredPayments.map(p => [
            p.userEmail,
            `$${p.amount}`,
            p.type,
            p.clubName,
            formatDate(p.date),
            p.transactionId || 'N/A'
        ]);
        
        const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FaMoneyBillWave className="text-2xl text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                Payment Transactions
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                All payment records in the system
                            </p>
                        </div>
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-2"></div>
                </div>

                {/* Revenue Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <FaCalendarAlt className="text-green-500 dark:text-green-400" />
                            </div>
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(todayRevenue)}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Today's Revenue
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Payments processed today
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FaMoneyBillWave className="text-blue-500 dark:text-blue-400" />
                            </div>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(totalRevenue)}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Total Revenue
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {totalPayments} total payments
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <FaMoneyBillWave className="text-purple-500 dark:text-purple-400" />
                            </div>
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {membershipPayments}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Membership Fees
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Club membership payments
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <FaCalendarAlt className="text-amber-500 dark:text-amber-400" />
                            </div>
                            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {eventPayments}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Event Payments
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Event registration fees
                        </p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 p-4 md:p-6 mb-6 border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by email, club name, or transaction ID..."
                                    className="input input-bordered dark:input-bordered-dark w-full pl-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Payment Type Filter */}
                        <div>
                            <div className="relative">
                                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                <select
                                    className="select select-bordered dark:select-bordered-dark w-full pl-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    value={paymentTypeFilter}
                                    onChange={(e) => setPaymentTypeFilter(e.target.value)}
                                >
                                    <option value="all">All Payment Types</option>
                                    <option value="membership">Membership Fees</option>
                                    <option value="event">Event Payments</option>
                                    <option value="donation">Donations</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400">
                            Showing <span className="font-bold text-gray-800 dark:text-gray-200">
                                {filteredPayments.length}
                            </span> of{' '}
                            <span className="font-bold text-gray-800 dark:text-gray-200">
                                {payments.length}
                            </span> payments
                        </p>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <button
                                onClick={exportToCSV}
                                className="btn btn-outline dark:btn-outline-dark btn-sm flex items-center gap-2"
                            >
                                <FaDownload /> Export CSV
                            </button>
                            <button
                                onClick={fetchData}
                                className="btn btn-primary dark:bg-blue-600 dark:text-white btn-sm flex items-center gap-2"
                            >
                                <FaSync /> Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-800/50 overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Payment Records
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            All payment transactions in the system
                        </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100 dark:bg-gray-700/50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        User Email
                                    </th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Amount
                                    </th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Type
                                    </th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Club Name
                                    </th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Date & Time
                                    </th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <div className="text-4xl mb-4 opacity-20 dark:opacity-10">💰</div>
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                                No Payments Found
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {searchTerm || paymentTypeFilter !== 'all' 
                                                    ? 'Try adjusting your search criteria' 
                                                    : 'No payment records available yet'}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((payment, index) => (
                                        <tr 
                                            key={index} 
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="text-sm text-gray-800 dark:text-gray-300 font-medium">
                                                    {payment.userEmail}
                                                </div>
                                                {payment.transactionId && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        ID: {payment.transactionId}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(payment.amount)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    payment.type === 'membership' 
                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                                                        : payment.type === 'event'
                                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
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
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    payment.status === 'completed' 
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                                        : payment.status === 'pending'
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                }`}>
                                                    {payment.status || 'completed'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    {filteredPayments.length > 0 && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Total: {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Page 1 of 1 • {filteredPayments.length} records
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-2">Average Payment</h3>
                        <div className="text-2xl font-bold">
                            {formatCurrency(totalRevenue / (totalPayments || 1))}
                        </div>
                        <p className="text-sm opacity-90 mt-2">Per transaction</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-2">Monthly Average</h3>
                        <div className="text-2xl font-bold">
                            {formatCurrency(totalRevenue / 12)}
                        </div>
                        <p className="text-sm opacity-90 mt-2">Estimated monthly</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                        <div className="text-2xl font-bold">
                            {(payments.filter(p => p.status === 'completed').length / (payments.length || 1) * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm opacity-90 mt-2">Completed payments</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;