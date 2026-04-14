import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShowselectionMovies = ({ movie }) => {

    // 1️⃣ Just default to first available date
    const [selectedDate, setSelectedDate] = useState(movie.showDates[0].date);

    const currentShows = movie.showDates.find((d) => d.date === selectedDate);
    const navigate = useNavigate();

    // 2️⃣ UPDATED handleClick → only pass showId
    const handleClick = (showId) => {
        navigate(`/seatselection/${showId}`);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">

            {/* Date Selector */}
            <div className="flex gap-3 overflow-x-auto border-b border-gray-200 pb-3 mb-6">
                {movie.showDates.map((d, index) => (
                    <button
                        key={index}
                        onClick={() => handleDateClick(d.date)}
                        className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
                    ${d.date === selectedDate
                                ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white shadow-md shadow-[#8a3357]/25"
                                : "bg-gray-100 text-gray-500 hover:bg-[#8a3357]/8 hover:text-[#8a3357]"
                            }`}
                    >
                        <span className={`text-[11px] font-semibold uppercase tracking-widest ${d.date === selectedDate ? "text-white/70" : "text-gray-400"}`}>
                            {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <span className={`text-base font-bold mt-0.5 ${d.date === selectedDate ? "text-white" : "text-gray-700"}`}>
                            {new Date(d.date).toLocaleDateString("en-US", { day: "numeric" })}
                        </span>
                        <span className={`text-[10px] font-medium ${d.date === selectedDate ? "text-white/70" : "text-gray-400"}`}>
                            {new Date(d.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                    </button>
                ))}
            </div>

            {/* Theaters List */}
            <div className="space-y-6">
                {currentShows?.theaters.map((theater, i) => (
                    <div key={i} className="pb-6 border-b border-gray-100 last:border-0">
                        {/* Theater Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                                {theater.theater?.charAt(0) || "?"}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                                    {theater.theater}
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {Math.floor(Math.random() * 10) + 1}.{Math.floor(Math.random() * 9)} km away • Allows cancellation
                                </p>
                            </div>
                        </div>

                        {/* Show Timings */}
                        <div className="flex flex-wrap gap-2">
                            {theater.timings.map((timing, tIndex) => {
                                const timeValue = typeof timing === "object" ? timing.time : timing;
                                const showId = typeof timing === "object" ? timing._id : null;
                                return (
                                    <button
                                        key={tIndex}
                                        onClick={() => handleClick(showId)}
                                        className="border border-gray-200 rounded-lg px-5 py-2 text-sm font-medium text-gray-600
                hover:border-[#8a3357] hover:text-[#8a3357] hover:bg-[#8a3357]/5
                transition-all duration-200 cursor-pointer"
                                    >
                                        {timeValue}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowselectionMovies;
