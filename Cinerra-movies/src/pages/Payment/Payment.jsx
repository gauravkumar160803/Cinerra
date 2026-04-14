import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PaymentPage from "./PaymentPage";
import { fetchBookingById } from "../../api";
import { useClerk } from "@clerk/clerk-react";

export default function Payment() {
  const { id: bookingId } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (!bookingId) return;

    const loadBooking = async () => {
      try {
        const data = await fetchBookingById(bookingId);
        setBookingData(data);

      } catch (err) {

        if (err.message === "LOGIN_REQUIRED") { 
          openSignIn();
          return;
        }

        console.error("Failed to fetch booking:", err);
        setBookingData(null);
      }
    };

    loadBooking();

  }, [bookingId, openSignIn]);

  return (
    <>
      <Navbar />
      {bookingData && <PaymentPage data={bookingData} />}
      <Footer />
    </>
  );
}


