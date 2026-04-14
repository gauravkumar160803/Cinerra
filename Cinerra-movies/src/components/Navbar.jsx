import { useState } from "react";
import { Bookmark, MapPin, ScanFace, LayoutGrid, X, NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

// ─── Add future announcements here ───────────────────────────────────────────
const ANNOUNCEMENTS = [
    {
        version: "Beta v1.01",
        items: [
            { type: "FEATURE", text: "Favourites page — curate and persist your saved titles across sessions" },
            { type: "FEATURE", text: "Location & language fields in the admin form for richer show metadata" },
            { type: "FEATURE", text: "Filter panel on show selection — sort by genre, time slot, and seat class" },
            { type: "FEATURE", text: "Location-based filtering on the home page — shows auto-scoped to your city" },
            { type: "PATCH", text: "Minor bug fixes across booking and routing edge cases" },
            { type: "UI", text: "Incremental UI improvements — spacing, transitions, and accessibility tweaks" },
        ],
    },
];
// ─────────────────────────────────────────────────────────────────────────────

const BADGE_STYLES = {
    FEATURE: { background: "#eff6ff", color: "#1d4ed8", border: "0.5px solid #bfdbfe" },
    PATCH: { background: "#fdf4ff", color: "#7e22ce", border: "0.5px solid #e9d5ff" },
    UI: { background: "#f0fdf4", color: "#15803d", border: "0.5px solid #bbf7d0" },
    HOTFIX: { background: "#fef2f2", color: "#991b1b", border: "0.5px solid #fca5a5" },
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState("Delhi");
    const [showAnnouncements, setShowAnnouncements] = useState(false);
    const { user } = useUser();
    const { openSignIn } = useClerk();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Now Showing", path: "/#intheater" },
        { name: "My Bookings", path: "/bookings" },
        { name: "Favourites", path: "/watchlist" },
        { name: "Upcoming", path: "/upcoming" },
    ];

    const closeMenu = () => setIsOpen(false);

    const handleLogoClick = () => {
        closeMenu();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <style>
                {`
                .admin-border-wrap {
                    position: relative;
                    display: inline-block;
                    padding: 2px;
                    border-radius: 12px;
                }
                .admin-border-wrap::before,
                .admin-border-wrap::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 12px;
                    border: 2px solid transparent;
                    background: linear-gradient(white, white) padding-box,
                                linear-gradient(var(--admin-a), #facc15, #8a3357, #facc15) border-box;
                    animation: adminRotate 10.5s linear infinite;
                }
                .admin-border-wrap::after {
                    animation-delay: -1.25s;
                }
                @property --admin-a {
                    syntax: '<angle>';
                    inherits: false;
                    initial-value: 0deg;
                }
                @keyframes adminRotate {
                    to { --admin-a: 360deg; }
                }
                .admin-border-wrap:hover .admin-inner-btn {
                    background: #fef9c3;
                }
                .admin-inner-btn {
                    position: relative;
                    z-index: 1;
                    display: block;
                    padding: 8px 24px;
                    border-radius: 10px;
                    background: white;
                    font-weight: 600;
                    font-size: 14px;
                    color: #cc5f07;
                    transition: background 0.2s;
                    text-decoration: none;
                }

                /* ── Announcement button ── */
                .announce-btn {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 7px 14px;
                    border-radius: 10px;
                    border: 1.5px solid #ef4444;
                    background: transparent;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    color: #ef4444;
                    transition: background 0.2s, color 0.2s;
                    animation: redGlow 2s ease-in-out infinite;
                }
                .announce-btn:hover {
                    background: #fef2f2;
                }
                @keyframes redGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
                    50%       { box-shadow: 0 0 8px 2px rgba(239,68,68,0.35); }
                }
                .announce-dot {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                    background: #ef4444;
                    border: 2px solid white;
                    animation: pulse-dot 1.6s ease-in-out infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%      { transform: scale(1.3); opacity: 0.7; }
                }

                /* ── Popup overlay ── */
                .announce-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 999;
                    background: rgba(0,0,0,0.35);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                }
                .announce-popup {
                    background: white;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 480px;
                    max-height: 88vh;
                    overflow-y: auto;
                    padding: 24px;
                    position: relative;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
                }
                .announce-popup-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 16px;
                }
                .announce-popup-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #9ca3af;
                    padding: 2px;
                    line-height: 1;
                    border-radius: 6px;
                    transition: color 0.15s;
                }
                .announce-popup-close:hover { color: #374151; }
                .announce-version-badge {
                    font-size: 11px;
                    font-weight: 600;
                    background: #fef2f2;
                    color: #991b1b;
                    padding: 3px 10px;
                    border-radius: 20px;
                    border: 0.5px solid #fca5a5;
                    display: inline-block;
                    margin-bottom: 10px;
                }
                .announce-divider {
                    border: none;
                    border-top: 1px solid #f3f4f6;
                    margin: 12px 0;
                }
                .announce-section-label {
                    font-size: 11px;
                    font-weight: 600;
                    color: #9ca3af;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin: 0 0 12px;
                }
                .announce-item {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                    margin-bottom: 10px;
                }
                .announce-type-badge {
                    font-size: 10px;
                    font-weight: 600;
                    padding: 2px 8px;
                    border-radius: 20px;
                    white-space: nowrap;
                    flex-shrink: 0;
                    margin-top: 1px;
                }
                .announce-item-text {
                    font-size: 13px;
                    color: #374151;
                    line-height: 1.5;
                    margin: 0;
                }
                `}
            </style>

            {/* ── Announcements Popup ─────────────────────────────────── */}
            {showAnnouncements && (
                <div className="announce-overlay" onClick={() => setShowAnnouncements(false)}>
                    <div className="announce-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="announce-popup-header">
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <NotebookPen size={22} style={{ color: "#ef4444" }} />
                                <div>
                                    <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#111827" }}>
                                        Announcements
                                    </p>
                                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                                        System changelog &amp; upcoming patches
                                    </p>
                                </div>
                            </div>
                            <button className="announce-popup-close" onClick={() => setShowAnnouncements(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <hr className="announce-divider" />

                        {ANNOUNCEMENTS.map((block, bi) => (
                            <div key={bi}>
                                <span className="announce-version-badge">{block.version}</span>
                                <p className="announce-section-label">Upcoming features &amp; fixes</p>
                                {block.items.map((item, ii) => (
                                    <div className="announce-item" key={ii}>
                                        <span
                                            className="announce-type-badge"
                                            style={BADGE_STYLES[item.type] ?? BADGE_STYLES.FEATURE}
                                        >
                                            {item.type}
                                        </span>
                                        <p className="announce-item-text">{item.text}</p>
                                    </div>
                                ))}
                                {bi < ANNOUNCEMENTS.length - 1 && <hr className="announce-divider" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <nav className="h-[80px] w-full bg-white fixed top-0 z-50 flex items-center justify-between px-4 lg:px-8">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link
                        onClick={handleLogoClick}
                        className="h-[60px] w-[150px] md:h-[80px] md:w-[200px]"
                    >
                        <img src="/Logos/NavbarLogo.png" alt="Logo" />
                    </Link>

                    <span className="hidden md:flex items-center gap-1 text-md bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                        <Bookmark size={20} />
                        β-v1.00
                    </span>
                </div>

                {/* Location */}
                <div className="hidden md:flex items-center border-2 border-neutral-300 rounded-4xl px-4 py-2 gap-2 cursor-pointer hover:border-[#8a3357]">
                    <MapPin size={18} className="text-[#8a3357]" />
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="outline-none text-sm bg-transparent cursor-pointer"
                    >
                        <option>Delhi</option>
                        <option>Noida</option>
                        <option>Ghaziabad</option>
                        <option>Gurgaon</option>
                        <option>Mumbai</option>
                    </select>
                </div>

                {/* Desktop Links */}
                <ul className="hidden xl:flex items-center">
                    {navLinks.map((link) => (
                        <li
                            key={link.name}
                            className="mx-3 font-bold text-sm text-neutral-600 hover:bg-gradient-to-r hover:from-[#8a3357] hover:to-[#4c2250] hover:bg-clip-text hover:text-transparent"
                        >
                            {link.path.includes("#") ? (
                                <HashLink smooth to={link.path}>
                                    {link.name}
                                </HashLink>
                            ) : (
                                <Link to={link.path}>{link.name}</Link>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Admin Button */}
                <div className="hidden md:flex items-center mx-4">
                    <Link to="/admin" className="admin-border-wrap">
                        <span className="admin-inner-btn">Admin</span>
                    </Link>
                </div>

                {/* ── Announcements Button (desktop) ── */}
                <div className="hidden md:flex items-center mx-2">
                    <button
                        className="announce-btn"
                        onClick={() => setShowAnnouncements(true)}
                    >
                        <span className="announce-dot" />
                        <NotebookPen size={15} />
                        Updates
                    </button>
                </div>

                {/* Auth */}
                <div className="hidden xl:flex">
                    {!user ? (
                        <button
                            onClick={openSignIn}
                            className="h-10 w-40 flex items-center justify-center gap-2
                                bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                                text-white font-semibold text-sm rounded-xl
                                shadow-md shadow-[#8a3357]/25
                                hover:shadow-lg hover:shadow-[#8a3357]/40
                                hover:opacity-95 hover:scale-105
                                transition-all duration-200 active:scale-[0.98] cursor-pointer"
                        >
                            Login / Signup <ScanFace size={16} />
                        </button>
                    ) : (
                        <UserButton />
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="xl:hidden">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <LayoutGrid size={28} />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isOpen && (
                    <div className="absolute top-[80px] left-0 w-full bg-white shadow-md xl:hidden flex flex-col items-center py-6 space-y-6">

                        <div className="flex items-center border-2 border-neutral-300 rounded-4xl px-4 py-2 gap-2 w-[90%]">
                            <MapPin size={18} className="text-[#8a3357]" />
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="outline-none text-sm bg-transparent w-full"
                            >
                                <option>Delhi</option>
                                <option>Noida</option>
                                <option>Ghaziabad</option>
                                <option>Gurgaon</option>
                                <option>Mumbai</option>
                            </select>
                        </div>

                        {navLinks.map((link) =>
                            link.path.includes("#") ? (
                                <HashLink
                                    key={link.name}
                                    smooth
                                    to={link.path}
                                    onClick={closeMenu}
                                    className="font-bold text-sm text-neutral-600"
                                >
                                    {link.name}
                                </HashLink>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={closeMenu}
                                    className="font-bold text-sm text-neutral-600"
                                >
                                    {link.name}
                                </Link>
                            )
                        )}

                        {/* Mobile Admin Button */}
                        <Link to="/admin" className="admin-border-wrap" onClick={closeMenu}>
                            <span className="admin-inner-btn">Admin</span>
                        </Link>

                        {/* ── Announcements Button (mobile) ── */}
                        <button
                            className="announce-btn"
                            onClick={() => {
                                closeMenu();
                                setShowAnnouncements(true);
                            }}
                        >
                            <span className="announce-dot" />
                            <NotebookPen size={15} />
                            Announcements
                        </button>

                        {!user ? (
                            <button
                                onClick={() => {
                                    closeMenu();
                                    openSignIn();
                                }}
                                className="h-10 w-40 flex items-center justify-center gap-2
                                    bg-gradient-to-r from-[#8a3357] to-[#4c2250]
                                    text-white font-semibold text-sm rounded-xl cursor-pointer"
                            >
                                Login / Signup <ScanFace size={18} className="ml-1" />
                            </button>
                        ) : (
                            <UserButton />
                        )}
                    </div>
                )}
            </nav>
        </>
    );
}

