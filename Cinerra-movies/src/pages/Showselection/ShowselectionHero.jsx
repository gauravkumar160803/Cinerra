import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";


const ShowselectionHero = ({ movie }) => {
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
    navigate(`/moviesdetails/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 mt-20">

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

        {/* Poster */}
        <div className="relative w-40 shrink-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="rounded-2xl object-cover w-full h-auto shadow-md"
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

        {/* Movie Info */}
        <div className="grid gap-3 place-justify-center text-center md:text-left my-auto">

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {movie.title}
          </h1>

          {/* Rating / Language / Duration */}
          <p className="text-gray-500 text-sm md:text-base">
            {movie.rating} | {movie.language} | {movie.duration}
          </p>

          {/* Button */}
          <button className="w-fit px-5 py-2 border border-gray-400 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
            onClick={() => handleClick(movie._id)}>
            View details
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

    </div>
  );
};

export default ShowselectionHero;

