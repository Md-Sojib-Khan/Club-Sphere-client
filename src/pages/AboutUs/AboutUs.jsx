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
    FaGlobe,
    FaLightbulb,
    FaUserFriends,
    FaChartLine,
    FaShieldAlt,
    FaSmile
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
            description: "Bring students together from different backgrounds and interests.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <FaCalendarAlt className="text-4xl" />,
            title: "Discover Events",
            description: "Find campus events that match your passions and schedule.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <FaHandshake className="text-4xl" />,
            title: "Build Community",
            description: "Create meaningful connections and lasting friendships.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: <FaGraduationCap className="text-4xl" />,
            title: "Learn & Grow",
            description: "Develop skills through workshops and activities.",
            color: "from-amber-500 to-orange-500"
        }
    ];

    const stats = [
        { number: "500+", label: "Active Clubs", icon: "🏢" },
        { number: "10K+", label: "Happy Students", icon: "👥" },
        { number: "2K+", label: "Monthly Events", icon: "📅" },
        { number: "95%", label: "Satisfaction Rate", icon: "⭐" }
    ];

    const values = [
        {
            title: "Inclusivity",
            description: "We welcome students from all backgrounds, majors, and interests.",
            icon: <FaUserFriends className="text-2xl" />,
            bgColor: "bg-blue-100 dark:bg-blue-900/30"
        },
        {
            title: "Community First",
            description: "Everything we do is centered around building stronger campus communities.",
            icon: <FaHeart className="text-2xl" />,
            bgColor: "bg-red-100 dark:bg-red-900/30"
        },
        {
            title: "Innovation",
            description: "We continuously improve to provide the best experience for students.",
            icon: <FaLightbulb className="text-2xl" />,
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
        },
        {
            title: "Growth",
            description: "Helping students develop both personally and professionally.",
            icon: <FaChartLine className="text-2xl" />,
            bgColor: "bg-green-100 dark:bg-green-900/30"
        },
        {
            title: "Safety",
            description: "Ensuring a secure and trustworthy platform for all users.",
            icon: <FaShieldAlt className="text-2xl" />,
            bgColor: "bg-purple-100 dark:bg-purple-900/30"
        },
        {
            title: "Fun",
            description: "Making campus life enjoyable and memorable.",
            icon: <FaSmile className="text-2xl" />,
            bgColor: "bg-pink-100 dark:bg-pink-900/30"
        }
    ];

    const teamHighlights = [
        {
            title: "Student-Led",
            description: "Founded and operated by students who understand campus life.",
            emoji: "🎓"
        },
        {
            title: "24/7 Support",
            description: "Always here to help you with any questions or issues.",
            emoji: "🛠️"
        },
        {
            title: "Verified Communities",
            description: "All clubs and events are carefully reviewed and verified.",
            emoji: "✅"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-secondary dark:from-primary/90 dark:to-secondary/90 text-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block mb-6"
                    >
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <FaRocket className="text-5xl" />
                        </div>
                    </motion.div>
                    
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
                        Revolutionizing campus connectivity, one student at a time
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                            Our Mission & Vision
                        </h2>
                        
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-gray-700/20 mb-8">
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                At <span className="font-bold text-primary dark:text-primary/90">ClubSphere</span>, we believe every student deserves to find their community. 
                                We're on a mission to transform campus life by making it more connected, 
                                engaging, and memorable. Our vision is to create a thriving ecosystem where 
                                students can easily discover, join, and create communities that fuel their 
                                passions and shape their university experience.
                            </p>
                            <div className="inline-flex items-center gap-2 text-primary dark:text-primary/80 font-semibold">
                                <FaRocket className="animate-pulse" />
                                <span>Launching students into unforgettable experiences</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* What We Do Section - NEW */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white"
                    >
                        What We Do
                    </motion.h2>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl">
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Simplify Discovery</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We make it effortless for students to find clubs and events that match their interests, 
                                    saving time and reducing the overwhelm of campus life.
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl">
                                <div className="text-4xl mb-4">🤝</div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Foster Connections</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We create meaningful connections between students, helping build friendships 
                                    and professional networks that last beyond university.
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-2xl">
                                <div className="text-4xl mb-4">🚀</div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Empower Growth</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We provide tools and platforms for students to develop leadership skills, 
                                    organize events, and create impact within their communities.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white"
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
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg dark:shadow-gray-700/20 text-center group transition-all duration-300"
                            >
                                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-gray-700/20"
                            >
                                <div className="text-4xl mb-3 opacity-80">{stat.icon}</div>
                                <div className="text-4xl md:text-5xl font-bold text-primary dark:text-primary/90 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="inline-block p-4 bg-primary/10 dark:bg-primary/20 rounded-2xl mb-6">
                                <FaHeart className="text-4xl text-primary dark:text-primary/80" />
                            </div>
                            
                            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                                Our Core Values
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${value.bgColor} p-6 rounded-xl border border-gray-200 dark:border-gray-700`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                                            {value.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                                                {value.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Highlights Section - NEW */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <motion.h2
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white"
                    >
                        Built For Students, By Students
                    </motion.h2>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {teamHighlights.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-700/20 text-center"
                                >
                                    <div className="text-4xl mb-4">{item.emoji}</div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 text-center"
                        >
                            <p className="text-gray-600 dark:text-gray-400 italic">
                                "We understand the challenges of campus life because we've lived them. 
                                That's why every feature we build is designed with real student needs in mind."
                            </p>
                            <p className="mt-4 font-semibold text-primary dark:text-primary/90">
                                — The ClubSphere Team
                            </p>
                        </motion.div>
                    </div>
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
                        className="max-w-2xl mx-auto text-center"
                    >
                        <div className="bg-gradient-to-r from-primary to-secondary dark:from-primary/90 dark:to-secondary/90 text-white rounded-2xl p-8 md:p-12 shadow-xl">
                            <div className="inline-block p-4 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                                <FaGlobe className="text-4xl" />
                            </div>
                            
                            <h2 className="text-3xl font-bold mb-4">
                                Ready to Join the Revolution?
                            </h2>
                            
                            <p className="text-lg mb-8 opacity-90">
                                Start your journey with ClubSphere today and transform your campus experience.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/all-clubs">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn bg-white text-primary hover:bg-gray-100 btn-lg font-bold"
                                    >
                                        Explore Clubs
                                    </motion.button>
                                </Link>
                                
                                <Link to="/all-events">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn btn-outline btn-white border-2 border-white hover:bg-white/10 btn-lg"
                                    >
                                        Browse Events
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer Note */}
            <footer className="py-8 text-center">
                <div className="container mx-auto px-4">
                    <p className="mb-2 text-gray-600 dark:text-gray-400">
                        Made with ❤️ for students everywhere
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        © {new Date().getFullYear()} ClubSphere. All rights reserved. | Empowering campus communities worldwide
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;