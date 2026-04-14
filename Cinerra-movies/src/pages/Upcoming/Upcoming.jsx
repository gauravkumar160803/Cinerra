import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UpcomingSection from "./UpcomingSection";
import Loader from "../../components/Loader"; // 🔥 ADD
import { fetchUpcomings } from "../../api";

export default function Upcoming() {
  const [upcomings, setUpcomings] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 ADD

  useEffect(() => {
    const loadUpcomings = async () => {
      try {
        const data = await fetchUpcomings();
        setUpcomings(data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false); // 🔥 IMPORTANT
      }
    };

    loadUpcomings();
  }, []);

  return (
    <>
      <Navbar />

      {/* 🔥 LOADER */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {upcomings.length > 0 && (
            <UpcomingSection upcomings={upcomings} />
          )}
        </>
      )}

      <Footer />
    </>
  );
}
