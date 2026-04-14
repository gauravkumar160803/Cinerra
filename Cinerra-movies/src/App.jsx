import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Moviesdetails from "./pages/Moviesdetails/Moviesdetails";
import Showselection from "./pages/Showselection/Showselection";
import Seatselection from "./pages/Seatselection/Seatselection";
import Admin from "./pages/Admin/Admin";
import Adminform from "./pages/Adminform/Adminform";
import Upcoming from "./pages/Upcoming/Upcoming";
import Upcomingmoviesdetails from "./pages/Upcomingmoviesdetails/Upcomingmoviesdetails";
import Bookings from "./pages/Bookings/Bookings";
import Watchlist from "./pages/Watchlist/Watchlist";
import Payment from "./pages/Payment/Payment";
import ScrollToTop from './ScrollToTop';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";


function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moviesdetails/:id" element={<Moviesdetails />} />
        <Route path="/showselection/:id" element={<Showselection />} />
        <Route path="/seatselection/:id" element={<Seatselection />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/Upcomingmoviesdetails/:id" element={<Upcomingmoviesdetails />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/payment/:id" element={<Payment />} />
        {/* Protected Admin Route */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminform" element={<Adminform />} />
      </Routes>
    </>
  );
}

export default App;
