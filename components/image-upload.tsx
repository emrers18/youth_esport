"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadMedia } from "@/lib/actions/media-actions";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "square",
  label = "Image",
  className,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder: "team-logos" | "event-images";
  aspect?: "square" | "video";
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

      onChange(result.url);
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
    if (!uploading) inputRef.current?.click();
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
          "group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-border bg-surface text-textSecondary outline-none transition-colors hover:border-primary/50 focus-visible:border-primary/50",
          uploading ? "cursor-not-allowed opacity-70" : "cursor-pointer",
          aspect === "square" ? "aspect-square w-32" : "aspect-video w-full max-w-sm"
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <ImageIcon className="relative size-6 opacity-60" aria-hidden="true" />
            <span className="relative px-2 text-center text-xs font-medium">
              {uploading ? "Uploading..." : "Upload Image"}
            </span>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2Icon className="size-5 animate-spin text-primary" aria-hidden="true" />
          </div>
        )}

        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined);
            }}
            aria-label="Remove image"
            className="absolute right-1.5 top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-background/90 text-textPrimary opacity-0 transition-opacity hover:bg-danger group-hover:opacity-100"
          >
            <XIcon className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="mt-1 text-xs text-textSecondary">JPG, JPEG, or PNG · maximum 5 MB.</p>
    </div>
  );
}
