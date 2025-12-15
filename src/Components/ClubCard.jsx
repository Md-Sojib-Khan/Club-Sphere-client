import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers, FaMoneyBillWave, FaCalendar } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { Link } from 'react-router';

const ClubCard = ({ club }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
            }}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
            {/* Club Banner Image */}
            <motion.figure 
                className="h-48 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                <img
                    src={club.bannerImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'}
                    alt={club.clubName}
                    className="w-full h-full object-cover"
                />
            </motion.figure>

            {/* Club Info */}
            <div className="card-body">
                <motion.div 
                    className="flex justify-between items-start mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div>
                        <h2 className="card-title text-lg h-10">{club.clubName}</h2>
                        <motion.div 
                            className={`badge ${club.status === 'approved' ? 'badge-success' : 'badge-warning'} mt-1`}
                            whileHover={{ scale: 1.1 }}
                        >
                            {club.status}
                        </motion.div>
                    </div>
                    <motion.div 
                        className="badge badge-outline"
                        whileHover={{ rotate: 5 }}
                    >
                        {club.category}
                    </motion.div>
                </motion.div>

                {/* Description */}
                <motion.p 
                    className="text-gray-600 line-clamp-2 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {club.description}
                </motion.p>

                {/* Club Details */}
                <motion.div 
                    className="space-y-2 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 text-sm">
                        <FaMapMarkerAlt className="text-gray-500" />
                        <span>{club.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MdCategory className="text-gray-500" />
                        <span>{club.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <FaMoneyBillWave className="text-gray-500" />
                        <span>
                            {club.membershipFee === 0 ? 'Free' : `$${club.membershipFee}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <FaUsers className="text-gray-500" />
                        <span>{club.totalMembers || 0} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <FaCalendar className="text-gray-500" />
                        <span>
                            {new Date(club.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </motion.div>

                {/* Action Button */}
                <motion.div 
                    className="card-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link to={`/clubs/${club._id}`} className="btn btn-primary btn-block">
                        View Details
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ClubCard;