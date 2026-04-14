import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UpcomingHero from "./UpcomingHero";
import UpcomingAbout from "./UpcomingAbout";
import UpcomingCast from "./UpcomingCast";
import UpcomingCrew from "./UpcomingCrew";
import Loader from "../../components/Loader"; // 🔥 ADD
import { fetchUpcoming } from "../../api";

export default function Upcomingmoviesdetails() {
  const { id } = useParams();
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 ADD

  useEffect(() => {
    if (!id) return;

    const loadUpcoming = async () => {
      try {
        const data = await fetchUpcoming(id);
        setUpcoming(data ?? null);
      } catch (err) {
        console.error("Error fetching movie by id:", err);
        setUpcoming(null);
      } finally {
        setLoading(false); // 🔥 IMPORTANT
      }
    };

    loadUpcoming();
  }, [id]);

  return (
    <>
      <Navbar />

      {/* 🔥 LOADER */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {upcoming && (
            <>
              <UpcomingHero upcoming={upcoming} />
              <UpcomingAbout upcoming={upcoming} />
              <UpcomingCast upcoming={upcoming} />
              <UpcomingCrew upcoming={upcoming} />
            </>
          )}
        </>
      )}

      <Footer />
    </>
  );
}