import React from 'react';
import useAuth from '../Hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../Components/Loading';

const ClubManagerRoute = ({ children }) => {
    const { loading, user } = useAuth();
    const { role, roleLoading } = useRole()

    if (loading || !user || roleLoading) {
        return <Loading></Loading>
    }

    if (role !== 'clubManager') {
        return <h1 className='text-4xl text-center font-bold my-80'>You are not Club Manager</h1>
    }

    return children;
};

export default ClubManagerRoute;