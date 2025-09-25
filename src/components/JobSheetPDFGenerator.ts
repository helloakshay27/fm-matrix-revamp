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
      const jobSheet = jobSheetData?.job_sheet;
      const checklistResponses = jobSheet?.checklist_responses || [];
      const needsPageBreak = checklistResponses.length > 9;

      if (needsPageBreak) {
        // Generate two separate pages when checklist is long
        await this.generateMultiPagePDF(taskDetails, jobSheetData, comments);
      } else {
        // Generate single page when checklist is short
        await this.generateSinglePagePDF(taskDetails, jobSheetData, comments);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  }

  private async generateSinglePagePDF(
    taskDetails: any,
    jobSheetData: any,
    comments: string = ""
  ): Promise<void> {
    const htmlContent = `
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

    await this.renderAndSavePDF(htmlContent, taskDetails);
  }

  private async generateMultiPagePDF(
    taskDetails: any,
    jobSheetData: any,
    comments: string = ""
  ): Promise<void> {
    // Page 1: Header, Client Info, Checklist, and Remarks
    const page1Content = `
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
        </body>
      </html>
    `;

    // Page 2: Signature Section
    const page2Content = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getPageStyles()}
        </head>
        <body style="padding-top: 50px;">
          ${this.generateSignatureSection(jobSheetData)}
        </body>
      </html>
    `;

    // Render Page 1
    const container1 = document.createElement("div");
    container1.innerHTML = page1Content;
    container1.style.cssText =
      "position:absolute;left:-9999px;top:-9999px;width:100%;max-width:210mm;height:auto;background-color:white;font-family:Arial,sans-serif;transform-origin:top left;transform:scale(1);margin:20px 15px;padding:15px 12px;";

    document.body.appendChild(container1);

    try {
      const canvas1 = await html2canvas(container1, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: container1.offsetWidth,
        height: container1.scrollHeight,
      });

      const imgData1 = canvas1.toDataURL("image/jpeg", 0.7);
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight1 = (canvas1.height * imgWidth) / canvas1.width;

      // Add first page
      this.pdf.addImage(imgData1, "JPEG", 0, 0, imgWidth, imgHeight1);

      // Render Page 2
      const container2 = document.createElement("div");
      container2.innerHTML = page2Content;
      container2.style.cssText = container1.style.cssText;

      document.body.appendChild(container2);

      try {
        const canvas2 = await html2canvas(container2, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: container2.offsetWidth,
          height: container2.scrollHeight,
        });

        const imgData2 = canvas2.toDataURL("image/jpeg", 0.7);
        const imgHeight2 = (canvas2.height * imgWidth) / canvas2.width;

        // Add second page
        this.pdf.addPage();
        this.pdf.addImage(imgData2, "JPEG", 0, 0, imgWidth, imgHeight2);

        // Save the PDF
        this.pdf.save(
          `JobSheet_${taskDetails.task_details?.id || "Unknown"}_${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`
        );
      } finally {
        document.body.removeChild(container2);
      }
    } finally {
      document.body.removeChild(container1);
    }
  }

  private async renderAndSavePDF(htmlContent: string, taskDetails: any): Promise<void> {
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    container.style.cssText =
      "position:absolute;left:-9999px;top:-9999px;width:100%;max-width:210mm;height:auto;background-color:white;font-family:Arial,sans-serif;transform-origin:top left;transform:scale(1);margin:20px 15px;padding:15px 12px;";

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
              <td></td>
              <td>Y</td>
              <td></td>
              <td>B</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <!-- Ampere Table -->
        <table class="measurement-table ampere-table">
          <thead>
            <tr>
              <th class="ampere-label">AMPERE</th>
              <th colspan="6"></th>
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
              <td></td>
            </tr>
          </tbody>
        </table>

        <!-- Pressure Table -->
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
          margin: 15mm 12mm 15mm 12mm; /* top right bottom left */
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          font-size: 10px;
          color: #000000;
          margin: 20px 15px 20px 15px; /* top right bottom left */
          padding: 15px 12px 15px 12px; /* top right bottom left */
          background: #ffffff;
          line-height: 1.3;
          width: calc(100% - 30px); /* account for left + right margins */
          height: auto;
          min-height: calc(100vh - 40px); /* account for top + bottom margins */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Header Styles */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding: 15px;
          width: 100%;
          height: auto;
          border: 2px solid #000000;
          background: #ffffff;
        }

        .left-logo {
          width: 50%;
          padding-right: 20px;
          height: auto;
        }

        .oig-logo h1 {
          color: #2563eb;
          margin: 0 0 5px 0;
          font-size: 24px;
          font-weight: 900;
          text-align: left;
          letter-spacing: 2px;
        }

        .arabic-text {
          font-size: 10px;
          margin: 2px 0;
          color: #000000;
          font-weight: 600;
          line-height: 1.2;
        }

        .english-text {
          font-size: 10px;
          margin: 2px 0;
          font-weight: 700;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .right-logo {
          width: 50%;
          text-align: right;
          padding-left: 20px;
          height: auto;
        }

        .color-squares {
          margin-bottom: 8px;
          display: flex;
          justify-content: flex-end;
          gap: 4px;
          align-items: center;
        }

        .square {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 1px solid #000000;
        }

        .square.blue { 
          background: #4169E1;
        }
        .square.gray { 
          background: #808080;
        }
        .square.green { 
          background: #8BC34A;
        }
        .square.orange { 
          background: #FF9800;
        }
        .square.yellow { 
          background: #FFEB3B;
        }
        .square.purple { 
          background: #9C27B0;
        }

        /* Client Info Styles */
        .client-info {
          margin-bottom: 15px;
          width: 100%;
          height: auto;
        }

        .info-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          height: auto;
          background: #ffffff;
          border: 2px solid #000000;
        }

        .info-table td {
          border: 1px solid #000000;
          padding: 8px 12px;
          vertical-align: middle;
          height: auto;
          min-height: 30px;
          background: #ffffff;
          font-weight: normal;
        }

        .info-table strong {
          font-weight: 700;
          color: #000000;
        }

        /* Checklist Styles */
        .checklist-section {
          margin-bottom: 15px;
          width: 100%;
          height: auto;
        }

        .checklist-section h3 {
          font-size: 12px;
          font-weight: 700;
          margin: 10px 0;
          text-align: center;
          text-decoration: underline;
          color: #000000;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .checklist-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          height: auto;
          background: #ffffff;
          border: 2px solid #000000;
        }

        .checklist-table th {
          background: #ffffff;
          border: 1px solid #000000;
          padding: 8px 6px;
          font-weight: 700;
          text-align: center;
          vertical-align: middle;
          height: auto;
          min-height: 35px;
          color: #000000;
          font-size: 10px;
        }

        .sl-header { width: 8%; }
        .inspection-header { width: 60%; }
        .result-header { width: 14%; }
        .remarks-header { width: 18%; }

        .checklist-table td {
          border: 1px solid #000000;
          padding: 8px 10px;
          vertical-align: top;
          height: auto;
          min-height: 28px;
          background: #ffffff;
          font-size: 9px;
        }

        .sl-no {
          text-align: center;
          font-weight: 700;
          font-size: 10px;
          color: #000000;
        }

        .inspection-point {
          text-align: left;
          font-size: 9px;
          padding-left: 8px;
          color: #000000;
          line-height: 1.3;
          font-weight: normal;
        }

        .result-cell {
          text-align: center;
          padding: 8px;
        }

        .checkbox-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .checkbox-pair {
          display: flex;
          gap: 12px;
          margin-bottom: 3px;
        }

        .checkbox {
          width: 14px;
          height: 14px;
          border: 2px solid #000000;
          display: inline-block;
          text-align: center;
          font-size: 10px;
          font-weight: 900;
          line-height: 10px;
          background: #ffffff;
        }

        .checkbox.checked {
          background: #ffffff;
          border-color: #000000;
          color: #000000;
          font-weight: 900;
        }

        .result-labels {
          display: flex;
          gap: 15px;
          font-size: 9px;
          font-weight: 700;
          color: #000000;
          letter-spacing: 0.5px;
        }

        .remarks {
          font-size: 9px;
          color: #000000;
          line-height: 1.3;
          background: #ffffff;
          border: none;
          min-height: 20px;
          padding: 2px;
        }

        .note {
          font-size: 9px;
          margin-top: 8px;
          font-style: italic;
          color: #000000;
          background: #ffffff;
          padding: 4px 8px;
          border: 1px solid #000000;
          font-weight: normal;
          text-align: left;
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
          margin-bottom: 15px;
          width: 100%;
          height: auto;
        }

        .measurement-group {
          margin-bottom: 0px;
          width: 100%;
          height: auto;
        }

        .measurement-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          height: auto;
          background: #ffffff;
          border: 2px solid #000000;
        }

        .measurement-table th,
        .measurement-table td {
          border: 1px solid #000000;
          padding: 8px 6px;
          text-align: center;
          height: auto;
          min-height: 30px;
          font-weight: 700;
        }

        .measurement-table th {
          background: #ffffff;
          font-weight: 700;
          color: #000000;
          font-size: 10px;
        }

        .measurement-table td {
          background: #ffffff;
          color: #000000;
          font-size: 10px;
        }

        .voltage-label,
        .ampere-label,
        .pressure-label {
          background: #ffffff;
          font-weight: 700;
          width: 15%;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 2px solid #000000;
        }

        .measurement-spacer {
          background: #ffffff;
          width: 15%;
        }

        .voltage-table th:not(.voltage-label) { 
          width: 14%;
          font-size: 9px;
        }
        .ampere-table th:not(.ampere-label) { 
          width: 17%;
          font-size: 9px;
        }
        .pressure-table th:not(.pressure-label) { 
          width: 42.5%;
          font-size: 9px;
        }

        /* Remarks Styles */
        .remarks-section {
          margin-bottom: 15px;
          width: 100%;
          height: auto;
        }

        .remarks-section h3 {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #000000;
          letter-spacing: 0.5px;
        }

        .remarks-box {
          border: 2px solid #000000;
          min-height: 80px;
          padding: 12px;
          font-size: 10px;
          width: 100%;
          height: auto;
          line-height: 1.4;
          color: #000000;
          background: #ffffff;
          resize: vertical;
          font-family: 'Arial', 'Helvetica', sans-serif;
        }

        /* Signature Styles */
        .signature-section {
          margin-top: 15px;
          width: 100%;
          height: auto;
        }

        .signature-table {
          width: 100%;
          border-collapse: collapse;
          height: auto;
          background: #ffffff;
          border: 2px solid #000000;
        }

        .signature-cell {
          border: 1px solid #000000;
          padding: 20px;
          width: 50%;
          vertical-align: top;
          height: auto;
          min-height: 100px;
          background: #ffffff;
        }

        .signature-header {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 15px;
          text-align: center;
          color: #000000;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #000000;
          padding-bottom: 5px;
        }

        .signature-content {
          font-size: 11px;
        }

        .signature-line {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .signature-label {
          min-width: 70px;
          font-weight: 700;
          margin-right: 10px;
          color: #000000;
        }

        .signature-value {
          flex: 1;
          color: #000000;
          font-weight: normal;
        }

        .signature-underline {
          flex: 1;
          border-bottom: 2px solid #000000;
          min-height: 16px;
        }

        /* Print Styles */
        @media print {
          @page {
            margin: 15mm 12mm 15mm 12mm; /* top right bottom left */
          }
          
          body {
            margin: 20px 15px 20px 15px; /* top right bottom left */
            padding: 15px 12px 15px 12px; /* top right bottom left */
            width: calc(100% - 30px);
            min-height: calc(100vh - 40px);
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    `;
  }
}
