import { useFormContext, useFieldArray } from "react-hook-form";
import FormField from "../components/FormField";
import ImageUploader from "../components/ImageUploader";
import { inputClass } from "../components/inputClass";

export default function CrewSection() {
    const {
        register,
        control,
        watch,
        formState: { errors },
    } = useFormContext();

    const { fields, append, remove } = useFieldArray({ control, name: "crew" });
    const crewValues = watch("crew") || [];

    return (
        <div>
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Crew</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Add directors, producers, composers, cinematographers, and more
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => append({ name: "", role: "", imageUrl: "" })}
                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#8a3357] to-[#b04a6a]
            text-white font-bold text-xs shadow-md shadow-[#8a3357]/25
            hover:shadow-lg hover:shadow-[#8a3357]/40 hover:scale-105
            transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                    + Add Member
                </button>
            </div>

            {fields.length === 0 && (
                <div className="text-center py-16 text-gray-300">
                    <div className="text-5xl mb-3">🎥</div>
                    <p className="text-sm font-medium">No crew members added yet</p>
                    <p className="text-xs mt-1">Click "+ Add Member" to get started</p>
                </div>
            )}

            <div className="space-y-4">
                {fields.map((field, index) => {
                    const memberErrors = errors.crew?.[index];

                    return (
                        <div
                            key={field.id}
                            className="rounded-xl border border-gray-100 bg-gray-50/60 p-5 relative"
                        >
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-gray-200
                  flex items-center justify-center text-gray-400 hover:text-red-500
                  hover:border-red-200 transition-all duration-150 text-xs shadow-sm"
                            >
                                ✕
                            </button>

                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Crew Member #{index + 1}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name */}
                                <FormField
                                    label="Name"
                                    error={memberErrors?.name?.message}
                                    required
                                    hint="Full name as it appears in credits"
                                >
                                    <input
                                        type="text"
                                        placeholder="e.g. Christopher Nolan"
                                        {...register(`crew.${index}.name`)}
                                        className={inputClass(!!memberErrors?.name)}
                                    />
                                </FormField>

                                {/* Role */}
                                <FormField
                                    label="Role / Department"
                                    error={memberErrors?.role?.message}
                                    required
                                    hint="Their specific job title or department on this film"
                                >
                                    <input
                                        type="text"
                                        placeholder="e.g. Director, Music Composer, DOP"
                                        {...register(`crew.${index}.role`)}
                                        className={inputClass(!!memberErrors?.role)}
                                    />
                                </FormField>

                                {/* Photo upload */}
                                <div className="sm:col-span-2">
                                    <ImageUploader
                                        fieldName={`crew.${index}.imageUrl`}
                                        label="Photo"
                                        hint="Upload a photo of this crew member — max 10 MB (optional)"
                                        aspectClass="aspect-square"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}