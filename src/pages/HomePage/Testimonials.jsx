import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: "Sarah Ahmed",
            role: "Computer Science Student",
            avatar: "👩‍💻",
            text: "ClubSphere helped me find my tech tribe! I joined the Coding Club and now I'm working on amazing projects with like-minded people.",
            rating: 5,
            club: "Tech Innovators Club"
        },
        {
            id: 2,
            name: "Rahim Khan",
            role: "Business Major",
            avatar: "👨‍🎓",
            text: "As an international student, it was hard to make friends. ClubSphere connected me with cultural clubs that made me feel at home.",
            rating: 5,
            club: "International Students Association"
        },
        {
            id: 3,
            name: "Fatima Jahan",
            role: "Photography Enthusiast",
            avatar: "📸",
            text: "The photography club I found here has transformed my skills. We have weekly photo walks and amazing guest speakers!",
            rating: 5,
            club: "Lens Masters Club"
        },
        {
            id: 4,
            name: "Arif Mahmud",
            role: "Sports Coordinator",
            avatar: "⚽",
            text: "Managing our football club events has become so much easier with ClubSphere. The event management features are a game-changer!",
            rating: 4,
            club: "Campus United FC"
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
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Stories from Our Community
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Hear from students who found their perfect communities through ClubSphere
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-gray-700/20 relative overflow-hidden group"
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-2 -right-2 text-6xl text-primary/10 dark:text-primary/20">
                                <FaQuoteLeft />
                            </div>

                            {/* Rating */}
                            <div className="flex mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-amber-500" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                                "{testimonial.text}"
                            </p>

                            {/* Divider */}
                            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-4" />

                            {/* Author Info */}
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">{testimonial.avatar}</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {testimonial.role}
                                    </p>
                                    <p className="text-xs text-primary dark:text-primary/80 font-medium mt-1">
                                        {testimonial.club}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-8"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                                4.9/5
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                                98%
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Would Recommend</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                                2K+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Success Stories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                                500+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Clubs Active</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;