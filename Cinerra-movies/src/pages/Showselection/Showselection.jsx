import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ShowselectionHero from "./ShowselectionHero";
import ShowselectionMovies from "./ShowselectionMovies";
import { fetchMovies } from "../../api";
import Loader from "../../components/Loader"; // 🔥 ADD

export default function Showselection() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 ADD

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const movies = await fetchMovies();
        const found = movies.find((m) => m._id === id);
        setMovie(found || null);
      } catch (err) {
        console.error("Error fetching movies:", err);
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
              <ShowselectionHero movie={movie} />
              <ShowselectionMovies movie={movie} />
            </>
          )}
        </>
      )}

      <Footer />
    </>
  );
}