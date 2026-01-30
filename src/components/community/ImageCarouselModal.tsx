import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Attachment {
    id: number;
    document_content_type: string;
    url: string;
}

interface ImageCarouselModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    attachments: Attachment[];
    initialIndex?: number;
}

export const ImageCarouselModal = ({
    open,
    onOpenChange,
    attachments,
    initialIndex = 0,
}: ImageCarouselModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    const images = attachments.filter(att =>
        att.document_content_type.startsWith('image/')
    );

    if (images.length === 0) return null;

    const currentImage = images[currentIndex];

    const handlePrevious = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            handlePrevious();
        } else if (e.key === "ArrowRight") {
            handleNext();
        } else if (e.key === "Escape") {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-full p-0 bg-black border-0 flex flex-col"
                style={{ maxWidth: '70vw', height: '90vh' }}
                onKeyDown={handleKeyDown}
            >
                {/* Close Button */}
                <div className="absolute top-4 right-4 z-50">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                        className="bg-white/30 hover:bg-white/40 text-white rounded-full"
                    >
                        <X size={24} />
                    </Button>
                </div>

                {/* Main Image Container */}
                <div className="flex-1 flex items-center justify-center relative bg-black overflow-hidden" style={{ height: 'calc(90vh - 120px)' }}>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {currentImage.document_content_type.startsWith('image/') ? (
                            <img
                                src={currentImage.url}
                                alt={`Image ${currentIndex + 1}`}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : null}
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                            >
                                <ChevronLeft size={32} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                            >
                                <ChevronRight size={32} />
                            </Button>
                        </>
                    )}
                </div>

                {/* Image Counter and Thumbnails Footer */}
                {images.length > 1 && (
                    <div className="bg-black/80 p-4 space-y-4">
                        {/* Counter */}
                        <div className="flex items-center justify-between px-4">
                            <div className="text-white text-sm font-medium">
                                {currentIndex + 1} / {images.length}
                            </div>

                            {/* Dots Indicator */}
                            <div className="flex gap-2 justify-center">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-2 rounded-full transition-all ${idx === currentIndex
                                            ? "bg-white w-6"
                                            : "bg-white/40 w-2 hover:bg-white/60"
                                            }`}
                                        aria-label={`Go to image ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Thumbnail Carousel */}
                        <div className="flex gap-2 overflow-x-auto pb-2 px-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all border-2 ${idx === currentIndex
                                        ? "border-white"
                                        : "border-white/30 opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <img
                                        src={img.url}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
