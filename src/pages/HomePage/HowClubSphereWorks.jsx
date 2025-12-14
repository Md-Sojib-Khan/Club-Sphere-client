import React from 'react';
import { motion } from 'framer-motion';
import { 
    FaSearch, 
    FaCalendarCheck, 
    FaUsers, 
    FaHeart,
    FaArrowRight,
    FaCheckCircle,
    FaRocket,
    FaHandshake
} from 'react-icons/fa';

const HowClubSphereWorks = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 50,
            scale: 0.8 
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
                type: "spring", 
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            scale: 1.05,
            y: -10,
            boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
            transition: { type: "spring", stiffness: 400 }
        }
    };

    const iconVariants = {
        hidden: { rotate: -180, opacity: 0 },
        visible: { 
            rotate: 0, 
            opacity: 1,
            transition: { 
                type: "spring", 
                stiffness: 200,
                delay: 0.5 
            }
        },
        hover: { 
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5 }
        }
    };

    const stepCircleVariants = {
        hidden: { scale: 0 },
        visible: { 
            scale: 1,
            transition: { 
                type: "spring", 
                stiffness: 200,
                damping: 15 
            }
        }
    };

    const steps = [
        {
            id: 1,
            icon: <FaSearch className="text-4xl" />,
            title: "Discover Clubs & Events",
            description: "Browse through hundreds of clubs and events. Filter by interests, location, or date to find exactly what you're looking for.",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            delay: 0.1
        },
        {
            id: 2,
            icon: <FaCalendarCheck className="text-4xl" />,
            title: "Join & Register",
            description: "Register for events with one click. Get instant confirmation and reminders. Manage all your event bookings in one place.",
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50",
            delay: 0.3
        },
        {
            id: 3,
            icon: <FaUsers className="text-4xl" />,
            title: "Connect & Network",
            description: "Connect with fellow attendees before, during, and after events. Build meaningful connections within your community.",
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            delay: 0.5
        },
        {
            id: 4,
            icon: <FaHeart className="text-4xl" />,
            title: "Enjoy & Engage",
            description: "Attend amazing events, share experiences, and become part of active communities that match your passions.",
            color: "from-red-500 to-orange-500",
            bgColor: "bg-red-50",
            delay: 0.7
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-block mb-4"
                    >
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10">
                            <FaRocket className="text-3xl text-primary" />
                        </div>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        How ClubSphere Works
                    </h2>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Join thousands of students in discovering amazing campus events in just 4 simple steps
                    </motion.p>
                </motion.div>

                {/* Steps Timeline */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative"
                >
                    {/* Connector Line - Animated */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"
                        style={{ originX: 0 }}
                    />

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step) => (
                            <motion.div
                                key={step.id}
                                variants={itemVariants}
                                custom={step.delay}
                                whileHover="hover"
                                className="relative"
                            >
                                {/* Step Number Circle */}
                                <motion.div
                                    variants={stepCircleVariants}
                                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                                >
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                                        <span className="text-white font-bold text-lg">{step.id}</span>
                                    </div>
                                </motion.div>

                                {/* Step Card */}
                                <div className={`${step.bgColor} rounded-2xl p-8 h-full border border-gray-200 relative overflow-hidden`}>
                                    {/* Background Pattern */}
                                    <motion.div
                                        initial={{ rotate: 0 }}
                                        whileHover={{ rotate: 180 }}
                                        className="absolute -right-10 -bottom-10 w-40 h-40 opacity-10"
                                    >
                                        <div className={`bg-gradient-to-r ${step.color} w-full h-full rounded-full`} />
                                    </motion.div>

                                    {/* Icon */}
                                    <motion.div
                                        variants={iconVariants}
                                        whileHover="hover"
                                        className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 mx-auto`}
                                    >
                                        <div className="text-white">
                                            {step.icon}
                                        </div>
                                    </motion.div>

                                    {/* Content */}
                                    <motion.h3
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl font-bold mb-4 text-center"
                                    >
                                        {step.title}
                                    </motion.h3>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 }}
                                        className="text-gray-600 text-center mb-6"
                                    >
                                        {step.description}
                                    </motion.p>

                                    {/* Animated Checkmark */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.7, type: "spring" }}
                                        className="text-center"
                                    >
                                        <FaCheckCircle className={`inline-block text-2xl bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-20 text-center"
                >
                    <div className="w-full mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 border border-primary/20">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", delay: 0.3 }}
                            className="inline-block mb-6"
                        >
                            <div className="p-4 rounded-full bg-gradient-to-r from-primary to-secondary">
                                <FaHandshake className="text-3xl text-white" />
                            </div>
                        </motion.div>

                        <h3 className="text-3xl font-bold mb-4">
                            Ready to Start Your Journey?
                        </h3>
                        
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                        >
                            Join thousands of students who are already using ClubSphere to discover amazing campus events
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-primary btn-lg"
                            >
                                Get Started Now <FaArrowRight className="ml-2" />
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-outline btn-primary btn-lg"
                            >
                                Learn More
                            </motion.button>
                        </motion.div>

                        {/* Animated Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1 }}
                            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
                        >
                            {[
                                { number: "10K+", label: "Active Users" },
                                { number: "500+", label: "Clubs" },
                                { number: "2K+", label: "Events" },
                                { number: "95%", label: "Satisfaction" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HowClubSphereWorks;