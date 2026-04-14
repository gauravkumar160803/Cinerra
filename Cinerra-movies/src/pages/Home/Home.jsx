import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Hero from "./Herosection";
import InTheatresSection from "./InTheatresSection";
import Footer from "../../components/Footer";
import { fetchMovies } from "../../api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const location = useLocation(); // 🔥 KEY

  useEffect(() => {
    fetchMovies()
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // 🔥 THIS FIXES EVERYTHING
  useEffect(() => {
    if (location.hash === "#intheater") {
      const el = document.getElementById("intheater");
      if (el) {
        const yOffset = -80;
        const y =
          el.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        setTimeout(() => {
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 50);
      }
    }
  }, [location, movies]); // 🔥 important

  return (
    <>
      <Navbar />

      {movies.length > 0 && <Hero movies={movies} />}

      {/* MUST exist always */}
      <div id="intheater">
        {movies.length > 0 && (
          <InTheatresSection movies={movies} />
        )}
      </div>

      <Footer />
    </>
  );
}