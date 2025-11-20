import { OIG_LOGO_CODE } from "@/assets/pdf/oig-logo-code";
import { VI_LOGO_CODE } from "@/assets/vi-logo-code";
import { DEFAULT_LOGO_CODE } from "@/assets/default-logo-code";
import { renderToStaticMarkup } from "react-dom/server";
import { JobSheetPDFStyles } from "./JobSheetPDFStyles";

export class JobSheetHTMLPreview {
  /**
   * Generate a complete HTML preview of the job sheet
   * This can be used for display in browser or printing
   */
  generateJobSheetHTML(
    taskDetails: any,
    jobSheetData: any,
    comments: string = ""
  ): string {
    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;
    const shouldShowBeforeAfter =
      jobSheet?.basic_info?.before_after_enabled === true ||
      jobSheet?.basic_info?.before_after_enabled === "true" ||
      jobSheet?.basic_info?.steps === 3;

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Job Sheet - ${taskDetails.task_details?.id || taskDetails.id || 'Preview'}</title>
          ${this.getPageStyles()}
          <style>
            /* Print-specific styles */
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .no-print {
                display: none !important;
              }
            }
            
            /* Page wrapper for better display */
            .page-wrapper {
              max-width: 210mm;
              margin: 20px auto;
              background: white;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              padding: 20px;
            }
            
            /* Toolbar styles */
            .preview-toolbar {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              background: #1f2937;
              color: white;
              padding: 12px 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              z-index: 1000;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .toolbar-title {
              font-size: 16px;
              font-weight: 600;
            }
            
            .toolbar-actions {
              display: flex;
              gap: 10px;
            }
            
            .toolbar-button {
              background: #C72030;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: background 0.2s;
            }
            
            .toolbar-button:hover {
              background: #A01828;
            }
            
            .toolbar-button.secondary {
              background: #374151;
            }
            
            .toolbar-button.secondary:hover {
              background: #4B5563;
            }
            
            /* Content wrapper with top margin for toolbar */
            .content-wrapper {
              margin-top: 60px;
            }
            
            @media print {
            .preview-toolbar {
                display: none !important;
              }
              .content-wrapper {
                margin-top: 0 !important;
              }
              .page-wrapper {
                margin: 0 !important;
                box-shadow: none !important;
                padding: 0 !important;
              }
            }
          </style>
        </head>
        <body>
          <!-- Preview Toolbar (hidden when printing) -->
         
          
          <!-- Main Content -->
          <div class="content-wrapper">
            <div class="page-wrapper">
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
            </div>
          </div>
          
          <!-- Print helper script -->
          <script>
            // Optional: Auto-print on load
            // window.onload = function() {
            //   setTimeout(() => window.print(), 500);
            // };
            
            // Add keyboard shortcut for printing
            document.addEventListener('keydown', function(e) {
              if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                window.print();
              }
            });
          </script>
        </body>
      </html>
    `;
  }

  /**
   * Open the job sheet preview in a new window/tab
   */
  openPreviewWindow(
    taskDetails: any,
    jobSheetData: any,
    comments: string = ""
  ): void {
    const htmlContent = this.generateJobSheetHTML(taskDetails, jobSheetData, comments);
    const previewWindow = window.open("", "_blank");
    
    if (previewWindow) {
      previewWindow.document.write(htmlContent);
      previewWindow.document.close();
    } else {
      console.error("Failed to open preview window. Please check popup blocker settings.");
    }
  }

  /**
   * Download the job sheet as an HTML file
   */
  downloadAsHTML(
    taskDetails: any,
    jobSheetData: any,
    comments: string = ""
  ): void {
    const htmlContent = this.generateJobSheetHTML(taskDetails, jobSheetData, comments);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JobSheet_${
      taskDetails.task_details?.id || taskDetails.id || new Date().getTime()
    }_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private getPageStyles(): string {
    return JobSheetPDFStyles.getPageStyles();
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

  private generateLocationDetails(jobSheetData: any): string {
    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;
    const location = jobSheet?.task_details?.asset?.location;

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

    // Get actual timestamps from data
    const beforeTimestamp =
      jobSheet?.basic_info?.bef_sub_date ||
      jobSheet?.basic_info?.created_date ||
      "";
    const afterTimestamp =
      jobSheet?.basic_info?.aft_sub_date ||
      jobSheet?.basic_info?.completed_date ||
      "";

    // Format timestamps if available
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      try {
        if (
          dateStr.includes(",") &&
          (dateStr.includes("AM") || dateStr.includes("PM"))
        ) {
          return dateStr;
        }
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB");
      } catch {
        return dateStr;
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
                  ${
                    beforeImageUrl
                      ? `<img src="${beforeImageUrl}" 
                         alt="Before Maintenance" 
                         class="figma-maintenance-image"
                         crossorigin="anonymous"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                         <div style="display: none; padding: 30px; text-align: center; color: #999; font-size: 12px; border: 2px dashed #ddd; border-radius: 8px; background: #f9f9f9; align-items: center; justify-content: center; min-height: 150px; flex-direction: column;">
                           <div style="font-size: 40px; margin-bottom: 10px;">📷</div>
                           <div>Image unavailable</div>
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
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                         <div style="display: none; padding: 30px; text-align: center; color: #999; font-size: 12px; border: 2px dashed #ddd; border-radius: 8px; background: #f9f9f9; align-items: center; justify-content: center; min-height: 150px; flex-direction: column;">
                           <div style="font-size: 40px; margin-bottom: 10px;">📷</div>
                           <div>Image unavailable</div>
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

