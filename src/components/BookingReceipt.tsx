import { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface InvoiceData {
    id?: number;
    membership_plan_id?: number;
    start_date?: string;
    end_date?: string;
    club_members?: any[];
    allocation_payment_detail?: {
        base_amount?: string | number;
        discount?: string | number;
        cgst?: string | number;
        sgst?: string | number;
        cgst_per?: number;
        sgst_per?: number;
        total_tax?: string | number;
        total_amount?: string | number;
        payment_mode?: string;
        payment_status?: string;
        created_at?: string;
    };
    membership_plan?: {
        name?: string;
        price?: number;
    };
    site_name?: string;
    created_at?: string;
}

interface InvoiceProps {
    data?: InvoiceData;
    autoDownload?: boolean;
    onDownloadComplete?: () => void;
    onClose?: () => void;
    showButton?: boolean;
    onBase64Generated?: (base64: string) => void;
    returnBase64?: boolean;
    isFromDetailsPage?: boolean;
    isFromBookingPage?: boolean;
}

const BookingReceipt = ({
    data,
    autoDownload = false,
    onDownloadComplete,
    onClose,
    showButton = true,
    onBase64Generated,
    returnBase64 = false,
    isFromDetailsPage = false,
    isFromBookingPage = false
}: InvoiceProps) => {
    console.log(data)
    const invoiceRef = useRef<HTMLDivElement>(null);

    // Extract data with fallbacks
    const invoiceNumber = data?.id || "1008";
    const invoiceDate = data?.created_at
        ? new Date(data.created_at)
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            .replace(/\//g, ". ")
        : new Date()
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            .replace(/\//g, ". ");

    // Determine invoice type based on page
    const invoiceType = isFromDetailsPage ? "RECEIPT" : "TAX INVOICE";

    const primaryMember = data?.club_members?.[0];
    const billToName = primaryMember?.user_name;
    const billToEmail = primaryMember?.user_email;
    const billToMobile = primaryMember?.user_mobile;

    const planName = data?.membership_plan?.name;
    const baseAmount =
        parseFloat(String(data?.allocation_payment_detail?.base_amount))
    const discountAmount =
        parseFloat(String(data?.allocation_payment_detail?.discount));
    const cgstAmount =
        parseFloat(String(data?.allocation_payment_detail?.cgst));
    const sgstAmount =
        parseFloat(String(data?.allocation_payment_detail?.sgst));
    const cgstPercentage = data?.allocation_payment_detail?.cgst_per;
    const sgstPercentage = data?.allocation_payment_detail?.sgst_per;
    const totalTax = cgstAmount + sgstAmount;
    const totalAmount =
        parseFloat(String(data?.allocation_payment_detail?.total_amount))
    const siteName = data?.site_name || "New Site 1";

    // Calculate total taxable value from line items
    const totalTaxableValue = Array.isArray(data?.invoice_data?.line_items)
        ? data.invoice_data.line_items.reduce((sum: number, item: any) => {
            return sum + (parseFloat(String(item.total)) || 0);
        }, 0)
        : 0;

    // Format amount in words
    const amountInWords = (num: number): string => {
        const ones = [
            "",
            "ONE",
            "TWO",
            "THREE",
            "FOUR",
            "FIVE",
            "SIX",
            "SEVEN",
            "EIGHT",
            "NINE",
        ];
        const tens = [
            "",
            "",
            "TWENTY",
            "THIRTY",
            "FORTY",
            "FIFTY",
            "SIXTY",
            "SEVENTY",
            "EIGHTY",
            "NINETY",
        ];
        const teens = [
            "TEN",
            "ELEVEN",
            "TWELVE",
            "THIRTEEN",
            "FOURTEEN",
            "FIFTEEN",
            "SIXTEEN",
            "SEVENTEEN",
            "EIGHTEEN",
            "NINETEEN",
        ];

        const convertLessThanSevenDigits = (n: number): string => {
            if (n === 0) return "";
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100)
                return (
                    tens[Math.floor(n / 10)] + (n % 10 > 0 ? " " + ones[n % 10] : "")
                );
            if (n < 1000)
                return (
                    ones[Math.floor(n / 100)] +
                    " HUNDRED" +
                    (n % 100 > 0 ? " " + convertLessThanSevenDigits(n % 100) : "")
                );
            if (n < 100000)
                return (
                    convertLessThanSevenDigits(Math.floor(n / 1000)) +
                    " THOUSAND" +
                    (n % 1000 > 0 ? " " + convertLessThanSevenDigits(n % 1000) : "")
                );
            return (
                convertLessThanSevenDigits(Math.floor(n / 100000)) +
                " LAKH" +
                (n % 100000 > 0 ? " " + convertLessThanSevenDigits(n % 100000) : "")
            );
        };

        if (num === 0) return "ZERO";
        if (num < 10000000)
            return convertLessThanSevenDigits(Math.floor(num)) + " ONLY";
        return (
            convertLessThanSevenDigits(Math.floor(num / 10000000)) +
            " CRORE " +
            convertLessThanSevenDigits(Math.floor(num % 10000000)) +
            " ONLY"
        );
    };

    const generatePDF = async (autoTrigger: boolean = false) => {
        if (!invoiceRef.current) return;

        try {
            // Generate canvas with reduced scale for smaller file size
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 1.2, // Reduced from 2 to ~1.5x original size (40% compression)
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                allowTaint: true,
            });

            // Convert to JPEG with compression instead of PNG (significantly smaller)
            const imgData = canvas.toDataURL("image/jpeg", 0.75); // 75% quality for good balance

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
                compress: true, // Enable PDF compression
            });

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            let heightLeft = (canvas.height * imgWidth) / canvas.width;
            let position = 0;

            // Add first image as JPEG (compressed)
            pdf.addImage(
                imgData,
                "JPEG",
                0,
                position,
                imgWidth,
                (canvas.height * imgWidth) / canvas.width
            );
            heightLeft -= pageHeight;

            // Add subsequent pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - (canvas.height * imgWidth) / canvas.width;
                pdf.addPage();
                pdf.addImage(
                    imgData,
                    "JPEG",
                    0,
                    position,
                    imgWidth,
                    (canvas.height * imgWidth) / canvas.width
                );
                heightLeft -= pageHeight;
            }

            // Get Base64 output
            let base64Pdf = pdf.output("datauristring");

            // Clean the base64 string to remove filename parameter if present
            // Extract just the base64 data part (everything after ;base64,)
            const base64DataMatch = base64Pdf.match(/;base64,(.+)$/);
            if (base64DataMatch && base64DataMatch[1]) {
                // Rebuild the URI with just the base64 data, no filename
                base64Pdf = `data:application/pdf;base64,${base64DataMatch[1]}`;
            }

            // If returnBase64 is true, pass it to callback instead of downloading
            if (returnBase64 && onBase64Generated) {
                onBase64Generated(base64Pdf);
            } else {
                // Download the PDF
                pdf.save(`invoice-${invoiceNumber}.pdf`);
            }

            if (onDownloadComplete) {
                onDownloadComplete();
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    // Auto-download if autoDownload is true
    useEffect(() => {
        if (autoDownload && invoiceRef.current) {
            const timer = setTimeout(() => {
                generatePDF(true);
            }, 500); // Small delay to ensure rendering is complete
            return () => clearTimeout(timer);
        }
    }, [autoDownload, returnBase64]);

    return (
        <div className="min-h-[297mm] flex flex-col items-center justify-center p-4">
            <div ref={invoiceRef}>
                <div className="w-full bg-[#F9F4E8] max-w-4xl flex h-[330mm]">
                    {/* LEFT SIDE - Logo/Branding Area */}
                    <div className="w-[24%] p-3 border-r-4 border-[#7C2D12] flex flex-col items-center justify-between py-8">
                        <div className="text-center">
                            <img src={`${window.location.origin}/image.png`} alt="" className="h-[90%]" />
                        </div>
                        <div className="flex justify-center items-center mb-[100px]">
                            <div
                                style={{
                                    transform: "rotate(-90deg)",
                                    transformOrigin: "",
                                    whiteSpace: "nowrap",
                                    width: "460px",
                                    textAlign: "center",
                                }}
                            >
                                <p className="text-[#1F5E2E] font-bold text-7xl">
                                    {invoiceType}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Invoice Content Area */}
                    <div className="flex-1">
                        {/* Header Section */}
                        <div className="border-b-4 border-[#7C2D12] p-6">
                            <div className="flex justify-between">
                                {/* Left: Company Details */}
                                <div className="flex-1">
                                    <p className="text-[#1F5E2E] font-bold mb-4 text-sm">{invoiceType}</p>
                                    <p className="text-[#1F5E2E] font-bold text-sm">
                                        PAUSE & PLAY MOVEMENT LABS
                                        <br />
                                        PVT. LTD.
                                    </p>
                                    <p className="text-[#1F5E2E] leading-tight text-sm">
                                        S. No. 19A/2A/1/2, Tech Park One,
                                        <br />
                                        Tower 'E', Yerwada, Pune – 411006,
                                        <br />
                                        Maharashtra, India
                                    </p>
                                    <p className="text-[#1F5E2E] text-sm">
                                        <span className="font-bold">Place of Supply:</span>{" "}
                                        MAHARASHTRA
                                    </p>
                                    <p className="text-[#1F5E2E] text-sm">
                                        <span className="font-bold">Code:</span> 27
                                    </p>
                                    <p className="text-[#1F5E2E] text-sm">
                                        <span className="font-bold">CIN:</span>{" "}
                                        U92390PN2024PTC235057
                                    </p>
                                    <p className="text-[#1F5E2E] text-sm">
                                        <span className="font-bold">GSTIN:</span> 27AALCD1821C1Z1
                                    </p>
                                    <p className="text-[#1F5E2E] text-sm">
                                        <span className="font-bold">PAN:</span> AALCD1821C
                                    </p>
                                    <p className="text-[#1F5E2E] text-sm">
                                        <span className="font-bold">TAN:</span> PNED22860F
                                    </p>
                                </div>

                                {/* Right: Invoice Title + Bill To Details */}
                                <div className="text-right">
                                    <p className="text-[#1F5E2E] font-bold mb-4 text-sm">
                                        ORIGINAL FOR RECEPIENT
                                    </p>
                                    <p className="text-[#1F5E2E] text-sm">
                                        <span className="font-bold">
                                            Invoice Number: {invoiceNumber}
                                        </span>
                                    </p>
                                    <p className="text-[#1F5E2E] mb-4 text-sm">
                                        <span className="font-bold">Date: {invoiceDate}</span>
                                    </p>
                                    <p className="text-[#1F5E2E] font-bold text-sm">Bill To:</p>
                                    <p className="text-[#1F5E2E] text-sm">{billToName}</p>
                                    <p className="text-[#1F5E2E] text-sm">{billToMobile}</p>
                                    <p className="text-[#1F5E2E] text-sm">{billToEmail}</p>
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        {/* Table Header */}
                        <div className="border-b-4 border-[#7C2D12] px-2">
                            <div className="grid grid-cols-12 gap-0 text-[#000000] text-sm font-bold">
                                <div className="col-span-1 px-1 py-2 text-[#1F5E2E] text-[11px] text-center">
                                    SL. NO.
                                </div>
                                <div className="col-span-3 px-1 py-2 text-[#1F5E2E] text-[11px] text-center">
                                    DESCRIPTION
                                </div>
                                <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-[11px] text-center">
                                    SAC/HSN CODE
                                </div>
                                <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-[11px] text-center">
                                    RATE (₹)
                                </div>
                                <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-[11px] text-center">
                                    DISCOUNT AMOUNT (₹)
                                </div>
                                <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-[11px] text-center">
                                    TOTAL TAXABLE VALUE (₹)
                                </div>
                                {/* <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-[11px]">
                                    TAX RATE
                                </div>
                                <div className="col-span-1 px-1 py-2 text-[#1F5E2E] text-[11px]">
                                    TAX AMOUNT (₹)
                                </div> */}
                            </div>
                        </div>
                        {/* Table Rows */}
                        <div className="border-b-4 border-[#7C2D12] px-2">
                            {Array.isArray(data?.invoice_data?.line_items) && data.invoice_data.line_items.map((item: any, index: number) => (
                                <div key={index}>
                                    {/* Main Row */}
                                    <div className="grid grid-cols-12 gap-0">
                                        <div className="col-span-1 px-1 py-2 text-[#1F5E2E] text-sm text-center">
                                            {index + 1}
                                        </div>
                                        <div className="col-span-3 px-1 py-2 text-[#1F5E2E] text-sm text-center">
                                            {item.description}
                                        </div>
                                        <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-sm text-center">
                                            {item.hsn_code}
                                        </div>
                                        <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-sm text-center">
                                            {parseFloat(String(item.rate)).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>
                                        <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-sm text-center">
                                            0.00
                                        </div>
                                        <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-sm text-center">
                                            {parseFloat(String(item.total)).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>
                                        {/* <div className="col-span-2 px-1 py-2 text-[#1F5E2E] text-sm text-center">
                                            {index === 0 ? `CGST (${cgstPercentage}%)` : `SGST (${sgstPercentage}%)`}
                                        </div>
                                        <div className="col-span-1 px-1 py-2 text-[#1F5E2E] text-sm text-center">
                                            {index === 0
                                                ? cgstAmount.toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })
                                                : sgstAmount.toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })
                                            }
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals Section */}
                        <div className="px-6 pb-6 pt-2 border-b-4 border-[#7C2D12]">
                            <div className="flex justify-between mb-3">
                                <p className="text-[#1F5E2E] font-bold text-sm">TOTAL TAXABLE AMOUNT</p>
                                <p className="text-[#1F5E2E] text-sm">
                                    ₹{" "}
                                    {totalTaxableValue.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="flex justify-between mb-3">
                                <p className="text-[#1F5E2E] font-bold text-sm">TOTAL CGST ({cgstPercentage}%)</p>
                                <p className="text-[#1F5E2E] text-sm">
                                    ₹{" "}
                                    {cgstAmount.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#1F5E2E] font-bold text-sm">TOTAL SGST ({sgstPercentage}%)</p>
                                <p className="text-[#1F5E2E] text-sm">
                                    ₹{" "}
                                    {sgstAmount.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Invoice Value */}
                        <div className="px-6 pt-1 pb-5 border-b-4 border-[#7C2D12]">
                            <div className="flex justify-between">
                                <p className="text-[#1F5E2E] font-bold text-sm">TOTAL INVOICE VALUE</p>
                                <p className="text-[#1F5E2E] font-bold text-sm">
                                    ₹
                                    {totalAmount.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Notes and Details Section */}
                        <div className="p-4">
                            {/* Tax Note */}
                            <p className="text-[#1F5E2E] text-sm mb-1">
                                <span className="font-bold italic">
                                    *Is Tax payable on reverse charge basis:
                                </span>{" "}
                                <span className="font-bold italic">NO*</span>
                            </p>

                            {/* Amount in Words */}
                            <p className="text-[#1F5E2E] text-sm mb-3">
                                <span className="font-bold">Amount in words:</span>{" "}
                                <span className="font-bold text-[#1F5E2E]">
                                    {amountInWords(Math.round(totalAmount))}
                                </span>
                            </p>

                            {/* Blank space */}
                            <div className="mb-[70px]"></div>

                            {/* Customer Note */}
                            {/* <p className="text-[#1F5E2E] font-bold text-sm mb-1">
                                Customer Note:
                            </p>
                            <p className="text-[#1F5E2E] text-sm mb-4 leading-relaxed">
                                You are kindly requested to make NEFT / RTGS / Issue Cheque/ Pay
                                Order favouring "Play & Pause Movement Labs Private Limited",
                                payable at "PUNE" on or before the completion of 7 days from the
                                date of invoice generation. We further request you to send the
                                cheque / pay order at the address mentioned hereby: PANCHSHIL
                                TECH PARK, 3rd Floor, Tower 'E', Tech Park One, Next to Don
                                Bosco school, Off. Air Port road, Yerwada, Pune-411006, by
                                subscribing on the envelope the name of "GANESH AHER"
                            </p>

                            
                            <p className="text-[#1F5E2E] font-bold text-sm mb-1">
                                CONFIRM BANK DETAILS
                            </p>
                            <p className="text-[#1F5E2E] text-sm mb-1">
                                Account Name: PAUSE & PLAY MOVEMENT LABS PVT. LTD.
                            </p>
                            <p className="text-[#1F5E2E] text-sm mb-1">
                                IFSC Code: KBKB0001758
                            </p>
                            <p className="text-[#1F5E2E] text-sm">A/c. No: 3250048396</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingReceipt;