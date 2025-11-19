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
      // Properly extract job_sheet from the API response
      const jobSheet =
        jobSheetData?.data?.job_sheet ||
        jobSheetData?.job_sheet ||
        jobSheetData;
      const checklistResponses = jobSheet?.checklist_responses || [];

      // Debug: Log the data structure

      // Enhanced page break logic for better content distribution
      const estimatedContentHeight = this.estimateContentHeight(
        jobSheet,
        comments
      );
      const maxSinglePageHeight = 280; // A4 usable height accounting for margins and optimal layout
      const maxChecklistItemsPerPage = 20; // Increased to fit more items on single page

      // Determine if content needs multiple pages - more conservative approach
      const needsPageBreak =
        estimatedContentHeight > maxSinglePageHeight ||
        checklistResponses.length > maxChecklistItemsPerPage;

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

  /**
   * Generate Job Sheet PDF and return as Blob (for mobile webview compatibility)
   * @param taskDetails Task details object
   * @param jobSheetData Job sheet data object
   * @param comments Additional comments
   * @returns Promise<Blob> PDF as Blob
   */
  async generateJobSheetPDFBlob(
    taskDetails: any,
    jobSheetData: any,
    comments: string = ""
  ): Promise<Blob> {
    try {
      // Properly extract job_sheet from the API response
      const jobSheet =
        jobSheetData?.data?.job_sheet ||
        jobSheetData?.job_sheet ||
        jobSheetData;
      const checklistResponses = jobSheet?.checklist_responses || [];

      // Enhanced page break logic for better content distribution
      const estimatedContentHeight = this.estimateContentHeight(
        jobSheet,
        comments
      );
      const maxSinglePageHeight = 280;
      const maxChecklistItemsPerPage = 20;

      const needsPageBreak =
        estimatedContentHeight > maxSinglePageHeight ||
        checklistResponses.length > maxChecklistItemsPerPage;

      if (needsPageBreak) {
        await this.generateSinglePagePDF(taskDetails, jobSheetData, comments);
      } else {
        await this.generateSinglePagePDF(taskDetails, jobSheetData, comments);
      }

      // Return PDF as Blob instead of saving
      const blob = this.pdf.output("blob");
      return blob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
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

    // Check if before/after section should be shown
    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;
    const shouldShowBeforeAfter =
      jobSheet?.basic_info?.before_after_enabled === true ||
      jobSheet?.basic_info?.before_after_enabled === "true" ||
      jobSheet?.basic_info?.steps === 3;

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
          ${
            shouldShowBeforeAfter
              ? this.generateBeforeAfterImagesSection(jobSheetData)
              : ""
          }
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
      `JobSheet_${
        taskDetails.task_details?.id || taskDetails.id || new Date().getTime()
      }_${new Date().toISOString().slice(0, 10)}.pdf`
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

    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;
    const checklistResponses = jobSheet?.checklist_responses || [];

    // Check if before/after section should be shown
    const shouldShowBeforeAfter =
      jobSheet?.basic_info?.before_after_enabled === true ||
      jobSheet?.basic_info?.before_after_enabled === "true" ||
      jobSheet?.basic_info?.steps === 3;

    // Split checklist into manageable pages - increased for better utilization
    const checklistPerPage = 18; // Optimized for A4 page space with better density
    const checklistPages = [];
    for (let i = 0; i < checklistResponses.length; i += checklistPerPage) {
      checklistPages.push(checklistResponses.slice(i, i + checklistPerPage));
    }

    console.log(
      `Multi-page PDF: ${checklistPages.length} pages for ${checklistResponses.length} checklist items`
    );

    // Page 1: Header, Client Info, Location, Before/After (conditional), First Checklist Batch
    const page1ChecklistData = {
      ...jobSheetData,
      data: {
        job_sheet: {
          ...jobSheet,
          checklist_responses: checklistPages[0] || [],
        },
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
          ${
            shouldShowBeforeAfter
              ? this.generateBeforeAfterImagesSection(jobSheetData)
              : ""
          }
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
        data: {
          job_sheet: {
            ...jobSheet,
            checklist_responses: checklistPages[i],
          },
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
            ${
              isLastPage
                ? this.generateRemarksSection(taskDetails, comments)
                : ""
            }
            ${isLastPage ? this.generateBottomSection() : ""}
          </body>
        </html>
      `;

      await this.renderPageToPDF(pageContent, taskDetails, false);
    }

    // Final page is now included in the last checklist page, so no separate final page needed

    // Save the PDF
    this.pdf.save(
      `JobSheet_${
        taskDetails.task_details?.id || taskDetails.id || new Date().getTime()
      }_${new Date().toISOString().slice(0, 10)}.pdf`
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
      // Convert all images to base64 to avoid CORS issues
      const images = container.querySelectorAll('img');
      console.log(`Converting ${images.length} images to base64 to bypass CORS`);
      
      const imageConversionPromises = Array.from(images).map(async (img: any) => {
        const originalSrc = img.src;
        if (!originalSrc || originalSrc.startsWith('data:')) {
          console.log(`Skipping already converted or invalid image: ${originalSrc}`);
          return;
        }

        try {
          console.log(`Converting image to base64: ${originalSrc}`);
          const base64 = await this.imageToBase64(originalSrc);
          img.src = base64;
          console.log(`✓ Successfully converted image to base64`);
        } catch (error) {
          console.error(`Failed to convert image to base64: ${originalSrc}`, error);
          // Use a transparent 1x1 pixel placeholder to avoid CORS tainting
          img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
          img.alt = 'Image failed to load due to CORS';
          console.log(`Replaced failed image with placeholder`);
        }
      });
      
      await Promise.all(imageConversionPromises);
      console.log('All images converted to base64, starting canvas rendering');

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: false, // Disabled since we're using base64 images
        allowTaint: true, // Allow since we've converted images to base64
        backgroundColor: "#ffffff",
        width: container.offsetWidth,
        height: container.scrollHeight,
        logging: true,
        imageTimeout: 0, // No timeout needed for base64 images
        onclone: (clonedDoc) => {
          // Ensure signature section is visible in cloned document
          const signatureSection =
            clonedDoc.querySelector(".signature-section");
          if (signatureSection) {
            signatureSection.style.cssText +=
              "position: relative !important; visibility: visible !important; display: block !important; opacity: 1 !important; z-index: 9999 !important;";
          }
          
          // Ensure all images are properly displayed
          const images = clonedDoc.querySelectorAll('img');
          images.forEach((img: any) => {
            img.style.cssText += "display: block !important; opacity: 1 !important; max-width: 100% !important; height: auto !important;";
          });
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
    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;

    // Enhanced data mapping from new API structure
    const siteName = jobSheet?.task_details?.site?.name || "";
    const assetName = jobSheet?.task_details?.asset?.name || "";
    const assetCode = jobSheet?.task_details?.asset?.code || "";
    const jobCode = jobSheet?.basic_info?.job_card_no || "";
    const group = jobSheet?.task_details?.asset?.category || "";
    const serialNumber = jobSheet?.basic_info?.job_id || "";

    // Get sub group from group_scores if available
    const subGroup = jobSheet?.group_scores?.[0]?.sub_group_name || group;

    // Format time data - handle null values properly
    const checkInTime = jobSheet?.summary?.time_tracking?.start_time || "";
    const checkOutTime = jobSheet?.summary?.time_tracking?.end_time || "";

    // Personnel information
    const assignee =
      jobSheet?.personnel?.performed_by?.full_name ||
      jobSheet?.basic_info?.backup_assigned_user ||
      "";
    const completedBy = jobSheet?.personnel?.performed_by?.full_name || "";
    const verifiedBy = ""; // Not available in current API structure
    const schedule = jobSheet?.basic_info?.scheduled_date || "";
    const completedDate = jobSheet?.basic_info?.completed_date || "";

    // Calculate duration if time tracking is available
    const duration = jobSheet?.summary?.time_tracking
      ? `${jobSheet.summary.time_tracking.duration_hours || 0}:${String(
          jobSheet.summary.time_tracking.duration_minutes || 0
        ).padStart(2, "0")}:00`
      : "";

    // Enhanced status with overdue indicator
    const baseStatus =
      jobSheet?.task_details?.task_status ||
      jobSheet?.summary?.task_completion_status ||
      "";
    const status = jobSheet?.summary?.is_overdue
      ? baseStatus === "Completed"
        ? "Completed After Overdue"
        : baseStatus
      : baseStatus;

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
              <td class="figma-value-cell">${assetCode}</td>
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
              <td class="figma-value-cell">${completedDate}</td>
              <td class="figma-label-cell">Duration:</td>
              <td class="figma-value-cell">${duration}</td>
            </tr>
            <tr>
              <td class="figma-label-cell">Schedule:</td>
              <td class="figma-value-cell">${schedule}</td>
              <td class="figma-label-cell">Status:</td>
              <td class="figma-value-cell ${
                jobSheet?.summary?.is_overdue ? "figma-status-overdue" : ""
              }">${status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  private generateDailyMaintenanceSection(jobSheetData: any): string {
    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;
    const checklistResponses = jobSheet?.checklist_responses || [];
    const taskName = jobSheet?.task_details?.task_name || "";

    // Handle both empty checklist and checklist with no responses
    if (checklistResponses.length === 0) {
      return `
        <div class="figma-maintenance-section">
          <div class="figma-maintenance-header">NEW ACTIVITY</div>
          <div class="figma-maintenance-subheader">No checklist items available</div>
        </div>
      `;
    }

    // Check if any checklist items have actual responses
    const hasAnyResponses = checklistResponses.some(
      (item) =>
        item.input_value !== null &&
        item.input_value !== undefined &&
        item.input_value !== ""
    );

    // Group checklist items by group_id and sub_group_id
    const grouped: { [key: string]: any[] } = {};
    
    checklistResponses.forEach((item: any) => {
      const groupId = item.group_id || 'ungrouped';
      const subGroupId = item.sub_group_id || 'ungrouped';
      const key = `${groupId}_${subGroupId}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push(item);
    });

    // Convert to array of sections
    const sections = Object.keys(grouped).map(key => ({
      sectionKey: key,
      group_name: grouped[key][0]?.group_name || 'Ungrouped',
      sub_group_name: grouped[key][0]?.sub_group_name || '',
      activities: grouped[key]
    }));

    console.log(`📊 PDF Grouping: ${sections.length} sections from ${checklistResponses.length} items`);

    // Enhanced section title - use task name or fallback to asset category
    const assetCategory = jobSheet?.task_details?.asset?.category || "";
    const mainTitle = taskName
      ? taskName.toUpperCase()
      : assetCategory
      ? `SERVICE CHECKLIST OF ${assetCategory.toUpperCase()}`
      : "NEW ACTIVITY";

    // Generate HTML for each section with proper table structure
    const sectionsHtml = sections.map((section, sectionIndex) => {
      const sectionTitle = section.group_name;
      const sectionSubtitle = section.sub_group_name;
      
      // Generate rows for this section with proper indexing
      const sectionRows = section.activities.map((item: any, index: number) => {
        const slNo = item.index || index + 1;
        const inspectionPoint = item.activity || item.label || "";

        // Enhanced result handling - support both input_value and userData fields
        const inputValue = item.input_value || (Array.isArray(item.userData) ? item.userData[0] : item.userData);
        const result =
          inputValue !== null && inputValue !== undefined && inputValue !== ""
            ? inputValue
            : hasAnyResponses
            ? ""
            : "Not Completed";

        // Support both comments and comment fields
        const remarks = item.comments || item.comment || "";

        // Handle attachments - generate HTML for image thumbnails
        const hasAttachments =
          item.attachments &&
          Array.isArray(item.attachments) &&
          item.attachments.length > 0;

        let attachmentDisplay = "-";
        if (hasAttachments) {
          const attachmentImages = item.attachments
            .map((attachment: any, idx: number) => {
              const attachmentUrl = typeof attachment === "string" ? attachment : attachment.url || attachment.file_url || "";
              return `<img 
                src="${attachmentUrl}" 
                alt="Attachment ${idx + 1}" 
                crossorigin="anonymous"
                style="width: 35px; height: 35px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; margin: 2px; display: inline-block;"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';"
              /><span style="display:none; font-size: 18px; color: #999; margin: 2px;">📎</span>`;
            })
            .join("");

          attachmentDisplay = `<div style="display: flex; flex-wrap: wrap; gap: 2px; align-items: center; justify-content: center;">${attachmentImages}</div>`;
        }

        return `
          <tr class="figma-checklist-row">
            <td class="figma-sl-cell">${slNo}</td>
            <td class="figma-inspection-cell">${inspectionPoint}</td>
            <td class="figma-result-cell">${result}</td>
            <td class="figma-remarks-cell">${remarks}</td>
            <td class="figma-attachment-cell">${attachmentDisplay}</td>
          </tr>
        `;
      }).join('');
      
      return `
        <div class="figma-section-wrapper" style="margin-bottom: 20px; page-break-inside: avoid;">
          <!-- Section Header -->
          <div class="figma-section-header" style="background: linear-gradient(to right, #f3f4f6, #f9fafb); padding: 12px 16px; border-radius: 8px; border-left: 4px solid #C72030; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0 0 4px 0;">
                  ${sectionTitle}
                </h4>
                ${sectionSubtitle ? `
                  <p style="font-size: 12px; color: #6b7280; margin: 0;">
                    ${sectionSubtitle}
                  </p>
                ` : ''}
              </div>
              <div style="background: rgba(196,184,157,0.33); color: #000; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                Section ${sectionIndex + 1}
              </div>
            </div>
          </div>
          
          <!-- Section Table -->
          <table class="figma-checklist-table" style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
            <thead>
              <tr class="figma-table-header-row">
                <th class="figma-sl-header">SL<br>NO</th>
                <th class="figma-inspection-header">INSPECTION POINT</th>
                <th class="figma-result-header">RESULT</th>
                <th class="figma-remarks-header">REMARKS</th>
                <th class="figma-attachment-header">ATTACHMENTS</th>
              </tr>
            </thead>
            <tbody>
              ${sectionRows}
            </tbody>
          </table>
        </div>
      `;
    }).join('');

    return `
      <div class="figma-checklist-section">
        <div class="figma-checklist-header">${mainTitle}</div>
        ${sectionsHtml}
        
        <div class="figma-measurement-section">
          ${
            !hasAnyResponses
              ? `<div class="figma-status-note">Task checklist is pending completion (${checklistResponses.length} items)</div>`
              : `<div class="figma-status-note">Showing all ${checklistResponses.length} checklist items in ${sections.length} section(s)</div>`
          }
          ${
            jobSheet?.metadata
              ? `<div class="figma-status-note">Completion: ${
                  jobSheet.metadata.completed_items
                }/${
                  jobSheet.metadata.total_checklist_items
                } items (${jobSheet.metadata.completion_percentage.toFixed(
                  1
                )}%)</div>`
              : ""
          }
        </div>
      </div>
    `;
  }

  private generateChecklistSectionWithPagination(
    jobSheetData: any,
    pageNumber: number = 1,
    isLastPage: boolean = true
  ): string {
    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;
    const checklistResponses = jobSheet?.checklist_responses || [];
    const assetCategory = jobSheet?.task_details?.asset?.category || "";
    const taskName = jobSheet?.task_details?.task_name || "";

    if (checklistResponses.length === 0) {
      return `
        <div class="checklist-section avoid-page-break">
          <h3>SERVICE CHECKLIST${
            taskName
              ? ` - ${taskName.toUpperCase()}`
              : assetCategory
              ? ` OF ${assetCategory.toUpperCase()}`
              : ""
          }</h3>
          <p>No checklist items available</p>
        </div>
      `;
    }

    // Check if any checklist items have actual responses
    const hasAnyResponses = checklistResponses.some(
      (item) =>
        item.input_value !== null &&
        item.input_value !== undefined &&
        item.input_value !== ""
    );

    // Group checklist items by group_id and sub_group_id
    const grouped: { [key: string]: any[] } = {};
    
    checklistResponses.forEach((item: any) => {
      const groupId = item.group_id || 'ungrouped';
      const subGroupId = item.sub_group_id || 'ungrouped';
      const key = `${groupId}_${subGroupId}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push(item);
    });

    // Convert to array of sections
    const sections = Object.keys(grouped).map(key => ({
      sectionKey: key,
      group_name: grouped[key][0]?.group_name || 'Ungrouped',
      sub_group_name: grouped[key][0]?.sub_group_name || '',
      activities: grouped[key]
    }));

    const checklistHtml = sections.map((section, sectionIndex) => {
      const sectionTitle = section.group_name;
      const sectionSubtitle = section.sub_group_name;
      
      const sectionRows = section.activities
        .map((item: any, index: number) => {
          const serialNumber = item.index || (pageNumber - 1) * 10 + index + 1;
          const activity = item.activity || item.label || "";

          // Handle null/empty input values properly - support both input_value and userData
          const inputValue = item.input_value || (Array.isArray(item.userData) ? item.userData[0] : item.userData);
          const result =
            inputValue !== null && inputValue !== undefined && inputValue !== ""
              ? inputValue
              : hasAnyResponses
              ? ""
              : "Not Completed";

          // Support both comments and comment fields
          const comments = item.comments || item.comment || "";

          // Handle attachments with image thumbnails (same as main section)
          const hasAttachments =
            item.attachments &&
            Array.isArray(item.attachments) &&
            item.attachments.length > 0;

          let attachmentDisplay = "-";
          if (hasAttachments) {
            // Generate image thumbnails for attachments
            const attachmentImages = item.attachments
              .map((attachment: any, attachIdx: number) => {
                const attachmentUrl =
                  typeof attachment === "string"
                    ? attachment
                    : attachment.url || attachment.file_url || "";
                const attachmentName =
                  typeof attachment === "string"
                    ? `Attachment ${attachIdx + 1}`
                    : attachment.filename ||
                      attachment.name ||
                      `Attachment ${attachIdx + 1}`;

                return `<img 
              src="${attachmentUrl}" 
              alt="${attachmentName}"
              crossorigin="anonymous"
              style="width: 35px; height: 35px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; margin: 2px; display: inline-block;"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';"
            /><span style="display:none; font-size: 18px; color: #999; margin: 2px;">📎</span>`;
              })
              .join("");

            attachmentDisplay = `<div style="display: flex; flex-wrap: wrap; gap: 2px; align-items: center; justify-content: center;">${attachmentImages}</div>`;
          }

          return `
          <tr class="avoid-page-break">
            <td class="sl-no">${serialNumber}</td>
            <td class="inspection-point">${activity}</td>
            <td class="result-cell">${result}</td>
            <td class="remarks">${comments}</td>
            <td class="attachment-cell">${attachmentDisplay}</td>
          </tr>
        `;
        })
        .join("");

      return `
        <div class="section-wrapper" style="margin-bottom: 15px; page-break-inside: avoid;">
          <div class="section-header" style="background: linear-gradient(to right, #f3f4f6, #f9fafb); padding: 8px 12px; border-radius: 6px; border-left: 3px solid #C72030; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-size: 12px; font-weight: 600; color: #1f2937; margin: 0 0 2px 0;">
                  ${sectionTitle}
                </h4>
                ${sectionSubtitle ? `
                  <p style="font-size: 10px; color: #6b7280; margin: 0;">
                    ${sectionSubtitle}
                  </p>
                ` : ''}
              </div>
              <div style="background: rgba(196,184,157,0.33); color: #000; padding: 2px 8px; border-radius: 3px; font-size: 9px; font-weight: 500;">
                Section ${sectionIndex + 1}
              </div>
            </div>
          </div>
          <table class="checklist-table" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead>
              <tr>
                <th class="sl-header">SL<br>NO</th>
                <th class="inspection-header">INSPECTION POINT</th>
                <th class="result-header">RESULT</th>
                <th class="remarks-header">REMARKS</th>
                <th class="attachment-header">ATTACHMENTS</th>
              </tr>
            </thead>
            <tbody>
              ${sectionRows}
            </tbody>
          </table>
        </div>
      `;
    }).join("");

    const pageTitle = taskName
      ? pageNumber === 1
        ? taskName.toUpperCase()
        : `${taskName.toUpperCase()} (Continued)`
      : pageNumber === 1
      ? `SERVICE CHECKLIST${
          assetCategory ? ` OF ${assetCategory.toUpperCase()}` : ""
        }`
      : `SERVICE CHECKLIST${
          assetCategory ? ` OF ${assetCategory.toUpperCase()}` : ""
        } (Continued)`;

    return `
      <div class="checklist-section ${isLastPage ? "" : "avoid-page-break"}">
        <h3>${pageTitle}</h3>
        ${checklistHtml}
      </div>
    `;
  }

  private generateLocationDetails(jobSheetData: any): string {
    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;
    const location = jobSheet?.task_details?.asset?.location;

    // Debug location data
    console.log("🗺️ Location Data Debug:", {
      hasJobSheet: !!jobSheet,
      hasTaskDetails: !!jobSheet?.task_details,
      hasAsset: !!jobSheet?.task_details?.asset,
      hasLocation: !!location,
      locationData: location,
    });

    if (!location) {
      return `
        <div class="figma-location-section">
          <div class="figma-location-header">Location Details</div>
          <div class="figma-location-content">No location information available</div>
        </div>
      `;
    }

    // Extract and clean location data - handle null/undefined values
    const siteValue =
      location.site && location.site !== "null" && location.site !== null
        ? location.site
        : "•";
    const buildingValue =
      location.building &&
      location.building !== "null" &&
      location.building !== null
        ? location.building
        : "•";
    const wingValue =
      location.wing && location.wing !== "null" && location.wing !== null
        ? location.wing
        : "•";
    const floorValue =
      location.floor && location.floor !== "null" && location.floor !== null
        ? location.floor
        : "•";
    const areaValue =
      location.area && location.area !== "null" && location.area !== null
        ? location.area
        : "•";
    const roomValue =
      location.room && location.room !== "null" && location.room !== null
        ? location.room
        : "•";

    return `
      <div class="figma-location-section">
        <div class="figma-location-header">Location Details</div>
        <table class="figma-location-table">
          <thead>
            <tr>
              <th class="figma-location-th">Site</th>
              <th class="figma-location-th">Building</th>
              <th class="figma-location-th">Wing</th>
              <th class="figma-location-th">Floor</th>
              <th class="figma-location-th">Area</th>
              <th class="figma-location-th">Room</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="figma-location-td">${siteValue}</td>
              <td class="figma-location-td">${buildingValue}</td>
              <td class="figma-location-td">${wingValue}</td>
              <td class="figma-location-td">${floorValue}</td>
              <td class="figma-location-td">${areaValue}</td>
              <td class="figma-location-td">${roomValue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  private generateBeforeAfterImagesSection(jobSheetData: any): string {
    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;

    // Use only actual image data - handle null values properly
    const beforeImageUrl =
      jobSheet?.basic_info?.bef_sub_attachment &&
      jobSheet?.basic_info?.bef_sub_attachment !== null &&
      jobSheet?.basic_info?.bef_sub_attachment !== "null"
        ? jobSheet?.basic_info?.bef_sub_attachment
        : null;
    const afterImageUrl =
      jobSheet?.basic_info?.aft_sub_attachment &&
      jobSheet?.basic_info?.aft_sub_attachment !== null &&
      jobSheet?.basic_info?.aft_sub_attachment !== "null"
        ? jobSheet?.basic_info?.aft_sub_attachment
        : null;

    // Get actual timestamps from data - handle the API date format
    const beforeTimestamp =
      jobSheet?.basic_info?.bef_sub_date ||
      jobSheet?.basic_info?.created_date ||
      "";
    const afterTimestamp =
      jobSheet?.basic_info?.aft_sub_date ||
      jobSheet?.basic_info?.completed_date ||
      "";

    // Format timestamps if available - handle API format "09/09/2025, 09:04 AM"
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      try {
        // Check if it's already in the desired format (contains comma and AM/PM)
        if (
          dateStr.includes(",") &&
          (dateStr.includes("AM") || dateStr.includes("PM"))
        ) {
          return dateStr; // Return as-is since it's already formatted
        }
        // Otherwise try to parse and format
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
      } catch {
        return dateStr; // Return original if parsing fails
      }
    };

    const beforeDate = formatDate(beforeTimestamp);
    const afterDate = formatDate(afterTimestamp);

    // Debug image URLs
    console.log("🖼️ Before/After Images Debug:", {
      beforeImageUrl,
      afterImageUrl,
      beforeDate,
      afterDate,
    });

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
                  ${
                    beforeImageUrl
                      ? `<img src="${beforeImageUrl}" 
                         alt="Before Maintenance" 
                         class="figma-maintenance-image"
                         crossorigin="anonymous"
                         data-cors-warning="true"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                         <div style="display: none; padding: 30px; text-align: center; color: #999; font-size: 12px; border: 2px dashed #ddd; border-radius: 8px; background: #f9f9f9; align-items: center; justify-content: center; min-height: 150px; flex-direction: column;">
                           <div style="font-size: 40px; margin-bottom: 10px;">📷</div>
                           <div>Image unavailable</div>
                           <div style="font-size: 10px; margin-top: 5px; color: #bbb;">(CORS restriction)</div>
                         </div>`
                      : '<div class="figma-no-image">No image available</div>'
                  }
                  ${
                    beforeDate
                      ? `<div class="figma-image-timestamp">${beforeDate}</div>`
                      : ""
                  }
                </div>
              </td>
              <td class="figma-image-cell">
                <div class="figma-image-container">
                  ${
                    afterImageUrl
                      ? `<img src="${afterImageUrl}" 
                         alt="After Maintenance" 
                         class="figma-maintenance-image"
                         crossorigin="anonymous"
                         data-cors-warning="true"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                         <div style="display: none; padding: 30px; text-align: center; color: #999; font-size: 12px; border: 2px dashed #ddd; border-radius: 8px; background: #f9f9f9; align-items: center; justify-content: center; min-height: 150px; flex-direction: column;">
                           <div style="font-size: 40px; margin-bottom: 10px;">📷</div>
                           <div>Image unavailable</div>
                           <div style="font-size: 10px; margin-top: 5px; color: #bbb;">(CORS restriction)</div>
                         </div>`
                      : '<div class="figma-no-image">No image available</div>'
                  }
                  ${
                    afterDate
                      ? `<div class="figma-image-timestamp">${afterDate}</div>`
                      : ""
                  }
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  private generateRemarksSection(taskDetails: any, comments: string): string {
    const jobSheet = taskDetails?.data?.job_sheet || taskDetails?.job_sheet;

    // Get comments from multiple sources and map correctly
    const taskComments = jobSheet?.task_details?.task_comments || "";
    const userComments = comments || "";
    const basicInfoComments = jobSheet?.basic_info?.comments || "";
    const checklistComments =
      jobSheet?.checklist_responses
        ?.filter((item: any) => item.comments)
        .map((item: any) => item.comments) || [];
    const systemComments = jobSheet?.comments || [];

    // Combine all available comments with proper filtering and formatting
    const allComments = [
      taskComments,
      userComments,
      basicInfoComments,
      ...checklistComments,
      ...systemComments.map((c: any) => c.comment || c.text || c),
    ].filter(
      (comment) =>
        comment && typeof comment === "string" && comment.trim().length > 0
    );

    const finalComments = allComments.length > 0 ? allComments.join(" • ") : "";

    return `
      <div class="svg-remarks-section">
        <div class="svg-remarks-container">
          <div class="svg-remarks-label">Remarks</div>
          <div class="svg-remarks-content">
            ${finalComments || ""}
          </div>
        </div>
      </div>
    `;
  }

  private generateEnhancedRemarksSection(
    taskDetails: any,
    comments: string
  ): string {
    const remarksText =
      comments || taskDetails?.task_details?.task_comments || "";

    return `
      <div class="svg-remarks-section">
        <div class="svg-remarks-container">
          <div class="svg-remarks-label">Remarks</div>
          <div class="svg-remarks-content">
            ${remarksText || ""}
          </div>
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
    const headerHeight = 25; // Header with logo (reduced)
    const clientInfoHeight = 70; // Client info table (8 rows, optimized)
    const locationHeight = 20; // Location table section (reduced)
    const beforeAfterHeight = 60; // Before/after images section with table (reduced)
    const measurementHeight = 30; // Status notes section (reduced)
    const remarksHeight = comments ? 25 : 15; // Remarks section (dynamic based on content, reduced)
    const bottomHeight = 20; // System note + branding (reduced)

    // Dynamic checklist height calculation - more accurate and optimized
    const checklistItems = jobSheet?.checklist_responses?.length || 8;
    const checklistHeaderHeight = 12; // Section title (reduced)
    const checklistTableHeaderHeight = 10; // Table header (reduced)
    const checklistRowHeight = 8; // Per row height (reduced for better density)
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
    console.log(`   - Bottom: ${bottomHeight}mm`);
    console.log(`   - TOTAL: ${totalHeight}mm`);

    return totalHeight;
  }

  private async imageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create a temporary image
      const img = new Image();
      
      // Set crossOrigin to try CORS first
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          
          // Draw the image on canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Fill with white background first (to avoid black background on transparent PNGs)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Then draw the image on top
          ctx.drawImage(img, 0, 0);
          
          // Convert to base64 - use PNG to preserve image quality and avoid compression artifacts
          const base64 = canvas.toDataURL('image/png');
          resolve(base64);
        } catch (error) {
          console.error('Error converting image to base64:', error);
          // Don't try fetch API as it will also fail with CORS
          reject(error);
        }
      };
      
      img.onerror = (error) => {
        console.warn(`Direct image load failed for: ${url}, CORS issue detected`);
        // Don't try fetch API as it will also fail with CORS
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });
  }

  private async fetchImageAsBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert blob to base64'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Fetch API failed:', error);
      // Return a placeholder or the original URL
      throw error;
    }
  }
}
