import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MoviesdetailsHero from "./MoviesdetailsHero";
import AboutMovies from "./AboutMovies";
import Cast from "./Cast";
import Crew from "./Crew";
import { fetchMovie } from "../../api"; // <- use single-movie fetch

export default function Moviesdetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetchMovie(id)
      .then((data) => {
        // if API returns null/undefined when not found, setMovie(null)
        setMovie(data ?? null);
      })
      .catch((err) => {
        console.error("Error fetching movie by id:", err);
        setMovie(null);
      });
  }, [id]);

  return (
    <>
      <Navbar />

      {/* render children only when movie is available */}
      {movie && (
        <>
          <MoviesdetailsHero movie={movie} />
          <AboutMovies movie={movie} />
          <Cast movie={movie} />
          <Crew movie={movie} />
        </>
      )}

      <Footer />
    </>
  );
}
