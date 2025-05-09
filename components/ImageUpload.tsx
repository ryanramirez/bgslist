'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  initialImages?: string[];
  onImagesChange: (files: File[]) => void;
  className?: string;
  maxImages?: number;
}

export default function ImageUpload({ 
  initialImages = [], 
  onImagesChange, 
  className = '',
  maxImages = 5
}: ImageUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (files: File[]) => {
    // Check if the total images (current + new valid ones) exceeds the limit
    if (previewUrls.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      // Take only enough files to reach the limit
      const availableSlots = maxImages - previewUrls.length;
      if (availableSlots <= 0) return;
      files = files.slice(0, availableSlots);
    }
    
    // Create preview URLs for the new files
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    // Update the state with the new files and previews
    const updatedImageFiles = [...imageFiles, ...files];
    const updatedPreviewUrls = [...previewUrls, ...newPreviewUrls];
    
    setImageFiles(updatedImageFiles);
    setPreviewUrls(updatedPreviewUrls);
    
    // Pass the files to the parent component
    onImagesChange(updatedImageFiles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesChange(Array.from(files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFilesChange(Array.from(files));
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const removeImage = (index: number) => {
    const newPreviewUrls = [...previewUrls];
    const newImageFiles = [...imageFiles];
    
    // If we're removing a local file, revoke the object URL to prevent memory leaks
    if (index < newImageFiles.length) {
      URL.revokeObjectURL(newPreviewUrls[index]);
    }
    
    newPreviewUrls.splice(index, 1);
    newImageFiles.splice(index, 1);
    
    setPreviewUrls(newPreviewUrls);
    setImageFiles(newImageFiles);
    
    // Pass the updated files to the parent component
    onImagesChange(newImageFiles);
  };

  return (
    <div className={`${className}`}>
      {/* Image previews */}
      {previewUrls.length > 0 && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative border rounded-lg overflow-hidden h-40">
              <Image 
                src={url} 
                alt={`Preview ${index + 1}`} 
                fill 
                className="object-cover"
              />
              <button 
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload area */}
      {previewUrls.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
            isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept="image/*"
            className="hidden"
            multiple
          />
          
          <div className="flex flex-col items-center justify-center py-6">
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 mb-1">Click or drag images here</p>
            <p className="text-gray-400 text-sm">JPG, PNG, or GIF (max 2MB)</p>
            <p className="text-gray-400 text-xs mt-1">
              {previewUrls.length === 0 
                ? `Add up to ${maxImages} images` 
                : `${previewUrls.length} of ${maxImages} images added. Add ${maxImages - previewUrls.length} more`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 