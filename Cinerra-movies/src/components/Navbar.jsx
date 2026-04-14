import { useState } from "react";
import { Bookmark, MapPin, ScanFace, LayoutGrid, X } from "lucide-react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState("Delhi");
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
                `}
            </style>

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

