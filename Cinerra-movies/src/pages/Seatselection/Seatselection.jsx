import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SeatselectionUI from "./SeatselectionUI";

import { fetchShow, fetchShowBookings } from "../../api";

export default function Seatselection() {
  const { id } = useParams();

  const [showData, setShowData] = useState(null);
  const [bookings, setBookings] = useState([]);

  // 🔹 Load show once
  useEffect(() => {
    if (!id) return;

    const loadShow = async () => {
      try {
        const showRes = await fetchShow(id);
        setShowData(showRes ?? null);
      } catch (err) {
        console.error("Error fetching show:", err);
        setShowData(null);
      }
    };

    loadShow();
  }, [id]);

  // 🔹 Poll bookings for THIS show every 3 seconds
  useEffect(() => {
    if (!id) return;

    let interval;

    const loadBookings = async () => {
      try {
        const bookingsData = await fetchShowBookings(id);
        setBookings(bookingsData ?? []);
      } catch (err) {
        console.error("Error fetching show bookings:", err);
      }
    };

    // initial load
    loadBookings();

    // polling
    interval = setInterval(loadBookings, 3000);

    return () => clearInterval(interval);

  }, [id]);

  return (
    <>
      <Navbar />

      {showData && (
        <SeatselectionUI showData={showData} bookings={bookings} />
      )}

      <Footer />
    </>
  );
}




