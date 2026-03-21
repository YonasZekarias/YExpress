"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { ImagePlus, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { getDisplayableImageUrl } from "@/lib/imageUrl";

interface ImageUploaderProps {
  label: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export default function ImageUploader({
  label,
  urls,
  onChange,
  max = 8,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || !API_URL) return;
    const remaining = max - urls.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${max} images`);
      return;
    }

    const picked = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const formData = new FormData();
      picked.forEach((f) => formData.append("images", f));

      const { data } = await axios.post(
        `${API_URL}/admin/upload/images`,
        formData,
        { withCredentials: true }
      );

      if (data.success && Array.isArray(data.urls)) {
        onChange([...urls, ...data.urls]);
        toast.success(
          data.urls.length === 1 ? "Image uploaded" : "Images uploaded"
        );
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getDisplayableImageUrl(url)}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-0.5 top-0.5 rounded bg-black/60 p-0.5 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {urls.length < max && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 transition hover:border-blue-400 hover:text-blue-600 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6" />
                <span className="text-[10px] font-medium">Add</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-[11px] text-gray-400">
        JPEG, PNG, WebP — stored on Cloudinary ({urls.length}/{max})
      </p>
    </div>
  );
}
