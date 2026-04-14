import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart } from "lucide-react";

export default function UpcomingSection({ upcomings }) {
    const navigate = useNavigate();
    const [liked, setLiked] = useState({});

    const handleClick = (id) => {
        navigate(`/Upcomingmoviesdetails/${id}`);
    };

    const toggleLike = (e, idx) => {
        e.stopPropagation();
        setLiked((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <section className="py-10 px-4 md:px-10 bg-gray-100 mt-[80px]">

            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2 mb-7">
                Upcoming Movies
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {upcomings.map((movie, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleClick(movie._id)}
                        className="cursor-pointer bg-gray-100 rounded-2xl overflow-hidden p-4 transition-all duration-300
                                   hover:shadow-lg hover:scale-[1.02] hover:bg-white"
                    >
                        {/* Poster */}
                        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Rating */}
                            <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#8a3357] to-[#4c2250] text-white text-[10px] font-bold px-2 py-[3px] rounded-md shadow-[0_2px_8px_rgba(138,51,87,0.45)] tracking-wide">
                                {movie.rating}
                            </span>

                            {/* Heart */}
                            <button
                                onClick={(e) => toggleLike(e, idx)}
                                className="absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-full
                                           bg-black/30 backdrop-blur-sm border border-white/20
                                           flex items-center justify-center
                                           transition-all duration-200 hover:bg-black/50 hover:scale-110"
                            >
                                <Heart
                                    size={13}
                                    style={{
                                        fill: liked[idx] ? "#8a3357" : "none",
                                        stroke: liked[idx] ? "#8a3357" : "white",
                                        strokeWidth: 2,
                                        transition: "all 0.2s",
                                    }}
                                />
                            </button>
                        </div>

                        {/* Title + Genre */}
                        <div className="mt-3 px-1">
                            <h3 className="text-sm font-bold text-gray-900 truncate leading-snug">
                                {movie.title}
                            </h3>
                            <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                                {movie.genres.join(" · ")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

