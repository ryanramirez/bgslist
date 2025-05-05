'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  initialImage?: string;
  onImageChange: (file: File) => void;
  className?: string;
}

export default function ImageUpload({ initialImage, onImageChange, className = '' }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    // Pass the file to the parent component
    onImageChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
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
      handleFileChange(files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
        isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-500'
      } ${className}`}
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
      />
      
      {previewUrl ? (
        <div className="relative w-full h-48 mb-2">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-contain"
          />
        </div>
      ) : (
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
          <p className="text-gray-500 mb-1">Click or drag image here</p>
          <p className="text-gray-400 text-sm">JPG, PNG, or GIF (max 2MB)</p>
        </div>
      )}
    </div>
  );
} 