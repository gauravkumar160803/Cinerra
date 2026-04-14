const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// 🔥 wait until Clerk is ready
async function waitForClerk() {
  return new Promise((resolve) => {
    if (window.Clerk && window.Clerk.loaded) {
      return resolve();
    }

    const interval = setInterval(() => {
      if (window.Clerk && window.Clerk.loaded) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

// 🔥 Universal request handler
async function request(url, options = {}) {
  let token = null;

  try {
    // ⛔ WAIT for Clerk (fixes refresh issue)
    await waitForClerk();

    if (window.Clerk) {
      token = await window.Clerk.session?.getToken();
    }
  } catch (err) {
    console.log("Token fetch error:", err);
  }

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",

      // 🔥 ADMIN FLAG (FIX)
      "x-admin-verified": localStorage.getItem("adminVerified") || "false",

      // 🔥 AUTH TOKEN
      ...(token && { Authorization: `Bearer ${token}` }),

      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("LOGIN_REQUIRED");
    }

    throw new Error(data?.message || "Request failed");
  }

  return data;
}

// ================= MOVIES =================
export const fetchMovies = () => request(`${BASE_URL}/movies`);
export const fetchMovie = (id) => request(`${BASE_URL}/movies/${id}`);

// ================= UPCOMINGS =================
export const fetchUpcomings = () => request(`${BASE_URL}/upcomings`);
export const fetchUpcoming = (id) => request(`${BASE_URL}/upcomings/${id}`);

// ================= SHOWS =================
export const fetchShow = (showId) => request(`${BASE_URL}/shows/${showId}`);

// ================= BOOKINGS =================
export const createBooking = (showId, seats) =>
  request(`${BASE_URL}/bookings`, {
    method: "POST",
    body: JSON.stringify({ showId, seats })
  });

export const fetchBookings = () => request(`${BASE_URL}/bookings`);
export const fetchBookingById = (bookingId) =>
  request(`${BASE_URL}/bookings/${bookingId}`);
export const fetchShowBookings = (showId) =>
  request(`${BASE_URL}/bookings/show/${showId}`);

// ================= PAYMENTS =================
export const validatePayment = (bookingId) =>
  request(`${BASE_URL}/bookings/validate-payment`, {
    method: "POST",
    body: JSON.stringify({ bookingId })
  });

export const verifyPayment = (payload) =>
  request(`${BASE_URL}/bookings/verify-payment`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

// ================= ADMIN =================
export const checkAdmin = () =>
  request(`${BASE_URL}/adminlogin/check-admin`);

export const verifyAdminKey = (key) =>
  request(`${BASE_URL}/adminlogin/verify-key`, {
    method: "POST",
    body: JSON.stringify({ key })
  });

// ================= VALIDATE ADMIN =================
export const validateAdmin = () =>
  request(`${BASE_URL}/validate/validate-admin`);

// ================= ADD MOVIE SHOW =================
export const addMovieShow = (data) =>
  request(`${BASE_URL}/admin/movies/add-movie-show`, {
    method: "POST",
    body: JSON.stringify(data)
  });

// ================= ADD UPCOMING MOVIE =================
export const addUpcomingMovie = (data) =>
  request(`${BASE_URL}/admin/movies/add-upcoming-movie`, {
    method: "POST",
    body: JSON.stringify(data)
  });