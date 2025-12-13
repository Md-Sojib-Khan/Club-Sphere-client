// AdminPayments.jsx - Minimal Version
import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminPayments = () => {
    const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

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
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  // Calculate total revenue
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPayments = payments.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center text-gray-800">
            <FaMoneyBillWave className="mr-3 text-blue-500" />
            Payment Transactions
          </h1>
          <p className="text-gray-600">All payment records in the system</p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Revenue</h3>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(todayRevenue)}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">All Time Revenue</h3>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-gray-500 mt-2">{totalPayments} total payments</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">All Payment Records</h2>
            <p className="text-gray-600 text-sm">Showing {payments.length} payments</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    User Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Club Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {payment.userEmail}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        ${payment.amount}
                      </td>
                      <td className="py-3 px-4 text-sm">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Data
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPayments;