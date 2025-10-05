/**
 * JobSheet PDF Styles
 * Contains all CSS styles for PDF generation matching Figma design
 */
export class JobSheetPDFStyles {
  /**
   * Returns the complete CSS styles for JobSheet PDF generation
   */
  static getPageStyles(): string {
    return `
      <style>
        /* Google Fonts Import */
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        
        /* Page Setup */
        @page {
          size: A4;
          margin: 15mm 12mm 15mm 12mm; /* top right bottom left */
        }

        /* Page Break Utilities */
        .page-break-before {
          page-break-before: always;
          break-before: page;
        }

        .page-break-after {
          page-break-after: always;
          break-after: page;
        }

        .avoid-page-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Work Sans', Arial, Helvetica, sans-serif;
          font-size: 10px;
          color: #000;
          margin: 10px; /* Reduced margin */
          padding: 10px; /* Reduced padding */
          background: #ffffff;
          line-height: 1.3;
          width: calc(100% - 20px); /* account for reduced margins */
          height: auto;
          min-height: calc(100vh - 20px); /* account for reduced margins */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Figma Design Typography Classes */
        .figma-heading {
          color: #000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 20px;
          font-style: normal;
          font-weight: 600;
          line-height: 20.18px; /* 100.901% */
        }

        .figma-subheading {
          color: #000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 16.14px;
        }

        .figma-body {
          color: #000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 12.11px;
        }

        /* Header Styles */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          padding: 15px;
          width: 100%;
          height: auto;
          background: #ffffff;
        }

        .left-logo {
          width: 50%;
          padding-right: 20px;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .left-logo svg {
          height: auto;
          max-height: 60px;
          width: auto;
          max-width: 100%;
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

        /* Figma Client Info Table Styles */
        .figma-client-info {
          margin-bottom: 15px;
          width: 100%;
        }

        .figma-info-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px dotted #999999;
          background: #ffffff;
        }

        .figma-label-cell {
          border: 1px dotted #999999;
          padding: 8px 10px;
          vertical-align: middle;
          width: 25%;
          background: #ffffff;
          color: #000000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 10px;
          font-weight: 500;
          line-height: 1.2;
          text-align: left;
        }

        .figma-value-cell {
          border: 1px dotted #999999;
          padding: 8px 10px;
          vertical-align: middle;
          width: 25%;
          background: #ffffff;
          color: #000000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 10px;
          font-weight: 400;
          line-height: 1.2;
          text-align: left;
        }

        .figma-status-overdue {
          color: #d32f2f !important;
          font-weight: 600 !important;
        }

        /* Figma Location Section Styles */
        .figma-location-section {
          margin: 15px 0;
          background: #ffffff;
          page-break-inside: avoid;
          clear: both;
        }

        .figma-location-header {
          background: #F5F5F5;
          border: 1px dotted #999999;
          padding: 10px 15px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          margin: 0;
        }

        .figma-location-stepper {
          position: relative;
          padding: 20px 15px;
          border: 1px dotted #999999;
          border-top: none;
          background: #ffffff;
        }

        .figma-stepper-line {
          position: absolute;
          top: 35px;
          left: 8.33%;
          right: 8.33%;
          height: 2px;
          background: #C72030;
          z-index: 1;
        }

        .figma-location-steps {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .figma-location-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .figma-step-label {
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-weight: 500;
          color: #000000;
          margin-bottom: 8px;
        }

        .figma-step-dot {
          width: 10px;
          height: 10px;
          background-color: #C72030;
          border-radius: 50%;
          margin-bottom: 8px;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px #000000;
        }

        .figma-step-value {
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          line-height: 1.1;
        }

        /* Location Table Styles */
        .figma-location-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px dotted #999999;
          margin: 0;
          background: #ffffff;
          table-layout: fixed;
        }

        .figma-location-th {
          background: #F5F5F5;
          border: 1px dotted #999999;
          padding: 8px 6px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 10px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          vertical-align: middle;
          width: 16.66%;
          white-space: nowrap;
        }

        .figma-location-td {
          border: 1px dotted #999999;
          padding: 8px 6px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          color: #000000;
          text-align: center;
          vertical-align: middle;
          width: 16.66%;
          word-wrap: break-word;
          overflow-wrap: break-word;
          min-height: 25px;
          line-height: 1.2;
        }

        .floor-dot {
          background-color: #dc2626; /* Red */
        }

        .area-dot {
          background-color: #dc2626; /* Red */
        }

        .room-dot {
          background-color: #dc2626; /* Red */
        }

        .location-value {
          font-size: 10px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.2;
        }

        /* Daily Maintenance Styles */
        .daily-maintenance-section {
          margin-bottom: 15px;
          width: 100%;
          height: auto;
        }

        .daily-maintenance-section h3 {
          font-size: 14px;
          font-weight: bold;
          margin: 15px 0;
          text-align: center;
          color: #000000;
          background-color: #c8a882;
          padding: 8px;
          border: 1px dotted #999999;
        }

        .maintenance-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          height: auto;
          background: #ffffff;
          border: 1px dotted #999999;
        }

        .maintenance-table th {
          background: inherit;
          border: 1px dotted #999999;
          padding: 8px 4px;
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
          height: auto;
          min-height: 30px;
          color: #000000;
          font-size: 9px;
        }

        .help-text-header { width: 14%; }
        .activities-header { width: 14%; }
        .inspect-header { width: 14%; }
        .comment-header { width: 14%; }
        .rating-header { width: 14%; }
        .score-header { width: 15%; }
        .attachment-header { width: 15%; }

        .maintenance-table td {
          border: 1px dotted #999999;
          padding: 6px 4px;
          vertical-align: middle;
          height: auto;
          min-height: 25px;
          background: #ffffff;
          font-size: 8px;
          text-align: center;
        }

        .help-text {
          text-align: left;
          padding-left: 8px;
        }

        .section-header td {
          background-color: inherit;
          font-weight: bold;
        }

        .continuation-header {
          text-align: center;
          margin: 15px 0;
          font-weight: bold;
          font-size: 12px;
          color: #000000;
          background-color: #f0f0f0;
          padding: 8px;
          border: 1px dotted #999999;
        }

        /* Service Checklist Styles - Matching Figma Design */
        .checklist-section {
          margin-bottom: 15px;
          width: 100%;
          height: auto;
        }

        .checklist-section h3 {
          color: #000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: 16.14px;
          margin: 15px 0 10px 0;
          text-align: center;
          background-color: #f0f0f0;
          padding: 12px 8px;
          border: 1px dotted #999999;
        }

        .checklist-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          height: auto;
          background: #ffffff;
          border: 1px dotted #999999;
        }

        .checklist-table th {
          background: #f5f5f5;
          border: 1px dotted #999999;
          padding: 10px 6px;
          text-align: center;
          vertical-align: middle;
          height: auto;
          min-height: 32px;
          color: #000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 10px;
          font-style: normal;
          font-weight: 600;
          line-height: 10.09px;
        }

        .sl-header { width: 8%; }
        .inspection-header { width: 42%; }
        .result-header { width: 15%; }
        .remarks-header { width: 20%; }
        .attachment-header { width: 15%; }

        .checklist-table td {
          border: 1px dotted #999999;
          padding: 8px 6px;
          vertical-align: middle;
          height: auto;
          min-height: 28px;
          background: #ffffff;
          color: #000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-style: normal;
          font-weight: 400;
          line-height: 9.08px;
        }

        .sl-no {
          text-align: center;
          font-weight: 600;
        }

        .inspection-point {
          text-align: left;
          padding-left: 10px;
        }

        .result-cell {
          text-align: center;
          font-weight: 600;
          color: #2d5a2d;
        }

        .remarks {
          text-align: left;
          padding-left: 10px;
          font-size: 9px;
        }

        .attachment-cell {
          text-align: center;
          font-weight: 600;
          color: #007bff;
          font-size: 9px;
        }

        /* Measurements Section - Matching Figma Design */
        .measurements-section {
          margin-bottom: 15px;
          width: 100%;
          height: auto;
        }

        .measurements-section h3 {
          font-size: 12px;
          font-weight: bold;
          margin: 15px 0 10px 0;
          text-align: center;
          color: #000000;
          background-color: #f0f0f0;
          padding: 8px;
          border: 1px dotted #999999;
        }

        .measurement-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          margin-bottom: 10px;
          background: #ffffff;
          border: 1px dotted #999999;
        }

        .measurement-table th {
          background: #f5f5f5;
          border: 1px dotted #999999;
          padding: 8px 4px;
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
          height: 30px;
          color: #000000;
          font-size: 9px;
        }

        .measurement-table td {
          border: 1px dotted #999999;
          padding: 8px 4px;
          vertical-align: middle;
          height: 25px;
          background: #ffffff;
          font-size: 9px;
          text-align: center;
        }

        .voltage-label, .ampere-label, .pressure-label {
          background-color: #e0e0e0 !important;
          font-weight: bold;
          width: 20%;
        }

        .measurement-spacer {
          background-color: #f9f9f9 !important;
          width: 20%;
        }

        /* Remarks Section */
        .remarks-section {
          margin: 15px 0;
          width: 100%;
        }

        .remarks-section h3 {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #000000;
        }

        .remarks-box {
          border: 1px dotted #999999;
          min-height: 40px;
          padding: 8px;
          background: #ffffff;
          font-size: 10px;
          line-height: 1.4;
        }

        /* Signature Section */
        .signature-section {
          margin: 20px 0;
          width: 100%;
          page-break-inside: avoid;
        }

        .signature-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px dotted #999999;
        }

        .signature-cell {
          border: 1px dotted #999999;
          padding: 15px;
          vertical-align: top;
          width: 50%;
          background: #ffffff;
        }

        .signature-header {
          font-weight: bold;
          font-size: 11px;
          margin-bottom: 15px;
          text-align: center;
          color: #000000;
          text-decoration: underline;
        }

        .signature-content {
          min-height: 60px;
        }

        .signature-line {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          font-size: 10px;
        }

        .signature-label {
          font-weight: bold;
          width: 50px;
          margin-right: 10px;
        }

        .signature-value {
          flex: 1;
          border-bottom: 1px dotted #999999;
          min-height: 20px;
          padding: 2px 5px;
        }

        .signature-underline {
          flex: 1;
          border-bottom: 1px dotted #999999;
          min-height: 20px;
        }

        /* Footer Elements */
        .system-note {
          margin: 15px 0;
          text-align: center;
          font-size: 10px;
          font-style: italic;
          color: #666666;
        }

        .powered-by {
          margin: 10px 0;
          text-align: center;
          font-size: 10px;
          color: #000000;
        }

        .powered-by strong {
          color: #c72030;
        }

        /* Bottom Section */
        .bottom-section {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          text-align: center;
        }

        /* Before/After Images Section Enhancement */
        .before-after-section {
          margin: 15px 0;
          width: 100%;
          height: auto;
        }

        .before-after-section h3 {
          color: #000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 20px;
          font-style: normal;
          font-weight: 600;
          line-height: 20.18px; /* 100.901% */
          margin: 15px 0 10px 0;
          text-align: center;
          background-color: #f0f0f0;
          padding: 12px 8px;
          border: 1px dotted #999999;
        }

        .images-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px dotted #999999;
        }

        .images-table th {
          background: #f5f5f5;
          border: 1px dotted #999999;
          padding: 12px 8px;
          color: #000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 14.12px;
          text-align: center;
        }

        .image-cell {
          border: 1px dotted #999999;
          padding: 15px;
          text-align: center;
          vertical-align: top;
          width: 50%;
          background: #fafafa;
        }

        .image-container {
          width: 100%;
          height: auto;
          padding: 5px;
        }

        .image-wrapper {
          position: relative;
          margin-bottom: 12px;
          display: inline-block;
          border-radius: 8px;
          overflow: hidden;
        }

        .asset-image {
          width: 100%;
          max-width: 200px;
          height: 160px;
          object-fit: cover;
          border: 2px solid #000;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .image-timestamp {
          position: absolute;
          bottom: 6px;
          right: 6px;
          background: rgba(0,0,0,0.8);
          color: white;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-weight: 500;
          padding: 3px 6px;
          border-radius: 4px;
        }

        .image-label {
          color: #000;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: 12.11px;
          margin-bottom: 6px;
        }

        .image-caption {
          color: #666;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 10px;
          font-style: italic;
          font-weight: 400;
          line-height: 10.09px;
          margin-top: 4px;
        }

        /* Figma Images Section Styles */
        .figma-images-section {
          margin: 15px 0;
          background: #ffffff;
        }

        .figma-images-header {
          background: #F5F5F5;
          border: 1px dotted #999999;
          padding: 10px 15px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          margin: 0;
        }

        .figma-images-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px dotted #999999;
          border-top: none;
          background: #ffffff;
        }

        .figma-image-header-cell {
          border: 1px dotted #999999;
          padding: 10px;
          background: #F5F5F5;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          width: 50%;
        }

        .figma-image-cell {
          border: 1px dotted #999999;
          padding: 15px;
          text-align: center;
          vertical-align: top;
          width: 50%;
        }

        .figma-image-container {
          width: 100%;
          max-width: 180px;
          margin: 0 auto;
        }

        .figma-maintenance-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border: 1px solid #CCCCCC;
          border-radius: 4px;
          display: block;
        }

        .figma-image-timestamp {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 2px 6px;
          font-size: 8px;
          position: absolute;
          top: 5px;
          right: 5px;
          border-radius: 2px;
          font-family: "Work Sans", Arial, sans-serif;
        }

        .figma-image-description {
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          color: #000000;
          margin-top: 8px;
          line-height: 1.2;
          text-align: center;
        }

        /* Figma Checklist Section Styles */
        .figma-checklist-section {
          margin: 15px 0;
          background: #ffffff;
        }

        .figma-checklist-header {
          background: #C8A882;
          border: 1px dotted #999999;
          padding: 10px 15px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          text-align: center;
          margin: 0;
        }

        .figma-checklist-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px dotted #999999;
          border-top: none;
          background: #ffffff;
        }

        .figma-table-header-row {
          background: #F5F5F5;
        }

        .figma-sl-header {
          border: 1px dotted #999999;
          padding: 8px 5px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          width: 8%;
          vertical-align: middle;
        }

        .figma-inspection-header {
          border: 1px dotted #999999;
          padding: 8px 10px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          width: 42%;
          vertical-align: middle;
        }

        .figma-result-header {
          border: 1px dotted #999999;
          padding: 8px 10px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          width: 15%;
          vertical-align: middle;
        }

        .figma-remarks-header {
          border: 1px dotted #999999;
          padding: 8px 10px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          width: 20%;
          vertical-align: middle;
        }

        .figma-attachment-header {
          border: 1px dotted #999999;
          padding: 8px 10px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          color: #000000;
          text-align: center;
          width: 15%;
          vertical-align: middle;
        }

        .figma-checklist-row {
          background-color: #ffffff;
        }

        .figma-checklist-row:nth-child(even) {
          background-color: #F8F8F8;
        }

        .figma-sl-cell {
          border: 1px dotted #999999;
          padding: 6px 5px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          color: #000000;
          text-align: center;
          vertical-align: middle;
        }

        .figma-inspection-cell {
          border: 1px dotted #999999;
          padding: 6px 10px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          color: #000000;
          text-align: left;
          vertical-align: middle;
          font-weight: 500;
        }

        .figma-result-cell {
          border: 1px dotted #999999;
          padding: 6px 10px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          color: #000000;
          text-align: center;
          vertical-align: middle;
        }

        .figma-remarks-cell {
          border: 1px dotted #999999;
          padding: 6px 10px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          color: #000000;
          text-align: left;
          vertical-align: middle;
        }

        .figma-attachment-cell {
          border: 1px dotted #999999;
          padding: 4px 6px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          color: #333;
          text-align: center;
          vertical-align: middle;
          min-width: 80px;
          max-width: 120px;
        }
        
        /* Attachment Image Styles */
        .figma-attachment-cell img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #ddd;
          margin: 2px;
          display: inline-block;
        }
        
        .figma-attachment-cell > div {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          align-items: center;
          justify-content: center;
        }

        /* Attachment Indicator Styles */
        .figma-attachment-indicator {
          color: #007bff;
          font-weight: 600;
          font-size: 8px;
          background: #e3f2fd;
          padding: 1px 4px;
          border-radius: 3px;
          margin-left: 5px;
          display: inline-block;
        }

        /* Status Note Styles */
        .figma-status-note {
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          color: #666666;
          font-style: italic;
          margin-top: 8px;
          padding: 4px 8px;
          background: #f5f5f5;
          border-radius: 4px;
          text-align: center;
        }

        /* Figma Measurement Section Styles */
        .figma-measurement-section {
          margin-top: 15px;
          display: flex;
          gap: 10px;
          justify-content: space-between;
        }

        .figma-measurement-table {
          border-collapse: collapse;
          border: 1px dotted #999999;
          background: #ffffff;
          flex: 1;
        }

        .figma-measurement-header {
          background: #F5F5F5;
          border: 1px dotted #999999;
          padding: 6px 8px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          color: #000000;
          text-align: center;
        }

        .figma-measurement-subheader {
          background: #F9F9F9;
        }

        .figma-voltage-cell,
        .figma-ampere-cell,
        .figma-pressure-cell {
          border: 1px dotted #999999;
          padding: 4px 6px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 8px;
          font-weight: 500;
          color: #000000;
          text-align: center;
        }

        .figma-measurement-value {
          border: 1px dotted #999999;
          padding: 6px 8px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 9px;
          color: #000000;
          text-align: center;
          background: #ffffff;
        }

        /* Enhanced responsive design for print */
        @media print {
          body {
            margin: 0;
            padding: 10mm;
            font-size: 9px;
          }
          
          .avoid-page-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .signature-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .measurements-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
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

        /* SVG-Style Remarks Section */
        .svg-remarks-section {
          margin: 20px 0;
          position: relative;
          background: #ffffff;
        }

        .svg-remarks-container {
          border: 2px dotted #999999;
          border-radius: 8px;
          min-height: 100px;
          position: relative;
          background: #ffffff;
          padding: 20px 15px 15px 15px;
        }

        .svg-remarks-label {
          position: absolute;
          top: -12px;
          left: 15px;
          background: #ffffff;
          padding: 0 8px;
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #000000;
        }

        .svg-remarks-content {
          font-family: "Work Sans", Arial, sans-serif;
          font-size: 10px;
          color: #000000;
          line-height: 1.4;
          min-height: 60px;
          word-wrap: break-word;
        }

        /* Powered By with Vi Logo */
        .powered-by-vi {
          margin: 15px 0;
          text-align: center;
          font-size: 10px;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .vi-logo {
          width: 80px;
          height: auto;
        }

        .powered-text {
          font-family: "Work Sans", Arial, sans-serif;
          font-weight: 400;
        }
      </style>
    `;
  }
}
