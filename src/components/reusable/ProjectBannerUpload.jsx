import React, { useState, useRef } from 'react';
import { Upload, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import ImageCropperr from './ImageCropperr';

const ProjectBannerUpload = ({
  label = 'Upload Images',
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
  selectedRatioProp = []
}) => {
  const [uploadedImages, setUploadedImages] = useState(initialImages);
  const [selectedRatio, setSelectedRatio] = useState(null);
  const [cropperImage, setCropperImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef(null);

  console.log('Uploaded images:', uploadedImages);

  const handleRatioClick = (ratio) => {
    setSelectedRatio(ratio);
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (enableCropping) {
          setCropperImage({
            file,
            dataURL: e.target.result,
            targetRatio: selectedRatio
          });
          setShowCropper(true);
        } else {
          handleCropComplete({ base64: e.target.result, file });
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const handleCropComplete = (result) => {
    if (!result) {
      setShowCropper(false);
      setCropperImage(null);
      setSelectedRatio(null);
      return;
    }

    const { base64, file } = result;
    const img = new Image();
    img.onload = () => {
      const actualRatio = img.width / img.height;
      const targetRatio = selectedRatio?.ratio;
      const isValidRatio = !targetRatio || Math.abs(actualRatio - targetRatio) < 0.1;
      const detectedRatio = ratios.find(r => Math.abs(actualRatio - r.ratio) < 0.1)?.label || actualRatio.toFixed(2);

      if (targetRatio && !isValidRatio) {
        toast.error(
          `Invalid image ratio. Detected: ${detectedRatio}, Expected: ${selectedRatio.label}`
        );
      }

      const newImage = {
        id: Date.now(),
        name: file.name,
        file,
        size: file.size / (1024 * 1024), // MB
        ratio: selectedRatio?.label || detectedRatio,
        isValidRatio,
        uploadTime: new Date().toLocaleTimeString(),
        preview: base64
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

  const handleRemoveImage = (id) => {
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

  // Check if all required ratios have valid images
  const areAllRatiosUploaded = selectedRatioProp.length > 0 &&
    selectedRatioProp.every(ratio => uploadedRatios.has(ratio));

  // Find missing ratios
  const missingRatios = selectedRatioProp.filter(ratio => !uploadedRatios.has(ratio));
  const validUploadedImages = selectedRatioProp.length > 0
    ? uploadedImages.filter(
      (img) => selectedRatioProp.includes(img.ratio) && img.isValidRatio
    )
    : includeInvalidRatios
      ? uploadedImages
      : uploadedImages.filter((img) => img.isValidRatio);

  // Count and plural label
  const imageCount = validUploadedImages.length;
  const pluralSuffix = imageCount !== 1 ? 's' : '';
  const modalContent = (
    <div className="project-banner-upload">
      <div className="upload-header">
        <h2>{label}</h2>
        <p>{description}</p>
      </div>

      <div className="ratio-grid">
        {displayedRatios.map((ratio) => {
          const isValidUploaded = uploadedRatios.has(ratio.label);
          return (
            <div key={ratio.label} className="ratio-card">
              <div
                className={`ratio-upload-area ${isValidUploaded ? 'disabled' : ''}`}
                style={{
                  width: ratio.width,
                  height: ratio.height,
                  aspectRatio: ratio.ratio,
                  position: 'relative'
                }}
                onClick={() => !isValidUploaded && handleRatioClick(ratio)}
              >
                <div className="upload-placeholder">
                  <Upload size={24} />
                </div>
                {isValidUploaded && (
                  <CheckCircle
                    size={24}
                    className="ratio-tick"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      color: 'green'
                    }}
                  />
                )}
              </div>
              <div className="ratio-label">{ratio.label}</div>
            </div>
          );
        })}
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
                    <img src={image.preview} alt={image.name} />
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
                  // if (!areAllRatiosUploaded) {
                  //   if (validUploadedImages.length > 0 && missingRatios.length > 0) {
                  //     const message =
                  //       missingRatios.length === 1
                  //         ? `Please upload the remaining required ratio: ${missingRatios[0]}`
                  //         : `Please upload all required ratios. Missing: ${missingRatios.join(', ')}`;
                  //     toast.error(message);
                  //   } else {
                  //     toast.error('Please upload images for all required ratios.');
                  //   }
                  //   return;
                  // }

                  onContinue(validUploadedImages);
                }
              }
              >
                Continue ({imageCount} image{pluralSuffix} uploaded)
              </button>


            </div>
          </div>
        </>
      )}
    </div>
  );

  console.log('validUploadedImages:', validUploadedImages)
  // Extract only valid uploaded images based on the selected ratio prop



  return showAsModal ? (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        {modalContent}
        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            padding: 20px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          }

          .modal-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #374151;
          }

          .modal-close-btn:hover {
            color: #ef4444;
          }

          .project-banner-upload {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .upload-header {
            margin-bottom: 30px;
          }

          .upload-header h2 {
            font-size: 24px;
            font-weight: 600;
            color: #333;
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
            cursor: pointer;
          }

          .ratio-upload-area {
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }

          .ratio-upload-area:hover {
            border-color: #de7007;
            background: #f8faff;
          }

          .upload-placeholder {
            color: #9ca3af;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          }

          .ratio-upload-area:hover .upload-placeholder {
            color: #de7007;
          }

          .ratio-upload-area.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: #f0f0f0;
          }

          .ratio-upload-area.disabled .upload-placeholder {
            pointer-events: none;
          }

          .ratio-tick {
            z-index: 10;
          }

          .ratio-label {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
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
          }

          .continue-btn:hover {
            background: #de7007;
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
      </div>
    </div>
  ) : (
    <div className="project-banner-upload">
      {modalContent}
      <style jsx>{`
        .project-banner-upload {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .upload-header {
          margin-bottom: 30px;
        }

        .upload-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #333;
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
          cursor: pointer;
        }

        .ratio-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .ratio-upload-area:hover {
          border-color: #de7007;
          background: #f8faff;
        }

        .upload-placeholder {
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .ratio-upload-area:hover .upload-placeholder {
          color: #de7007;
        }

        .ratio-upload-area.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #f0f0f0;
        }

        .ratio-upload-area.disabled .upload-placeholder {
          pointer-events: none;
        }

        .ratio-tick {
          z-index: 10;
        }

        .ratio-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
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
        }

        .continue-btn:hover {
          background: #de7007;
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
    </div>
  );
};

export default ProjectBannerUpload;