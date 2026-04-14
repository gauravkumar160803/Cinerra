import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MoviesdetailsHero from "./MoviesdetailsHero";
import AboutMovies from "./AboutMovies";
import Cast from "./Cast";
import Crew from "./Crew";
import { fetchMovie } from "../../api";
import Loader from "../../components/Loader"; // 🔥 ADD

export default function Moviesdetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 ADD

  useEffect(() => {
    if (!id) return;

    const loadMovie = async () => {
      try {
        const data = await fetchMovie(id);
        setMovie(data ?? null);
      } catch (err) {
        console.error("Error fetching movie by id:", err);
        setMovie(null);
      } finally {
        setLoading(false); // 🔥 IMPORTANT
      }
    };

    loadMovie();
  }, [id]);

  return (
    <>
      <Navbar />

      {/* 🔥 LOADER */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {movie && (
            <>
              <MoviesdetailsHero movie={movie} />
              <AboutMovies movie={movie} />
              <Cast movie={movie} />
              <Crew movie={movie} />
            </>
          )}
        </>
      )}

      <Footer />
    </>
  );
}
