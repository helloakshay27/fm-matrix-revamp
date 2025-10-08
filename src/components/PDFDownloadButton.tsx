import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { JobSheetPDFGenerator } from './JobSheetPDFGenerator';
import { toast } from 'sonner';

interface PDFDownloadButtonProps {
  taskDetails: any;
  jobSheetData: any;
  comments?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  buttonText?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  taskDetails,
  jobSheetData,
  comments = '',
  variant = 'outline',
  size = 'sm',
  className = '',
  buttonText = 'Download PDF'
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfGenerator = new JobSheetPDFGenerator();

  const handleDownloadPDF = async () => {
    if (!taskDetails || !jobSheetData) {
      toast.error('Missing task or job sheet data');
      return;
    }

    setIsDownloading(true);
    try {
      // Pass the correct data structure to PDF generator
      await pdfGenerator.generateJobSheetPDF(
        taskDetails,
        jobSheetData.data || jobSheetData,
        comments
      );

      toast.success('Job sheet PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadPDF}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      disabled={isDownloading || !taskDetails || !jobSheetData}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  );
};
