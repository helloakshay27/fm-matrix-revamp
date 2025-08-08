import React from 'react';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface CalendarEvent {
  id: string | number;
  title: string;
  start: string;
  color?: string;
  status?: string;
}

export interface CalendarFilters {
  dateFrom: string;
  dateTo: string;
  's[task_custom_form_schedule_type_eq]'?: string;
  's[task_task_of_eq]'?: string;
}

export interface PDFGeneratorProps {
  events: CalendarEvent[];
  view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek' | 'year';
  date: Date;
  activeFilters: CalendarFilters;
  onUpdateToast: (message: string, show: boolean) => void;
}

export class CalendarPDFGenerator {
  private events: CalendarEvent[];
  private view: string;
  private date: Date;
  private activeFilters: CalendarFilters;
  private onUpdateToast: (message: string, show: boolean) => void;

  constructor(props: PDFGeneratorProps) {
    this.events = props.events;
    this.view = props.view;
    this.date = props.date;
    this.activeFilters = props.activeFilters;
    this.onUpdateToast = props.onUpdateToast;
  }

  async generatePDF(): Promise<void> {
    try {
      // Determine view type and set toast message
      let viewDisplayName = '';
      let taskCount = this.events.length;
      switch (this.view) {
        case 'year':
          viewDisplayName = `Year View (${taskCount} tasks)`;
          break;
        case 'dayGridMonth':
          viewDisplayName = `Month View (${taskCount} tasks)`;
          break;
        case 'timeGridWeek':
          viewDisplayName = `Week View (${taskCount} tasks)`;
          break;
        case 'listWeek':
          viewDisplayName = `List View (${taskCount} tasks)`;
          break;
        default:
          viewDisplayName = `Calendar View (${taskCount} tasks)`;
      }

      this.onUpdateToast(`Exporting ${viewDisplayName}...`, true);

      // Get the current view and date range info for the filename
      const viewName = this.view === 'year' ? 'Year-View' :
        this.view === 'dayGridMonth' ? 'Monthly-View' :
          this.view === 'timeGridWeek' ? 'Weekly-View' :
            this.view === 'listWeek' ? 'List-View' : 'Daily-View';

      const dateRange = this.view === 'year'
        ? `${moment(this.date).year()}`
        : `${moment(this.date).format('MMM-YYYY')}`;

      // Create filename with current filters and date range
      const filename = `Scheduled-Tasks-Calendar-${viewName}-${dateRange}.pdf`;

      console.log(`Generating PDF: ${filename} with ${this.events.length} Tasks`);

      // Create a temporary container for the PDF content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '0';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.minHeight = '100vh';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '20px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.zIndex = '-9999';
      tempContainer.style.overflow = 'visible';
      document.body.appendChild(tempContainer);

      // Create PDF header with filter information and summary
      const headerHTML = this.generateHeaderHTML(viewName);
      tempContainer.innerHTML = headerHTML;

      // Generate calendar content based on current view
      let calendarHTML = '';

      if (this.view === 'listWeek' || this.events.length > 20) {
        // Use compact list view for agenda view or when there are many events
        calendarHTML = this.generateListViewHTML();
      } else if (this.view === 'year') {
        // Generate yearly calendar HTML
        calendarHTML = this.generateYearlyCalendarHTML();
      } else {
        // For other views, create a simplified table representation
        calendarHTML = this.generateMonthlyCalendarHTML();
      }

      tempContainer.insertAdjacentHTML('beforeend', calendarHTML);

      // Add legends at the bottom
      const legendsHTML = this.generateLegendsHTML();
      tempContainer.insertAdjacentHTML('beforeend', legendsHTML);

      // Wait for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate the canvas with optimized settings for smaller file size
      console.log('Capturing canvas...', tempContainer.scrollHeight);
      const canvas = await html2canvas(tempContainer, {
        scale: 1.0,
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
        width: tempContainer.offsetWidth,
        height: tempContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        removeContainer: true,
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.body.firstElementChild;
          if (clonedContainer) {
            (clonedContainer as HTMLElement).style.transform = 'none';
            (clonedContainer as HTMLElement).style.position = 'static';
          }
        }
      });

      // Remove the temporary container
      document.body.removeChild(tempContainer);

      console.log('Canvas generated:', canvas.width, 'x', canvas.height);

      // Create PDF with optimized compression settings
      const imgData = canvas.toDataURL('image/jpeg', 0.7);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgAspectRatio = canvas.height / canvas.width;
      const imgWidth = pdfWidth - 20;
      const imgHeight = imgWidth * imgAspectRatio;

      let yPosition = 10;
      let remainingHeight = imgHeight;

      // Add pages as needed with compression
      while (remainingHeight > 0) {
        const pageHeight = Math.min(remainingHeight, pdfHeight - 20);
        const sourceY = imgHeight - remainingHeight;
        const sourceHeight = pageHeight;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = (sourceHeight / imgHeight) * canvas.height;

        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0, (sourceY / imgHeight) * canvas.height,
            canvas.width, pageCanvas.height,
            0, 0,
            canvas.width, pageCanvas.height
          );

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.8);
          pdf.addImage(pageImgData, 'JPEG', 10, yPosition, imgWidth, pageHeight);
        }

        remainingHeight -= pageHeight;
        if (remainingHeight > 0) {
          pdf.addPage();
          yPosition = 10;
        }
      }

      // Save the PDF
      console.log('Saving PDF:', filename);
      pdf.save(filename);

      // Success message
      this.onUpdateToast(`${viewDisplayName} exported successfully!`, true);
      setTimeout(() => this.onUpdateToast('', false), 3000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      this.onUpdateToast('Error exporting PDF. Please try again.', true);
      setTimeout(() => this.onUpdateToast('', false), 3000);
    }
  }

  private generateHeaderHTML(viewName: string): string {
    return `
      <div style="margin-bottom: 30px; font-family: Arial, sans-serif; page-break-inside: avoid;">
        <div style="text-align: center; border-bottom: 3px solid #e53e3e; padding-bottom: 20px; margin-bottom: 25px;">
          <h1 style="color: #333; margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">Scheduled Tasks Calendar</h1>
          <h2 style="color: #666; margin: 0 0 15px 0; font-size: 20px;">${viewName}</h2>
          <div style="color: #888; font-size: 14px;">
            Generated on: ${moment().format('MMMM DD, YYYY at HH:mm')}
          </div>
        </div>

        ${Object.entries(this.activeFilters).some(([key, value]) => value && value.trim() !== '') ? `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
            <h3 style="color: #333; font-size: 16px; margin: 0 0 10px 0; font-weight: bold;">Applied Filters</h3>
            <div style="font-size: 14px; line-height: 1.6;">
              ${this.activeFilters.dateFrom ? `<div style="margin-bottom: 6px;"><strong>Date From:</strong> ${this.activeFilters.dateFrom}</div>` : ''}
              ${this.activeFilters.dateTo ? `<div style="margin-bottom: 6px;"><strong>Date To:</strong> ${this.activeFilters.dateTo}</div>` : ''}
              ${this.activeFilters['s[task_custom_form_schedule_type_eq]'] ? `<div style="margin-bottom: 6px;"><strong>Schedule Type:</strong> ${this.activeFilters['s[task_custom_form_schedule_type_eq]']}</div>` : ''}
              ${this.activeFilters['s[task_task_of_eq]'] ? `<div><strong>Task Type:</strong> ${this.activeFilters['s[task_task_of_eq]']}</div>` : ''}
            </div>
          </div>
        ` : ''}

        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
          <h3 style="color: #334155; margin: 0 0 15px 0; font-size: 18px; font-weight: bold; text-align: center;">Summary Statistics</h3>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
            <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="font-weight: bold; font-size: 24px; color: #a78bfa; margin-bottom: 5px;">${this.events.filter(e => e.title?.toLowerCase().includes('ppm')).length}</div>
              <div style="color: #64748b; font-size: 14px; font-weight: 500;">PPM Tasks</div>
            </div>
            <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="font-weight: bold; font-size: 24px; color: #84cc16; margin-bottom: 5px;">${this.events.filter(e => e.title?.toLowerCase().includes('amc')).length}</div>
              <div style="color: #64748b; font-size: 14px; font-weight: 500;">AMC Tasks</div>
            </div>
            <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="font-weight: bold; font-size: 24px; color: #f472b6; margin-bottom: 5px;">${this.events.filter(e => !e.title?.toLowerCase().includes('ppm') && !e.title?.toLowerCase().includes('amc')).length}</div>
              <div style="color: #64748b; font-size: 14px; font-weight: 500;">Other Tasks</div>
            </div>
            <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="font-weight: bold; font-size: 24px; color: #3b82f6; margin-bottom: 5px;">${this.events.length}</div>
              <div style="color: #64748b; font-size: 14px; font-weight: 500;">Total Tasks</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private generateListViewHTML(): string {
    // Sort events by date
    const sortedEvents = [...this.events].sort((a, b) => 
      moment(a.start).valueOf() - moment(b.start).valueOf()
    );

    const getEventTypeColor = (event: CalendarEvent) => {
      const title = event.title?.toLowerCase() || '';
      if (title.includes('ppm')) return '#a78bfa';
      if (title.includes('amc')) return '#84cc16';
      return '#f472b6';
    };

    const getStatusColor = (status?: string) => {
      switch (status?.toLowerCase()) {
        case 'scheduled': return '#facc15';
        case 'open': return '#ec4899';
        case 'in progress': return '#3b82f6';
        case 'completed': case 'closed': return '#22c55e';
        case 'overdue': return '#ef4444';
        default: return '#6b7280';
      }
    };

    let listHTML = `
      <div style="margin-bottom: 30px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000; margin: 0; font-size: 24px; font-weight: bold;">Tasks List - ${moment(this.activeFilters.dateFrom, 'DD/MM/YYYY').format('MMM DD')} to ${moment(this.activeFilters.dateTo, 'DD/MM/YYYY').format('MMM DD, YYYY')}</h1>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Total: ${sortedEvents.length} tasks | PPM: ${sortedEvents.filter(e => e.title?.toLowerCase().includes('ppm')).length} | AMC: ${sortedEvents.filter(e => e.title?.toLowerCase().includes('amc')).length} | Other: ${sortedEvents.filter(e => !e.title?.toLowerCase().includes('ppm') && !e.title?.toLowerCase().includes('amc')).length}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-top: 20px;">
          <thead>
            <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
              <th style="border: 1px solid #dee2e6; padding: 6px; text-align: left; font-weight: bold; width: 5%;">#</th>
              <th style="border: 1px solid #dee2e6; padding: 6px; text-align: left; font-weight: bold; width: 11%;">Date</th>
              <th style="border: 1px solid #dee2e6; padding: 6px; text-align: left; font-weight: bold; width: 7%;">Time</th>
              <th style="border: 1px solid #dee2e6; padding: 6px; text-align: left; font-weight: bold; width: 42%;">Task Title</th>
              <th style="border: 1px solid #dee2e6; padding: 6px; text-align: center; font-weight: bold; width: 9%;">Type</th>
              <th style="border: 1px solid #dee2e6; padding: 6px; text-align: center; font-weight: bold; width: 11%;">Status</th>
              <th style="border: 1px solid #dee2e6; padding: 6px; text-align: center; font-weight: bold; width: 10%;">ID</th>
              <th style="border: 1px solid #dee2e6; padding: 6px; text-align: center; font-weight: bold; width: 5%;"></th>
            </tr>
          </thead>
          <tbody>
    `;

    if (sortedEvents.length === 0) {
      listHTML += `
        <tr>
          <td colspan="8" style="border: 1px solid #dee2e6; padding: 40px; text-align: center; color: #6b7280; font-style: italic;">
            No tasks found for the selected date range and filters.
          </td>
        </tr>
      `;
    } else {
      // Show all tasks dynamically with pagination
      const tasksPerPage = 40; // Optimal number for A4 page to fit more tasks
      
      sortedEvents.forEach((event, index) => {
        const eventDate = moment(event.start);
        const eventColor = getEventTypeColor(event);
        const statusColor = getStatusColor(event.status);
        const isEvenRow = index % 2 === 0;
        
        // Add page break every 40 tasks for better pagination
        const shouldBreakPage = index > 0 && index % tasksPerPage === 0;
        
        // Determine task type
        const title = event.title?.toLowerCase() || '';
        let taskType = 'Other';
        if (title.includes('ppm')) taskType = 'PPM';
        else if (title.includes('amc')) taskType = 'AMC';

        // Add page break and new table header if needed
        if (shouldBreakPage) {
          const currentPage = Math.floor(index / tasksPerPage) + 1;
          const startTask = index + 1;
          const endTask = Math.min(index + tasksPerPage, sortedEvents.length);
          
          listHTML += `
            </tbody>
          </table>
        </div>
        
        <!-- New page starts here -->
        <div style="page-break-before: always; margin-bottom: 30px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #000; margin: 0; font-size: 24px; font-weight: bold;">Tasks List - ${moment(this.activeFilters.dateFrom, 'DD/MM/YYYY').format('MMM DD')} to ${moment(this.activeFilters.dateTo, 'DD/MM/YYYY').format('MMM DD, YYYY')} (Page ${currentPage})</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Tasks ${startTask} to ${endTask} of ${sortedEvents.length} total tasks</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-top: 20px;">
            <thead>
              <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                <th style="border: 1px solid #dee2e6; padding: 6px; text-align: left; font-weight: bold; width: 5%;">#</th>
                <th style="border: 1px solid #dee2e6; padding: 6px; text-align: left; font-weight: bold; width: 11%;">Date</th>
                <th style="border: 1px solid #dee2e6; padding: 6px; text-align: left; font-weight: bold; width: 7%;">Time</th>
                <th style="border: 1px solid #dee2e6; padding: 6px; text-align: left; font-weight: bold; width: 42%;">Task Title</th>
                <th style="border: 1px solid #dee2e6; padding: 6px; text-align: center; font-weight: bold; width: 9%;">Type</th>
                <th style="border: 1px solid #dee2e6; padding: 6px; text-align: center; font-weight: bold; width: 11%;">Status</th>
                <th style="border: 1px solid #dee2e6; padding: 6px; text-align: center; font-weight: bold; width: 10%;">ID</th>
                <th style="border: 1px solid #dee2e6; padding: 6px; text-align: center; font-weight: bold; width: 5%;"></th>
              </tr>
            </thead>
            <tbody>
          `;
        }

        listHTML += `
          <tr style="background: ${isEvenRow ? '#ffffff' : '#f8f9fa'}; border-bottom: 1px solid #e9ecef;">
            <td style="border: 1px solid #dee2e6; padding: 5px; text-align: center; font-weight: 500; color: #495057; font-size: 10px;">
              ${index + 1}
            </td>
            <td style="border: 1px solid #dee2e6; padding: 5px; font-weight: 500; color: #495057; font-size: 10px;">
              ${eventDate.format('MMM DD, YYYY')}
              <div style="font-size: 9px; color: #6c757d; margin-top: 1px;">
                ${eventDate.format('dddd')}
              </div>
            </td>
            <td style="border: 1px solid #dee2e6; padding: 5px; text-align: center; font-weight: 500; color: #495057; font-size: 10px;">
              ${eventDate.format('HH:mm')}
            </td>
            <td style="border: 1px solid #dee2e6; padding: 5px; color: #333; font-size: 10px;">
              <div style="font-weight: 500; margin-bottom: 1px; line-height: 1.2;">
                ${event.title || 'Untitled Task'}
              </div>
              ${event.title && event.title.length > 60 ? `
                <div style="font-size: 8px; color: #6c757d; font-style: italic;">
                  Task #${event.id}
                </div>
              ` : ''}
            </td>
            <td style="border: 1px solid #dee2e6; padding: 5px; text-align: center;">
              <span style="
                display: inline-block;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 8px;
                font-weight: 600;
                color: white;
                background-color: ${eventColor};
                text-transform: uppercase;
                letter-spacing: 0.3px;
              ">
                ${taskType}
              </span>
            </td>
            <td style="border: 1px solid #dee2e6; padding: 5px; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                <div style="
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  background-color: ${statusColor};
                  flex-shrink: 0;
                "></div>
                <span style="font-size: 9px; font-weight: 500; color: #495057;">
                  ${event.status || 'Unknown'}
                </span>
              </div>
            </td>
            <td style="border: 1px solid #dee2e6; padding: 5px; text-align: center; font-family: monospace; font-size: 9px; color: #6c757d;">
              ${event.id}
            </td>
            <td style="border: 1px solid #dee2e6; padding: 5px; text-align: center;">
              <div style="
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: ${eventColor};
                margin: 0 auto;
              "></div>
            </td>
          </tr>
        `;
      });

      // Add final summary row
      const totalPages = Math.ceil(sortedEvents.length / tasksPerPage);
      listHTML += `
        <tr style="background: #e8f5e8; border-top: 2px solid #28a745;">
          <td colspan="8" style="border: 1px solid #dee2e6; padding: 8px; text-align: center; font-weight: 600; color: #155724;">
            Total Tasks: ${sortedEvents.length} | 
            PPM: ${sortedEvents.filter(e => e.title?.toLowerCase().includes('ppm')).length} | 
            AMC: ${sortedEvents.filter(e => e.title?.toLowerCase().includes('amc')).length} | 
            Other: ${sortedEvents.filter(e => !e.title?.toLowerCase().includes('ppm') && !e.title?.toLowerCase().includes('amc')).length}
            ${totalPages > 1 ? ` | Pages: ${totalPages}` : ''}
          </td>
        </tr>
      `;
    }

    listHTML += `
          </tbody>
        </table>
      </div>
    `;

    return listHTML;
  }

  private generateYearlyCalendarHTML(): string {
    const currentYear = moment(this.date).year();
    console.log('Generating yearly calendar for year:', currentYear);

    const getEventsForDate = (date: moment.Moment) => {
      return this.events.filter(event => {
        const eventDate = moment(event.start);
        return eventDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
      });
    };

    let yearlyHTML = '';

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthStart = moment().year(currentYear).month(monthIndex).startOf('month');
      const monthEnd = monthStart.clone().endOf('month');
      const monthName = monthStart.format('MMMM');

      yearlyHTML += `
        <div style="page-break-before: ${monthIndex > 0 ? 'always' : 'auto'}; page-break-after: avoid; margin-bottom: 30px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #000; margin: 0; font-size: 24px; font-weight: bold;">${monthName} ${currentYear}</h1>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10px;">
            <thead>
              <tr style="background: #e5e7eb;">
                <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Sunday</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Monday</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Tuesday</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Wednesday</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Thursday</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Friday</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Saturday</th>
              </tr>
            </thead>
            <tbody>
      `;

      const startOfCalendar = monthStart.clone().startOf('week').startOf('day');
      const endOfCalendar = monthEnd.clone().endOf('week').endOf('day');
      let currentWeekStart = startOfCalendar.clone();

      while (currentWeekStart.isSameOrBefore(endOfCalendar, 'day')) {
        yearlyHTML += '<tr>';

        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
          const currentDate = currentWeekStart.clone().add(dayOfWeek, 'days');
          const dayEvents = getEventsForDate(currentDate);
          const isCurrentMonth = currentDate.month() === monthIndex;
          const isToday = currentDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');

          const cellStyle = `
            border: 1px solid #d1d5db;
            padding: 6px;
            vertical-align: top;
            height: 180px;
            width: 14.28%;
            ${!isCurrentMonth ? 'background: #f9fafb; color: #9ca3af;' : 'background: white;'}
            ${isToday ? 'background: #fef3c7;' : ''}
          `;

          yearlyHTML += `<td style="${cellStyle}">`;
          yearlyHTML += `<div style="font-weight: bold; font-size: 13px; margin-bottom: 6px; color: ${!isCurrentMonth ? '#9ca3af' : isToday ? '#92400e' : '#374151'};">${currentDate.date()}</div>`;

          if (dayEvents.length > 0) {
            dayEvents.slice(0, 4).forEach((event) => {
              yearlyHTML += `
                <div style="font-size: 9px; margin: 1px 0; padding: 1px 0; color: #374151; overflow: hidden;">
                  ${event.title || 'Event'}
                </div>
              `;
            });
          }

          yearlyHTML += '</td>';
        }

        yearlyHTML += '</tr>';
        currentWeekStart.add(1, 'week');
      }

      yearlyHTML += `
            </tbody>
          </table>
        </div>
      `;
    }

    return yearlyHTML;
  }

  private generateMonthlyCalendarHTML(): string {
    const currentDate = moment(this.date);
    const monthStart = currentDate.clone().startOf('month');
    const monthEnd = currentDate.clone().endOf('month');

    const getEventsForDate = (date: moment.Moment) => {
      return this.events.filter(event => {
        const eventDate = moment(event.start);
        return eventDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
      });
    };

    let monthlyHTML = `
      <div style="margin-bottom: 30px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000; margin: 0; font-size: 24px; font-weight: bold;">${currentDate.format('MMMM YYYY')}</h1>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10px;">
          <thead>
            <tr style="background: #e5e7eb;">
              <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Sunday</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Monday</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Tuesday</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Wednesday</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Thursday</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Friday</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; text-align: center; width: 14.28%;">Saturday</th>
            </tr>
          </thead>
          <tbody>
    `;

    const startOfCalendar = monthStart.clone().startOf('week').startOf('day');
    const endOfCalendar = monthEnd.clone().endOf('week').endOf('day');
    let currentWeekStart = startOfCalendar.clone();

    while (currentWeekStart.isSameOrBefore(endOfCalendar, 'day')) {
      monthlyHTML += '<tr>';

      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const dayDate = currentWeekStart.clone().add(dayOfWeek, 'days');
        const dayEvents = getEventsForDate(dayDate);
        const isCurrentMonth = dayDate.month() === currentDate.month();
        const isToday = dayDate.isSame(moment(), 'day');

        const cellStyle = `
          border: 1px solid #d1d5db;
          padding: 6px;
          vertical-align: top;
          height: 180px;
          width: 14.28%;
          ${!isCurrentMonth ? 'background: #f9fafb; color: #9ca3af;' : 'background: white;'}
          ${isToday ? 'background: #fef3c7;' : ''}
        `;

        monthlyHTML += `<td style="${cellStyle}">`;
        monthlyHTML += `<div style="font-weight: bold; font-size: 12px; margin-bottom: 4px; color: ${!isCurrentMonth ? '#9ca3af' : isToday ? '#92400e' : '#374151'};">${dayDate.date()}</div>`;

        if (dayEvents.length > 0) {
          dayEvents.slice(0, 4).forEach((event) => {
            monthlyHTML += `
              <div style="font-size: 9px; margin: 1px 0; padding: 1px 0; color: #374151;">
                ${event.title}
              </div>
            `;
          });
        }

        monthlyHTML += '</td>';
      }

      monthlyHTML += '</tr>';
      currentWeekStart.add(1, 'week');
    }

    monthlyHTML += `
          </tbody>
        </table>
      </div>
    `;

    return monthlyHTML;
  }

  private generateLegendsHTML(): string {
    return `
      <div style="margin-top: 40px; page-break-inside: avoid;">
        <div style="border-top: 2px solid #e5e5e5; padding-top: 25px;">
          <h3 style="color: #333; font-size: 18px; margin: 0 0 20px 0; font-weight: bold; text-align: center;">Reference Guide</h3>
          
          <div style="margin-bottom: 25px;">
            <h4 style="color: #333; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Task Types</h4>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
              <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                <div style="width: 20px; height: 20px; background: #a78bfa; border-radius: 4px; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #333; font-weight: 500;">PPM Tasks</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                <div style="width: 20px; height: 20px; background: #84cc16; border-radius: 4px; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #333; font-weight: 500;">AMC Tasks</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                <div style="width: 20px; height: 20px; background: #f472b6; border-radius: 4px; flex-shrink: 0;"></div>
                <span style="font-size: 14px; color: #333; font-weight: 500;">Other Tasks</span>
              </div>
            </div>
          </div>

          <div>
            <h4 style="color: #333; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">Status Indicators</h4>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                <div style="width: 16px; height: 16px; background-color: #facc15; border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 13px; color: #333; font-weight: 500;">Scheduled</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                <div style="width: 16px; height: 16px; background-color: #ec4899; border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 13px; color: #333; font-weight: 500;">Open</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                <div style="width: 16px; height: 16px; background-color: #3b82f6; border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 13px; color: #333; font-weight: 500;">In Progress</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                <div style="width: 16px; height: 16px; background-color: #22c55e; border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 13px; color: #333; font-weight: 500;">Completed</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                <div style="width: 16px; height: 16px; background-color: #ef4444; border-radius: 50%; flex-shrink: 0;"></div>
                <span style="font-size: 13px; color: #333; font-weight: 500;">Overdue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Hook for using the PDF generator
export const useCalendarPDFGenerator = () => {
  return {
    generatePDF: async (props: PDFGeneratorProps) => {
      const generator = new CalendarPDFGenerator(props);
      await generator.generatePDF();
    }
  };
};
