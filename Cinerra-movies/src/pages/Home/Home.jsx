import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Hero from "./Herosection";
import InTheatresSection from "./InTheatresSection";
import Footer from "../../components/Footer";
import { fetchMovies } from "../../api";
import Loader from "../../components/Loader"; // 🔥 ADD THIS

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 ADD THIS
  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false); // 🔥 IMPORTANT
      }
    };

    loadData();
  }, []);

  // 🔥 THIS FIXES HASH SCROLL
  useEffect(() => {
    if (location.hash === "#intheater" && movies.length > 0) {
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
  }, [location, movies]);

  return (
    <>
      <Navbar />

      {/* 🔥 LOADER */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <Hero movies={movies} />

          <div id="intheater">
            <InTheatresSection movies={movies} />
          </div>
        </>
      )}

      <Footer />
    </>
  );
}