  private generateDailyMaintenanceSection(jobSheetData: any): string {
    const jobSheet = jobSheetData?.data?.job_sheet || jobSheetData?.job_sheet;
    const checklistResponses = jobSheet?.checklist_responses || [];
    const taskName = jobSheet?.task_details?.task_name || "";

    if (checklistResponses.length === 0) {
      return `
        <div class="figma-maintenance-section">
          <div class="figma-maintenance-header">NEW ACTIVITY</div>
          <div class="figma-maintenance-subheader">No checklist items available</div>
        </div>
      `;
    }

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

    const sections = Object.keys(grouped).map(key => ({
      sectionKey: key,
      group_name: grouped[key][0]?.group_name || 'Ungrouped',
      sub_group_name: grouped[key][0]?.sub_group_name || '',
      activities: grouped[key]
    }));

    const assetCategory = jobSheet?.task_details?.asset?.category || "";
    const mainTitle = taskName
      ? taskName.toUpperCase()
      : assetCategory
      ? `SERVICE CHECKLIST OF ${assetCategory.toUpperCase()}`
      : "NEW ACTIVITY";

    const sectionsHtml = sections.map((section, sectionIndex) => {
      const sectionTitle = section.group_name;
      const sectionSubtitle = section.sub_group_name;
      
      const sectionRows = section.activities.map((item: any, index: number) => {
        const slNo = item.index || index + 1;
        const inspectionPoint = item.activity || item.label || "";

        const inputValue = item.input_value || (Array.isArray(item.userData) ? item.userData[0] : item.userData);
        const result =
          inputValue !== null && inputValue !== undefined && inputValue !== ""
            ? inputValue
            : hasAnyResponses
            ? ""
            : "Not Completed";

        const remarks = item.comments || item.comment || "";

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

  private generateRemarksSection(taskDetails: any, comments: string): string {
    const jobSheet = taskDetails?.data?.job_sheet || taskDetails?.job_sheet;

    const taskComments = jobSheet?.task_details?.task_comments || "";
    const userComments = comments || "";
    const basicInfoComments = jobSheet?.basic_info?.comments || "";
    const checklistComments =
      jobSheet?.checklist_responses
        ?.filter((item: any) => item.comments)
        .map((item: any) => item.comments) || [];
    const systemComments = jobSheet?.comments || [];

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
}
