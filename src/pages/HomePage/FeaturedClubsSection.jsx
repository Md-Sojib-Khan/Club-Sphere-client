// FeaturedClubsSection.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ClubCard from '../../Components/ClubCard';


const FeaturedClubsSection = () => {
  const axiosSecure = useAxiosSecure();

  // React Query দিয়ে clubs fetch করছি
  const { data: clubsData, isLoading } = useQuery({
    queryKey: ['featuredClubs'],
    queryFn: async () => {
      const response = await axiosSecure.get('/clubs/all?limit=8');
      return response.data;
    }
  });

  const clubs = clubsData || [];

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (clubs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-base-100 to-base-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Featured Clubs
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join amazing clubs and connect with like-minded people
          </p>
        </motion.div>

        {/* Clubs Grid with Stagger Animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {clubs.slice(0, 4).map((club) => (
            <motion.div
              key={club._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ClubCard club={club} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button with Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link 
            to="/all-clubs" 
            className="inline-flex items-center gap-2 btn btn-primary btn-lg group"
          >
            <span>View All Clubs</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedClubsSection;