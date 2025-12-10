import React, { useState, useRef } from 'react';
import { Upload, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ImageCropperr } from './ImageCropperr';

interface UploadedImage {
    id: number;
    name: string;
    file: File;
    size: number;
    ratio: string;
    isValidRatio: boolean;
    uploadTime: string;
    preview: string;
    type: 'image';
}

interface RatioOption {
    label: string;
    ratio: number;
    width: number;
    height: number;
}

interface GalleryImageUploadProps {
    label?: string;
    description?: string;
    ratios?: RatioOption[];
    onImagesChange?: (images: UploadedImage[]) => void;
    enableCropping?: boolean;
    initialImages?: UploadedImage[];
    onContinue?: (images: UploadedImage[]) => void;
    showAsModal?: boolean;
    onClose?: () => void;
    includeInvalidRatios?: boolean;
    selectedRatioProp?: string[];
}

export const GalleryImageUpload: React.FC<GalleryImageUploadProps> = ({
    label = 'Upload Gallery Images',
    description = 'Upload images supporting multiple aspect ratios.',
    ratios = [
        { label: '16:9', ratio: 16 / 9, width: 200, height: 112 },
        { label: '9:16', ratio: 9 / 16, width: 120, height: 213 },
        { label: '1:1', ratio: 1, width: 150, height: 150 },
        { label: '3:2', ratio: 3 / 2, width: 180, height: 120 }
    ],
    onImagesChange = () => { },
    enableCropping = true,
    initialImages = [],
    onContinue = null,
    showAsModal = false,
    onClose = () => { },
    includeInvalidRatios = false,
    selectedRatioProp = [],
}) => {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(initialImages);
    const [selectedRatio, setSelectedRatio] = useState<RatioOption | null>(null);
    const [cropperImage, setCropperImage] = useState<{
        file: File;
        dataURL: string;
        targetRatio: RatioOption;
    } | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRatioClick = (ratio: RatioOption) => {
        setSelectedRatio(ratio);
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedRatio) return;

        // Validate file type
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            toast.error('Please upload a valid image file');
            return;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 5) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        // For images, proceed with cropping flow
        const reader = new FileReader();
        reader.onload = (e) => {
            if (enableCropping) {
                setCropperImage({
                    file,
                    dataURL: e.target?.result as string,
                    targetRatio: selectedRatio,
                });
                setShowCropper(true);
            } else {
                handleCropComplete({ base64: e.target?.result as string, file });
            }
        };
        reader.readAsDataURL(file);

        event.target.value = '';
    };

    const handleCropComplete = (result: { base64: string; file: File } | null) => {
        if (!result || !selectedRatio) {
            setShowCropper(false);
            setCropperImage(null);
            setSelectedRatio(null);
            return;
        }

        const { base64, file } = result;
        const img = new Image();
        img.onload = () => {
            const actualRatio = img.width / img.height;
            const targetRatio = selectedRatio.ratio;
            const isValidRatio = Math.abs(actualRatio - targetRatio) < 0.1;
            const detectedRatio = ratios.find(r => Math.abs(actualRatio - r.ratio) < 0.1)?.label ||
                actualRatio.toFixed(2);

            if (!isValidRatio) {
                toast.error(
                    `Invalid image ratio. Detected: ${detectedRatio}, Expected: ${selectedRatio.label}`
                );
                // Don't add image if ratio validation fails
                setShowCropper(false);
                setCropperImage(null);
                setSelectedRatio(null);
                return;
            }

            const newImage: UploadedImage = {
                id: Date.now(),
                name: file.name,
                file,
                size: file.size / (1024 * 1024), // MB
                ratio: selectedRatio.label,
                isValidRatio,
                uploadTime: new Date().toLocaleTimeString(),
                preview: base64,
                type: 'image',
            };

            const updated = [...uploadedImages, newImage];
            setUploadedImages(updated);
            onImagesChange(updated);
            setShowCropper(false);
            setCropperImage(null);
            setSelectedRatio(null);
        };
        img.src = base64;
    };

    const handleRemoveImage = (id: number) => {
        const updated = uploadedImages.filter(img => img.id !== id);
        setUploadedImages(updated);
        onImagesChange(updated);
    };

    // Filter ratios to display based on selectedRatioProp
    const displayedRatios = selectedRatioProp.length > 0
        ? ratios.filter(ratio => selectedRatioProp.includes(ratio.label))
        : ratios;

    // Filter images to display based on selectedRatioProp
    const displayedImages = selectedRatioProp.length > 0
        ? uploadedImages.filter(img => selectedRatioProp.includes(img.ratio))
        : uploadedImages;

    // Determine which ratios have valid uploaded images
    const uploadedRatios = new Set(
        uploadedImages.filter(img => img.isValidRatio).map(img => img.ratio)
    );

    // Valid uploaded images
    const validUploadedImages = selectedRatioProp.length > 0
        ? uploadedImages.filter(
            (img) => selectedRatioProp.includes(img.ratio) && img.isValidRatio
        )
        : includeInvalidRatios
            ? uploadedImages
            : uploadedImages.filter((img) => img.isValidRatio);

    // Count and plural label
    const mediaCount = validUploadedImages.length;
    const pluralSuffix = mediaCount !== 1 ? 's' : '';

    const renderRatioCard = (ratio: RatioOption) => {
        const isValidUploaded = uploadedRatios.has(ratio.label);

        return (
            <div key={ratio.label} className="flex flex-col items-center gap-3">
                <div
                    className={`relative flex items-center justify-center transition-all duration-200 ${isValidUploaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-orange-600 hover:bg-blue-50'
                        }`}
                    style={{
                        width: ratio.width,
                        height: ratio.height,
                        aspectRatio: ratio.ratio,
                        border: '2px dashed #d1d5db',
                        borderRadius: '8px',
                        background: isValidUploaded ? '#f0f0f0' : 'white',
                    }}
                    onClick={() => !isValidUploaded && handleRatioClick(ratio)}
                >
                    {!isValidUploaded && (
                        <div
                            className="flex items-center justify-center text-gray-400 hover:text-orange-600 transition-colors"
                        >
                            <Upload size={24} />
                        </div>
                    )}
                    {isValidUploaded && (
                        <CheckCircle
                            size={24}
                            className="text-green-500"
                        />
                    )}
                </div>
                <div className="text-sm font-semibold text-gray-700">
                    {ratio.label}
                </div>
            </div>
        );
    };

    const modalContent = (
        <div className="project-banner-upload">
            <style>{`
        .project-banner-upload {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }

        .upload-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .upload-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .upload-header p {
          color: #666;
          margin: 0;
          font-size: 14px;
        }

        .ratio-grid {
          display: flex;
          gap: 30px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .ratio-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 40px 0;
        }

        .uploaded-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
        }

        .uploaded-images {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .uploaded-image-card {
          display: flex;
          align-items: center;
          padding: 16px;
          background: white;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .uploaded-image-card.valid {
          border: 2px solid #22c55e;
          background: #f0fff4;
        }

        .uploaded-image-card.invalid {
          border: 2px solid #ef4444;
          background: #fef2f2;
        }

        .uploaded-image-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .image-preview {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-info {
          flex: 1;
          min-width: 0;
        }

        .image-name {
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
          word-break: break-word;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .valid-tick {
          color: #22c55e;
          flex-shrink: 0;
        }

        .image-details {
          display: flex;
          gap: 12px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }

        .image-ratio {
          background: #e0e7ff;
          color: #3730a3;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .image-size {
          color: #6b7280;
          font-size: 12px;
        }

        .invalid-badge {
          background: #fee2e2;
          color: #dc2626;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .upload-time {
          color: #9ca3af;
          font-size: 12px;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
          margin-left: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-btn:hover {
          background: #fee2e2;
        }

        .continue-section {
          margin-top: 24px;
          text-align: center;
        }

        .continue-btn {
          background: #de7007;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 14px;
        }

        .continue-btn:hover {
          background: #c45a05;
        }

        @media (max-width: 768px) {
          .ratio-grid {
            gap: 20px;
          }

          .uploaded-image-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .image-preview {
            margin-right: 0;
          }

          .remove-btn {
            margin-left: 0;
            align-self: flex-end;
          }
        }
      `}</style>

            <div className="upload-header">
                <h2>{label}</h2>
                <p>{description}</p>
            </div>

            <div className="ratio-grid">
                {displayedRatios.map(renderRatioCard)}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {showCropper && cropperImage && (
                <ImageCropperr
                    open={showCropper}
                    image={cropperImage.dataURL}
                    originalFile={cropperImage.file}
                    onComplete={handleCropComplete}
                    selectedRatio={cropperImage.targetRatio}
                />
            )}

            {displayedImages.length > 0 && (
                <>
                    <div className="section-divider" />
                    <div className="uploaded-section">
                        <h3>Uploaded Images</h3>
                        <div className="uploaded-images">
                            {displayedImages.map((image) => (
                                <div
                                    key={image.id}
                                    className={`uploaded-image-card ${!image.isValidRatio ? 'invalid' : 'valid'}`}
                                >
                                    <div className="image-preview">
                                        <img
                                            src={image.preview}
                                            alt={image.name}
                                        />
                                    </div>
                                    <div className="image-info">
                                        <div className="image-name">
                                            {image.name}
                                            {image.isValidRatio && <CheckCircle size={16} className="valid-tick" />}
                                        </div>
                                        <div className="image-details">
                                            <span className="image-ratio">{image.ratio}</span>
                                            <span className="image-size">{image.size.toFixed(2)} MB</span>
                                            {!image.isValidRatio && (
                                                <span className="invalid-badge">Invalid Ratio</span>
                                            )}
                                        </div>
                                        <div className="upload-time">Uploaded {image.uploadTime}</div>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemoveImage(image.id)}
                                        aria-label="Remove image"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="continue-section">
                            <button
                                className="continue-btn"
                                onClick={() => {
                                    onContinue?.(validUploadedImages);
                                }}
                            >
                                Continue ({mediaCount} image{pluralSuffix} uploaded)
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    if (showAsModal) {
        return (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer z-10"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    {modalContent}
                </div>
            </div>
        );
    }

    return <>{modalContent}</>;
};
