import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { FaCheckCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    
    const sessionId = searchParams.get('session_id');
    const clubId = searchParams.get('clubId');

    useEffect(() => {
        const confirmPayment = async () => {
            try {
                if (sessionId) {
                    // Get session details from Stripe
                    const res = await axiosSecure.patch(`/verify-payment?session_id=${sessionId}`);
                    
                    if (res.data.payment_status === 'paid') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            text: 'You are now a member of the club',
                            timer: 2000
                        });
                    }
                }
            } catch (error) {
                console.error('Error confirming payment:', error);
            }
        };

        if (sessionId) {
            confirmPayment();
        }
    }, [sessionId]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <FaCheckCircle className="w-24 h-24 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4 text-center">Payment Successful!</h1>
            <p className="text-gray-600 mb-8 text-center max-w-md">
                Thank you for your payment. Your membership has been activated.
                You can now access all club features and events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={() => navigate('/dashboard/my-memberships')} 
                    className="btn btn-primary"
                >
                    View My Memberships
                </button>
                <button 
                    onClick={() => navigate(`/clubs/${clubId}`)} 
                    className="btn btn-outline"
                >
                    Back to Club
                </button>
                <button 
                    onClick={() => navigate('/all-clubs')} 
                    className="btn btn-outline"
                >
                    Browse More Clubs
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;