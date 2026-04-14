import { useFormContext } from "react-hook-form";
import FormField from "../components/FormField";
import ImageUploader from "../components/Imageuploader";
import GenreSelector from "../components/Genreselector";
import { inputClass, textareaClass } from "../components/inputClass";

export default function MovieDetailsSection() {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Movie Details</h2>
                <p className="text-sm text-gray-400 mt-1">
                    Fill in all the core information about the movie
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Title */}
                <FormField
                    label="Title"
                    error={errors.title?.message}
                    required
                    hint="The full official title of the movie"
                >
                    <input
                        type="text"
                        placeholder="e.g. Inception, The Dark Knight"
                        {...register("title")}
                        className={inputClass(!!errors.title)}
                    />
                </FormField>

                {/* Rating */}
                <FormField
                    label="Rating"
                    error={errors.rating?.message}
                    required
                    hint="Censor board certificate — e.g. U, UA, A, PG-13"
                >
                    <input
                        type="text"
                        placeholder="e.g. UA"
                        {...register("rating")}
                        className={inputClass(!!errors.rating)}
                    />
                </FormField>

                {/* Duration */}
                <FormField
                    label="Duration"
                    error={errors.duration?.message}
                    required
                    hint="Total runtime — use format: 2h 30m, 2h, or 150m"
                >
                    <input
                        type="text"
                        placeholder="e.g. 2h 28m"
                        {...register("duration")}
                        className={inputClass(!!errors.duration)}
                    />
                </FormField>

                {/* Release Date */}
                <FormField
                    label="Release Date"
                    error={errors.releaseDate?.message}
                    required
                    hint="The date the movie releases in theatres (YYYY-MM-DD)"
                >
                    <input
                        type="date"
                        {...register("releaseDate")}
                        className={inputClass(!!errors.releaseDate)}
                    />
                </FormField>

                {/* Trailer URL */}
                <div className="md:col-span-2">
                    <FormField
                        label="Trailer URL"
                        error={errors.trailerUrl?.message}
                        hint="YouTube embed URL — go to YouTube › Share › Embed and copy the src value (optional)"
                    >
                        <input
                            type="url"
                            placeholder="e.g. https://www.youtube.com/embed/YoHD9XEInc0"
                            {...register("trailerUrl")}
                            className={inputClass(!!errors.trailerUrl)}
                        />
                    </FormField>
                </div>

                {/* Poster upload — full width */}
                <div className="md:col-span-2">
                    <ImageUploader
                        fieldName="poster"
                        label="Movie Poster"
                        hint="Upload the official poster — JPG, PNG or WEBP, max 10 MB. The image will be uploaded to Cloudinary."
                        required
                        aspectClass="aspect-[2/3]"
                    />
                </div>

                {/* About */}
                <div className="md:col-span-2">
                    <FormField
                        label="About"
                        error={errors.about?.message}
                        required
                        hint="A compelling synopsis shown on the movie detail page (10 – 2000 characters)"
                    >
                        <textarea
                            rows={4}
                            placeholder="e.g. A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
                            {...register("about")}
                            className={textareaClass(!!errors.about)}
                        />
                    </FormField>
                </div>

                {/* Genres */}
                <div className="md:col-span-2">
                    <GenreSelector />
                </div>

            </div>
        </div>
    );
}