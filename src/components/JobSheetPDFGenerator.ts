import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export class JobSheetPDFGenerator {
  private pdf: jsPDF;

  constructor() {
    this.pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
    });
  }

  async generateJobSheetPDF(
    taskDetails: any,
    jobSheetData: any,
    comments: string = ""
  ): Promise<void> {
    try {
      const htmlContent = this.generateHTMLContent(
        taskDetails,
        jobSheetData,
        comments
      );
      const container = document.createElement("div");
      container.innerHTML = htmlContent;
      container.style.cssText =
        "position:absolute;left:-9999px;top:-9999px;width:100%;max-width:210mm;height:auto;background-color:white;font-family:Arial,sans-serif;transform-origin:top left;transform:scale(1)";

      document.body.appendChild(container);

      try {
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: container.offsetWidth,
          height: container.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.7);
        const imgWidth = 210,
          pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight,
          position = 0;

        this.pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          this.pdf.addPage();
          this.pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        this.pdf.save(
          `JobSheet_${taskDetails.task_details?.id || "Unknown"}_${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`
        );
      } finally {
        document.body.removeChild(container);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  }

  private generateHTMLContent(
    taskDetails: any,
    jobSheetData: any,
    comments: string = ""
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getPageStyles()}
        </head>
        <body>
          ${this.generateHeader(jobSheetData)}
          ${this.generateClientInfo(taskDetails, jobSheetData)}
          ${this.generateChecklistSection(jobSheetData)}
          ${this.generateRemarksSection(comments, jobSheetData)}
          ${this.generateSignatureSection(jobSheetData)}
        </body>
      </html>
    `;
  }

  private generateHeader(data: any): string {
    return `
      <div class="header">
        <div class="left-logo">
          <div class="oig-logo">
            <h1>OIG</h1>
            <p class="arabic-text">شركة المجموعة الدولية العمانية ش.م.م</p>
            <p class="english-text">OMAN INTERNATIONAL GROUP SAOC</p>
          </div>
        </div>
        <div class="right-logo">
          <div class="color-squares">
            <span class="square blue"></span>
            <span class="square gray"></span>
            <span class="square green"></span>
            <span class="square orange"></span>
            <span class="square yellow"></span>
            <span class="square purple"></span>
          </div>
          <p class="arabic-text">إدارة المرافق والخدمات اللوجستية</p>
          <p class="english-text">FACILITIES MANAGEMENT SERVICES</p>
        </div>
      </div>
    `;
  }

  private generateClientInfo(taskDetails: any, jobSheetData: any): string {
    const jobSheet = jobSheetData?.job_sheet;
    const siteName = jobSheet?.task_details?.site?.name || "NIZWA GRAND MALL";
    const frequency = jobSheet?.basic_info?.frequency || "3 months";
    const jobCode = jobSheet?.basic_info?.job_card_no || "HFM16938";
    const taskName = jobSheet?.task_details?.task_name || "Preventive Maintenance";
    const date = jobSheet?.basic_info?.created_date || new Date().toLocaleDateString();
    const location = jobSheet?.task_details?.asset?.location ||
      taskDetails?.task_details?.location?.full_location ||
      "Pump Room";
    const assetCode = jobSheet?.task_details?.asset?.code ||
      taskDetails?.task_details?.asset_service_code ||
      "";

    return `
      <div class="client-info">
        <table class="info-table">
          <tr>
            <td><strong>CLIENT: ${siteName.toUpperCase()}</strong></td>
            <td><strong>Frequency:</strong> ${frequency}</td>
            <td><strong>JOB CODE:</strong> ${jobCode}</td>
          </tr>
          <tr>
            <td><strong>Task:</strong> ${taskName}</td>
            <td><strong>Pump NO:</strong></td>
            <td><strong>Date:</strong> ${date}</td>
          </tr>
          <tr>
            <td><strong>Location:</strong> ${location}</td>
            <td><strong>SI. No:</strong></td>
            <td><strong>Asset code:</strong> ${assetCode}</td>
          </tr>
          <tr>
            <td><strong>Model No:</strong></td>
            <td colspan="2"></td>
          </tr>
        </table>
      </div>
    `;
  }

  private generateChecklistSection(jobSheetData: any): string {
    const jobSheet = jobSheetData?.job_sheet;
    const checklistResponses = jobSheet?.checklist_responses || [];
    const assetCategory =
      jobSheet?.task_details?.asset?.category || "CHILLED WATER SECONDARY PUMP";

    if (checklistResponses.length === 0) {
      return `
        <div class="checklist-section">
          <h3>SERVICE CHECKLIST OF ${assetCategory.toUpperCase()}</h3>
          <p>No checklist items found</p>
        </div>
      `;
    }

    const checklistHtml = checklistResponses
      .map((item: any, index: number) => {
        const isSatisfactory =
          item.input_value === "Yes" ||
          item.status === "Completed" ||
          item.rating > 0;
        const isNotSatisfactory =
          item.input_value === "No" || item.status === "Failed";
        const comments = item.comments || "";
        const serialNumber = item.index || index + 1;
        const activity = item.activity || "N/A";

        return `
          <tr>
            <td class="sl-no">${serialNumber}</td>
            <td class="inspection-point">${activity}</td>
            <td class="result-cell">
              <div class="checkbox-row">
                <div class="checkbox-pair">
                  <div class="checkbox ${isSatisfactory ? "checked" : ""}">
                    ${isSatisfactory ? "✓" : ""}
                  </div>
                  <div class="checkbox ${isNotSatisfactory ? "checked" : ""}">
                    ${isNotSatisfactory ? "✓" : ""}
                  </div>
                </div>
                <div class="result-labels">
                  <span>S</span>
                  <span>NS</span>
                </div>
              </div>
            </td>
            <td class="remarks">${comments}</td>
          </tr>
        `;
      })
      .join("");

    return `
      <div class="checklist-section">
        <h3>SERVICE CHECKLIST OF ${assetCategory.toUpperCase()}</h3>
        <table class="checklist-table">
          <thead>
            <tr>
              <th class="sl-header">SL<br>NO</th>
              <th class="inspection-header">INSPECTION POINT</th>
              <th class="result-header">RESULT<br>(✓)<br>S&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NS</th>
              <th class="remarks-header">REMARKS</th>
            </tr>
          </thead>
          <tbody>
            ${checklistHtml}
          </tbody>
        </table>

   
      </div>
    `;
  }

  private generateMeasurementTables(jobSheetData: any): string {
    return `
      <div class="measurements-section">
        <!-- Voltage Table -->
        <div class="measurement-group">
          <table class="measurement-table voltage-table">
            <thead>
              <tr>
                <th class="voltage-label">VOLTAGE</th>
                <th>R-N</th>
                <th>Y-N</th>
                <th>B-N</th>
                <th>RY</th>
                <th>YB</th>
                <th>RB</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="measurement-spacer"></td>
                <td>R</td>
                <td>Y</td>
                <td>B</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Ampere Table -->
        <div class="measurement-group">
          <table class="measurement-table ampere-table">
            <thead>
              <tr>
                <th class="ampere-label">AMPERE</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="measurement-spacer"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pressure Table -->
        <div class="measurement-group">
          <table class="measurement-table pressure-table">
            <thead>
              <tr>
                <th class="pressure-label">PRESSURE</th>
                <th>INLET PRESSURE (bar)</th>
                <th>OUTLET PRESSURE (bar)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="measurement-spacer"></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private generateRemarksSection(comments: string, jobSheetData: any): string {
    const remarksText =
      comments || jobSheetData?.job_sheet?.task_details?.task_comments || "";
    
    return `
      <div class="remarks-section">
        <h3>Remarks:</h3>
        <div class="remarks-box">
          ${remarksText || ""}
        </div>
      </div>
    `;
  }

  private generateSignatureSection(jobSheetData: any): string {
    const jobSheet = jobSheetData?.job_sheet;
    const performedBy = jobSheet?.personnel?.performed_by;
    const performedByName = performedBy?.full_name || "";

    return `
      <div class="signature-section">
        <table class="signature-table">
          <tr>
            <!-- Work Completed by -->
            <td class="signature-cell">
              <div class="signature-header">Work Completed by</div>
              <div class="signature-content">
                <div class="signature-line">
                  <span class="signature-label">Name:</span>
                  <span class="signature-value">${performedByName}</span>
                </div>
                <div class="signature-line">
                  <span class="signature-label">Signature:</span>
                  <span class="signature-underline"></span>
                </div>
                <div class="signature-line">
                  <span class="signature-label">Date:</span>
                  <span class="signature-underline"></span>
                </div>
              </div>
            </td>

            <!-- Inspected by -->
            <td class="signature-cell">
              <div class="signature-header">Inspected by</div>
              <div class="signature-content">
                <div class="signature-line">
                  <span class="signature-label">Name:</span>
                  <span class="signature-underline"></span>
                </div>
                <div class="signature-line">
                  <span class="signature-label">Signature:</span>
                  <span class="signature-underline"></span>
                </div>
                <div class="signature-line">
                  <span class="signature-label">Date:</span>
                  <span class="signature-underline"></span>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  private getPageStyles(): string {
    return `
      <style>
        /* Page Setup */
        @page {
          size: A4;
          margin: 8mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          font-size: 9px;
          color: #1a1a1a;
          margin: 8px;
          padding: 8px;
          background: #ffffff;
          line-height: 1.2;
          width: 100%;
          height: auto;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Header Styles */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 2px solid #2c3e50;
          margin-bottom: 8px;
          padding: 10px;
          width: 100%;
          height: auto;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .left-logo {
          width: 48%;
          padding-right: 10px;
          height: auto;
        }

        .oig-logo h1 {
          color: #2563eb;
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          text-align: left;
          letter-spacing: 1px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .arabic-text {
          font-size: 8px;
          margin: 3px 0;
          color: #374151;
          font-weight: 500;
        }

        .english-text {
          font-size: 8px;
          margin: 3px 0;
          font-weight: 500;
          color: #374151;
        }

        .right-logo {
          width: 48%;
          text-align: right;
          padding-left: 10px;
          height: auto;
        }

        .color-squares {
          margin-bottom: 6px;
          display: flex;
          justify-content: flex-end;
          gap: 3px;
        }

        .square {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
        }

        .square:hover {
          transform: scale(1.1);
        }

        .square.blue { 
          background: linear-gradient(135deg, #4169E1 0%, #3b5af0 100%);
        }
        .square.gray { 
          background: linear-gradient(135deg, #808080 0%, #6b7280 100%);
        }
        .square.green { 
          background: linear-gradient(135deg, #8BC34A 0%, #7cb342 100%);
        }
        .square.orange { 
          background: linear-gradient(135deg, #FF9800 0%, #f57c00 100%);
        }
        .square.yellow { 
          background: linear-gradient(135deg, #FFEB3B 0%, #fbc02d 100%);
        }
        .square.purple { 
          background: linear-gradient(135deg, #9C27B0 0%, #8e24aa 100%);
        }

        /* Client Info Styles */
        .client-info {
          margin-bottom: 8px;
          width: 100%;
          height: auto;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .info-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          height: auto;
          background: #ffffff;
        }

        .info-table td {
          border: 1px solid #d1d5db;
          padding: 8px 10px;
          vertical-align: middle;
          height: auto;
          min-height: 26px;
          background: #ffffff;
          transition: background-color 0.2s ease;
        }

        .info-table td:nth-child(even) {
          background: #f9fafb;
        }

        .info-table strong {
          font-weight: 600;
          color: #1f2937;
        }

        /* Checklist Styles */
        .checklist-section {
          margin-bottom: 8px;
          width: 100%;
          height: auto;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .checklist-section h3 {
          font-size: 11px;
          font-weight: 600;
          margin: 6px 0;
          text-align: center;
          text-decoration: underline;
          color: #1f2937;
          letter-spacing: 0.5px;
        }

        .checklist-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8px;
          height: auto;
          background: #ffffff;
        }

        .checklist-table th {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border: 1px solid #d1d5db;
          padding: 6px 4px;
          font-weight: 600;
          text-align: center;
          vertical-align: middle;
          height: auto;
          min-height: 30px;
          color: #374151;
          text-shadow: 0 1px 1px rgba(255,255,255,0.8);
        }

        .sl-header { width: 8%; }
        .inspection-header { width: 62%; }
        .result-header { width: 12%; }
        .remarks-header { width: 18%; }

        .checklist-table td {
          border: 1px solid #d1d5db;
          padding: 6px 8px;
          vertical-align: top;
          height: auto;
          min-height: 24px;
          background: #ffffff;
        }

        .checklist-table tbody tr:nth-child(even) td {
          background: #f9fafb;
        }

        .checklist-table tbody tr:hover td {
          background: #f3f4f6;
        }

        .sl-no {
          text-align: center;
          font-weight: 600;
          font-size: 8px;
          color: #374151;
        }

        .inspection-point {
          text-align: left;
          font-size: 8px;
          padding-left: 8px;
          color: #1f2937;
          line-height: 1.3;
        }

        .result-cell {
          text-align: center;
          padding: 6px;
        }

        .checkbox-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .checkbox-pair {
          display: flex;
          gap: 8px;
          margin-bottom: 2px;
        }

        .checkbox {
          width: 12px;
          height: 12px;
          border: 2px solid #374151;
          display: inline-block;
          text-align: center;
          font-size: 8px;
          border-radius: 2px;
          transition: all 0.2s ease;
          position: relative;
        }

        .checkbox.checked {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          border-color: #047857;
          color: #ffffff;
          font-weight: bold;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .result-labels {
          display: flex;
          gap: 10px;
          font-size: 7px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.5px;
        }

        .remarks {
          font-size: 7px;
          color: #4b5563;
          line-height: 1.3;
        }

        .note {
          font-size: 8px;
          margin-top: 4px;
          font-style: italic;
          color: #6b7280;
          background: #fef3c7;
          padding: 4px 8px;
          border-left: 3px solid #f59e0b;
          border-radius: 0 2px 2px 0;
        }

        /* Measurement Tables Styles */
        .measurements-section {
          margin-bottom: 8px;
          width: 100%;
          height: auto;
        }

        .measurement-group {
          margin-bottom: 4px;
          width: 100%;
          height: auto;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .measurement-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8px;
          height: auto;
          background: #ffffff;
        }

        .measurement-table th,
        .measurement-table td {
          border: 1px solid #d1d5db;
          padding: 6px 4px;
          text-align: center;
          height: auto;
          min-height: 26px;
        }

        .measurement-table th {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          font-weight: 600;
          color: #374151;
          text-shadow: 0 1px 1px rgba(255,255,255,0.8);
        }

        .measurement-table td {
          background: #ffffff;
          color: #1f2937;
        }

        .measurement-table tbody tr:nth-child(even) td {
          background: #f9fafb;
        }

        .voltage-label,
        .ampere-label,
        .pressure-label {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          font-weight: 600;
          width: 14%;
          color: #1e40af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .measurement-spacer {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          width: 14%;
        }

        .voltage-table th:not(.voltage-label) { 
          width: 14.33%;
          font-size: 7px;
        }
        .ampere-table th:not(.ampere-label) { 
          width: 17.2%;
          font-size: 7px;
        }
        .pressure-table th:not(.pressure-label) { 
          width: 43%;
          font-size: 7px;
        }

        /* Remarks Styles */
        .remarks-section {
          margin-bottom: 10px;
          width: 100%;
          height: auto;
        }

        .remarks-section h3 {
          font-size: 11px;
          font-weight: 600;
          margin: 0 0 6px 0;
          color: #1f2937;
          letter-spacing: 0.5px;
        }

        .remarks-box {
          border: 2px solid #d1d5db;
          min-height: 70px;
          padding: 12px;
          font-size: 9px;
          width: 100%;
          height: auto;
          background: #f9fafb;
          border-radius: 4px;
          line-height: 1.4;
          color: #374151;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Signature Styles */
        .signature-section {
          margin-top: 12px;
          width: 100%;
          height: auto;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .signature-table {
          width: 100%;
          border-collapse: collapse;
          height: auto;
          background: #ffffff;
        }

        .signature-cell {
          border: 2px solid #d1d5db;
          padding: 16px;
          width: 50%;
          vertical-align: top;
          height: auto;
          min-height: 90px;
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
        }

        .signature-header {
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 14px;
          text-align: center;
          color: #1f2937;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 4px;
        }

        .signature-content {
          font-size: 9px;
        }

        .signature-line {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }

        .signature-label {
          min-width: 60px;
          font-weight: 600;
          margin-right: 8px;
          color: #374151;
        }

        .signature-value {
          flex: 1;
          color: #1f2937;
          font-weight: 500;
        }

        .signature-underline {
          flex: 1;
          border-bottom: 2px solid #6b7280;
          min-height: 14px;
          border-radius: 1px;
        }

        /* Print Styles */
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    `;
  }
}
