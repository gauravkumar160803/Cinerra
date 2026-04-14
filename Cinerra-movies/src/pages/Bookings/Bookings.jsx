import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MyBookings from "./MyBookings";
import { fetchBookings } from "../../api";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Bookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {

    const loadBookings = async () => {
      try {

        const data = await fetchBookings();
        setBookings(data);
        setLoading(false);

      } catch (err) {

        if (err.message === "LOGIN_REQUIRED") {

          // Stop loading state so page doesn't flash
          setLoading(false);

          openSignIn({
            fallbackRedirectUrl: "/bookings",
          });
          // Redirect user to home if they cancel login
          navigate("/");

          return;

        }

        console.error("Failed to load bookings:", err);
        setLoading(false);
      }
    };

    loadBookings();

  }, [openSignIn,navigate]);

  return (
    <>
      <Navbar />

      {!loading && <MyBookings bookings={bookings} />}

      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          Loading bookings...
        </div>
      )}

      <Footer />
    </>
  );
}
