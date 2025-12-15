import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { toast } from 'react-toastify';
import userImg from '../assets/user.png'
import useAuth from '../Hooks/useAuth';

const Navbar = () => {
    // const [theme, setTheme] = useState(localStorage.getItem('theme') || "light")
    const { user, logOutUser } = useAuth();

    const links = <>
        <li><NavLink to={'/'}>Home</NavLink></li>
        <li><NavLink to={'/all-clubs'}>All Clubs</NavLink></li>
        <li><NavLink to={'/all-events'}>All Events</NavLink></li>
        <li><NavLink to={'/about-us'}>About Us</NavLink></li>
    </>

    const handleSignOut = () => {
        logOutUser()
            .then(() => toast.success('Sign-out successful'))
            .catch(e => toast(e.code))
    }

    // useEffect(() => {
    //     const html = document.querySelector('html')
    //     html.setAttribute("data-theme", theme)
    //     localStorage.setItem("theme", theme)
    // }, [theme])


    // const handleTheme = (checked) => {
    //     setTheme(checked ? "dark" : "light")
    // }

    return (
        <div className="navbar bg-base-100 shadow-sm md:px-10 sticky top-0 z-50">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow font-medium">
                        {links}
                    </ul>
                </div>
                <Link to={'/'} className="btn btn-ghost text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">ClubSphere</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 font-medium">
                    {links}
                </ul>
            </div>
            <div className="navbar-end gap-3">
                {/* <input
                    onChange={(e) => handleTheme(e.target.checked)}
                    type="checkbox"
                    defaultChecked={localStorage.getItem('theme') === "dark"}
                    className="toggle" /> */}
                {
                    user
                        ? <div className="dropdown dropdown-end dropdown-hover cursor-pointer">
                            <div tabIndex={0} role="button" >
                                <img className='w-10 h-10 object-cover rounded-full border-2 border-white' src={user?.photoURL ? user?.photoURL : userImg } alt="" />
                            </div>
                            <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-20 w-52 p-2 shadow-sm space-y-2">
                                <li><Link to={'my-profile'} className='font-medium'>Profile</Link></li>
                                <li><Link to={'/dashboard'} className='font-medium'>Dashboard</Link></li>
                                <li><button onClick={handleSignOut} className="btn bg-red-500 btn-sm rounded-full px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 text-white font-medium">LogOut</button></li>
                            </ul>
                        </div>

                        : <div className='flex items-center gap-2'>
                            <Link to={'/login'} className="btn bg-red-500 btn-sm rounded-full px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 text-white font-medium">Login</Link>
                            <Link to={'/register'} className="btn bg-red-500 btn-sm rounded-full px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 text-white font-medium hidden md:inline-flex">Register</Link>
                        </div>
                }

            </div>
        </div>
    );
};

export default Navbar;