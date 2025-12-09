import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

export const ImageCropper = ({
    open,
    image,
    onComplete,
    originalFile,
    requiredRatios = [1],
    allowedRatios = [{ label: "1:1", ratio: 1 }],
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [aspect, setAspect] = useState(allowedRatios[0].ratio);
    const [aspectLabel, setAspectLabel] = useState(allowedRatios[0].label);
    const [imageRatio, setImageRatio] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [imageMimeType, setImageMimeType] = useState("image/png");

    useEffect(() => {
        if (image) {
            const img = new Image();
            img.onload = () => {
                const ratio = img.naturalWidth / img.naturalHeight;
                setImageRatio(ratio);
                setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                setCrop({ x: 0, y: 0 });
            };
            img.src = image;

            if (originalFile?.type) {
                setImageMimeType(originalFile.type);
            } else if (image.startsWith("data:image")) {
                const mime = image.match(/data:(.*?);base64,/)[1];
                setImageMimeType(mime);
            }
        }
    }, [image, originalFile]);

    const handleAspectChange = (targetAspect, label) => {
        setAspect(targetAspect);
        setAspectLabel(label);
    };

    const isRatioAcceptable = (actual, expectedList, tolerance = 0.1) =>
        expectedList.some((expected) => Math.abs(actual - expected) <= tolerance);

    const isGridSizeValid = () =>
        aspect === 16 / 9 ? imageDimensions.width >= 400 && imageDimensions.height >= 225 : true;

    const getContainerDimensions = () => {
        const baseSize = 300;
        if (aspect === 16 / 9) return { width: baseSize * 1.2, height: baseSize };
        if (aspect === 9 / 16) return { width: baseSize, height: baseSize * 1.2 };
        if (aspect === 3 / 2) return { width: baseSize * 1.1, height: baseSize * (2 / 3) };
        return { width: baseSize, height: baseSize };
    };

    const base64ToFile = (base64, filename, mimeType) => {
        const arr = base64.split(",");
        const bstr = atob(arr[1]);
        const u8arr = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }
        return new File([u8arr], filename, { type: mimeType });
    };

    if (!open || !image) return null;

    const { width, height } = getContainerDimensions();

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
            <div className="modal-dialog modal-dialog-centered" style={{ borderRadius: "12px" }}>
                <div className="modal-content rounded-3 overflow-hidden">
                    <div className="modal-header border-0 justify-content-center pt-4 pb-2">
                        <h5 className="modal-title text-center text-orange-600 fs-5 fw-semibold">Crop Image</h5>
                    </div>
                    <div className="modal-body px-4">
                        <div className="d-flex justify-content-center mb-4 flex-wrap" style={{ gap: "8px" }}>
                            {allowedRatios.map(({ label, ratio }) => (
                                <button
                                    key={label}
                                    onClick={() => handleAspectChange(ratio, label)}
                                    className={`px-3 py-2 rounded ${aspect === ratio
                                        ? "purple-btn2 text-white"
                                        : "border border-purple-500 text-purple-600 bg-white"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div
                            style={{
                                position: "relative",
                                height,
                                background: "#fff",
                                borderRadius: "8px",
                                overflow: "hidden",
                            }}
                        >
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={1}
                                aspect={aspect}
                                onCropChange={setCrop}
                                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                            />
                        </div>
                    </div>
                    <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-end" style={{ gap: "10px" }}>
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


                                const canvas = document.createElement("canvas");
                                const img = new Image();
                                img.crossOrigin = "anonymous";
                                img.src = image;
                                img.onload = () => {
                                    const ctx = canvas.getContext("2d");
                                    canvas.width = croppedAreaPixels.width;
                                    canvas.height = croppedAreaPixels.height;
                                    ctx.drawImage(
                                        img,
                                        croppedAreaPixels.x,
                                        croppedAreaPixels.y,
                                        croppedAreaPixels.width,
                                        croppedAreaPixels.height,
                                        0,
                                        0,
                                        croppedAreaPixels.width,
                                        croppedAreaPixels.height
                                    );

                                    const quality = imageMimeType === "image/jpeg" ? 0.8 : undefined;
                                    const base64 = canvas.toDataURL(imageMimeType, quality);

                                    const originalName = originalFile?.name?.split(".")[0] || "cropped_image";
                                    const extension =
                                        imageMimeType === "image/jpeg" ? "jpg" :
                                            imageMimeType === "image/webp" ? "webp" : "png";

                                    const croppedFile = base64ToFile(base64, `${originalName}.${extension}`, imageMimeType);

                                    // ✅ Send to parent only
                                    onComplete({ base64, file: croppedFile });
                                };
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
