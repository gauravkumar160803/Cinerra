import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { createBooking } from "../../api";
import { useClerk } from "@clerk/clerk-react";

const SeatselectionUI = ({ showData, bookings }) => {
    const navigate = useNavigate();
    const { openSignIn } = useClerk();

    const movie = showData?.movie;
    const show = showData?.show;

    const allTimings = show?.allTimings || [];
    const seatCategories = show?.seatingPrices || [];

    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        if (!allTimings.length) return;
        const initiallySelected =
            allTimings.find(t => t._id === show?.showId) || allTimings[0];
        setSelectedTime(initiallySelected);
    }, [show]);

    const lockedSeats = useMemo(() => {
        if (!bookings || !selectedTime?._id) return new Set();
        const seatsForThisShow = bookings
            .filter(b => b?.show?.showId === selectedTime._id)
            .flatMap(b => b.seats || []);
        return new Set(seatsForThisShow);
    }, [bookings, selectedTime]);

    useEffect(() => { setSelectedSeats([]); }, [selectedTime]);

    useEffect(() => {
        const resumeBooking = async () => {
            const pending = sessionStorage.getItem("pendingBooking");
            if (!pending) return;
            const { showId, seats } = JSON.parse(pending);
            try {
                const booking = await createBooking(showId, seats);
                sessionStorage.removeItem("pendingBooking");
                navigate(`/payment/${booking._id}`);
            } catch (err) {
                console.error("Resume booking failed:", err);
            }
        };
        resumeBooking();
    }, []);

    const handleSeatClick = (seatId) => {
        if (lockedSeats.has(seatId)) return;
        setSelectedSeats(prev =>
            prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
        );
    };

    const priceMap = useMemo(() => {
        return seatCategories.reduce((map, cat) => {
            map[cat.name] = cat.price;
            return map;
        }, {});
    }, [seatCategories]);

    const getCategoryDetailsForSeat = (seatId) => {
        const rowLetter = seatId.charAt(0);
        return seatCategories.find(cat => cat.rows.includes(rowLetter));
    };

    const getSeatPrice = (seatId) => {
        const category = getCategoryDetailsForSeat(seatId);
        return category ? category.price : 0;
    };

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);

    const handleProceed = async () => {
        if (!selectedTime?._id || selectedSeats.length === 0) return;
        try {
            const booking = await createBooking(selectedTime._id, selectedSeats);
            navigate(`/payment/${booking._id}`);
        } catch (err) {
            if (err.message === "LOGIN_REQUIRED") {
                sessionStorage.setItem("pendingBooking", JSON.stringify({
                    showId: selectedTime._id,
                    seats: selectedSeats
                }));
                openSignIn();
                return;
            }
            console.error("Booking failed:", err);
            alert(err.message || "Failed to create booking");
        }
    };

    const getCatType = (index) => {
        if (index === 0) return "premium";
        if (index === 1) return "executive";
        return "normal";
    };

    // Renders one seat row
    // Premium: no aisles, all 12 seats in one block
    // Executive/Normal: split left(4) | aisle | mid(4) | aisle | right(4)
    const renderRow = (row, catType) => {
        const isPremium = catType === "premium";
        const isExecutive = catType === "executive";

        const seatBtn = (i) => {
            const seatId = `${row}${i + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            const isLocked = lockedSeats.has(seatId);

            return (
                <button
                    key={seatId}
                    disabled={isLocked}
                    onClick={() => handleSeatClick(seatId)}
                    title={seatId}
                    className={`w-10 h-10 rounded-lg text-xs border-2 transition-all duration-150 flex items-center justify-center font-medium
                        ${isLocked
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
                            : isSelected
                                ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white border-transparent shadow-md shadow-[#8a3357]/30 scale-105"
                                : isPremium
                                    ? "border-amber-300 text-amber-700 hover:bg-amber-100 bg-amber-50"
                                    : isExecutive
                                        ? "border-purple-200 text-purple-700 hover:bg-purple-100 bg-purple-50"
                                        : "border-gray-200 text-gray-500 hover:bg-gray-100 bg-white"
                        }`}
                >
                    {isLocked ? <X size={12} /> : i + 1}
                </button>
            );
        };

        if (isPremium) {
            // Premium: no aisles, all 12 seats straight across
            return (
                <div key={row} className="flex items-center gap-1.5">
                    <span className="w-6 text-xs text-gray-400 text-right shrink-0">{row}</span>
                    <div className="flex gap-1.5">
                        {Array.from({ length: 12 }, (_, i) => seatBtn(i))}
                    </div>
                    <span className="w-6 text-xs text-gray-400 text-left shrink-0">{row}</span>
                </div>
            );
        }

        // Executive / Normal: left(4) | aisle | mid(4) | aisle | right(4)
        return (
            <div key={row} className="flex items-center gap-1.5">
                <span className="w-6 text-xs text-gray-400 text-right shrink-0">{row}</span>
                <div className="flex gap-1.5">
                    {Array.from({ length: 4 }, (_, i) => seatBtn(i))}
                </div>
                {/* aisle */}
                <div className="w-8 shrink-0" />
                <div className="flex gap-1.5">
                    {Array.from({ length: 4 }, (_, i) => seatBtn(i + 4))}
                </div>
                {/* aisle */}
                <div className="w-8 shrink-0" />
                <div className="flex gap-1.5">
                    {Array.from({ length: 4 }, (_, i) => seatBtn(i + 8))}
                </div>
                <span className="w-6 text-xs text-gray-400 text-left shrink-0">{row}</span>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 mt-16 relative">

            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">{movie.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {new Date(show.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} | {show.theater}
                </p>
            </div>

            {/* Timings */}
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
                {allTimings.map((timing) => (
                    <button
                        key={timing._id}
                        onClick={() => setSelectedTime(timing)}
                        className={`px-5 py-2 rounded-full text-sm border transition-all duration-200
                            ${selectedTime?._id === timing._id
                                ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white border-transparent shadow-md shadow-[#8a3357]/25"
                                : "border-gray-200 text-gray-600 hover:border-[#8a3357] hover:text-[#8a3357] hover:bg-[#8a3357]/5"
                            }`}
                    >
                        {timing.time}
                    </button>
                ))}
            </div>

            {/* Seat Legend */}
            <div className="flex justify-center gap-6 mb-10 flex-wrap">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-amber-50 border-2 border-amber-300" />
                    <span className="text-xs text-gray-500">Premium</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-purple-50 border-2 border-purple-200" />
                    <span className="text-xs text-gray-500">Executive</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-white border-2 border-gray-200" />
                    <span className="text-xs text-gray-500">Normal</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#8a3357] to-[#b04a6a]" />
                    <span className="text-xs text-gray-500">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gray-200 border-2 border-gray-200" />
                    <span className="text-xs text-gray-500">Booked</span>
                </div>
            </div>

            {/* Seats — Normal on top, screen at bottom */}
            <div className="flex flex-col items-center space-y-8 overflow-x-auto pb-4">
                {seatCategories.map((cat, catIndex) => {
                    const catType = getCatType(catIndex);
                    const isPremium = catType === "premium";

                    return (
                        <div key={cat.name} className="w-full flex flex-col items-center">

                            {/* Category label */}
                            <div className="flex items-center gap-3 mb-4 w-full justify-center">
                                <div className="h-px bg-gray-100 w-16" />
                                <span className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full
                                    ${isPremium
                                        ? "text-amber-600 bg-amber-50 border border-amber-200"
                                        : catType === "executive"
                                            ? "text-purple-600 bg-purple-50 border border-purple-200"
                                            : "text-gray-500 bg-gray-50 border border-gray-200"
                                    }`}>
                                    {cat.name} · ₹{priceMap[cat.name]}
                                </span>
                                <div className="h-px bg-gray-100 w-16" />
                            </div>

                            {/* Rows */}
                            <div className="flex flex-col gap-2">
                                {cat.rows.map(row => renderRow(row, catType))}
                            </div>

                            {/* Walking path between Executive and Normal */}
                            {catType === "executive" && (
                                <div className="mt-4 mb-2 w-full flex items-center justify-center gap-2">
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <span>↓</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-200 flex-1 max-w-[80px]" />
                                    <span><h5 className="text-xs text-gray-400 font-bold">Path</h5></span>
                                    <div className="border-t border-dashed border-gray-200 flex-1 max-w-[80px]" />
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <span>↓</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Screen at the bottom — like the screenshot */}
            <div className="mt-12 flex flex-col items-center gap-2">
                {/* Exit signs flanking the screen */}
                <div className="flex items-center justify-center gap-4 w-full mb-1">
                    <div className="flex items-center gap-1.5 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-md tracking-widest">
                        EXIT
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1.5 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-md tracking-widest">
                        EXIT
                    </div>
                </div>

                {/* Screen shape — curved 3D like the screenshot */}
                <div className="relative w-full max-w-xl">
                    {/* Top shine */}
                    <div className="h-2 w-full rounded-t-[40%] bg-gradient-to-r from-[#b8a9e8] via-[#d4caf0] to-[#b8a9e8]" />
                    {/* Main screen body */}
                    <div
                        className="w-full h-12 flex items-center justify-center"
                        style={{
                            background: "linear-gradient(180deg, #c4b5f4 0%, #a78bfa 40%, #8b5cf6 100%)",
                            borderRadius: "0 0 12px 12px",
                            boxShadow: "0 8px 32px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
                        }}
                    >
                        <span className="text-white/80 text-[11px] uppercase tracking-[0.3em] font-semibold">
                            Screen
                        </span>
                    </div>
                    {/* Bottom shadow / depth */}
                    <div
                        className="h-3 w-[95%] mx-auto rounded-b-full"
                        style={{
                            background: "linear-gradient(180deg, #7c3aed40 0%, transparent 100%)",
                        }}
                    />
                </div>

                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-1">
                    All eyes this way
                </p>
            </div>

            {/* Bottom proceed bar */}
            {selectedSeats.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-between items-center px-6 py-4 z-50">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">{selectedSeats.length} seat(s) selected</p>
                        <p className="text-base font-bold text-[#8a3357]">₹{totalPrice}</p>
                    </div>
                    <button
                        onClick={handleProceed}
                        className="bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                            text-white font-semibold px-6 py-2.5 rounded-xl
                            shadow-md shadow-[#8a3357]/25
                            hover:shadow-lg hover:shadow-[#8a3357]/40
                            hover:opacity-95 hover:scale-105
                            transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                        Proceed
                    </button>
                </div>
            )}
        </div>
    );
};

export default SeatselectionUI;





