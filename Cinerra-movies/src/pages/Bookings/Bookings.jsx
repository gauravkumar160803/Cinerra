import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MyBookings from "./MyBookings";
import Loader from "../../components/Loader"; // 🔥 ADD
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

      } catch (err) {

        if (err.message === "LOGIN_REQUIRED") {

          setLoading(false);

          openSignIn({
            fallbackRedirectUrl: "/bookings",
          });

          navigate("/");
          return;
        }

        console.error("Failed to load bookings:", err);

      } finally {
        setLoading(false); // 🔥 move here (cleaner)
      }
    };

    loadBookings();

  }, [openSignIn, navigate]);

  return (
    <>
      <Navbar />

      {/* 🔥 LOADER */}
      {loading ? (
        <Loader />
      ) : (
        <MyBookings bookings={bookings} />
      )}

      <Footer />
    </>
  );
}