import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * ImageUploader
 * Props:
 *  - fieldName: string — the RHF field to write the Cloudinary URL into (e.g. "poster")
 *  - label: string
 *  - hint: string
 *  - required: bool
 *  - aspectClass: string — Tailwind aspect class for preview (default "aspect-[2/3]")
 */
export default function ImageUploader({
    fieldName,
    label,
    hint,
    required = false,
    aspectClass = "aspect-[2/3]",
}) {
    const { setValue, watch, formState: { errors } } = useFormContext();
    const currentUrl = watch(fieldName);
    const error = errors[fieldName]?.message;

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    const uploadToCloudinary = async (file) => {
        // Validate size
        if (file.size > MAX_SIZE_BYTES) {
            setUploadError(`File too large. Max size is ${MAX_SIZE_MB} MB.`);
            return;
        }
        // Validate type
        if (!file.type.startsWith("image/")) {
            setUploadError("Only image files are allowed.");
            return;
        }

        setUploadError("");
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                { method: "POST", body: formData }
            );

            if (!res.ok) throw new Error("Upload failed. Check your Cloudinary config.");
            const data = await res.json();

            // Write the returned secure URL into React Hook Form
            setValue(fieldName, data.secure_url, { shouldValidate: true, shouldDirty: true });
        } catch (err) {
            setUploadError(err.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleFile = (file) => {
        if (file) uploadToCloudinary(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    return (
        <div className="flex flex-col gap-1.5">
            {/* Label */}
            {label && (
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    {label}
                    {required && <span className="text-[#b04a6a] text-xs">*</span>}
                </label>
            )}
            {hint && <p className="text-xs text-gray-400 -mt-1">{hint}</p>}

            <div className="flex gap-4 items-start">
                {/* Drop zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`relative flex-1 min-h-[120px] rounded-xl border-2 border-dashed
            flex flex-col items-center justify-center gap-2 cursor-pointer
            transition-all duration-200 select-none
            ${dragOver
                            ? "border-[#b04a6a] bg-[#8a3357]/5"
                            : "border-gray-200 bg-gray-50/60 hover:border-[#b04a6a] hover:bg-[#8a3357]/5"
                        }
            ${uploading ? "pointer-events-none opacity-70" : ""}
          `}
                >
                    {uploading ? (
                        <>
                            <div className="w-7 h-7 border-3 border-[#8a3357] border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-gray-400 font-medium">Uploading…</p>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-lg">
                                📁
                            </div>
                            <div className="text-center px-3">
                                <p className="text-sm font-semibold text-gray-600">
                                    Drop image here or{" "}
                                    <span className="text-[#8a3357]">browse</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    PNG, JPG, WEBP — max {MAX_SIZE_MB} MB
                                </p>
                            </div>
                        </>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                </div>

                {/* Live preview */}
                {currentUrl && (
                    <div className={`relative flex-shrink-0 w-24 ${aspectClass} rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm group`}>
                        <img
                            src={currentUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setValue(fieldName, "", { shouldValidate: true });
                            }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white
                flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100
                transition-opacity duration-150"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Errors */}
            {uploadError && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                    <span>⚠</span> {uploadError}
                </p>
            )}
            {error && !uploadError && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
}