import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ShowselectionHero from "./ShowselectionHero";
import ShowselectionMovies from "./ShowselectionMovies";

import { fetchMovies } from "../../api";

export default function Showselection() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovies()
      .then((movies) => {
        const found = movies.find((m) => m._id === id);
        setMovie(found || null);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setMovie(null);
      });
  }, [id]);

  return (
    <>
      <Navbar />

      {/* render only when movie is loaded to avoid crashes */}
      {movie && (
        <>
          <ShowselectionHero movie={movie} />
          <ShowselectionMovies movie={movie} />
        </>
      )}

      <Footer />
    </>
  );
}
