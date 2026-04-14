import { useState } from "react";

export default function UpcomingHero({ upcoming }) {
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

  if (!upcoming) {
    return (
      <section className="w-full flex justify-center items-center text-white mt-[80px] h-[calc((100vh-80px)*0.60)]">
        <p className="text-xl">Upcoming movie not found !!</p>
      </section>
    );
  }

  return (
    <section className="w-full relative text-white flex justify-center overflow-hidden mt-[80px] h-[calc((100vh-80px)*0.60)]">
      {/* Background (poster + smooth merge) */}
      <div
        className="absolute inset-0 bg-cover bg-right"
        style={{ backgroundImage: `url(${upcoming.poster})` }}
      >
        {/* Fade poster’s left edge */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-neutral-900/90"></div>
      </div>
      {/* Grey overlay for left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-transparent"></div>

      {/* Foreground Content */}
      <div className="w-11/12 flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-12 relative z-10 h-full">
        {/* Left: Poster */}
        <div className="h-[60%] md:h-[85%] aspect-[2/3] relative flex-shrink-0">
          <img
            src={upcoming.poster}
            alt={upcoming.title}
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />

          {/* Trailer Button (centered on poster) */}
          {upcoming.trailerUrl && (
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
                  ▶
                </span>
                Trailer
              </span>
            </button>
          )}
        </div>


        {/* Right: Movie Info */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {upcoming.title}
          </h1>
          <p className="text-base sm:text-lg mb-2">Rating: {upcoming.rating}</p>
          <p className="text-base sm:text-lg mb-2">
            Genre: {upcoming.genres.join(" | ")}
          </p>
          <p className="text-base sm:text-lg mb-2">
            Release Date: {upcoming.releaseDate}
          </p>
          <p className="text-base sm:text-lg mb-2">
            Duration: {upcoming.duration}
          </p>
          <button
            className="mt-6 sm:mt-8 w-[140px] sm:w-[160px] md:w-[200px] lg:w-[250px] 
        px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-3xl
         bg-neutral-700 text-white font-bold text-xs sm:text-sm md:text-base 
         flex items-center justify-center transition-transform duration-300 ease-out 
         hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] mx-auto md:mx-0 cursor-pointer"
          >
            Notify Me
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
              src={`${getEmbedUrl(upcoming.trailerUrl)}?rel=0&modestbranding=1`}
              title={`${upcoming.title} trailer`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
