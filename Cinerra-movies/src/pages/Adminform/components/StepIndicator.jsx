export default function StepIndicator({ sections, activeSection, setActiveSection }) {
    const activeIdx = sections.findIndex((s) => s.id === activeSection);

    return (
        <div className="w-full">
            {/* Desktop: horizontal step bar */}
            <div className="hidden sm:flex items-center justify-between relative">
                {/* connecting line */}
                <div className="absolute top-5 left-0 right-0 h-px bg-gray-200 z-0" />

                {sections.map((section, idx) => {
                    const isActive = section.id === activeSection;
                    const isDone = idx < activeIdx;

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => setActiveSection(section.id)}
                            className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${isActive
                                        ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] border-[#8a3357] shadow-lg shadow-[#8a3357]/30 scale-110"
                                        : isDone
                                            ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] border-[#8a3357] opacity-70"
                                            : "bg-white border-gray-200 group-hover:border-[#b04a6a] group-hover:shadow-sm"
                                    }`}
                            >
                                {isDone ? (
                                    <span className="text-white text-sm">✓</span>
                                ) : (
                                    <span className={isActive ? "" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all"}>
                                        {section.icon}
                                    </span>
                                )}
                            </div>
                            <span className={`text-xs font-medium whitespace-nowrap transition-colors duration-200 ${isActive ? "text-[#8a3357]" : isDone ? "text-gray-400" : "text-gray-400 group-hover:text-gray-600"
                                }`}>
                                {section.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Mobile: compact tabs */}
            <div className="sm:hidden flex gap-1 overflow-x-auto pb-1">
                {sections.map((section, idx) => {
                    const isActive = section.id === activeSection;
                    const isDone = idx < activeIdx;
                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border ${isActive
                                    ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white border-[#8a3357] shadow-sm"
                                    : isDone
                                        ? "bg-gray-100 text-gray-400 border-gray-200"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <span>{section.icon}</span>
                            {section.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}