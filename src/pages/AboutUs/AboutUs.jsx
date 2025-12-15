import React from 'react';
import { motion } from 'framer-motion';
import { 
    FaUsers, 
    FaHandshake, 
    FaCalendarAlt, 
    FaHeart,
    FaRocket,
    FaAward,
    FaGraduationCap,
    FaGlobe
} from 'react-icons/fa';
import { Link } from 'react-router';

const AboutUs = () => {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const features = [
        {
            icon: <FaUsers className="text-4xl" />,
            title: "Connect Students",
            description: "Bring students together from different backgrounds and interests."
        },
        {
            icon: <FaCalendarAlt className="text-4xl" />,
            title: "Discover Events",
            description: "Find campus events that match your passions and schedule."
        },
        {
            icon: <FaHandshake className="text-4xl" />,
            title: "Build Community",
            description: "Create meaningful connections and lasting friendships."
        },
        {
            icon: <FaGraduationCap className="text-4xl" />,
            title: "Learn & Grow",
            description: "Develop skills through workshops and activities."
        }
    ];

    const stats = [
        { number: "500+", label: "Active Clubs" },
        { number: "10K+", label: "Students" },
        { number: "2K+", label: "Events Monthly" },
        { number: "95%", label: "Satisfaction" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        About ClubSphere
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90"
                    >
                        Connecting students with amazing campus communities
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <div className="inline-block p-4 bg-primary/10 rounded-2xl mb-6">
                            <FaRocket className="text-4xl text-primary" />
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Our Mission
                        </h2>
                        
                        <p className="text-lg text-gray-600 mb-8">
                            At ClubSphere, we believe every student deserves to find their community. 
                            We're on a mission to make campus life more connected, engaging, and 
                            memorable by bridging the gap between students and campus organizations.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12"
                    >
                        Why Choose ClubSphere?
                    </motion.h2>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className="bg-white p-6 rounded-xl shadow-lg text-center"
                            >
                                <div className="text-primary mb-4 flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="p-6"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="inline-block p-4 bg-primary/10 rounded-2xl mb-6">
                            <FaHeart className="text-4xl text-primary" />
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-8">
                            Our Values
                        </h2>
                        
                        <div className="space-y-6 text-left">
                            <div className="bg-white p-6 rounded-xl shadow">
                                <h3 className="text-xl font-bold mb-2 text-primary">
                                    Inclusivity
                                </h3>
                                <p className="text-gray-600">
                                    We welcome students from all backgrounds, majors, and interests.
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl shadow">
                                <h3 className="text-xl font-bold mb-2 text-primary">
                                    Community First
                                </h3>
                                <p className="text-gray-600">
                                    Everything we do is centered around building stronger campus communities.
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl shadow">
                                <h3 className="text-xl font-bold mb-2 text-primary">
                                    Innovation
                                </h3>
                                <p className="text-gray-600">
                                    We continuously improve to provide the best experience for students.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto text-center bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 md:p-12"
                    >
                        <div className="inline-block p-4 bg-white/20 rounded-2xl mb-6">
                            <FaGlobe className="text-4xl" />
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Join?
                        </h2>
                        
                        <p className="text-lg mb-8 opacity-90">
                            Start your journey with ClubSphere today and discover amazing campus communities.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/all-clubs">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-white btn-lg"
                                >
                                    Explore Clubs
                                </motion.button>
                            </Link>
                            
                            <Link to="/all-events">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-outline btn-white btn-lg"
                                >
                                    Browse Events
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer Note */}
            <footer className="py-8 text-center text-gray-600">
                <div className="container mx-auto px-4">
                    <p className="mb-2">
                        Made with ❤️ for students everywhere
                    </p>
                    <p className="text-sm">
                        © {new Date().getFullYear()} ClubSphere. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;