import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FileText, Loader2 } from 'lucide-react';

interface PdfGeneratorProps {
  elementId: string;
  voucherNumber: string;
}

export default function PdfGenerator({ elementId, voucherNumber }: PdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      alert("Error: Voucher preview element not found!");
      return;
    }

    setIsGenerating(true);

    try {
      // 1. Temporarily add a printing-specific style or class if needed
      // 2. Capture the canvas with high resolution scale
      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution crisp text rendering
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // 3. Setup standard A4 size in jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate width and height to preserve aspect ratio and fit A4 neatly
      const ratio = canvasWidth / canvasHeight;
      let width = pdfWidth - 20; // 10mm margins on left & right
      let height = width / ratio;

      // If height exceeds A4 height, scale down further
      if (height > (pdfHeight - 20)) {
        height = pdfHeight - 20;
        width = height * ratio;
      }

      // Center the invoice nicely in the page
      const xOffset = (pdfWidth - width) / 2;
      const yOffset = (pdfHeight - height) / 2;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, width, height, undefined, 'FAST');
      
      // Save PDF with correct file name format
      const fileName = `Voucher-${voucherNumber || 'Draft'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again or use the browser print option.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePdf}
      disabled={isGenerating}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-md transition-all duration-150 ease-in-out cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
      title="Generate and Download PDF of Voucher"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>পিডিএফ হচ্ছে... (Generating PDF...)</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          <span>পিডিএফ তৈরি করুন (Generate PDF)</span>
        </>
      )}
    </button>
  );
}
