import { useFormContext, useFieldArray } from "react-hook-form";
import FormField from "../components/FormField";
import { inputClass } from "../components/inputClass";

// ── Timings ──────────────────────────────────────────────────────
function TimingsArray({ dateIndex, theaterIndex, theaterErrors }) {
    const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: `showDates.${dateIndex}.theaters.${theaterIndex}.timings`,
    });

    return (
        <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Show Timings
                </p>
                <button
                    type="button"
                    onClick={() => append({ time: "", audi: "" })}
                    className="text-xs px-3 py-1 rounded-lg border border-[#b04a6a] text-[#8a3357]
            hover:bg-[#8a3357] hover:text-white transition-all duration-150 font-medium"
                >
                    + Timing
                </button>
            </div>

            {fields.length === 0 && (
                <p className="text-xs text-gray-300 italic">No timings added — click "+ Timing"</p>
            )}

            <div className="space-y-2">
                {fields.map((f, tIdx) => {
                    const tErrors = theaterErrors?.timings?.[tIdx];
                    return (
                        <div key={f.id} className="flex gap-2 items-start">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <FormField
                                    error={tErrors?.time?.message}
                                    hint="24-hour clock — e.g. 10:30 or 20:00"
                                >
                                    <input
                                        type="time"
                                        placeholder="e.g. 10:30"
                                        {...register(
                                            `showDates.${dateIndex}.theaters.${theaterIndex}.timings.${tIdx}.time`
                                        )}
                                        className={inputClass(!!tErrors?.time)}
                                    />
                                </FormField>
                                <FormField
                                    error={tErrors?.audi?.message}
                                    hint="Screen or auditorium identifier"
                                >
                                    <input
                                        type="text"
                                        placeholder="e.g. Audi 1, Screen 3"
                                        {...register(
                                            `showDates.${dateIndex}.theaters.${theaterIndex}.timings.${tIdx}.audi`
                                        )}
                                        className={inputClass(!!tErrors?.audi)}
                                    />
                                </FormField>
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(tIdx)}
                                className="mt-1 w-7 h-7 flex-shrink-0 rounded-full bg-white border border-gray-200
                  flex items-center justify-center text-gray-400 hover:text-red-500
                  hover:border-red-200 transition-all text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Seating Prices ───────────────────────────────────────────────
function SeatingPricesArray({ dateIndex, theaterIndex, theaterErrors }) {
    const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: `showDates.${dateIndex}.theaters.${theaterIndex}.seatingPrices`,
    });

    return (
        <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Seating Categories
                </p>
                <button
                    type="button"
                    onClick={() => append({ name: "", price: "", rows: "" })}
                    className="text-xs px-3 py-1 rounded-lg border border-[#b04a6a] text-[#8a3357]
            hover:bg-[#8a3357] hover:text-white transition-all duration-150 font-medium"
                >
                    + Category
                </button>
            </div>

            {fields.length === 0 && (
                <p className="text-xs text-gray-300 italic">
                    No seating categories — click "+ Category"
                </p>
            )}

            <div className="space-y-2">
                {fields.map((f, sIdx) => {
                    const sErrors = theaterErrors?.seatingPrices?.[sIdx];
                    return (
                        <div key={f.id} className="flex gap-2 items-start">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <FormField
                                    error={sErrors?.name?.message}
                                    hint="Seat tier label shown to users"
                                >
                                    <input
                                        type="text"
                                        placeholder="e.g. Premium, Gold, Silver"
                                        {...register(
                                            `showDates.${dateIndex}.theaters.${theaterIndex}.seatingPrices.${sIdx}.name`
                                        )}
                                        className={inputClass(!!sErrors?.name)}
                                    />
                                </FormField>
                                <FormField
                                    error={sErrors?.price?.message}
                                    hint="Ticket price in INR (₹), numbers only"
                                >
                                    <input
                                        type="number"
                                        placeholder="e.g. 350"
                                        {...register(
                                            `showDates.${dateIndex}.theaters.${theaterIndex}.seatingPrices.${sIdx}.price`
                                        )}
                                        className={inputClass(!!sErrors?.price)}
                                    />
                                </FormField>
                                <FormField
                                    error={sErrors?.rows?.message}
                                    hint="Seat rows belonging to this tier, comma-separated"
                                >
                                    <input
                                        type="text"
                                        placeholder="e.g. A, B, C, D"
                                        {...register(
                                            `showDates.${dateIndex}.theaters.${theaterIndex}.seatingPrices.${sIdx}.rows`
                                        )}
                                        className={inputClass(!!sErrors?.rows)}
                                    />
                                </FormField>
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(sIdx)}
                                className="mt-1 w-7 h-7 flex-shrink-0 rounded-full bg-white border border-gray-200
                  flex items-center justify-center text-gray-400 hover:text-red-500
                  hover:border-red-200 transition-all text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Single Theater card ──────────────────────────────────────────
function TheaterCard({ dateIndex, theaterIndex, remove, theaterErrors }) {
    const { register } = useFormContext();
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 relative">
            <button
                type="button"
                onClick={() => remove(theaterIndex)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-50 border border-gray-200
          flex items-center justify-center text-gray-400 hover:text-red-500
          hover:border-red-200 transition-all text-xs"
            >
                ✕
            </button>

            <FormField
                label="Theater Name"
                error={theaterErrors?.theater?.message}
                required
                hint="Full name including location — helps users identify the venue"
            >
                <input
                    type="text"
                    placeholder="e.g. PVR Cinemas, Connaught Place, New Delhi"
                    {...register(`showDates.${dateIndex}.theaters.${theaterIndex}.theater`)}
                    className={inputClass(!!theaterErrors?.theater)}
                />
            </FormField>

            <TimingsArray
                dateIndex={dateIndex}
                theaterIndex={theaterIndex}
                theaterErrors={theaterErrors}
            />
            <SeatingPricesArray
                dateIndex={dateIndex}
                theaterIndex={theaterIndex}
                theaterErrors={theaterErrors}
            />
        </div>
    );
}

// ── Show Date block ──────────────────────────────────────────────
function ShowDateBlock({ dateIndex, remove: removeDate, dateErrors }) {
    const { register, control } = useFormContext();
    const {
        fields: theaterFields,
        append: appendTheater,
        remove: removeTheater,
    } = useFieldArray({
        control,
        name: `showDates.${dateIndex}.theaters`,
    });

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-lg">📅</span>
                    <FormField
                        error={dateErrors?.date?.message}
                        required
                        hint="The calendar date for this set of shows (YYYY-MM-DD)"
                    >
                        <input
                            type="date"
                            {...register(`showDates.${dateIndex}.date`)}
                            className={inputClass(!!dateErrors?.date) + " w-52"}
                        />
                    </FormField>
                </div>
                <button
                    type="button"
                    onClick={() => removeDate(dateIndex)}
                    className="text-xs px-3 py-1.5 rounded-lg text-red-400 border border-red-200
            hover:bg-red-50 transition-all duration-150 font-medium"
                >
                    Remove Date
                </button>
            </div>

            <div className="space-y-3 mb-3">
                {theaterFields.map((tField, tIdx) => (
                    <TheaterCard
                        key={tField.id}
                        dateIndex={dateIndex}
                        theaterIndex={tIdx}
                        remove={removeTheater}
                        theaterErrors={dateErrors?.theaters?.[tIdx]}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={() =>
                    appendTheater({
                        theater: "",
                        timings: [{ time: "", audi: "" }],
                        seatingPrices: [{ name: "", price: "", rows: "" }],
                    })
                }
                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200
          text-gray-400 text-sm font-medium hover:border-[#b04a6a] hover:text-[#8a3357]
          transition-all duration-150"
            >
                + Add Theater for this Date
            </button>
        </div>
    );
}

// ── Main export ──────────────────────────────────────────────────
export default function TheatersSection() {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "showDates",
    });

    return (
        <div>
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Theaters & Shows</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Set the dates, theaters, show timings and seat pricing
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        append({
                            date: "",
                            theaters: [
                                {
                                    theater: "",
                                    timings: [{ time: "", audi: "" }],
                                    seatingPrices: [{ name: "", price: "", rows: "" }],
                                },
                            ],
                        })
                    }
                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
            text-white font-bold text-xs shadow-md shadow-[#8a3357]/25
            hover:shadow-lg hover:shadow-[#8a3357]/40 hover:scale-105
            transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                    + Add Date
                </button>
            </div>

            {fields.length === 0 && (
                <div className="text-center py-16 text-gray-300">
                    <div className="text-5xl mb-3">🏟️</div>
                    <p className="text-sm font-medium">No show dates added yet</p>
                    <p className="text-xs mt-1">Click "+ Add Date" to schedule this movie</p>
                </div>
            )}

            <div className="space-y-4">
                {fields.map((field, idx) => (
                    <ShowDateBlock
                        key={field.id}
                        dateIndex={idx}
                        remove={remove}
                        dateErrors={errors.showDates?.[idx]}
                    />
                ))}
            </div> 
        </div>
    );
}
