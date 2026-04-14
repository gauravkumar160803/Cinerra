import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WatchlistHero from "./WatchlistHero";


export default function Watchlist() {
  return (
    <>
      <Navbar />
      <WatchlistHero />
      <Footer />
    </>
  );
}
