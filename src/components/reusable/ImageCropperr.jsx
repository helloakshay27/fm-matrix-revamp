import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

const ImageCropperr = ({
    open,
    image,
    onComplete,
    originalFile,
    selectedRatio,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageMimeType, setImageMimeType] = useState('image/png');

    useEffect(() => {
        if (image) {
            if (originalFile?.type) {
                setImageMimeType(originalFile.type);
            } else if (image.startsWith('data:image')) {
                const mime = image.match(/data:(.*?);base64,/)[1];
                setImageMimeType(mime);
            }
        }
    }, [image, originalFile]);

    const getContainerDimensions = () => {
        const baseSize = 300;
        if (selectedRatio.ratio === 16 / 9) return { width: baseSize * 1.2, height: baseSize };
        if (selectedRatio.ratio === 9 / 16) return { width: baseSize, height: baseSize * 1.2 };
        if (selectedRatio.ratio === 3 / 2) return { width: baseSize * 1.1, height: baseSize * (2 / 3) };
        return { width: baseSize, height: baseSize };
    };

    if (!open || !image) return null;

    const { width, height } = getContainerDimensions();

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ borderRadius: '12px' }}>
                <div className="modal-content rounded-3 overflow-hidden">
                    <div className="modal-header border-0 justify-content-center pt-4 pb-2">
                        <h5 className="modal-title text-center text-orange-600 fs-5 fw-semibold">
                            Preview Image - {selectedRatio.label}
                        </h5>
                    </div>
                    <div className="modal-body px-4">
                        <div
                            style={{
                                position: 'relative',
                                height,
                                background: '#fff',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                        >
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={1}
                                aspect={selectedRatio.ratio}
                                onCropChange={setCrop}
                                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                            />
                        </div>
                    </div>
                    <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end" style={{ gap: '10px' }}>
                        <button
                            className="px-4 py-2 rounded border border-gray-400 text-gray-700 bg-white hover:bg-gray-100"
                            onClick={() => onComplete(null)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 rounded purple-btn2 text-white"
                            onClick={() => {
                                toast.dismiss();
                                onComplete({
                                    base64: image,
                                    file: originalFile
                                });
                            }}
                        >
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperr;