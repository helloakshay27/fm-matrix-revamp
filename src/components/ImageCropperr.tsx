import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

interface ImageCropperrProps {
    open: boolean;
    image: string;
    onComplete: (result: { base64: string; file: File } | null) => void;
    originalFile: File;
    selectedRatio: { label: string; ratio: number };
}

export const ImageCropperr: React.FC<ImageCropperrProps> = ({
    open,
    image,
    onComplete,
    originalFile,
    selectedRatio,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [imageMimeType, setImageMimeType] = useState("image/jpeg");

    useEffect(() => {
        if (image) {
            if (originalFile?.type) {
                setImageMimeType(originalFile.type);
            } else if (image.startsWith("data:image")) {
                const mime = image.match(/data:(.*?);base64,/)?.[1];
                if (mime) setImageMimeType(mime);
            }
        }
    }, [image, originalFile]);

    const getContainerDimensions = () => {
        const baseSize = 300;
        if (selectedRatio.ratio === 16 / 9)
            return { width: baseSize * 1.2, height: baseSize };
        if (selectedRatio.ratio === 9 / 16)
            return { width: baseSize, height: baseSize * 1.2 };
        if (selectedRatio.ratio === 3 / 2)
            return { width: baseSize * 1.1, height: baseSize * (2 / 3) };
        return { width: baseSize, height: baseSize };
    };

    if (!open || !image) return null;

    const { width, height } = getContainerDimensions();

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={() => onComplete(null)}
        >
            <div
                className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full mx-4"
                style={{ maxHeight: "90vh", overflow: "auto" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="border-0 justify-center pt-4 pb-2 px-6 text-center">
                    <h5 className="text-orange-600 text-lg font-semibold">
                        Preview Image - {selectedRatio.label}
                    </h5>
                </div>

                {/* Cropper Container */}
                <div className="px-6 py-6">
                    <div
                        style={{
                            position: "relative",
                            height,
                            width,
                            background: "#fff",
                            borderRadius: "8px",
                            overflow: "hidden",
                            margin: "0 auto",
                        }}
                    >
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={1}
                            aspect={selectedRatio.ratio}
                            onCropChange={setCrop}
                            onCropComplete={(_, areaPixels) =>
                                setCroppedAreaPixels(areaPixels)
                            }
                        />
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="border-0 px-6 pb-6 pt-4 flex justify-end"
                    style={{ gap: "10px" }}
                >
                    <button
                        className="px-4 py-2 rounded border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 font-medium transition"
                        onClick={() => onComplete(null)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 font-medium transition"
                        onClick={() => {
                            toast.dismiss();
                            onComplete({
                                base64: image,
                                file: originalFile,
                            });
                        }}
                    >
                        Finish
                    </button>
                </div>
            </div>
        </div>
    );
};
