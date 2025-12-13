// ClubManagerDashboardHome.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaBuilding, 
  FaSpinner,
  FaChartLine,
  FaArrowRight,
  FaExclamationTriangle
} from 'react-icons/fa';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ClubManagerDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch manager dashboard stats
  const { 
    data: dashboardData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['managerDashboard', user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error('Please login');
      
      const response = await axiosSecure.get(
        `/api/manager/dashboard?managerEmail=${user.email}`
      );
      return response.data;
    },
    enabled: !!user?.email
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-lg">Loading Manager Dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <FaExclamationTriangle className="text-xl" />
          <div>
            <span>{error?.message || 'Failed to load dashboard'}</span>
          </div>
          <button 
            className="btn btn-sm btn-outline mt-2" 
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { summary = {} } = dashboardData || {};
  
  // Stats cards data
  const statsCards = [
    {
      title: 'Clubs Managed',
      value: summary.clubsManaged || 0,
      icon: <FaBuilding className="text-2xl" />,
      color: 'bg-primary text-primary-content',
      description: 'Total clubs you manage',
      detail: `${summary.activeClubs || 0} active • ${summary.pendingClubs || 0} pending`,
      link: '/manager/clubs'
    },
    {
      title: 'Total Members',
      value: summary.totalMembers || 0,
      icon: <FaUsers className="text-2xl" />,
      color: 'bg-secondary text-secondary-content',
      description: 'Across all your clubs',
      detail: 'Active club members',
      link: '/manager/members'
    },
    {
      title: 'Total Events',
      value: summary.totalEvents || 0,
      icon: <FaCalendarAlt className="text-2xl" />,
      color: 'bg-accent text-accent-content',
      description: 'Events created in your clubs',
      detail: 'All events organized',
      link: '/manager/events'
    },
    {
      title: 'Total Revenue',
      value: `$${summary.totalPayments?.toLocaleString() || 0}`,
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: 'bg-success text-success-content',
      description: 'Payments received',
      detail: 'Total revenue from memberships',
      link: '/manager/payments'
    }
  ];

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <FaChartLine className="mr-3" />
            Manager Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, <span className="font-semibold">{user?.displayName || user?.email}</span>
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className={`card-body ${card.color} rounded-t-2xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg">{card.title}</h3>
                    <p className="text-sm opacity-90">{card.description}</p>
                  </div>
                  {card.icon}
                </div>
              </div>
              <div className="card-body">
                <div className="stat-value text-3xl">
                  {card.value}
                </div>
                <p className="text-sm text-gray-500 mt-2">{card.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/dashboard/event-registrations" 
                className="card bg-base-200 hover:bg-base-300 transition-colors p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Event Registrations</h3>
                    <p className="text-sm text-gray-600">View all event registrations</p>
                  </div>
                  <FaUsers />
                </div>
              </Link>
              
              <Link 
                to="/dashboard/event-management" 
                className="card bg-base-200 hover:bg-base-300 transition-colors p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Create Event</h3>
                    <p className="text-sm text-gray-600">Organize a new event</p>
                  </div>
                  <FaCalendarAlt />
                </div>
              </Link>
              
              <Link 
                to="/dashboard/my-clubs" 
                className="card bg-base-200 hover:bg-base-300 transition-colors p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Manage Clubs</h3>
                    <p className="text-sm text-gray-600">View all your clubs</p>
                  </div>
                  <FaBuilding />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
          <button 
            onClick={() => refetch()}
            className="btn btn-sm btn-outline mt-2"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubManagerDashboardHome;