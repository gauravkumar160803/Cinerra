/**
 * PreviewSection — reused for both "Movie Show" and "Upcoming" forms.
 * type = "movie" | "upcoming"
 */
export default function PreviewSection({ formData, type = "movie" }) {
    const movie = formData;
    const hasPoster = movie?.poster && movie.poster.trim() !== "";
    const getEmbedUrl = (url) => {
        if (!url) return "";

        // youtube watch?v=
        if (url.includes("watch?v=")) {
            const id = url.split("watch?v=")[1].split("&")[0];
            return `https://www.youtube.com/embed/${id}`;
        }

        // youtu.be short link
        if (url.includes("youtu.be/")) {
            const id = url.split("youtu.be/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${id}`;
        }

        return url; // already embed
    };

    if (!movie?.title) {
        return (
            <div className="text-center py-20 text-gray-300">
                <div className="text-5xl mb-3">👁️</div>
                <p className="text-sm font-medium text-gray-400">
                    Fill in movie details to see the preview
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Preview</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        How this will appear on your site
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
          ${type === "upcoming"
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-[#8a3357]/10 text-[#8a3357] border border-[#8a3357]/20"
                    }`}>
                    {type === "upcoming" ? "⏳ Upcoming" : "🎬 Now Showing"}
                </span>
            </div>

            {/* ── Hero ── */}
            <div className="relative w-full rounded-2xl overflow-hidden text-white min-h-[300px] flex items-center">
                {hasPoster && (
                    <div
                        className="absolute inset-0 bg-cover bg-right"
                        style={{ backgroundImage: `url(${movie.poster})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-neutral-900/90" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-6 md:p-10 w-full">
                    {hasPoster && (
                        <div className="w-32 md:w-44 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10">
                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl md:text-4xl font-bold mb-2">{movie.title}</h1>

                        {movie.genres?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                                {movie.genres.map((g) => (
                                    <span key={g} className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4 justify-center md:justify-start">
                            {movie.rating && <span>🏷️ {movie.rating}</span>}
                            {movie.duration && <span>⏱ {movie.duration}</span>}
                            {movie.releaseDate && <span>📅 {movie.releaseDate}</span>}
                        </div>

                        {movie.about && (
                            <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 max-w-xl">
                                {movie.about}
                            </p>
                        )}

                        {type === "movie" && (
                            <button className="mt-5 px-6 py-2.5 rounded-2xl bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                text-white font-bold text-sm shadow-md shadow-[#8a3357]/25 hover:scale-105
                transition-all duration-200 cursor-pointer">
                                Book Tickets
                            </button>
                        )}

                        {type === "upcoming" && (
                            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm font-medium">
                                ⏳ Coming Soon
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── About ── */}
            {movie.about && (
                <div className="py-6 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-2">About the Film</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{movie.about}</p>
                </div>
            )}

            {/* ── Cast ── */}
            {movie.cast?.length > 0 && (
                <div className="py-6 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Cast</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {movie.cast.map((member, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                                <img
                                    src={member.imageUrl || "https://placehold.co/100x100/e5e7eb/9ca3af?text=?"}
                                    alt={member.name}
                                    className="w-16 h-16 rounded-full object-cover shadow border-2 border-gray-100"
                                    onError={(e) => { e.target.src = "https://placehold.co/100x100/e5e7eb/9ca3af?text=?"; }}
                                />
                                <p className="mt-1.5 text-xs font-semibold text-gray-800 leading-tight">{member.name}</p>
                                <p className="text-[10px] text-gray-400">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Crew ── */}
            {movie.crew?.length > 0 && (
                <div className="py-6 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Crew</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {movie.crew.map((member, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                                <img
                                    src={member.imageUrl || "https://placehold.co/100x100/e5e7eb/9ca3af?text=?"}
                                    alt={member.name}
                                    className="w-16 h-16 rounded-full object-cover shadow border-2 border-gray-100"
                                    onError={(e) => { e.target.src = "https://placehold.co/100x100/e5e7eb/9ca3af?text=?"; }}
                                />
                                <p className="mt-1.5 text-xs font-semibold text-gray-800 leading-tight">{member.name}</p>
                                <p className="text-[10px] text-gray-400">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Show Schedule (movie only) ── */}
            {type === "movie" && movie.showDates?.length > 0 && (
                <div className="py-6 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Show Schedule</h3>
                    <div className="space-y-4">
                        {movie.showDates.map((showDate, dIdx) => (
                            <div key={dIdx} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <span>📅</span> {showDate.date || "Date not set"}
                                </p>
                                {showDate.theaters?.map((t, tIdx) => (
                                    <div key={tIdx} className="mb-3 last:mb-0 pl-4 border-l-2 border-[#b04a6a]/20">
                                        <p className="text-sm font-semibold text-gray-700 mb-1.5">🏟️ {t.theater || "Theater"}</p>
                                        {t.timings?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {t.timings.map((timing, tiIdx) => (
                                                    <span key={tiIdx} className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 shadow-sm">
                                                        🕐 {timing.time} — {timing.audi}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {t.seatingPrices?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {t.seatingPrices.map((seat, sIdx) => (
                                                    <span key={sIdx} className="px-3 py-1 rounded-full bg-[#8a3357]/8 border border-[#8a3357]/15 text-xs font-medium text-[#8a3357]">
                                                        {seat.name} — ₹{seat.price}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Trailer ── */}
            {movie.trailerUrl && (
                <div className="py-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Trailer</h3>
                    <div className="aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`${getEmbedUrl(movie.trailerUrl)}?rel=0&modestbranding=1`}
                            title="Trailer preview"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
}