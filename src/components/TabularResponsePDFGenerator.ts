import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ResponseComplaint {
  complaint_id: number;
  ticket_number: string;
  icon_category?: string;
}

interface ResponseAnswer {
  answer_id: number;
  question_id: number;
  question_name: string;
  answer_type: string;
  option_name?: string;
  comments?: string;
  complaints: ResponseComplaint[];
}

interface ResponseLocation {
  site_name: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string;
}

interface SurveyResponse {
  response_id: number;
  responded_time: string;
  mapping_id: number;
  survey_id: number;
  survey_name: string;
  questions_count: number;
  complaints_count: number;
  positive_responses?: number;
  negative_responses?: number;
  location: ResponseLocation;
  answers: ResponseAnswer[];
}

interface SurveyDetail {
  survey_id: number;
  survey_name: string;
  positive_responses?: number;
  negative_responses?: number;
  csat?: number;
}

export class TabularResponsePDFGenerator {
  private formatDateTime(ts?: string): string {
    if (!ts) return "-";
    try {
      const d = new Date(ts);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${day}/${month}/${year}, ${hours}:${minutes}${ampm}`;
    } catch {
      return ts;
    }
  }

  private getTicketsJoined(response: SurveyResponse): string {
    const tks: string[] = [];
    response.answers?.forEach(a => {
      a.complaints?.forEach(c => {
        if (c.ticket_number) tks.push(c.ticket_number);
      });
    });
    const uniq = Array.from(new Set(tks));
    return uniq.length ? uniq.join(", ") : "-";
  }

  async generateTabularResponsePDF(
    response: SurveyResponse,
    surveyData: SurveyDetail | null
  ): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 15;

    // Colors matching the image
    const primaryColor = [199, 32, 48]; // #C72030
    const lightBgColor = [246, 244, 238]; // #F6F4EE
    const borderColor = [217, 217, 217]; // #D9D9D9
    const textGray = [102, 102, 102];

    // Title
    doc.setFontSize(18);
    doc.setTextColor(26, 26, 26);
    doc.setFont('helvetica', 'bold');
    doc.text(response.survey_name || 'Survey Response', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 12;

    // Summary Cards Section
    doc.setFillColor(...lightBgColor);
    
    // Positive Card
    const cardWidth = (pageWidth - 30) / 2 - 5;
    const cardHeight = 25;
    const cardStartX = 15;
    
    doc.roundedRect(cardStartX, yPosition, cardWidth, cardHeight, 3, 3, 'F');
    doc.setFillColor(...primaryColor);
    doc.circle(cardStartX + 10, yPosition + 12.5, 6, 'F');
    
    // Smiley icon (simplified)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('☺', cardStartX + 10, yPosition + 14, { align: 'center' });
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(response.positive_responses || 0), cardStartX + 25, yPosition + 12);
    
    doc.setTextColor(...textGray);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Positive', cardStartX + 25, yPosition + 19);

    // Negative Card
    const negCardStartX = cardStartX + cardWidth + 10;
    doc.setFillColor(...lightBgColor);
    doc.roundedRect(negCardStartX, yPosition, cardWidth, cardHeight, 3, 3, 'F');
    doc.setFillColor(...primaryColor);
    doc.circle(negCardStartX + 10, yPosition + 12.5, 6, 'F');
    
    // Sad face icon (simplified)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('☹', negCardStartX + 10, yPosition + 14, { align: 'center' });
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(response.negative_responses || 0), negCardStartX + 25, yPosition + 12);
    
    doc.setTextColor(...textGray);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Negative', negCardStartX + 25, yPosition + 19);

    yPosition += cardHeight + 15;

    // Survey Response Detail Section
    doc.setFillColor(...lightBgColor);
    doc.roundedRect(15, yPosition, pageWidth - 30, 10, 2, 2, 'F');
    
    doc.setFillColor(...primaryColor);
    doc.circle(20, yPosition + 5, 3, 'F');
    
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Survey Response Detail', 28, yPosition + 6.5);
    
    yPosition += 15;

    // Response details in grid format
    const detailsData = [
      ['Response ID', String(response.response_id || '-'), 'Wing', response.location?.wing_name || '-'],
      ['Time', this.formatDateTime(response.responded_time), 'Area', response.location?.area_name || '-'],
      ['Building', response.location?.building_name || '-', 'Floor', response.location?.floor_name || '-'],
      ['', '', 'Room', response.location?.room_name || '-'],
      ['Ticket Id', this.getTicketsJoined(response), '', '']
    ];

    doc.setFillColor(246, 247, 247);
    doc.rect(15, yPosition, pageWidth - 30, 40, 'F');
    
    doc.setDrawColor(...borderColor);
    doc.rect(15, yPosition, pageWidth - 30, 40, 'S');

    let detailY = yPosition + 5;
    const colWidth = (pageWidth - 40) / 4;
    
    doc.setFontSize(9);
    detailsData.forEach((row, idx) => {
      let xPos = 20;
      
      // First column
      if (row[0]) {
        doc.setTextColor(...textGray);
        doc.setFont('helvetica', 'normal');
        doc.text(row[0], xPos, detailY);
        doc.setTextColor(26, 26, 26);
        doc.setFont('helvetica', 'bold');
        doc.text(row[1], xPos, detailY + 4);
      }
      
      xPos += colWidth * 2;
      
      // Third column
      if (row[2]) {
        doc.setTextColor(...textGray);
        doc.setFont('helvetica', 'normal');
        doc.text(row[2], xPos, detailY);
        doc.setTextColor(26, 26, 26);
        doc.setFont('helvetica', 'bold');
        doc.text(row[3], xPos, detailY + 4);
      }
      
      detailY += 8;
    });

    yPosition += 45;

    // Survey Responses Detail Table
    doc.setFillColor(...lightBgColor);
    doc.roundedRect(15, yPosition, pageWidth - 30, 10, 2, 2, 'F');
    
    doc.setFillColor(...primaryColor);
    doc.circle(20, yPosition + 5, 3, 'F');
    
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Survey Responses detail', 28, yPosition + 6.5);
    
    yPosition += 15;

    // Prepare table data
    const tableData = response.answers.map(ans => {
      const issueIcons = ans.complaints && ans.complaints.length > 0
        ? ans.complaints.map(c => c.icon_category).filter(Boolean).join(", ")
        : "-";
      
      return [
        ans.question_name || '-',
        ans.option_name || '-',
        issueIcons,
        ans.comments || '-'
      ];
    });

    // Generate table using autoTable
    autoTable(doc, {
      startY: yPosition,
      head: [['Question', 'Rate your experience', 'Issue Icon', 'Comment']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [246, 244, 238],
        textColor: [26, 26, 26],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'left'
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [26, 26, 26],
        fontSize: 9,
        cellPadding: 4,
        valign: 'top'
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      columnStyles: {
        0: { cellWidth: 70 }, // Increased width for Question column
        1: { cellWidth: 45 }, // Rate your experience
        2: { cellWidth: 35 }, // Issue Icon (can be smaller)
        3: { cellWidth: 50 }  // Comment
      },
      margin: { left: 15, right: 15 },
      styles: {
        lineColor: [217, 217, 217],
        lineWidth: 0.5,
        cellPadding: 4,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      }
    });

    // Save the PDF
    const fileName = `Survey_Response_${response.response_id}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
  }
}