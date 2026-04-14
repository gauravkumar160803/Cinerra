/**
 * Returns Tailwind classes for a standard text input.
 * Pass hasError=true to show the red ring.
 */
export function inputClass(hasError = false) {
    return [
        "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800",
        "bg-white placeholder:text-gray-300",
        "focus:outline-none focus:ring-2 transition-all duration-150",
        hasError
            ? "border-red-300 focus:ring-red-200 focus:border-red-400"
            : "border-gray-200 focus:ring-[#b04a6a]/20 focus:border-[#b04a6a]",
    ].join(" ");
}

export function textareaClass(hasError = false) {
    return inputClass(hasError) + " resize-none";
} 