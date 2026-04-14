import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { movieSchema, upcomingSchema } from "./validation/movieSchema";

import StepIndicator from "./components/StepIndicator";
import MovieDetailsSection from "./sections/MovieDetailsSection";
import CastSection from "./sections/CastSection";
import CrewSection from "./sections/CrewSection";
import TheatersSection from "./sections/TheatersSection";
import PreviewSection from "./sections/PreviewSection";
import { validateAdmin } from "../../api";
import { addMovieShow, addUpcomingMovie } from "../../api";

// ── Section configs ──────────────────────────────────────────────
const MOVIE_SECTIONS = [
    { id: "details", label: "Movie Details", icon: "🎬" },
    { id: "cast", label: "Cast", icon: "🎭" },
    { id: "crew", label: "Crew", icon: "🎥" },
    { id: "theaters", label: "Theaters & Shows", icon: "🏟️" },
    { id: "preview", label: "Preview", icon: "👁️" },
];

const UPCOMING_SECTIONS = [
    { id: "details", label: "Movie Details", icon: "🎬" },
    { id: "cast", label: "Cast", icon: "🎭" },
    { id: "crew", label: "Crew", icon: "🎥" },
    { id: "preview", label: "Preview", icon: "👁️" },
];

const BASE_DEFAULTS = {
    title: "",
    poster: "",
    rating: "",
    genres: [],
    duration: "",
    releaseDate: "",
    about: "",
    trailerUrl: "",
    cast: [],
    crew: [],
};

const MOVIE_DEFAULTS = { ...BASE_DEFAULTS, showDates: [] };
const UPCOMING_DEFAULTS = { ...BASE_DEFAULTS };

