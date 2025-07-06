'use client';
import { useEffect, useState } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import { X } from 'lucide-react';

interface Props {
  onUpload: (urls: string[]) => void;
  initialUrls?: string[];
}

export const MultipleUploadthing = ({ onUpload, initialUrls = [] }: Props) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialUrls);

  // Initialize with unique URLs
  useEffect(() => {
    const unique = Array.from(new Set(initialUrls));
    setUploadedUrls(unique);
    if (unique.length > 0) {
      onUpload(unique);
    }
  }, []);

  const handleUploadComplete = (res: { url: string }[]) => {
    const urls = res.map((file) => file.url);
    setUploadedUrls(urls);
    onUpload(urls);
  };

  const removeImage = (url: string) => {
    const filtered = uploadedUrls.filter((u) => u !== url);
    setUploadedUrls(filtered);
    onUpload(filtered);
  };

  return (
    <div className="space-y-4">
      {uploadedUrls.length === 0 && (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error) => console.error('Upload error:', error.message)}
          config={{ mode: 'auto' }}
          className="ut-upload-dropzone ut-button:bg-blue-600 ut-button:ut-uploading:bg-blue-400 [&_svg]:hidden border-none items-center justify-center text-center"
        />
      )}
      {uploadedUrls.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {uploadedUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-300 shadow-sm"
            >
              <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600 hover:text-red-800 shadow-md"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};