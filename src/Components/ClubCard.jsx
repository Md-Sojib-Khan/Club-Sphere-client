import { FaMapMarkerAlt, FaUsers, FaMoneyBillWave, FaCalendar } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { Link } from 'react-router';

const ClubCard = ({ club }) => {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            {/* Club Banner Image */}
            <figure className="h-48 overflow-hidden">
                <img
                    src={club.bannerImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'}
                    alt={club.clubName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
            </figure>

            {/* Club Info */}
            <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="card-title text-xl">{club.clubName}</h2>
                        <div className={`badge ${club.status === 'approved' ? 'badge-success' : 'badge-warning'} mt-1`}>
                            {club.status}
                        </div>
                    </div>
                    <div className="badge badge-outline">{club.category}</div>
                </div>

                {/* Description */}
                <p className="text-gray-600 line-clamp-2 mb-4">{club.description}</p>

                {/* Club Details */}
                <div className="space-y-2 mb-4">
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
                </div>

                {/* Action Button */}
                <div className="card-actions">
                    <Link to={`/clubs/${club._id}`} className="btn btn-primary btn-block">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClubCard;