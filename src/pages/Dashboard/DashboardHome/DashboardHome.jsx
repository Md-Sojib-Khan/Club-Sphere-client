import React from 'react';
import useRole from '../../../Hooks/useRole';
import AdminDashboardHome from './AdminDashboardHome';
import ClubManagerDashboardHome from './ClubManagerDashboardHome';
import MemberDashboardHome from './MemberDashboardHome';
// import useRole from '../../../hooks/useRole';

const DashboardHome = () => {
    const {role} =useRole()
    if(role === 'admin'){
        return <AdminDashboardHome></AdminDashboardHome>
    }
    else if(role === 'clubManager'){
        return <ClubManagerDashboardHome></ClubManagerDashboardHome>
    }
    else {
        return <MemberDashboardHome></MemberDashboardHome>
    }
};

export default DashboardHome;