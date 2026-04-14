import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

const MyBookings = ({ bookings = [] }) => {

    const navigate = useNavigate();

    const [filter, setFilter] = useState("all");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const ticketRef = useRef(null);

    const filtered =
        filter === "all"
            ? bookings
            : bookings.filter((b) => b.paymentStatus === filter);

    const getStatusClass = (status) => {
        if (status === "paid") return "bg-green-100 text-green-600 border-green-300";
        if (status === "failed") return "bg-red-100 text-red-600 border-red-300";
        return "bg-orange-100 text-orange-600 border-orange-300";
    };

    const handleCardClick = (booking) => {

        if (booking.paymentStatus === "paid") {
            setSelectedTicket(booking);
            return;
        }

    };

    const downloadTicket = async () => {

        const element = ticketRef.current;
        if (!element) return;

        const clone = element.cloneNode(true);
        clone.style.position = "absolute";
        clone.style.top = "-9999px";
        clone.style.left = "-9999px";
        clone.style.width = element.offsetWidth + "px";
        document.body.appendChild(clone);

        const all = clone.querySelectorAll("*");

        const FALLBACKS = {
            color: "#111111",
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
        };

        all.forEach((el) => {
            const cs = window.getComputedStyle(el);

            ["color", "backgroundColor", "borderColor", "outlineColor"].forEach((prop) => {

                const val = cs[prop] || "";

                if (
                    val.includes("oklch") ||
                    val.includes("oklab") ||
                    val.includes("color(")
                ) {
                    el.style[prop] = FALLBACKS[prop] || "#111111";
                }

            });

            el.style.colorScheme = "light";
        });

        try {
            const canvas = await html2canvas(clone, {
                scale: 3,
                // CHANGED: Set to null so the downloaded PNG has a transparent background.
                // This prevents the transparent holes from being filled with white!
                backgroundColor: null,
                useCORS: true,
                logging: false,
            });

            const link = document.createElement("a");
            link.download = `ticket-${selectedTicket.referenceCode}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

        } finally {
            document.body.removeChild(clone);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 mt-[80px]">

            <div className="max-w-3xl mx-auto">

                <h1 className="text-2xl font-semibold text-center mb-8">
                    My Bookings
                </h1>

                <div className="flex justify-center gap-3 mb-10 bg-white rounded-full w-max mx-auto px-1 py-1 shadow-sm">

                    {["all", "paid", "pending", "failed"].map((type) => (

                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    ${filter === type
                                    ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white font-bold shadow-md shadow-[#8a3357]/25"
                                    : "bg-white text-gray-500 hover:text-[#8a3357] hover:bg-[#8a3357]/5"
                                }`}
                        >
                            {type === "all" ? "All" : type === "paid" ? "Booked" : type === "pending" ? "Pending" : "Failed"}
                        </button>

                    ))}

                </div>

                <div className="space-y-6">

                    {filtered.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-16">
                            No bookings found
                        </p>
                    )}

                    {filtered.map((booking) => {

                        const statusClass = getStatusClass(booking.paymentStatus);

                        return (

                            <div
                                key={booking._id}
                                onClick={() => handleCardClick(booking)}
                                className={`flex flex-col md:flex-row bg-white rounded-xl shadow-sm hover:shadow-md transition
                                ${booking.paymentStatus === "paid"
                                        ? "cursor-pointer"
                                        : "cursor-default"
                                    }`}
                            >

                                <div className="w-full md:w-24 flex md:flex-col items-center md:justify-center p-3 gap-3 shrink-0">

                                    <div className="w-14 h-20 rounded-md overflow-hidden bg-gray-200">
                                        <img
                                            src={booking.movie?.poster}
                                            alt={booking.movie?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <span className="text-[11px] text-gray-400">
                                        {booking.seats.length} ticket
                                        {booking.seats.length > 1 && "s"}
                                    </span>

                                </div>

                                <div className="relative hidden md:flex items-stretch shrink-0">
                                    <div className="absolute bg-gray-100 rounded-full w-6 h-6 -top-3 left-1/2 -translate-x-1/2" />
                                    <div className="absolute bg-gray-100 rounded-full w-6 h-6 -bottom-3 left-1/2 -translate-x-1/2" />
                                    <div className="border-l border-dashed border-gray-300 my-3 mx-3" />
                                </div>

                                <div className="flex-1 p-4 flex flex-col">

                                    <div className="flex justify-between items-start">

                                        <div>
                                            <h2 className="text-base font-semibold">
                                                {booking.movie?.title}
                                            </h2>

                                            <p className="text-xs text-gray-500">
                                                {booking.movie?.rating} • {booking.movie?.genres?.join(", ")}
                                            </p>
                                        </div>

                                        <span className={`text-xs px-2.5 py-0.5 rounded-md border font-semibold ${statusClass}`}>
                                            {booking.paymentStatus.toUpperCase()}
                                        </span>

                                    </div>

                                    <hr className="my-3 border-gray-100" />

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-700">

                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase mb-1">
                                                Date & Time
                                            </p>

                                            <p className="font-medium">{booking.showDate}</p>

                                            <p className="font-medium">
                                                {booking.show?.showTime}
                                                <span className="ml-2 text-gray-500">
                                                    ({booking.show?.audi})
                                                </span>
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase mb-1">
                                                Seats
                                            </p>

                                            <p className="font-medium">
                                                {booking.seats.join(", ")}
                                            </p>
                                        </div>

                                        <div className="flex row-span-2 items-center justify-center">

                                            {booking.paymentStatus === "paid" && (
                                                <div className="w-[90px] h-[90px] bg-gray-100 rounded-md flex items-center justify-center">
                                                    <QRCode value={booking.referenceCode} size={90} />
                                                </div>
                                            )}

                                            {booking.paymentStatus === "pending" && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/payment/${booking._id}`);
                                                    }}
                                                    className="px-4 py-2 text-xs font-semibold text-white rounded-lg
                                                        bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                                                        shadow-md shadow-[#8a3357]/25
                                                        hover:shadow-lg hover:shadow-[#8a3357]/40
                                                        hover:opacity-95 hover:scale-105
                                                        transition-all duration-200 active:scale-[0.98] cursor-pointer"
                                                >
                                                    Finish Booking
                                                </button>
                                            )}

                                        </div>

                                        <div className="col-span-2 md:col-span-1 mt-3 text-xs text-gray-600">
                                            <p className="text-[10px] text-gray-400 uppercase mb-1">
                                                Venue
                                            </p>
                                            {booking.theater}
                                        </div>

                                    </div>

                                    <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-4">

                                        <span className="text-[11px] text-gray-400 font-mono">
                                            {booking.referenceCode}
                                        </span>

                                        <span className="text-base font-semibold text-[#8a3357]">
                                            ₹{booking.totalPrice.toFixed(2)}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>

            </div>

            {selectedTicket && selectedTicket.paymentStatus === "paid" && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
                    onClick={(e) => e.target === e.currentTarget && setSelectedTicket(null)}
                >

                    <div className="relative w-full max-w-[340px]">

                        <div ref={ticketRef} className="w-full flex flex-col drop-shadow-2xl filter">

                            <div className="bg-white rounded-t-2xl px-6 pt-6 pb-2">

                                <div className="flex justify-center mb-3">
                                    <img
                                        src="/Logos/NavbarLogo.png"
                                        alt="Logo"
                                        crossOrigin="anonymous"
                                        className="h-8 object-contain"
                                    />
                                </div>

                                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gray-400 text-center mb-1">
                                    Movie Ticket
                                </p>

                                <h2 className="text-xl font-bold leading-tight text-center text-gray-900">
                                    {selectedTicket.movie?.title}
                                </h2>

                                <p className="text-sm text-gray-400 text-center mt-1">
                                    {selectedTicket.movie?.genres?.join(" · ")}
                                </p>

                            </div>

                            {/* CHANGED: Replaced the separate absolute circles with a canvas-safe transparent gradient */}
                            <div
                                className="w-full h-8 relative flex items-center"
                                style={{
                                    background: 'radial-gradient(circle at 0px 50%, transparent 12px, white 12px) left center / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 12px, white 12px) right center / 51% 100% no-repeat',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                <div className="w-full border-t border-dashed border-gray-300 mx-5 relative z-10"></div>
                            </div>

                            <div className="bg-white rounded-b-2xl overflow-hidden">

                                <div className="px-6 pt-2 pb-4 grid grid-cols-3 gap-3 text-xs border-b border-gray-100">

                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                                        <p className="font-semibold text-gray-800">{selectedTicket.showDate}</p>
                                    </div>

                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Time</p>
                                        <p className="font-semibold text-gray-800">{selectedTicket.show?.showTime}</p>
                                    </div>

                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Audi</p>
                                        <p className="font-semibold text-gray-800">{selectedTicket.show?.audi}</p>
                                    </div>

                                    <div className="col-span-2">
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Venue</p>
                                        <p className="font-semibold text-gray-800 break-words">{selectedTicket.theater}</p>
                                    </div>

                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Seats</p>
                                        <p className="font-semibold text-gray-800">{selectedTicket.seats.join(", ")}</p>
                                    </div>

                                </div>

                                <div className="flex flex-col items-center px-6 py-5 gap-2">

                                    <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                                        <QRCode value={selectedTicket.referenceCode} size={144} />
                                    </div>

                                    <p className="text-[10px] font-mono text-gray-300 tracking-[0.2em] mt-1">
                                        {selectedTicket.referenceCode}
                                    </p>

                                    <p className="text-[10px] text-gray-400">
                                        Scan at cinema entry
                                    </p>

                                </div>

                                <div
                                    className="flex justify-between items-center px-6 py-3"
                                    style={{ borderTop: "1px solid #f3f4f6" }}
                                >

                                    <span className="text-xs text-gray-400">Total Paid</span>

                                    <span className="text-base font-bold" style={{ color: "#8a3357" }}>
                                        ₹{selectedTicket.totalPrice.toFixed(2)}
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className="flex gap-3 mt-4">

                            <button
                                onClick={downloadTicket}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                                bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                                shadow-md shadow-[#8a3357]/25
                                hover:shadow-lg hover:shadow-[#8a3357]/40
                                hover:opacity-95 hover:scale-105
                                transition-all duration-200 active:scale-[0.98] cursor-pointer"
                            >
                                ↓ Download Ticket
                            </button>

                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-200
                                hover:bg-gray-300 hover:shadow-md hover:scale-105
                                transition-all duration-200 active:scale-[0.98] cursor-pointer"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default MyBookings;