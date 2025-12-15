import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from './useAuth';


const axiosSecure = axios.create({
    baseURL: 'https://club-sphere-server-nine.vercel.app'
})

const useAxiosSecure = () => {
    const { user } = useAuth();

    useEffect(() => {
        // intercept request
        const reqInterceptor = axiosSecure.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        })

        // interceptor response
        const resInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        })

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        }

    }, [user])

    return axiosSecure;
};

export default useAxiosSecure;