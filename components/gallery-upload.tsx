"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadMedia } from "@/lib/actions/media-actions";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function GalleryUpload({
  value = [],
  onChange,
  folder,
  max = 6,
  label = "Photo",
  className,
}: {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder: "event-gallery";
  max?: number;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPG, JPEG, or PNG files can be uploaded.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File size must be at most 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const result = await uploadMedia(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      onChange([...value, result.url]);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) handleFile(file);
  };

  const openPicker = () => {
    if (!uploading && value.length < max) inputRef.current?.click();
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div
            key={url}
            className="group relative aspect-square w-24 overflow-hidden rounded-md border border-border bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`${label} ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label="Remove photo"
              className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/90 text-textPrimary opacity-0 transition-opacity hover:bg-danger group-hover:opacity-100"
            >
              <XIcon className="size-3" aria-hidden="true" />
            </button>
          </div>
        ))}

        {value.length < max && (
          <div
            role="button"
            tabIndex={0}
            aria-disabled={uploading}
            onClick={openPicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPicker();
              }
            }}
            className={cn(
              "flex aspect-square w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-surface text-textSecondary outline-none transition-colors hover:border-primary/50 focus-visible:border-primary/50",
              uploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            )}
          >
            {uploading ? (
              <Loader2Icon className="size-5 animate-spin text-primary" aria-hidden="true" />
            ) : (
              <>
                <PlusIcon className="size-5 opacity-60" aria-hidden="true" />
                <ImageIcon className="sr-only" aria-hidden="true" />
              </>
            )}
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-textSecondary">
        JPG, JPEG, or PNG · maximum 5 MB · up to {max} photos.
      </p>
    </div>
  );
}
