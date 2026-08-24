import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  imageDataUrl: string | null;
  onImageSelected: (dataUrl: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageDataUrl,
  onImageSelected,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            readAndEmitFile(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const readAndEmitFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      readAndEmitFile(e.dataTransfer.files[0]);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera. Check device permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    setStream(null);
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      onImageSelected(dataUrl);
      stopCamera();
    }
  };

  return (
    <div className="space-y-2">
      {/* If Image is attached */}
      {imageDataUrl ? (
        <div className="relative inline-block border border-white/20 p-1.5 bg-black/40">
          <img
            src={imageDataUrl}
            alt="Problem attachment"
            className="h-28 max-w-full object-contain"
          />
          <button
            type="button"
            onClick={() => onImageSelected(null)}
            className="absolute -top-2 -right-2 p-1 bg-neutral-900 border border-white/20 text-white hover:text-red-400 transition-colors"
            title="Remove attachment"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="text-[10px] font-mono text-axiom-muted-dark mt-1 px-1 flex items-center gap-1 uppercase tracking-wider">
            <ImageIcon className="w-3 h-3 text-axiom-muted-dark" /> Image attached (multimodal)
          </div>
        </div>
      ) : isCameraActive ? (
        /* Camera Capture Interface */
        <div className="border border-white/10 p-3 bg-black space-y-3">
          <div className="relative aspect-video bg-neutral-900 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-1 text-xs font-mono border border-white/20 text-axiom-muted-dark hover:text-white"
            >
              Cancel Camera
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              className="px-4 py-1.5 bg-axiom-text-dark text-axiom-base-dark dark:bg-axiom-text-dark dark:text-axiom-base-dark font-mono text-xs font-semibold hover:bg-axiom-text-dark/95"
            >
              Capture Snap
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border ${
            isDragOver ? 'border-axiom-amber bg-white/5' : 'border-white/10 bg-black/20'
          } p-3 text-center transition-colors flex items-center justify-between text-xs text-axiom-muted-dark`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && readAndEmitFile(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-axiom-muted-dark" />
            <span>Drop problem photo, paste from clipboard, or</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-axiom-text-dark underline hover:text-axiom-amber font-mono"
            >
              browse
            </button>
          </div>

          <button
            type="button"
            onClick={startCamera}
            className="px-2.5 py-1 border border-white/15 text-[11px] font-mono text-axiom-text-dark hover:border-axiom-amber flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5 text-axiom-muted-dark" /> Snap Camera
          </button>
        </div>
      )}
    </div>
  );
};
