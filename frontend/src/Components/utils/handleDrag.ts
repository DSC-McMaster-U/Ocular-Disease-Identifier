import React from "react";

interface DragProps {
  setDragActive: (value: boolean) => void;
  setImages: (value: File[]) => void;
  images: File[];
}

export const handleDrop = (
  event: React.DragEvent,
  { setDragActive, setImages, images }: DragProps
) => {
  // Prevent default browser actions from occurring due to drag-drop
  event.preventDefault();
  event.stopPropagation();

  // Signal that user is not drag/dropping, to change visual appearance of upload box
  setDragActive(false);

  // If drag-drop images exist, then append new files to current images array; if not, keep same images
  setImages(
    event.dataTransfer.files && event.dataTransfer.files[0]
      ? [...images, ...event.dataTransfer.files]
      : [...images]
  );
};

export const handleDragLeave = (
  event: React.DragEvent<HTMLElement>,
  { setDragActive }: DragProps
) => {
  event.preventDefault();
  event.stopPropagation();

  if (event.currentTarget.contains(event.relatedTarget as Node)) {
    return;
  }

  setDragActive(false);
};

export const handleDragActive = (
  event: React.DragEvent,
  { setDragActive }: DragProps
) => {
  event.preventDefault();
  event.stopPropagation();

  setDragActive(true);
};
