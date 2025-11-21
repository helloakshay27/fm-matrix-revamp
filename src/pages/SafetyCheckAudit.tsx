
import React, { useState, useEffect } from 'react';
import { Download, Eye, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { Button } from "@/components/ui/button";


export const SafetyCheckAudit: React.FC = () => {
    const [auditData, setAuditData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();
    const questId = searchParams.get('quest_id');
    const token = localStorage.getItem('token') || '';
    let baseUrl = localStorage.getItem('baseUrl') || '';

    if (baseUrl && !baseUrl.startsWith('http')) {
        baseUrl = 'https://' + baseUrl;
    }

    useEffect(() => {
        if (questId) {
            fetchAuditData();
        }
    }, [questId]);

    const fetchAuditData = async () => {
        setLoading(true);
        try {
            const url = `${baseUrl}/pms/permits/safety_responses.json?quest_id=${questId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();

            if (result.status === 'success' && Array.isArray(result.responses)) {
                const mappedData = result.responses.map((item: any, index: number) => ({
                    id: index + 1,
                    question: item.question || '-',
                    comment: item.comment || '-',
                    answerType: item.answer_type || '-',
                    recordedBy: `${item.recorded_by || '-'} (${item.department || '-'})`,
                    dateTime: item.created_at || null,
                }));

                setAuditData(mappedData);

                const pdfFullUrl = result.pdf_url
                    ? result.pdf_url.startsWith('http')
                        ? result.pdf_url
                        : `${baseUrl}${result.pdf_url}`
                    : null;
                setPdfUrl(pdfFullUrl);

                const attachmentFullUrl = result.attachment_url
                    ? result.attachment_url.startsWith('http')
                        ? result.attachment_url
                        : `${baseUrl}${result.attachment_url}`
                    : null;
                setAttachmentUrl(attachmentFullUrl);
            } else {
                setAuditData([]);
                setPdfUrl(null);
                setAttachmentUrl(null);
            }
        } catch (error) {
            console.error('Error fetching audit data:', error);
            setAuditData([]);
            setPdfUrl(null);
            setAttachmentUrl(null);
        } finally {
            setLoading(false);
        }
    };

    // const handleDownload = () => {
    //     if (pdfUrl) window.open(pdfUrl, '_blank');
    //     else alert('No PDF available for download.');
    // };
    const handleDownload = async () => {
        if (!pdfUrl) {
            alert('No PDF available for download.');
            return;
        }

        try {
            const token = localStorage.getItem('token') || '';
            let baseUrl = localStorage.getItem('baseUrl') || '';
            if (baseUrl && !baseUrl.startsWith('http')) {
                baseUrl = 'https://' + baseUrl;
            }

            // Make the full URL if pdfUrl is relative
            const fullPdfUrl = pdfUrl.startsWith('http') ? pdfUrl : `${baseUrl}${pdfUrl}`;

            // Open a new window with Authorization header via fetch and blob download
            const response = await fetch(fullPdfUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;

            // Extract file name from pdf_url
            const fileName = fullPdfUrl.split('/').pop()?.split('?')[0] || 'audit.pdf';
            a.download = fileName;

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF.');
        }
    };


    const handleViewAttachment = () => {
        if (attachmentUrl) window.open(attachmentUrl, '_blank');
        else alert('No attachment available.');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const formatDateTime = (dateStr: string | null) => {
        if (!dateStr) return '-';
        try {
            // parse date using the format from your API
            const parsedDate = parse(dateStr, 'dd/MM/yyyy HH:mm:ss', new Date());
            // format to the desired output
            return format(parsedDate, 'dd/MM/yyyy hh:mm a'); // 12-hour format with AM/PM
        } catch (error) {
            console.error('Date parsing error:', error);
            return dateStr;
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6 w-full">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="flex items-center gap-2 mb-4 text-gray-700 hover:text-gray-900"
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold text-[#c72030]">
                    Safety Check Audit Responses
                </h1>
                <div className="flex gap-3">
                    <Button
                        onClick={handleDownload}
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </Button>
                    <Button
                        onClick={handleViewAttachment}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        View Attachment
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-auto w-full">
                {loading ? (
                    <p className="p-6 text-gray-500">Loading audit data...</p>
                ) : auditData.length === 0 ? (
                    <p className="p-6 text-gray-500">No audit data available.</p>
                ) : (
                    <table className="w-full min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#f6f4ee]">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Sr.no</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Question</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Comment</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Answer Type</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Recorded By</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {auditData.map((row) => (
                                <tr key={row.id}>
                                    <td className="px-6 py-4 text-sm text-gray-700">{row.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{row.question}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{row.comment}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{row.answerType}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{row.recordedBy}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{formatDateTime(row?.dateTime)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SafetyCheckAudit;
