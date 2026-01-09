import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';

export const PaymentRedirectPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    const bookingId = searchParams.get('bookingId');
    const token = searchParams.get('token');
    const amount = searchParams.get('amount');

    useEffect(() => {
        // Validate required parameters
        if (!bookingId || !token || !amount) {
            console.error('Missing required parameters for payment redirect');
            navigate(-1);
            return;
        }

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Redirect to payment gateway
                    const paymentUrl = `https://pulse-api.lockated.com/pms/easebuzz/pay?productinfo=FacilityBooking&udf1=${bookingId}&amount=${amount}&token=${token}`;
                    window.location.href = paymentUrl;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [bookingId, token, amount, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
                        <CheckCircle className="text-green-600 w-10 h-10" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Booking Created Successfully!
                </h1>

                <p className="text-gray-600 mb-6">
                    Redirecting to payment gateway in
                </p>

                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 text-3xl font-bold">
                        {countdown}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Please wait...</span>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                    <p>Booking ID: <span className="font-mono font-semibold">{bookingId}</span></p>
                    <p className="mt-1">Amount: <span className="font-semibold">₹{parseFloat(amount || '0').toFixed(2)}</span></p>
                </div>
            </div>
        </div>
    );
};
