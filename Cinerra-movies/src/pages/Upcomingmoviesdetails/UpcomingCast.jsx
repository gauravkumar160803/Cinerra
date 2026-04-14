import { useState } from 'react';

export default function UpcomingCast({ upcoming }) {
    const castMembers = upcoming?.cast || [];
    const cardsPerPage = 6;
    const [startIndex, setStartIndex] = useState(0);

    const visibleCast = castMembers.slice(startIndex, startIndex + cardsPerPage);

    const showNext = () => {
        if (startIndex + cardsPerPage < castMembers.length) {
            setStartIndex(prev => prev + cardsPerPage);
        }
    };

    const showPrevious = () => {
        if (startIndex > 0) {
            setStartIndex(prev => Math.max(prev - cardsPerPage, 0));
        }
    };

    const isNextDisabled = startIndex + cardsPerPage >= castMembers.length;

    const isPrevDisabled = startIndex === 0;

    if (castMembers.length === 0) {
        return null;
    }

    return (
        <section className="py-5 px-2 mx-4 md:mx-20 bg-transparent w-full border-b border-gray-300 max-w-5xl">
            <div className="max-w-5xl">
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">
                    Cast
                </h2>

                <div className="relative flex items-center">
                    {castMembers.length > cardsPerPage && (
                        <button
                            onClick={showPrevious}
                            disabled={isPrevDisabled}
                            className={`absolute -left-12 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border border-gray-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-10 
                ${isPrevDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            aria-label="Previous cast page"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-600">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                    )}

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-6 w-full py-2">
                        {/* FIXED: Added index and updated key to look for MongoDB _id */}
                        {visibleCast.map((member, index) => (
                            <div
                                key={member._id || member.id || index}
                                className="flex flex-col items-center flex-shrink-0 text-center"
                            >
                                <img
                                    src={member.imageUrl || "https://placehold.co/100x100/CCCCCC/333333?text=N/A"}
                                    alt={member.name}
                                    className="w-24 h-24 object-cover rounded-full shadow-md transition duration-300 hover:shadow-lg"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/CCCCCC/333333?text=N/A"; }}
                                />

                                <p className="mt-2 text-sm font-semibold text-gray-900 leading-snug">
                                    {member.name}
                                </p>

                                <p className="text-xs text-gray-500 line-clamp-2">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>

                    {castMembers.length > cardsPerPage && (
                        <button
                            onClick={showNext}
                            disabled={isNextDisabled}
                            className={`absolute -right-12 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border border-gray-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-10 
                ${isNextDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            aria-label="Next cast page"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-600">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}