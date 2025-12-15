import React from 'react';
import useAuth from '../Hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../Components/Loading';

const AdminRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <Loading></Loading>
    }

    if (role !== 'admin') {
        return <h1 className='text-4xl text-center font-bold my-80'>You are not Admin</h1>
    }

    return children;
};

export default AdminRoute;