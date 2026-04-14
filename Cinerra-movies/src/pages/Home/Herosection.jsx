import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TRANSITION_MS = 600;

// ─── Infinite queue helpers ───────────────────────────────────────────────────
// Instead of tracking index position we always push a new slide onto a queue
// and pop the old one — direction is always whatever the user last chose.
// This means 0→1→2→3→0→1→... always slides left, never snaps back.

let globalKey = 0;
const nextKey = () => ++globalKey;

export default function Herosection({ movies }) {
  const navigate = useNavigate();

  // direction the auto-advance travels — "next" by default
  const lastDirection = useRef("next");

  // The visible queue: [{ movie, key, state }]
  // We keep max 2 items: the outgoing and the incoming.
  const [slides, setSlides] = useState(() =>
    movies?.length
      ? [{ movie: movies[0], key: nextKey(), state: "visible" }]
      : []
  );

  // Which movie index is currently showing
  const currentIdx = useRef(0);
  const transitioning = useRef(false);
  const timerRef = useRef(null);
  const [progressKey, setProgressKey] = useState(0);

  // ── Transition engine ──────────────────────────────────────────────────────
  const goTo = useCallback(
    (nextIdx, direction) => {
      if (transitioning.current || !movies?.length) return;
      transitioning.current = true;
      lastDirection.current = direction;

      const exitState = direction === "next" ? "exit-left" : "exit-right";
      const enterState = direction === "next" ? "enter-right" : "enter-left";
      const key = nextKey();

      // 1. Mark current slide as exiting
      setSlides((prev) =>
        prev.map((s) => (s.state === "visible" ? { ...s, state: exitState } : s))
      );

      // 2. Add new slide off-screen
      setSlides((prev) => [...prev, { movie: movies[nextIdx], key, state: enterState }]);

      // 3. One double-RAF later — snap new slide to visible
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setSlides((prev) =>
            prev.map((s) => (s.key === key ? { ...s, state: "visible" } : s))
          );
        })
      );

      currentIdx.current = nextIdx;
      setProgressKey((k) => k + 1);

      // 4. Cleanup exited slide
      setTimeout(() => {
        setSlides((prev) => prev.filter((s) => s.state === "visible"));
        transitioning.current = false;
      }, TRANSITION_MS + 80);
    },
    [movies]
  );

  // ── Timer ──────────────────────────────────────────────────────────────────
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (!movies?.length) return;
    timerRef.current = setInterval(() => {
      // always go "next" direction on auto-advance
      const next = (currentIdx.current + 1) % movies.length;
      goTo(next, "next");
    }, 5000);
  }, [movies, goTo]);

  // Tab-visibility fix
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        clearInterval(timerRef.current);
      } else {
        transitioning.current = false;
        setProgressKey((k) => k + 1);
        resetTimer();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    resetTimer();
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // ── Nav handlers ──────────────────────────────────────────────────────────
  const handleNext = (e) => {
    e?.stopPropagation();
    const next = (currentIdx.current + 1) % movies.length;
    goTo(next, "next");
    resetTimer();
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    const prev = (currentIdx.current - 1 + movies.length) % movies.length;
    goTo(prev, "prev");
    resetTimer();
  };

  const handleDot = (e, idx) => {
    e.stopPropagation();
    if (idx === currentIdx.current || transitioning.current) return;
    const dir = idx > currentIdx.current ? "next" : "prev";
    goTo(idx, dir);
    resetTimer();
  };

  if (!movies?.length) return null;

  // Slide transition styles
  const slideTransition = {
    transition: `opacity ${TRANSITION_MS}ms cubic-bezier(.4,0,.2,1), transform ${TRANSITION_MS}ms cubic-bezier(.4,0,.2,1)`,
    willChange: "transform, opacity",
  };

  const stateToStyle = {
    "visible": { opacity: 1, transform: "translateX(0)" },
    "enter-right": { opacity: 0, transform: "translateX(52px)" },
    "enter-left": { opacity: 0, transform: "translateX(-52px)" },
    "exit-left": { opacity: 0, transform: "translateX(-52px)" },
    "exit-right": { opacity: 0, transform: "translateX(52px)" },
  };

  // The "current" movie for background — last visible or entering slide
  const bgMovie =
    slides.find((s) => s.state === "visible")?.movie ?? movies[currentIdx.current];

  return (
    <section
      className="relative h-[calc(100vh-145px)] w-full flex flex-col md:flex-row text-white overflow-hidden mt-[80px] cursor-pointer tracking-wide"
      onClick={() => navigate(`/showselection/${bgMovie._id}`)}
    >

      {/* ── Blurred bg ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <img
          key={bgMovie._id}
          src={bgMovie.poster}
          alt=""
          className="w-full h-full object-cover scale-[1.08]"
          style={{ filter: "blur(42px) brightness(0.5) saturate(1.2)" }}
        />
      </div>

      {/* ── Film grain ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 36%, rgba(0,0,0,0.65) 100%)" }}
      />

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] z-0 pointer-events-none bg-gradient-to-t from-black/90 to-transparent" />

      {/* ── Left fade (desktop) ── */}
      <div className="absolute top-0 left-0 bottom-0 w-1/2 z-0 pointer-events-none hidden md:block bg-gradient-to-r from-black/80 to-transparent" />

      {/* ── Slide counter ── */}
      <div className="absolute top-5 right-5 z-20 text-[11px] font-normal tracking-[0.12em] text-white/30 select-none">
        {String(currentIdx.current + 1).padStart(2, "0")} / {String(movies.length).padStart(2, "0")}
      </div>

      {/* ── LEFT: sliding content ── */}
      <div className="flex-1 relative z-10 overflow-hidden">
        {slides.map(({ movie, state, key }) => (
          <div
            key={key}
            className="absolute bottom-10 left-4 right-4 sm:left-6 sm:right-6 md:left-12 lg:left-24 md:right-8"
            style={{ ...slideTransition, ...stateToStyle[state] }}
          >
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/40 mb-3">
              Now Showing
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mb-7">
              <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-semibold border border-white/20">
                {movie.rating}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />
              <span className="text-xs font-light text-white/55 tracking-wide">
                {movie.genres.join(" · ")}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />
              <span className="text-xs font-light text-white/55 tracking-wide">
                {movie.duration}
              </span>
            </div>

            <button
              className="inline-flex items-center gap-2
                px-7 py-3 rounded-full
                bg-gradient-to-br from-[#c0446a] to-[#8a2f52]
                text-white text-[13px] font-medium tracking-wider
                shadow-[0_8px_30px_rgba(192,68,106,0.4)]
                hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_12px_38px_rgba(192,68,106,0.55)]
                active:scale-[0.97] transition-all duration-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/showselection/${movie._id}`);
              }}
            >
              Book Now
              <span className="inline-block transition-transform duration-200">→</span>
            </button>
          </div>
        ))}
      </div>

      {/* ── RIGHT: poster carousel ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10 overflow-hidden">
        <PosterCarousel
          movies={movies}
          currentIdx={currentIdx}
          transitionMs={TRANSITION_MS}
        />

        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2
            w-9 h-9 rounded-full flex items-center justify-center
            bg-white/10 hover:bg-white/20 backdrop-blur-sm
            border border-white/15
            transition-all duration-200 cursor-pointer hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2
            w-9 h-9 rounded-full flex items-center justify-center
            bg-white/10 hover:bg-white/20 backdrop-blur-sm
            border border-white/15
            transition-all duration-200 cursor-pointer hover:scale-110"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 sm:bottom-5 flex gap-1.5">
          {movies.map((_, idx) => (
            <span
              key={idx}
              onClick={(e) => handleDot(e, idx)}
              className={`rounded-full cursor-pointer transition-all duration-300 ${idx === currentIdx.current
                  ? "bg-white w-1.5 h-1.5 scale-125"
                  : "bg-white/30 w-1.5 h-1.5"
                }`}
            />
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <ProgressBar key={progressKey} />
    </section>
  );
}

// ─── Poster Carousel ──────────────────────────────────────────────────────────
// Also uses a push/pop queue so it never snaps back either.

function PosterCarousel({ movies, currentIdx, transitionMs }) {
  const [slides, setSlides] = useState(() => [
    { movie: movies[0], key: nextKey(), state: "visible" },
  ]);
  const prevIdx = useRef(0);
  const transRef = useRef(false);

  const stateToStyle = {
    "visible": { opacity: 1, transform: "translateX(0) scale(1)" },
    "enter-right": { opacity: 0, transform: "translateX(54px) scale(0.95)" },
    "enter-left": { opacity: 0, transform: "translateX(-54px) scale(0.95)" },
    "exit-left": { opacity: 0, transform: "translateX(-54px) scale(0.95)" },
    "exit-right": { opacity: 0, transform: "translateX(54px) scale(0.95)" },
  };

  // Watch currentIdx.current via a stable effect trigger
  const [trigger, setTrigger] = useState(0);

  // Parent goTo calls this indirectly via progressKey changes —
  // we watch currentIdx.current by syncing on every render via useEffect.
  useEffect(() => {
    const ci = currentIdx.current;
    if (ci === prevIdx.current || transRef.current) return;
    transRef.current = true;

    const direction = (() => {
      // Always respect the direction that results in the shorter path
      // BUT for infinite feel we just track prev→current numeric diff
      // and treat wrap-around (0 after last) as "next"
      const diff = ci - prevIdx.current;
      if (diff === 0) return "next";
      // wrap forward: going from last to 0
      if (prevIdx.current === movies.length - 1 && ci === 0) return "next";
      // wrap backward: going from 0 to last
      if (prevIdx.current === 0 && ci === movies.length - 1) return "prev";
      return diff > 0 ? "next" : "prev";
    })();

    const exitState = direction === "next" ? "exit-left" : "exit-right";
    const enterState = direction === "next" ? "enter-right" : "enter-left";
    const key = nextKey();

    setSlides((prev) =>
      prev.map((s) => (s.state === "visible" ? { ...s, state: exitState } : s))
    );
    setSlides((prev) => [...prev, { movie: movies[ci], key, state: enterState }]);

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setSlides((prev) =>
          prev.map((s) => (s.key === key ? { ...s, state: "visible" } : s))
        );
      })
    );

    prevIdx.current = ci;

    setTimeout(() => {
      setSlides((prev) => prev.filter((s) => s.state === "visible"));
      transRef.current = false;
    }, transitionMs + 80);
  });

  return (
    <div className="relative w-[210px] sm:w-[250px] md:w-[280px] lg:w-[310px] h-[315px] sm:h-[375px] md:h-[420px] lg:h-[465px]">
      {slides.map(({ movie, state, key }) => (
        <div
          key={key}
          className="absolute inset-0"
          style={{
            transition: `opacity ${transitionMs}ms cubic-bezier(.4,0,.2,1), transform ${transitionMs}ms cubic-bezier(.4,0,.2,1)`,
            willChange: "transform, opacity",
            ...stateToStyle[state],
          }}
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover rounded-xl"
            style={{ boxShadow: "0 28px 64px rgba(0,0,0,0.75), 0 4px 18px rgba(0,0,0,0.45)" }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "heroProgress 5s linear forwards";
  }, []);

  return (
    <>
      <style>{`@keyframes heroProgress { from { width:0% } to { width:100% } }`}</style>
      <div
        ref={ref}
        className="absolute bottom-0 left-0 h-[2px] z-20"
        style={{ width: "0%", background: "rgba(192,68,106,0.75)" }}
      />
    </>
  );
}

