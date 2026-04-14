import { z } from "zod";

// ── Shared person schema (no id field — MongoDB handles _id) ─────
const PersonSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    role: z.string().min(1, "Role is required").max(100, "Role too long"),
    // imageUrl comes back as a Cloudinary URL string after upload
    imageUrl: z.string().url("Must be a valid image URL").or(z.literal("")).optional(),
});

// ── Theater sub-schemas ──────────────────────────────────────────
const SeatingPriceSchema = z.object({
    name: z.string().min(1, "Category name is required"),
    price: z.coerce
        .number({ invalid_type_error: "Price must be a number" })
        .nonnegative("Price must be ≥ 0"),
    rows: z
        .string()
        .min(1, "At least one row is required")
        .transform((val) =>
            val
                .split(",")
                .map((r) => r.trim())
                .filter(Boolean)
        )
        .or(z.array(z.string())),
});

const TimingSchema = z.object({
    time: z
        .string()
        .min(1, "Show time is required")
        .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, "Must be HH:MM (e.g. 10:30)"),
    audi: z.string().min(1, "Auditorium / screen name is required"),
});

const TheaterSchema = z.object({
    theater: z.string().min(1, "Theater name is required"),
    timings: z.array(TimingSchema).min(1, "Add at least one show timing"),
    seatingPrices: z.array(SeatingPriceSchema).min(1, "Add at least one seating category"),
});

const ShowDateSchema = z.object({
    date: z
        .string()
        .min(1, "Date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    theaters: z.array(TheaterSchema).min(1, "Add at least one theater"),
});

// ── Shared base fields (used by both movie & upcoming) ───────────
const baseMovieFields = {
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title cannot exceed 200 characters"),

    poster: z
        .string()
        .min(1, "Poster image is required")
        .url("Poster must be a valid URL (upload an image above)"),

    rating: z
        .string()
        .min(1, "Rating is required")
        .max(10, "Rating value is too long"),

    genres: z.array(z.string().min(1)).min(1, "Select or add at least one genre"),

    duration: z
        .string()
        .min(1, "Duration is required")
        .refine((val) => {
            if (!val) return false;

            const lower = val.toLowerCase().trim();

            // allow special values
            if (["n/a", "not announced", "tbd"].includes(lower)) {
                return true;
            }

            // allow time formats
            return /^(\d+h\s*\d*m|\d+h|\d+m)$/.test(lower);
        }, {
            message: "Enter valid duration (e.g. 2h 30m, 2h, 130m, or N/A)"
        }),

    releaseDate: z
        .string()
        .min(1, "Release date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),

    about: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description cannot exceed 2000 characters"),

    trailerUrl: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true; // allow empty
            return val.startsWith("http");
        }, {
            message: "Must be a valid URL"
        }),

    cast: z.array(PersonSchema).optional().default([]),
    crew: z.array(PersonSchema).optional().default([]),
};

// ── Movie schema (with showDates) ────────────────────────────────
export const movieSchema = z.object({
    ...baseMovieFields,
    showDates: z.array(ShowDateSchema).optional().default([]),
});

// ── Upcoming schema (no showDates) ───────────────────────────────
export const upcomingSchema = z.object({
    ...baseMovieFields,
});