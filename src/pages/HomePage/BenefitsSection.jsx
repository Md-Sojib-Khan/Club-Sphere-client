import React from 'react';
import { motion } from 'framer-motion';
import { 
    FaUserCheck, 
    FaCalendarCheck, 
    FaUsers, 
    FaShieldAlt,
    FaMobileAlt,
    FaChartLine
} from 'react-icons/fa';

const BenefitsSection = () => {
    const benefits = [
        {
            id: 1,
            icon: <FaUserCheck className="text-3xl" />,
            title: "Easy Registration",
            description: "One-click club joining with instant approval. No paperwork, no waiting.",
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            id: 2,
            icon: <FaCalendarCheck className="text-3xl" />,
            title: "Smart Event Management",
            description: "Get reminders, sync with calendar, and manage all events in one place.",
            color: "text-purple-600 dark:text-purple-400"
        },
        {
            id: 3,
            icon: <FaUsers className="text-3xl" />,
            title: "Community Building",
            description: "Connect with members before events and build meaningful relationships.",
            color: "text-green-600 dark:text-green-400"
        },
        {
            id: 4,
            icon: <FaShieldAlt className="text-3xl" />,
            title: "Verified & Safe",
            description: "All clubs are verified and monitored to ensure a safe environment.",
            color: "text-red-600 dark:text-red-400"
        },
        {
            id: 5,
            icon: <FaMobileAlt className="text-3xl" />,
            title: "Mobile Friendly",
            description: "Access clubs and events on-the-go with our responsive design.",
            color: "text-amber-600 dark:text-amber-400"
        },
        {
            id: 6,
            icon: <FaChartLine className="text-3xl" />,
            title: "Growth Tracking",
            description: "Track your participation and skill development over time.",
            color: "text-teal-600 dark:text-teal-400"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Why Choose ClubSphere?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        We make campus life more connected, organized, and memorable
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="relative"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-700/20 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-600/20 transition-all duration-300">
                                {/* Icon Container */}
                                <div className="mb-6">
                                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 shadow-inner ${benefit.color}`}>
                                        {benefit.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {benefit.description}
                                </p>

                                {/* Background Pattern */}
                                <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5">
                                    <div className="w-full h-full bg-gradient-to-r from-primary to-secondary rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Comparison Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-2xl p-8"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                                Traditional vs ClubSphere
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">
                                            <span className="text-red-500">Before:</span> Searching through notice boards and emails
                                        </p>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">
                                            <span className="text-green-500">Now:</span> Centralized platform with smart search
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">
                                            <span className="text-red-500">Before:</span> Manual attendance and paperwork
                                        </p>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">
                                            <span className="text-green-500">Now:</span> Digital registration with auto-tracking
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">
                                            <span className="text-red-500">Before:</span> Limited club visibility
                                        </p>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">
                                            <span className="text-green-500">Now:</span> Global reach with detailed profiles
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="inline-block p-6 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white">
                                <div className="text-4xl font-bold mb-2">10x</div>
                                <div className="text-lg">More Engagement</div>
                            </div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">
                                Students using ClubSphere are 10 times more likely to participate in campus activities
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BenefitsSection;