import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { OIG_LOGO_CODE } from "@/assets/pdf/oig-logo-code";
import { VI_LOGO_CODE } from "@/assets/vi-logo-code";
import { DEFAULT_LOGO_CODE } from "@/assets/default-logo-code";
import { renderToStaticMarkup } from "react-dom/server";
import { JobSheetPDFStyles } from "./JobSheetPDFStyles";

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
      const jobSheet = jobSheetData || jobSheetData?.job_sheet ;
      const checklistResponses = jobSheet?.checklist_responses || [];
      // Enhanced page break logic for better content distribution
      const estimatedContentHeight = this.estimateContentHeight(
        jobSheet,
        comments
      );
      const maxSinglePageHeight = 270; // A4 usable height accounting for margins and optimal layout
      const maxChecklistItemsPerPage = 12; // Optimized for A4 space with proper spacing

      // Determine if content needs multiple pages
      const needsPageBreak =
        estimatedContentHeight > maxSinglePageHeight ||
        checklistResponses.length > maxChecklistItemsPerPage;

      console.log(`PDF Layout Analysis:`);
      console.log(`- Estimated content height: ${estimatedContentHeight}mm`);
      console.log(`- Checklist items: ${checklistResponses.length}`);
      console.log(`- Max single page height: ${maxSinglePageHeight}mm`);
      console.log(`- Max items per page: ${maxChecklistItemsPerPage}`);
      console.log(`- Requires multi-page: ${needsPageBreak}`);

      if (needsPageBreak) {
        console.log(
          "✓ Using MULTI-PAGE layout for optimal content distribution"
        );
      } else {
        console.log(
          "✓ Using SINGLE-PAGE layout - all content fits comfortably"
        );
      }

      if (needsPageBreak) {
        // Generate multi-page PDF with proper content distribution
        await this.generateSinglePagePDF(taskDetails, jobSheetData, comments);
      } else {
        // Generate single page when content fits
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
    console.log(
      "Generating PDF matching Figma design structure - Single Page Mode"
    );

    // Single Page: All sections as per Figma design
    const pageContent = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getPageStyles()}
        </head>
        <body>
          ${this.generateHeader(jobSheetData)}
          ${this.generateClientInfo(taskDetails, jobSheetData)}
          ${this.generateLocationDetails(jobSheetData)}
          ${this.generateBeforeAfterImagesSection(jobSheetData)}
          ${this.generateDailyMaintenanceSection(jobSheetData)}
          ${this.generateRemarksSection(taskDetails, comments)}
          ${this.generateBottomSection()}
        </body>
      </html>
    `;

    // Render the complete page
    await this.renderPageToPDF(pageContent, taskDetails, true);

    // Save the PDF
    this.pdf.save(
      `JobSheet_${taskDetails.task_details?.id || taskDetails.id || new Date().getTime()}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
  }

  private async generateMultiPagePDF(
    taskDetails: any,
    jobSheetData: any,
    comments: string = ""
  ): Promise<void> {
    console.log(
      "Generating PDF matching Figma design structure - Multi-Page Mode"
    );

    const jobSheet = jobSheetData?.job_sheet;
    const checklistResponses = jobSheet?.checklist_responses || [];

    // Split checklist into manageable pages
    const checklistPerPage = 12; // Optimized for A4 page space
    const checklistPages = [];
    for (let i = 0; i < checklistResponses.length; i += checklistPerPage) {
      checklistPages.push(checklistResponses.slice(i, i + checklistPerPage));
    }

    console.log(
      `Multi-page PDF: ${checklistPages.length} pages for ${checklistResponses.length} checklist items`
    );

    // Page 1: Header, Client Info, Location, Before/After, First Checklist Batch
    const page1ChecklistData = {
      ...jobSheetData,
      job_sheet: {
        ...jobSheet,
        checklist_responses: checklistPages[0] || [],
      },
    };

    const page1Content = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getPageStyles()}
        </head>
        <body>
          ${this.generateHeader(jobSheetData)}
          ${this.generateClientInfo(taskDetails, jobSheetData)}
          ${this.generateLocationDetails(jobSheetData)}
          ${this.generateBeforeAfterImagesSection(jobSheetData)}
          ${this.generateChecklistSectionWithPagination(
            page1ChecklistData,
            1,
            checklistPages.length === 1
          )}
        </body>
      </html>
    `;

    // Render Page 1
    await this.renderPageToPDF(page1Content, taskDetails, true);

    // Additional pages for remaining checklist items
    for (let i = 1; i < checklistPages.length; i++) {
      const pageChecklistData = {
        ...jobSheetData,
        job_sheet: {
          ...jobSheet,
          checklist_responses: checklistPages[i],
        },
      };

      const isLastPage = i === checklistPages.length - 1;
      const pageContent = `
        <!DOCTYPE html>
        <html>
          <head>
            ${this.getPageStyles()}
          </head>
          <body>
            ${this.generateHeader(jobSheetData)}
            <div class="continuation-header">
              SERVICE CHECKLIST (Continued) - Page ${i + 1}
            </div>
            ${this.generateChecklistSectionWithPagination(
              pageChecklistData,
              i + 1,
              isLastPage
            )}
          </body>
        </html>
      `;

      await this.renderPageToPDF(pageContent, taskDetails, false);
    }

    // Final page: Measurements, Remarks, Signature
    const finalPageContent = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getPageStyles()}
        </head>
        <body>
          ${this.generateHeader(jobSheetData)}
          ${this.generateRemarksSection(taskDetails, comments)}
          ${this.generateBottomSection()}
        </body>
      </html>
    `;

    await this.renderPageToPDF(finalPageContent, taskDetails, false);

    // Save the PDF
    this.pdf.save(
      `JobSheet_${taskDetails.task_details?.id || taskDetails.id || new Date().getTime()}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
  }

  private async renderPageToPDF(
    htmlContent: string,
    taskDetails: any,
    isFirstPage: boolean = false
  ): Promise<void> {
    const container = document.createElement("div");
    container.innerHTML = htmlContent;

    // Reduced margins and padding to prevent content being pushed off page
    container.style.cssText =
      "width:100%;max-width:210mm;height:auto;background-color:white;font-family:Arial,sans-serif;transform-origin:top left;transform:scale(1);margin:20px 15px;padding:15px 12px;";

    document.body.appendChild(container);

    try {
      // Wait a moment for fonts and images to load
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: container.offsetWidth,
        height: container.scrollHeight,
        logging: false, // Reduce console noise
        imageTimeout: 5000,
        onclone: (clonedDoc) => {
          // Ensure signature section is visible in cloned document
          const signatureSection =
            clonedDoc.querySelector(".signature-section");
          if (signatureSection) {
            signatureSection.style.cssText +=
              "position: relative !important; visibility: visible !important; display: block !important; opacity: 1 !important; z-index: 9999 !important;";
          }
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.8); // Slightly higher quality
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log(
        `Rendering page: canvas=${canvas.width}x${
          canvas.height
        }px, imgHeight=${imgHeight}mm, pageHeight=${pageHeight}mm, needsSplit=${
          imgHeight > pageHeight
        }`
      );

      // Check if signature section exists in rendered content
      const signatureExists = container.querySelector(".signature-section");
      console.log(`Signature section found in HTML: ${!!signatureExists}`);

      // Add new page if not the first page
      if (!isFirstPage) {
        this.pdf.addPage();
      }

      // Handle content that exceeds page height with better margin handling
      if (imgHeight > pageHeight - 10) {
        // Leave 10mm margin for safety
        console.log("Content exceeds page height, splitting across pages");
        // Split content across multiple pages
        let heightLeft = imgHeight;
        let position = 0;
        let pageCount = 0;

        while (heightLeft > 0) {
          if (pageCount > 0) {
            // Add new page for overflow content
            this.pdf.addPage();
          }

          const currentPageHeight = Math.min(heightLeft, pageHeight - 10);
          this.pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);

          heightLeft -= pageHeight - 10;
          position -= pageHeight - 10;
          pageCount++;
        }
      } else {
        // Content fits on single page - add with small top margin
        console.log("Content fits on single page");
        this.pdf.addImage(imgData, "JPEG", 0, 5, imgWidth, imgHeight); // 5mm top margin
      }
    } finally {
      document.body.removeChild(container);
    }
  }

  private generateHeader(data: any): string {
    const logoHtml = this.getLogoForSite();

    return `
      <div class="header">
        <div class="left-logo">
          ${logoHtml}
        </div>
      </div>
    `;
  }

  private getLogoForSite(): string {
    const hostname = window.location.hostname;

    // Check if it's Oman site
    const isOmanSite = hostname.includes("oig.gophygital.work");
    // Check if it's VI site
    const isViSite = hostname.includes("vi-web.gophygital.work");

    if (isOmanSite) {
      return renderToStaticMarkup(OIG_LOGO_CODE());
    } else if (isViSite) {
      return renderToStaticMarkup(VI_LOGO_CODE());
    } else {
      return renderToStaticMarkup(DEFAULT_LOGO_CODE());
    }
  }

  private generateClientInfo(taskDetails: any, jobSheetData: any): string {
    const jobSheet = jobSheetData?.job_sheet;
    
    // Use only dynamic data - no fallbacks
    const siteName = jobSheet?.task_details?.site?.name || "";
    const assetName = jobSheet?.task_details?.asset?.name || "";
    const assetNo = jobSheet?.task_details?.asset?.code || "";
    const jobCode = jobSheet?.basic_info?.job_card_no || "";
    const modelNo = jobSheet?.task_details?.asset?.category || "";
    const group = jobSheet?.task_details?.asset?.category || "";
    const subGroup = jobSheet?.task_details?.asset?.category || "";
    const serialNumber = jobSheet?.basic_info?.job_id || "";

    // Format time data from jobSheet - use actual API structure
    const checkInTime = jobSheet?.summary?.time_tracking?.start_time || "";
    const checkOutTime = jobSheet?.summary?.time_tracking?.end_time || "";
    
    // Calculate duration from API data
    const durationHours = jobSheet?.summary?.time_tracking?.duration_hours || 0;
    const durationMinutes = jobSheet?.summary?.time_tracking?.duration_minutes || 0;
    const duration = (durationHours > 0 || durationMinutes > 0) 
      ? `${Math.floor(durationHours)}:${String(Math.floor(durationMinutes % 60)).padStart(2, "0")}:00`
      : "";

    const assignee = jobSheet?.personnel?.performed_by?.full_name || "";
    const completedBy = jobSheet?.personnel?.performed_by?.full_name || "";
    const verifiedBy = jobSheet?.personnel?.verified_by?.full_name || "";
    const schedule = jobSheet?.basic_info?.scheduled_date || "";
    const verifiedOn = jobSheet?.basic_info?.completed_date || "";
    
    // Only use actual status data
    const status = jobSheet?.summary?.is_overdue && jobSheet?.task_details?.task_status
      ? "Completed After Overdue"
      : jobSheet?.task_details?.task_status || "";

    return `
      <div class="figma-client-info">
        <table class="figma-info-table">
          <tbody>
            <tr>
              <td class="figma-label-cell">Site Name:</td>
              <td class="figma-value-cell">${siteName}</td>
              <td class="figma-label-cell">Job Code:</td>
              <td class="figma-value-cell">${jobCode}</td>
            </tr>
            <tr>
              <td class="figma-label-cell">Asset Name:</td>
              <td class="figma-value-cell">${assetName}</td>
              <td class="figma-label-cell">Asset No.:</td>
              <td class="figma-value-cell">${assetNo}</td>
            </tr>
            <tr>
              <td class="figma-label-cell">Group:</td>
              <td class="figma-value-cell">${group}</td>
              <td class="figma-label-cell">Sr. No.:</td>
              <td class="figma-value-cell">${serialNumber}</td>
            </tr>
            <tr>
              <td class="figma-label-cell">Check In:</td>
              <td class="figma-value-cell">${checkInTime}</td>
              <td class="figma-label-cell">Sub Group:</td>
              <td class="figma-value-cell">${subGroup}</td>
            </tr>
            <tr>
              <td class="figma-label-cell">Assignee:</td>
              <td class="figma-value-cell">${assignee}</td>
              <td class="figma-label-cell">Check Out:</td>
              <td class="figma-value-cell">${checkOutTime}</td>
            </tr>
            <tr>
              <td class="figma-label-cell">Verified By:</td>
              <td class="figma-value-cell">${verifiedBy}</td>
              <td class="figma-label-cell">Completed By:</td>
              <td class="figma-value-cell">${completedBy}</td>
            </tr>
            <tr>
              <td class="figma-label-cell">Verified On:</td>  
              <td class="figma-value-cell">${verifiedOn}</td>
              <td class="figma-label-cell">Duration:</td>
              <td class="figma-value-cell">${duration}</td>
            </tr>
            <tr>
              <td class="figma-label-cell">Schedule:</td>
              <td class="figma-value-cell">${schedule}</td>
              <td class="figma-label-cell">Status:</td>
              <td class="figma-value-cell figma-status-overdue">${status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  private generateDailyMaintenanceSection(jobSheetData: any): string {
    const jobSheet = jobSheetData?.job_sheet;
    const checklistResponses = jobSheet?.checklist_responses || [];
    const taskName = jobSheet?.task_details?.task_name || "";

    // Handle both empty checklist and checklist with no responses
    if (checklistResponses.length === 0) {
      return `
        <div class="figma-maintenance-section">
          <div class="figma-maintenance-header">SERVICE CHECKLIST OF ${(jobSheet?.task_details?.asset?.category || "").toUpperCase()}</div>
          <div class="figma-maintenance-subheader">No checklist items available</div>
        </div>
      `;
    }

    // Check if any checklist items have actual responses
    const hasAnyResponses = checklistResponses.some(item => 
      item.input_value !== null && item.input_value !== undefined && item.input_value !== ""
    );

    // Limit items for single page view (can be expanded in multi-page)
    const displayItems = checklistResponses.slice(0, 8); // Optimized for space

    const generateTableRows = (items: any[]) => {
      return items
        .map((item: any, index: number) => {
          const slNo = item.index || (index + 1);
          const inspectionPoint = item.activity || "";
          
          // Handle null/empty input values properly
          const inputValue = item.input_value;
          const result = inputValue !== null && inputValue !== undefined && inputValue !== "" 
            ? inputValue 
            : (hasAnyResponses ? "" : "Not Completed");
          
          const remarks = item.comments || "";

          return `
          <tr class="figma-checklist-row">
            <td class="figma-sl-cell">${slNo}</td>
            <td class="figma-inspection-cell">${inspectionPoint}</td>
            <td class="figma-result-cell">${result}</td>
            <td class="figma-remarks-cell">${remarks}</td>
          </tr>
        `;
        })
        .join("");
    };

    const sectionTitle = taskName || `SERVICE CHECKLIST OF ${(jobSheet?.task_details?.asset?.category || "").toUpperCase()}`;

    return `
      <div class="figma-checklist-section">
        <div class="figma-checklist-header">${sectionTitle.toUpperCase()}</div>
        <table class="figma-checklist-table">
          <thead>
            <tr class="figma-table-header-row">
              <th class="figma-sl-header">SL<br>NO</th>
              <th class="figma-inspection-header">INSPECTION POINT</th>
              <th class="figma-result-header">RESULT</th>
              <th class="figma-remarks-header">REMARKS</th>
            </tr>
          </thead>
          <tbody>
            ${generateTableRows(displayItems)}
          </tbody>
        </table>
        
        <div class="figma-measurement-section">
          ${!hasAnyResponses ? '<div class="figma-status-note">Task checklist is pending completion</div>' : ''}
        </div>
      </div>
    `;
  }





  private generateChecklistSectionWithPagination(
    jobSheetData: any,
    pageNumber: number = 1,
    isLastPage: boolean = true
  ): string {
    const jobSheet = jobSheetData?.job_sheet;
    const checklistResponses = jobSheet?.checklist_responses || [];
    const assetCategory = jobSheet?.task_details?.asset?.category || "";

    if (checklistResponses.length === 0) {
      return `
        <div class="checklist-section avoid-page-break">
          <h3>SERVICE CHECKLIST OF ${assetCategory.toUpperCase()}</h3>
          <p>No checklist items available</p>
        </div>
      `;
    }

    // Check if any checklist items have actual responses
    const hasAnyResponses = checklistResponses.some(item => 
      item.input_value !== null && item.input_value !== undefined && item.input_value !== ""
    );

    const checklistHtml = checklistResponses
      .map((item: any, index: number) => {
        const serialNumber = item.index || (pageNumber - 1) * 10 + index + 1;
        const activity = item.activity || "";
        
        // Handle null/empty input values properly
        const inputValue = item.input_value;
        const result = inputValue !== null && inputValue !== undefined && inputValue !== "" 
          ? inputValue 
          : (hasAnyResponses ? "" : "Not Completed");
        
        const comments = item.comments || "";

        return `
          <tr class="avoid-page-break">
            <td class="sl-no">${serialNumber}</td>
            <td class="inspection-point">${activity}</td>
            <td class="result-cell">${result}</td>
            <td class="remarks">${comments}</td>
          </tr>
        `;
      })
      .join("");

    const sectionTitle =
      pageNumber === 1
        ? `SERVICE CHECKLIST OF ${assetCategory.toUpperCase()}`
        : `SERVICE CHECKLIST OF ${assetCategory.toUpperCase()} (Continued)`;

    return `
      <div class="checklist-section ${isLastPage ? "" : "avoid-page-break"}">
        <h3>${sectionTitle}</h3>
        <table class="checklist-table">
          <thead>
            <tr>
              <th class="sl-header">SL<br>NO</th>
              <th class="inspection-header">INSPECTION POINT</th>
              <th class="result-header">RESULT</th>
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

  private generateBeforeAfterImagesSection(jobSheetData: any): string {
    const jobSheet = jobSheetData?.job_sheet;

    // Use only actual image data - handle null values properly
    const beforeImageUrl = jobSheet?.basic_info?.bef_sub_attachment && jobSheet?.basic_info?.bef_sub_attachment !== null 
      ? jobSheet?.basic_info?.bef_sub_attachment 
      : jobSheet?.images?.before_image;
    const afterImageUrl = jobSheet?.basic_info?.aft_sub_attachment && jobSheet?.basic_info?.aft_sub_attachment !== null
      ? jobSheet?.basic_info?.aft_sub_attachment 
      : jobSheet?.images?.after_image;
    
    // Get actual timestamps from data - handle the API date format
    const beforeTimestamp = jobSheet?.basic_info?.bef_sub_date || jobSheet?.basic_info?.created_date || "";
    const afterTimestamp = jobSheet?.basic_info?.aft_sub_date || jobSheet?.basic_info?.completed_date || "";
    
    // Format timestamps if available - handle API format "09/09/2025, 09:04 AM"
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      try {
        // Check if it's already in the desired format (contains comma and AM/PM)
        if (dateStr.includes(',') && (dateStr.includes('AM') || dateStr.includes('PM'))) {
          return dateStr; // Return as-is since it's already formatted
        }
        // Otherwise try to parse and format
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      } catch {
        return dateStr; // Return original if parsing fails
      }
    };

    const beforeDate = formatDate(beforeTimestamp);
    const afterDate = formatDate(afterTimestamp);

    return `
      <div class="figma-images-section">
        <div class="figma-images-header">Pre-Post Inspection Info</div>
        <table class="figma-images-table">
          <thead>
            <tr>
              <th class="figma-image-header-cell">BEFORE</th>
              <th class="figma-image-header-cell">AFTER</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="figma-image-cell">
                <div class="figma-image-container">
                  ${beforeImageUrl ? 
                    `<img src="${beforeImageUrl}" 
                         alt="Before Maintenance" 
                         class="figma-maintenance-image" />` :
                    '<div class="figma-no-image">No image available</div>'
                  }
                  ${beforeDate ? `<div class="figma-image-timestamp">${beforeDate}</div>` : ''}
                </div>
              </td>
              <td class="figma-image-cell">
                <div class="figma-image-container">
                  ${afterImageUrl ? 
                    `<img src="${afterImageUrl}" 
                         alt="After Maintenance" 
                         class="figma-maintenance-image" />` :
                    '<div class="figma-no-image">No image available</div>'
                  }
                  ${afterDate ? `<div class="figma-image-timestamp">${afterDate}</div>` : ''}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }



  private generateRemarksSection(taskDetails: any, comments: string): string {
    const remarksText = comments || taskDetails?.task_details?.task_comments || "";

    return `
      <div class="figma-remarks-section">
        <div class="figma-remarks-label">Remarks:</div>
        <div class="figma-remarks-box">
          ${remarksText}
        </div>
      </div>
    `;
  }

  private generateImageMetadata(
    beforeUrl: string,
    afterUrl: string,
    assetName: string
  ): string {
    const timestamp = new Date().toISOString();
    const sessionId = Math.random().toString(36).substring(2, 15);

    return `
      <!-- Image Metadata (Hidden) -->
      <div class="image-metadata" style="display: none;">
        Generated: ${timestamp}
        Session: ${sessionId}
        Asset: ${assetName}
        Before Image: ${beforeUrl}
        After Image: ${afterUrl}
        Generator: JobSheetPDFGenerator v2.0
      </div>
    `;
  }

  private getPageStyles(): string {
    return JobSheetPDFStyles.getPageStyles();
  }

  private generateBottomSection(): string {
    return `
      <div class="bottom-section">
        <div class="system-note">
          <p><em>This is a system generated report and does not require any signature.</em></p>
        </div>
        
        <div class="powered-by">
          <p>Powered By <strong>FMMatrix</strong></p>
        </div>
      </div>
    `;
  }

  private estimateContentHeight(jobSheet: any, comments: string = ""): number {
    const headerHeight = 30; // Header with logo
    const clientInfoHeight = 80; // Client info table (8 rows)
    const locationHeight = 25; // Location stepper section
    const beforeAfterHeight = 70; // Before/after images section with table
    const measurementHeight = 45; // Three measurement tables
    const remarksHeight = comments ? 35 : 20; // Remarks section (dynamic based on content)
    const signatureHeight = 60; // Signature section with two columns
    const bottomHeight = 25; // System note + branding

    // Dynamic checklist height calculation - more accurate
    const checklistItems = jobSheet?.checklist_responses?.length || 8;
    const checklistHeaderHeight = 15; // Section title
    const checklistTableHeaderHeight = 12; // Table header
    const checklistRowHeight = 10; // Per row height
    const checklistHeight =
      checklistHeaderHeight +
      checklistTableHeaderHeight +
      checklistItems * checklistRowHeight;

    const totalHeight =
      headerHeight +
      clientInfoHeight +
      locationHeight +
      beforeAfterHeight +
      checklistHeight +
      measurementHeight +
      remarksHeight +
      signatureHeight +
      bottomHeight;

    console.log(`📏 Content Height Estimation:`);
    console.log(`   - Header: ${headerHeight}mm`);
    console.log(`   - Client Info: ${clientInfoHeight}mm`);
    console.log(`   - Location: ${locationHeight}mm`);
    console.log(`   - Before/After: ${beforeAfterHeight}mm`);
    console.log(
      `   - Checklist (${checklistItems} items): ${checklistHeight}mm`
    );
    console.log(`   - Measurements: ${measurementHeight}mm`);
    console.log(`   - Remarks: ${remarksHeight}mm`);
    console.log(`   - Signature: ${signatureHeight}mm`);
    console.log(`   - Bottom: ${bottomHeight}mm`);
    console.log(`   - TOTAL: ${totalHeight}mm`);

    return totalHeight;
  }



  private generateLocationDetails(jobSheetData?: any): string {
    const jobSheet = jobSheetData?.job_sheet;
    const location = jobSheet?.task_details?.asset?.location || {};

    // Extract location data - use only actual values, handle null properly
    const siteValue = location.site && location.site !== "NA" && location.site !== null ? location.site : "";
    const buildingValue = location.building && location.building !== "NA" && location.building !== null ? location.building : "";
    const wingValue = location.wing && location.wing !== "NA" && location.wing !== null ? location.wing : "";
    const floorValue = location.floor && location.floor !== "NA" && location.floor !== null ? location.floor : "";
    const areaValue = location.area && location.area !== "NA" && location.area !== null ? location.area : "";
    const roomValue = location.room && location.room !== "NA" && location.room !== null ? location.room : "";

    return `
      <div class="figma-location-section">
        <div class="figma-location-header">Location Details</div>
        <div class="figma-location-stepper">
          <div class="figma-stepper-line"></div>
          <div class="figma-location-steps">
            <div class="figma-location-step">
              <div class="figma-step-label">Site</div>
              <div class="figma-step-dot"></div>
              <div class="figma-step-value">${siteValue}</div>
            </div>
            <div class="figma-location-step">
              <div class="figma-step-label">Building</div>
              <div class="figma-step-dot"></div>
              <div class="figma-step-value">${buildingValue}</div>
            </div>
            <div class="figma-location-step">
              <div class="figma-step-label">Wing</div>
              <div class="figma-step-dot"></div>
              <div class="figma-step-value">${wingValue}</div>
            </div>
            <div class="figma-location-step">
              <div class="figma-step-label">Floor</div>
              <div class="figma-step-dot"></div>
              <div class="figma-step-value">${floorValue}</div>
            </div>
            <div class="figma-location-step">
              <div class="figma-step-label">Area</div>
              <div class="figma-step-dot"></div>
              <div class="figma-step-value">${areaValue}</div>
            </div>
            <div class="figma-location-step">
              <div class="figma-step-label">Room</div>
              <div class="figma-step-dot"></div>
              <div class="figma-step-value">${roomValue}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
