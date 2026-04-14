import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UpcomingHero from "./UpcomingHero";
import UpcomingAbout from "./UpcomingAbout";
import UpcomingCast from "./UpcomingCast";
import UpcomingCrew from "./UpcomingCrew";
import { fetchUpcoming } from "../../api"; // <- use single-movie fetch

export default function Upcomingmoviesdetails() {
  const { id } = useParams();
  const [upcoming, setUpcoming] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetchUpcoming(id)
      .then((data) => {
        // if API returns null/undefined when not found, setMovie(null)
        setUpcoming(data ?? null);
      })
      .catch((err) => {
        console.error("Error fetching movie by id:", err);
        setUpcoming(null);
      });
  }, [id]);

  return (
    <>
      <Navbar />

      {/* render children only when movie is available */}
      {upcoming && (
        <>
          <UpcomingHero upcoming={upcoming} />
          <UpcomingAbout upcoming={upcoming} />
          <UpcomingCast upcoming={upcoming} />
          <UpcomingCrew upcoming={upcoming} />
        </>
      )}

      <Footer />
    </>
  );
}