// ── Reusable form shell ──────────────────────────────────────────
function MovieFormShell({ formType }) {
    const isMovie = formType === "movie";
    const sections = isMovie ? MOVIE_SECTIONS : UPCOMING_SECTIONS;
    const schema = isMovie ? movieSchema : upcomingSchema;
    const defaults = isMovie ? MOVIE_DEFAULTS : UPCOMING_DEFAULTS;
    const successMsg = isMovie ? "Movie added successfully! 🎬" : "Upcoming movie added! ⏳";

    const [activeSection, setActiveSection] = useState("details");
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState("");
    const [errorPopup, setErrorPopup] = useState(null); // ✅ ADDED ONLY THIS

    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaults,
        mode: "onTouched",
    });

    const { handleSubmit, watch, reset, formState } = methods;
    const formData = watch();

    useEffect(() => {
        setActiveSection("details");
        setSubmitStatus(null);
        reset(defaults);
    }, [formType]);

    const onSubmit = async (formData) => {
        console.log("FORM TYPE:", formType);
        setSubmitStatus("loading");
        setSubmitMessage("");

        try {
            const result =
                formType === "movie"
                    ? await addMovieShow(formData)
                    : await addUpcomingMovie(formData);

            if (!result.success) {
                throw new Error(result.message || "Submission failed");
            }

            setSubmitStatus("success");
            setSubmitMessage(successMsg);

            reset(defaults);
            setActiveSection("details");
        } catch (err) {
            setSubmitStatus("error");
            setSubmitMessage(
                err.message || "Something went wrong. Please try again."
            );
        }
    };

    const goTo = (direction) => {
        const idx = sections.findIndex((s) => s.id === activeSection);
        const next = sections[idx + direction];
        if (next) setActiveSection(next.id);
    };

    const isFirst = activeSection === sections[0].id;
    const isLast = activeSection === sections[sections.length - 1].id;

    // ✅ REPLACED ALERT WITH POPUP
    const onError = (errors) => {
        console.log("FORM ERRORS:", errors);

        const firstError = Object.values(errors)[0];

        setErrorPopup(
            firstError?.message || "Please fill all required fields"
        );
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                <StepIndicator
                    sections={sections}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />

                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-8">
                        {activeSection === "details" && <MovieDetailsSection />}
                        {activeSection === "cast" && <CastSection />}
                        {activeSection === "crew" && <CrewSection />}
                        {activeSection === "theaters" && isMovie && <TheatersSection />}
                        {activeSection === "preview" && (
                            <PreviewSection formData={formData} type={formType} />
                        )}
                    </div>

                    <div className="border-t border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between bg-gray-50/50">
                        <button
                            type="button"
                            onClick={() => goTo(-1)}
                            disabled={isFirst}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium
                hover:bg-gray-100 hover:border-gray-300 transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>

                        {isLast ? (
                            <button
                                type="button"
                                onClick={handleSubmit(onSubmit, onError)} // ✅ FIXED HERE ONLY
                                disabled={submitStatus === "loading"}
                                className="px-8 py-2.5 rounded-xl bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                  text-white font-bold text-sm flex items-center gap-2
                  shadow-md shadow-[#8a3357]/25 hover:shadow-lg hover:shadow-[#8a3357]/40
                  hover:opacity-95 hover:scale-105 transition-all duration-200
                  active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitStatus === "loading" ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting…
                                    </>
                                ) : isMovie ? (
                                    "🚀 Add Movie"
                                ) : (
                                    "⏳ Add to Upcoming"
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => goTo(1)}
                                className="px-8 py-2.5 rounded-xl bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                  text-white font-bold text-sm shadow-md shadow-[#8a3357]/25
                  hover:shadow-lg hover:shadow-[#8a3357]/40 hover:opacity-95 hover:scale-105
                  transition-all duration-200 active:scale-[0.98] cursor-pointer"
                            >
                                Next →
                            </button>
                        )}
                    </div>

                    {submitStatus === "success" && (
                        <div className="mx-6 md:mx-8 mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium flex items-center gap-2">
                            ✅ {submitMessage}
                        </div>
                    )}
                    {submitStatus === "error" && (
                        <div className="mx-6 md:mx-8 mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                            ❌ {submitMessage}
                        </div>
                    )}
                </div>

                {/* ✅ SMOOTH POPUP (ONLY ADDITION) */}
                {errorPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl px-6 py-5 w-[90%] max-w-sm text-center">
                            <div className="text-3xl mb-2">⚠️</div>
                            <p className="text-sm text-gray-700 mb-4">{errorPopup}</p>
                            <button
                                onClick={() => setErrorPopup(null)}
                                className="px-5 py-2 rounded-xl bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </FormProvider>
    );
}

// ── Main page ────────────────────────────────────────────────────
export default function AdminForm() {
    const navigate = useNavigate();
    const [authChecking, setAuthChecking] = useState(true);
    const [formType, setFormType] = useState("movie");

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await validateAdmin();

                if (!res.success) {
                    if (
                        res.message === "UNAUTHORIZED" ||
                        res.message === "ACCESS_DENIED"
                    ) {
                        navigate("/");
                    } else {
                        navigate("/admin");
                    }
                    return;
                }

                setAuthChecking(false);
            } catch (err) {
                navigate("/admin");
            }
        };

        verify();
    }, [navigate]);

    if (authChecking) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-4 border-[#8a3357] border-t-transparent animate-spin" />
                    <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">
                        Verifying Access
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f0f0] font-sans">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8a3357] to-[#b04a6a] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">A</span>
                        </div>
                        <div>
                            <h1 className="text-gray-900 font-bold text-base leading-none">Admin Portal</h1>
                            <p className="text-gray-400 text-xs mt-0.5">Movie Management</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Back to Site
                    </button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm w-fit mb-8">
                    <button
                        type="button"
                        onClick={() => setFormType("movie")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${formType === "movie"
                                ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white shadow-md shadow-[#8a3357]/25"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        🎬 Add Movie Show
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormType("upcoming")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${formType === "upcoming"
                                ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white shadow-md shadow-[#8a3357]/25"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        ⏳ Add Upcoming Movie
                    </button>
                </div>

                <p className="text-xs text-gray-400 -mt-4 mb-6 ml-1">
                    {formType === "movie"
                        ? "This will be added to the live movie listings with theater & booking details."
                        : "This will appear in the upcoming / coming soon section — no theater info needed."}
                </p>

                <MovieFormShell key={formType} formType={formType} />
            </div>
        </div>
    );
}