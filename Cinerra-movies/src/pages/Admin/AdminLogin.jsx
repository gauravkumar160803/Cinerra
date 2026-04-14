import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdmin, verifyAdminKey } from "../../api";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";

// ── icons ──────────────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="M21 2l-9.6 9.6M15 8l3 3" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
        strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
    </svg>
  );
}

// ── countdown popup ────────────────────────────────────────────────────────
function CountdownPopup({ message, subtext, emoji, seconds, total = 5, variant = "error" }) {
  const isSignin = variant === "signin";
  const pct = Math.max(0, (seconds / total) * 100);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className={`bg-white rounded-2xl shadow-2xl px-8 py-7 flex flex-col items-center gap-4 w-full max-w-sm border ${isSignin ? "border-[#8a3357]/20" : "border-red-100"
        }`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${isSignin ? "bg-[#8a3357]/10" : "bg-red-50"
          }`}>
          {emoji}
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-[15px] leading-snug">{message}</p>
          {subtext && <p className="text-gray-400 text-xs mt-1.5">{subtext}</p>}
        </div>
        <p className="text-gray-400 text-sm">
          {isSignin ? "Opening sign-in in " : "Redirecting in "}
          <span className="font-bold text-[#8a3357]">{seconds}s</span>
        </p>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8a3357] to-[#c0627e]"
            style={{ width: `${pct}%`, transition: "width 1s linear" }}
          />
        </div>
      </div>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────
export default function AdminLogin() {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  const [phase, setPhase] = useState("loading");
  const [adminKey, setAdminKey] = useState("");
  const [keyError, setKeyError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [focused, setFocused] = useState(false);
  const [popupCfg, setPopupCfg] = useState(null);

  // refs so callbacks always read latest values without stale closures
  const isSignedInRef = useRef(isSignedIn);
  const isLoadedRef = useRef(isLoaded);
  const dismissPollRef = useRef(null); // holds the polling interval id
  const redirectStartedRef = useRef(false); // prevent double-firing redirect

  useEffect(() => { isSignedInRef.current = isSignedIn; }, [isSignedIn]);
  useEffect(() => { isLoadedRef.current = isLoaded; }, [isLoaded]);

  // ── countdown helper ───────────────────────────────────────────────────
  const startCountdown = useCallback(({ message, subtext, emoji, total = 5, variant = "error", onDone }) => {
    setPopupCfg({ message, subtext, emoji, seconds: total, total, variant });
    let remaining = total;
    const id = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(id);
        setPopupCfg(null);
        onDone();
      } else {
        setPopupCfg((p) => (p ? { ...p, seconds: remaining } : p));
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const startRedirect = useCallback(
    (message, subtext) => {
      if (redirectStartedRef.current) return; // guard against double calls
      redirectStartedRef.current = true;
      setPhase("needs-signin");
      startCountdown({
        message,
        subtext,
        emoji: "🚫",
        total: 5,
        variant: "error",
        onDone: () => navigate("/"),
      });
    },
    [startCountdown, navigate]
  );

  // ── auth + admin check ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // Step 1: show blurred page + "sign in required" countdown
      setPhase("needs-signin");
      startCountdown({
        message: "Sign in required",
        subtext: "You must be signed in to access the admin portal.",
        emoji: "🔐",
        total: 4,
        variant: "signin",
        onDone: () => {
          // Step 2: open Clerk modal
          openSignIn({
            redirectUrl: window.location.href,
            appearance: { variables: { colorPrimary: "#8a3357" } },
          });
          setPhase("loading");
          setPopupCfg(null);

          // Step 3: poll every 500ms to detect if user closes the modal
          // Clerk's modal closing does NOT re-trigger useEffect because
          // isSignedIn doesn't change — polling is the only reliable way.
          dismissPollRef.current = setInterval(() => {
            if (isLoadedRef.current && !isSignedInRef.current) {
              // Check if the Clerk modal is no longer open
              // Clerk renders its modal into a portal — when closed, the
              // overlay div is removed from the DOM.
              const clerkModalOpen = !!document.querySelector(".cl-modalBackdrop, [data-clerk-modal], #clerk-modal, .cl-rootBox");
              if (!clerkModalOpen) {
                clearInterval(dismissPollRef.current);
                dismissPollRef.current = null;
                startRedirect(
                  "Sign-in cancelled.",
                  "You must be signed in to access the admin portal."
                );
              }
            }
          }, 500);
        },
      });
      return;
    }

    // Clear dismiss poll if user successfully signed in
    if (dismissPollRef.current) {
      clearInterval(dismissPollRef.current);
      dismissPollRef.current = null;
    }

    // Signed in — check admin status
    (async () => {
      setPhase("checking");
      try {
        const res = await checkAdmin();
        if (!res.success) {
          startRedirect(
            "Access denied.",
            res.message === "NOT_ADMIN"
              ? "Your account does not have admin privileges."
              : "Unauthorised — please contact support."
          );
          return;
        }
        setPhase("key");
      } catch {
        startRedirect("Something went wrong.", "Could not verify your account. Try again.");
      }
    })();

    // Cleanup poll on unmount
    return () => {
      if (dismissPollRef.current) clearInterval(dismissPollRef.current);
    };
  }, [isLoaded, isSignedIn]); // eslint-disable-line

  // ── key submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) { setKeyError("Please enter your admin key."); return; }
    setSubmitting(true);
    setKeyError("");
    try {
      const res = await verifyAdminKey(adminKey);
      if (!res.success) {
        if (res.message === "INVALID_KEY") {
          setKeyError("Incorrect admin key. Please try again.");
        } else if (res.message === "NOT_ADMIN") {
          startRedirect("Access denied.", "Your account does not have admin privileges.");
        } else if (res.message === "UNAUTHORIZED") {
          startRedirect("Session expired.", "Please sign in again to continue.");
        } else {
          setKeyError("Something went wrong. Please try again.");
        }
        return;
      }
      navigate("/adminform");
    } catch {
      setKeyError("Network error. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  // resolve display name
  const displayName =
    user?.firstName ||
    user?.fullName?.split(" ")[0] ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Admin";

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <>
      {popupCfg && <CountdownPopup {...popupCfg} />}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5e6ec] via-[#f0d9e4] to-[#e8cdd8] px-4">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-[#8a3357]/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#c0627e]/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-[420px]">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">

            <div className="px-9 py-9">
              {/* header — always visible */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8a3357] to-[#c0627e] flex items-center justify-center text-white shadow-lg shadow-[#8a3357]/20 mb-4">
                  <LockIcon />
                </div>
                <h1 className="text-[22px] font-bold text-gray-800 tracking-tight">Admin Portal</h1>
                <p className="text-gray-400 text-[13px] mt-1 text-center">
                  Restricted access — authorised personnel only
                </p>
              </div>

              {/* loading / checking */}
              {(phase === "loading" || phase === "checking") && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="w-9 h-9 rounded-full border-[3px] border-[#8a3357]/20 border-t-[#8a3357] animate-spin" />
                  <p className="text-sm text-gray-400">
                    {phase === "checking" ? "Verifying your account…" : "Loading…"}
                  </p>
                </div>
              )}

              {/* blurred placeholders — shown while waiting for sign-in or during redirect */}
              {phase === "needs-signin" && (
                <div className="flex flex-col gap-3.5 opacity-30 pointer-events-none select-none">
                  <div className="h-11 rounded-xl bg-gray-300 animate-pulse" />
                  <div className="h-11 rounded-xl bg-gray-200 animate-pulse" />
                  <div className="h-11 rounded-xl bg-[#8a3357]/30 animate-pulse" />
                </div>
              )}

              {/* key entry */}
              {phase === "key" && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-700 text-[15px] font-semibold text-center">
                      Welcome back,{" "}
                      <span className="text-[#8a3357]">{displayName}</span> 👋
                    </p>
                    <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] px-4 py-2.5 rounded-xl">
                      <ShieldIcon />
                      <span className="font-medium">Identity verified</span>
                      <span className="ml-auto text-emerald-500 text-xs font-bold">✓ Authenticated</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 px-0.5">
                      <KeyIcon />
                      Admin Key
                    </label>

                    <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${keyError
                        ? "border-red-300 bg-red-50/40"
                        : focused
                          ? "border-[#8a3357] bg-white shadow-md shadow-[#8a3357]/10"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}>
                      <div className={`pl-4 shrink-0 transition-colors duration-200 ${focused ? "text-[#8a3357]" : "text-gray-300"}`}>
                        <LockIcon />
                      </div>
                      <input
                        type={showKey ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={adminKey}
                        onChange={(e) => { setAdminKey(e.target.value); setKeyError(""); }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        autoComplete="current-password"
                        className="flex-1 px-3 py-3.5 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-300 font-mono tracking-[0.2em]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey((v) => !v)}
                        tabIndex={-1}
                        className="pr-4 shrink-0 text-gray-300 hover:text-[#8a3357] transition-colors duration-150"
                      >
                        <EyeIcon open={showKey} />
                      </button>
                    </div>

                    {adminKey.length > 0 && (
                      <div className="flex items-center gap-1.5 px-0.5">
                        {[4, 8, 12].map((threshold, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${adminKey.length >= threshold ? "bg-[#8a3357]" : "bg-gray-200"
                              }`}
                          />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1 w-10">
                          {adminKey.length < 4 ? "Short" : adminKey.length < 8 ? "Medium" : "Long"}
                        </span>
                      </div>
                    )}

                    {keyError && (
                      <p className="text-red-500 text-[12px] flex items-center gap-1.5 px-0.5">
                        <span>⚠</span> {keyError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !adminKey.trim()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8a3357] to-[#b04a6a] text-white py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-[#8a3357]/25 hover:shadow-lg hover:shadow-[#8a3357]/30 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                  >
                    {submitting ? (
                      <><Spinner /> Verifying key…</>
                    ) : (
                      <>Enter Admin Portal <span className="opacity-60">→</span></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-400/60 mt-4">
            Unauthorised access attempts are logged and monitored.
          </p>
        </div>
      </div>
    </>
  );
}