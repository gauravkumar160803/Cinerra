import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UpcomingSection from "./UpcomingSection";
import { fetchUpcomings } from "../../api";

export default function Upcoming() {
  const [upcomings, setUpcomings] = useState([]);

  useEffect(() => {
    fetchUpcomings()
      .then((data) => setUpcomings(data))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <>
      <Navbar />
      {upcomings.length > 0 && (
        <>
            <UpcomingSection upcomings={upcomings} />
        </>
      )}
      <Footer />
    </>
  );
}
