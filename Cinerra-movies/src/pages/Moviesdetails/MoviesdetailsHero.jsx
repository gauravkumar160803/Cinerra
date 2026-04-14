import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

export default function MoviesdetailsHero({ movie }) {
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
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/showselection/${id}`);
  };

  if (!movie) {
    return (
      <section className="w-full flex justify-center items-center text-white mt-[80px] h-[calc((100vh-80px)*0.90)] sm:h-[calc((100vh-80px)*0.60)]">
        <p className="text-xl">Movie not found !!</p>
      </section>
    );
  }

  return (
    <section className="w-full relative text-white flex justify-center overflow-hidden mt-[80px] h-[calc((100vh-80px)*0.90)] sm:h-[calc((100vh-80px)*0.90)] md:h-[calc((100vh-80px)*0.60)]">
      {/* Background (poster + smooth merge) */}
      <div
        className="absolute inset-0 bg-cover bg-right"
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        {/* Fade poster’s left edge */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-neutral-900/90"></div>
      </div>
      {/* Grey overlay for left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-transparent"></div>

      {/* Foreground Content */}
      <div className="w-11/12 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10 h-auto">
        {/* Left: Poster */}
        <div className="h-[60%] md:h-[85%] aspect-[2/3] relative flex-shrink-0 mt-4">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />

          {/* Trailer Button (centered on poster) */}
          {movie.trailerUrl && (
            <button
              onClick={() => setShowTrailer(true)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="flex items-center gap-2 bg-black/40 hover:bg-black/60  
        text-white px-3 py-1 rounded-full shadow-lg text-sm sm:text-base 
        transition-transform duration-300 ease-out hover:scale-105 hover:shadow-[0_5px_15px_rgba(0,0,0,0.6)]"
              >
                {/* Small Play Icon */}
                <span className="flex items-center justify-center  bg-transparent rounded-full w-6 h-6 text-xs font-bold">
                  <Play size={18} />
                </span>
                Trailer
              </span>
            </button>
          )}
        </div>


        {/* Right: Movie Info */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
            {movie.title}
          </h1>
          <p className="text-sm md:text-base mb-1 md:mb-2">Rating: {movie.rating}</p>
          <p className="text-sm md:text-base mb-1 md:mb-2">
            Genre: {movie.genres.join(" | ")}
          </p>
          <p className="text-sm md:text-base mb-1 md:mb-2">
            Release Date: {movie.releaseDate}
          </p>
          <p className="text-sm md:text-base mb-1 md:mb-2">
            Duration: {movie.duration}
          </p>
          <button
            className="mt-4 md:mt-8 w-[150px] sm:w-[150px] md:w-[190px] lg:w-[200px]
              px-2 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full
              bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
              text-white font-bold text-xs sm:text-sm md:text-base
              flex items-center justify-center gap-2
              shadow-[0_8px_30px_rgba(192,68,106,0.4)]
              hover:shadow-[0_12px_38px_rgba(192,68,106,0.55)]
              hover:opacity-95 hover:scale-105
              transition-all duration-200 active:scale-[0.98]
              mx-auto md:mx-0 cursor-pointer"
            onClick={() => handleClick(movie._id)}
          >
            <span>Book Tickets</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="w-[70%] h-[60%] bg-black rounded-lg overflow-hidden relative shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-3 right-3 text-white text-2xl z-10 hover:text-red-500"
            >
              ✕
            </button>

            {/* YouTube Trailer */}
            <iframe
              width="100%"
              height="100%"
              src={`${getEmbedUrl(movie.trailerUrl)}?rel=0&modestbranding=1`}
              title={`${movie.title} trailer`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
