import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube, FaFilm, FaHeart } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <div className='bg-gray-900 text-white'>
            <footer className="py-12 w-11/12 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand Section */}
                    <aside className='col-span-2'>
                        <div className='flex items-center gap-2 mb-4'>
                            <FaFilm className="text-purple-500 text-2xl" />
                            <h1 className='font-bold text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>ClubSphere</h1>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            Your ultimate destination for movie magic. Discover, explore, and enjoy the world of cinema 
                            with detailed information, reviews, and recommendations. From classic films to latest blockbusters, 
                            we bring the theater experience to you.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                                <FaGithub className="text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaXTwitter className="text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <FaLinkedin className="text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                                <FaYoutube className="text-xl" />
                            </a>
                        </div>
                    </aside>

                    {/* Quick Links */}
                    <nav className='flex flex-col gap-3'>
                        <h6 className="text-lg font-semibold mb-2 text-white">Explore</h6>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Movies</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">TV Shows</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Trending</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Upcoming</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Top Rated</a>
                    </nav>

                    {/* Categories */}
                    <nav className='flex flex-col gap-3'>
                        <h6 className="text-lg font-semibold mb-2 text-white">Categories</h6>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Action</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Comedy</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Drama</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Sci-Fi</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Horror</a>
                    </nav>

                    {/* Support */}
                    <nav className='flex flex-col gap-3'>
                        <h6 className="text-lg font-semibold mb-2 text-white">Support</h6>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Help Center</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Contact Us</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</a>
                        <a className="text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">FAQ</a>
                    </nav>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-700 pt-6 mt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <aside className="flex items-center gap-2 text-gray-300">
                            <p>© {new Date().getFullYear()} MovieMaster Pro. All rights reserved.</p>
                        </aside>
                        <div className="flex items-center gap-2 text-gray-300">
                            <span>Made with</span>
                            <FaHeart className="text-red-500" />
                            <span>for movie lovers</span>
                        </div>
                        <nav className="flex gap-6 text-gray-300">
                            <a className="hover:text-purple-400 transition-colors cursor-pointer text-sm">Privacy</a>
                            <a className="hover:text-purple-400 transition-colors cursor-pointer text-sm">Terms</a>
                            <a className="hover:text-purple-400 transition-colors cursor-pointer text-sm">Cookies</a>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;