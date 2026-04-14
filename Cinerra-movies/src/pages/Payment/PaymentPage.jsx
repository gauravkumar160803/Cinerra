import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePayment, verifyPayment } from "../../api";

const PaymentPage = ({ data }) => {
    const navigate = useNavigate();

    const {
        movie,
        theater,
        showDate,
        show,
        seats,
        totalPrice,
        referenceCode,
        user
    } = data;

    // expiresAt in state so we can update it when validate-payment extends it
    const [expiresAt, setExpiresAt] = useState(data.expiresAt);
    const [timeLeft, setTimeLeft] = useState("");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!expiresAt) return;

        const interval = setInterval(() => {
            const now = Date.now();
            // show timer as 1 min less than real expiry
            const expiry = new Date(expiresAt).getTime() - 60 * 1000;
            const diff = expiry - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft("Expired");
                setIsExpired(true);

                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 2000);

                return;
            }

            const minutes = Math.floor(diff / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);

        }, 1000);

        return () => clearInterval(interval);

    }, [expiresAt, navigate]);

    const tickets = seats?.length || 0;
    const total = totalPrice || 0;
    const baseAmount = Number((total / 1.18).toFixed(2));
    const bookingFee = Number((total - baseAmount).toFixed(2));

    const handleProceedToPay = async () => {
        try {
            const result = await validatePayment(data._id);

            // sync frontend timer with the extended expiresAt from backend
            if (result.expiresAt) {
                setExpiresAt(result.expiresAt);
            }

            // calculate remaining seconds from expiresAt minus 10 sec buffer
            const expiryTime = new Date(result.expiresAt).getTime();
            const remainingMs = expiryTime - Date.now();
            const timeoutSeconds = Math.max(0, Math.floor(remainingMs / 1000) - 10);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: result.order.amount,
                currency: "INR",
                name: "Cinerra",
                description: "Movie Ticket Payment",
                order_id: result.order.id,
                // popup timeout is always in sync with actual expiresAt
                timeout: timeoutSeconds,
                handler: async function (response) {
                    try {
                        await verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        navigate("/");

                    } catch (err) {
                        alert("Payment verification failed. If amount was deducted, it will be refunded.");
                    }
                },
                modal: {
                    ondismiss: function () {
                        alert("Payment cancelled. Your seats are still held for a few minutes.");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="bg-gray-50 flex flex-col w-full px-4 md:px-8 lg:px-12 pt-8 pb-24 lg:pb-8 min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] overflow-y-auto mt-[80px]">

            {/* TIMER */}
            <div className="flex justify-center mb-6 lg:mb-4 shrink-0">
                <div className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide shadow-sm 
                    ${isExpired
                        ? "bg-red-100 border border-red-300 text-red-600"
                        : "bg-orange-50 border border-orange-200 text-[#8a3357]"}
                `}>
                    {isExpired
                        ? "⚠️ Booking expired. Redirecting..."
                        : `Complete payment in ${timeLeft}`}
                </div>
            </div>

            <h1 className="text-2xl font-semibold text-center mb-8 lg:mb-6 shrink-0">
                Review your booking
            </h1>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-0">

                {/* LEFT SECTION */}
                <div className="w-full lg:w-[70%] bg-white rounded-2xl shadow-sm p-6 md:p-8 h-fit lg:self-start flex flex-col">

                    <div className="flex justify-between items-start gap-6">
                        <div>
                            <h2 className="text-xl font-semibold">{movie.title}</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {movie.rating} • {movie.genres?.join(", ")} • {movie.duration}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{theater}</p>
                        </div>

                        <div className="w-24 h-36 md:w-28 md:h-40 bg-gray-200 rounded-xl overflow-hidden shadow-md shrink-0">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                Booking Ref
                            </p>
                            <p className="text-base font-medium tracking-wide bg-gradient-to-r from-[#8a3357] to-[#4c2250] bg-clip-text text-transparent">
                                {referenceCode}
                            </p>
                        </div>
                    </div>

                    <hr className="my-8" />

                    <div className="space-y-2 text-gray-700 text-sm">
                        <p className="font-medium">
                            {showDate} | {show.showTime}
                        </p>
                        <p>{tickets} tickets • ₹{baseAmount}</p>
                        <p>Seats – {seats.length > 0 ? seats.join(", ") : "—"}</p>
                    </div>

                    <p className="mt-6 text-xs text-gray-500">
                        Cancellation is unavailable
                    </p>
                </div>

                {/* RIGHT SECTION */}
                <div className="w-full lg:w-[30%] bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between h-full">

                    <div>
                        <h3 className="text-lg font-semibold mb-6">
                            Payment summary
                        </h3>

                        <div className="flex justify-between text-sm mb-3">
                            <span>Order amount</span>
                            <span>₹{baseAmount.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-sm mb-5">
                            <span>Booking charge (18% GST)</span>
                            <span>₹{bookingFee.toFixed(2)}</span>
                        </div>

                        <hr />

                        <div className="flex justify-between font-semibold text-lg mt-5">
                            <span>To be paid</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-3xl p-6 flex flex-col items-center gap-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                Your Details
                            </h4>
                            <div className="w-full flex flex-col gap-2">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</span>
                                    <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
                                </div>
                                <div className="h-px bg-gray-200" />
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                                    <span className="text-sm font-semibold text-gray-800">{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleProceedToPay}
                        disabled={isExpired}
                        className={`hidden lg:block mt-8 py-1.5 px-8 rounded-2xl text-sm font-semibold transition-all duration-200 shrink-0 mx-auto
                    ${isExpired
                                ? "bg-gray-200 cursor-not-allowed text-gray-400"
                                : "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white shadow-md shadow-[#8a3357]/25 hover:shadow-lg hover:shadow-[#8a3357]/40 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            }`}
                    >
                        <span className="flex flex-col items-center gap-0.5">
                            <span className="text-white/80 text-xs font-medium tracking-wide">Proceed to Pay</span>
                            <span className="text-white text-lg font-bold tracking-tight">₹{total.toFixed(2)}</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Floating Mobile Button */}
            <div className="fixed lg:hidden bottom-6 left-1/2 -translate-x-1/2">
                {/* Floating Mobile Button */}
                <div className="fixed lg:hidden bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={handleProceedToPay}
                        disabled={isExpired}
                        className={`py-3 px-6 rounded-2xl text-sm font-semibold transition-all duration-200 whitespace-nowrap
                        ${isExpired
                                ? "bg-gray-200 cursor-not-allowed text-gray-400"
                                : "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white shadow-md shadow-[#8a3357]/25 hover:shadow-lg hover:shadow-[#8a3357]/40 hover:opacity-95 active:scale-[0.98] cursor-pointer"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-sm font-medium">Proceed to Pay</span>
                            <span className="text-lg font-bold">₹{total.toFixed(2)}</span>
                        </span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default PaymentPage;








