import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

const PRESET_GENRES = [
    "Action", "Adventure", "Animation", "Biography", "Comedy",
    "Crime", "Documentary", "Drama", "Fantasy", "Horror",
    "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", "War",
];

/**
 * GenreSelector — pill toggles for preset genres + a custom genre input.
 * Writes into RHF field `genres` (array of strings).
 */
export default function GenreSelector() {
    const { control, formState: { errors } } = useFormContext();
    const [customInput, setCustomInput] = useState("");

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Genres <span className="text-[#b04a6a] text-xs">*</span>
            </label>
            <p className="text-xs text-gray-400 -mt-1">
                Click to toggle presets · Type a custom genre and press Enter or comma
            </p>

            <Controller
                name="genres"
                control={control}
                render={({ field }) => {
                    const selected = field.value || [];

                    const toggle = (genre) => {
                        field.onChange(
                            selected.includes(genre)
                                ? selected.filter((g) => g !== genre)
                                : [...selected, genre]
                        );
                    };

                    const addCustom = () => {
                        const trimmed = customInput.trim();
                        if (trimmed && !selected.includes(trimmed)) {
                            field.onChange([...selected, trimmed]);
                        }
                        setCustomInput("");
                    };

                    const removeGenre = (genre) => {
                        field.onChange(selected.filter((g) => g !== genre));
                    };

                    return (
                        <div>
                            {/* Preset pills */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {PRESET_GENRES.map((genre) => {
                                    const isSelected = selected.includes(genre);
                                    return (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => toggle(genre)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                        ${isSelected
                                                    ? "bg-gradient-to-br from-[#8a3357] to-[#b04a6a] text-white border-[#8a3357] shadow-sm"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-[#b04a6a] hover:text-[#8a3357]"
                                                }`}
                                        >
                                            {genre}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom genre input */}
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === ",") {
                                            e.preventDefault();
                                            addCustom();
                                        }
                                    }}
                                    placeholder='e.g. Superhero — press Enter or comma to add'
                                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-800
                    bg-white placeholder:text-gray-300
                    focus:outline-none focus:ring-2 focus:ring-[#b04a6a]/20 focus:border-[#b04a6a]
                    transition-all duration-150"
                                />
                                <button
                                    type="button"
                                    onClick={addCustom}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
                    text-white text-xs font-bold shadow-sm hover:scale-105 transition-all duration-150
                    active:scale-[0.98] cursor-pointer"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Custom genre badges (non-preset selected genres) */}
                            {selected.filter((g) => !PRESET_GENRES.includes(g)).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selected
                                        .filter((g) => !PRESET_GENRES.includes(g))
                                        .map((g) => (
                                            <span
                                                key={g}
                                                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                          bg-amber-50 text-amber-700 border border-amber-200"
                                            >
                                                ✨ {g}
                                                <button
                                                    type="button"
                                                    onClick={() => removeGenre(g)}
                                                    className="text-amber-400 hover:text-amber-700 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))}
                                </div>
                            )}
                        </div>
                    );
                }}
            />

            {errors.genres && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                    <span>⚠</span> {errors.genres.message}
                </p>
            )}
        </div>
    );
}