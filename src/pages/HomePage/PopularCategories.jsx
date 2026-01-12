import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { 
    FaCode, 
    FaPalette, 
    FaMusic, 
    FaFutbol,
    FaGraduationCap,
    FaHeart,
    FaGlobeAsia,
    FaBusinessTime
} from 'react-icons/fa';

const PopularCategories = () => {
    const categories = [
        {
            id: 1,
            name: "Technology",
            icon: <FaCode className="text-3xl" />,
            clubs: 45,
            color: "from-blue-500 to-cyan-500",
            description: "Coding, AI, Robotics & Tech Innovation"
        },
        {
            id: 2,
            name: "Arts & Culture",
            icon: <FaPalette className="text-3xl" />,
            clubs: 32,
            color: "from-purple-500 to-pink-500",
            description: "Painting, Drama, Dance & Literature"
        },
        {
            id: 3,
            name: "Sports & Fitness",
            icon: <FaFutbol className="text-3xl" />,
            clubs: 28,
            color: "from-green-500 to-emerald-500",
            description: "Football, Cricket, Yoga & Gym"
        },
        {
            id: 4,
            name: "Music & Performance",
            icon: <FaMusic className="text-3xl" />,
            clubs: 24,
            color: "from-red-500 to-orange-500",
            description: "Bands, Choir, Instruments & DJ"
        },
        {
            id: 5,
            name: "Academic",
            icon: <FaGraduationCap className="text-3xl" />,
            clubs: 36,
            color: "from-indigo-500 to-blue-500",
            description: "Debate, Research, Study Groups"
        },
        {
            id: 6,
            name: "Social Service",
            icon: <FaHeart className="text-3xl" />,
            clubs: 22,
            color: "from-rose-500 to-pink-500",
            description: "Volunteering, Charity & Community"
        },
        {
            id: 7,
            name: "Cultural",
            icon: <FaGlobeAsia className="text-3xl" />,
            clubs: 18,
            color: "from-amber-500 to-yellow-500",
            description: "Cultural Exchange & Heritage"
        },
        {
            id: 8,
            name: "Business",
            icon: <FaBusinessTime className="text-3xl" />,
            clubs: 20,
            color: "from-teal-500 to-green-500",
            description: "Entrepreneurship & Networking"
        }
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Explore by Interest
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Find clubs that match your passions from our diverse categories
                    </p>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ 
                                y: -8,
                                scale: 1.02,
                                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                            }}
                            className="group relative"
                        >
                            <Link to={`/all-clubs?category=${category.name.toLowerCase()}`}>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300">
                                    {/* Icon */}
                                    <div className="mb-4">
                                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${category.color} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                                            {category.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary/80 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                        {category.description}
                                    </p>

                                    {/* Clubs Count */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {category.clubs} clubs
                                        </span>
                                        <span className="text-primary dark:text-primary/80 font-medium text-sm">
                                            Explore →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <Link to="/all-clubs">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary btn-lg px-8 py-4 text-lg font-bold rounded-full"
                        >
                            View All Categories
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default PopularCategories;