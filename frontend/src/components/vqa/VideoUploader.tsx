
import React, { useState, useRef } from 'react';
import { Upload, X, FileVideo } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoUploaderProps {
  onVideoSelected: (file: File) => void;
}

export function VideoUploader({ onVideoSelected }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        processVideoFile(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        processVideoFile(file);
      }
    }
  };

  const processVideoFile = (file: File) => {
    setVideoFile(file);
    onVideoSelected(file);
    
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);
    
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  };

  const clearVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoFile(null);
    setVideoPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="video/*"
        className="hidden"
      />
      
      {!videoPreviewUrl ? (
        <motion.div
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${
            isDragging 
              ? 'border-accent bg-accent/5' 
              : 'border-gray-300 dark:border-gray-700 hover:border-accent dark:hover:border-accent'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload Video</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
            Drag and drop your video file here, or click to browse
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Supports MP4, MOV, AVI, WebM (max 100MB)
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="rounded-xl overflow-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <video 
            src={videoPreviewUrl} 
            controls 
            className="w-full rounded-xl"
          />
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearVideo();
              }}
              className="w-10 h-10 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black transition-colors"
              aria-label="Remove video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/70 text-white py-1 px-3 rounded-full text-sm flex items-center">
            <FileVideo className="w-4 h-4 mr-2" />
            {videoFile?.name}
          </div>
        </motion.div>
      )}
    </div>
  );
}
