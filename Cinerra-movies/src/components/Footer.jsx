import { useState } from "react";
import { Facebook, Cross, Instagram, Mail, ChevronDown } from "lucide-react";

export default function Footer() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I book tickets?",
            answer:
                "You can book tickets by browsing Now Showing movies, selecting your showtime, choosing seats and completing the payment securely online.",
        },
        {
            question: "Can I get a refund?",
            answer:
                "Refunds are available according to our Refund Policy. Please visit the Help Center or contact support for eligibility and timelines.",
        },
        {
            question: "Do you support multiple languages?",
            answer: "Yes — our platform supports multiple languages depending on your region and preferences.",
        },
        {
            question: "Is online payment secure?",
            answer:
                "Yes — we use secure, PCI-compliant payment gateways and encryption to ensure your payment details are protected.",
        },
        {
            question: "How can I change or cancel my booking?",
            answer:
                "Changes or cancellations depend on the theatre and time before the show. Check ‘My Bookings’ for available actions — fees may apply.",
        },
        {
            question: "Are there student or promo discounts?",
            answer:
                "Yes — we run periodic offers and promo codes. Check the Offers page or apply a promo code at checkout to see the discount.",
        },
        {
            question: "Can I pre-book seats?",
            answer: "Yes — during booking you can choose and pre-book available seats for most partner theatres.",
        },
        {
            question: "What should I bring to the theatre?",
            answer: "Bring your e-ticket / booking QR and the ID (if required for offers). Screenshots of the ticket usually work but prefer the official e-ticket.",
        },
        {
            question: "Are theatres wheelchair accessible?",
            answer:
                "Most partner theatres provide wheelchair access. Check the theatre details page or contact support for accessibility information.",
        },
    ];

    return (
        <footer className="bg-white text-gray-800 py-16 px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 tracking-wide">
                {/* Left Column: Logo + About + Socials */}
                <div className="flex-1 space-y-6">
                    <div className="h-[70px] w-[180px]">
                        <img src="/Logos/NavbarLogo.png" alt="Cinerra logo" className="h-full w-full object-contain" />
                    </div>
                    <p className="text-sm leading-relaxed max-w-sm">
                        Your one-stop destination for movies, shows, and more. Book tickets, explore reviews, and never miss the latest entertainment.
                    </p>
                    <div className="flex gap-5">
                        <a href="#" className="hover:text-[#8a3357]">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="group">
                            <img src="/Logos/icons8-x-24 (1).png" alt="X (Twitter)" className="w-5 h-5 group-hover:hidden" />
                            <img src="/Logos/icons8-x-24.png" alt="X (Twitter)" className="w-5 h-5 hidden group-hover:block" />
                        </a>
                        <a href="#" className="hover:text-[#8a3357]">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="mailto:support@cinerra.com" className="hover:text-[#8a3357]">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Middle Column: Quick Links + Support */}
                <div className="flex-1 grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-[#8a3357] cursor-pointer">Now Showing</li>
                            <li className="hover:text-[#8a3357] cursor-pointer">Upcoming Movies</li>
                            <li className="hover:text-[#8a3357] cursor-pointer">Book Tickets</li>
                            <li className="hover:text-[#8a3357] cursor-pointer">Contact Us</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-[#8a3357] cursor-pointer">Help Center</li>
                            <li className="hover:text-[#8a3357] cursor-pointer">Terms of Service</li>
                            <li className="hover:text-[#8a3357] cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-[#8a3357] cursor-pointer">Refund Policy</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Feedback + Newsletter */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Feedback</h3>
                        <textarea
                            rows="3"
                            placeholder="Write your feedback..."
                            className="w-full rounded-xl p-3 text-sm border border-gray-300 focus:outline focus:ring-1 focus:ring-[#8a3357] focus:border-[#8a3357] resize-none"
                        ></textarea>
                        <button className="mt-3 w-auto
                            bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                            text-white font-semibold text-sm
                            px-4 py-2 rounded-xl
                            shadow-md shadow-[#8a3357]/25
                            hover:shadow-lg hover:shadow-[#8a3357]/40
                            hover:opacity-95 hover:scale-105
                            transition-all duration-200 active:scale-[0.98] cursor-pointer">
                            Submit
                        </button>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-3 py-2 text-sm rounded-l-xl w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#8a3357] focus:border-[#8a3357]"
                            />
                            <button className="bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                                text-white font-semibold
                                px-4 rounded-r-xl
                                shadow-md shadow-[#8a3357]/25
                                hover:shadow-lg hover:shadow-[#8a3357]/40
                                hover:opacity-95 hover:scale-105
                                transition-all duration-200 active:scale-[0.98] cursor-pointer">
                                Go
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto mt-16 tracking-wide">
                <h3 className="text-3xl font-semibold mb-10 text-center text-gray-900">
                    Popular Questions
                </h3>

                {/* FIX: Added 'items-start' right here 👇 */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;

                        return (
                            <div
                                key={idx}
                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                                className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all duration-300
                                ${isOpen ? "border-[#8a3357] shadow-md" : "border-gray-200 hover:border-[#8a3357]"}`}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-gray-900">
                                        {faq.question}
                                    </p>

                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-300 
                                ${isOpen ? "rotate-180 text-[#8a3357]" : "text-gray-500"}`}
                                    />
                                </div>

                                {/* Answer */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 mt-3 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <p className="text-sm text-gray-700">{faq.answer}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom line */}
            <div className="border-t border-gray-200 mt-16 pt-6 text-center tracking-wide">
                <p className="text-sm">© {new Date().getFullYear()} Cinerra. All rights reserved.</p>
            </div>
        </footer>
    );
}
