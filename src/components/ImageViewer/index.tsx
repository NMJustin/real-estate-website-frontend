'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';

interface ImageViewerProps {
  images: { id: string; imageUrl: string; mediaType?: 'IMAGE' | 'VIDEO'; caption?: string }[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImageViewer({ images, initialIndex = 0, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex];
  const isVideo = currentImage?.mediaType === 'VIDEO';

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetView();
  }, [images.length, resetView]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetView();
  }, [images.length, resetView]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setScale((prev) => {
      const nextScale = Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.5), 5);
      if (nextScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return nextScale;
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isVideo) return;
    if (scale > 1.2) {
      resetView();
    } else {
      setScale(2.5);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-' || e.key === '_') handleZoomOut();
      if (e.key === '0') resetView();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, onClose, resetView]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between backdrop-blur-md select-none">
      {/* Top Bar with Controls */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition disabled:opacity-30"
            title="Zoom out (-)"
            disabled={scale <= 0.5 || isVideo}
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          <span
            onClick={resetView}
            className="cursor-pointer px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold text-emerald-400 border border-white/10 transition"
            title="Click to reset zoom"
          >
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition disabled:opacity-30"
            title="Zoom in (+)"
            disabled={scale >= 5 || isVideo}
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <button
            onClick={resetView}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
            title="Reset View (0)"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition hidden sm:flex"
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

        {/* Counter and caption */}
        <div className="text-center text-white text-xs sm:text-sm">
          <span className="font-semibold">{currentIndex + 1}</span> of{' '}
          <span className="font-semibold">{images.length}</span>
          {currentImage?.caption && (
            <span className="hidden md:inline ml-3 text-slate-300">· {currentImage.caption}</span>
          )}
        </div>

        {/* Close Button */}
        <div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full text-white transition shadow-lg"
            title="Close viewer (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        ref={containerRef}
        className={`relative flex-1 w-full h-full flex items-center justify-center overflow-hidden ${
          scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
        }`}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Navigation Arrow Left */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Zoomable Image or Video */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {isVideo ? (
            <video
              src={currentImage.imageUrl}
              controls
              autoPlay
              className="max-w-[90vw] max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
          ) : (
            <img
              src={currentImage.imageUrl}
              alt={currentImage.caption || `Property image ${currentIndex + 1}`}
              className="max-w-[92vw] max-h-[75vh] object-contain rounded-lg shadow-2xl pointer-events-none"
              draggable={false}
            />
          )}
        </div>

        {/* Navigation Arrow Right */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="relative z-20 py-3 px-4 bg-gradient-to-t from-black/90 to-transparent flex justify-center">
          <div className="flex items-center gap-2 overflow-x-auto max-w-2xl px-2 py-1 scrollbar-thin">
            {images.map((item, index) => (
              <button
                key={item.id || index}
                onClick={() => {
                  setCurrentIndex(index);
                  resetView();
                }}
                className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                  index === currentIndex
                    ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                    : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/60'
                }`}
              >
                {item.mediaType === 'VIDEO' ? (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[10px] text-white">
                    Video
                  </div>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageViewer;
