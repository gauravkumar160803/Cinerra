/**
 * Reusable form field wrapper with label + error display.
 * Props:
 *  - label: string
 *  - error: string | undefined
 *  - required: bool
 *  - hint: string (optional helper text)
 *  - children: the actual input
 */
export default function FormField({ label, error, required, hint, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    {label}
                    {required && <span className="text-[#b04a6a] text-xs">*</span>}
                </label>
            )}
            {hint && <p className="text-xs text-gray-400 -mt-1">{hint}</p>}
            {children}
            {error && (
                <p className="flex items-center gap-1 text-xs text-red-500 font-medium mt-0.5">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
}