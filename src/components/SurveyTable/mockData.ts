
import { Survey } from './types';

export const mockSurveyData: Survey[] = [
  {
    id: "12345",
    title: "Survey Title 123",
    ticketCreation: true,
    ticketCategory: "Category 123",
    ticketLevel: "Survey",
    noOfAssociation: 2,
    typeOfSurvey: "QR",
    status: "Active",
    validFrom: "30/06/2025",
    validTo: "01/07/2025"
  },
  {
    id: "12346",
    title: "Customer Satisfaction Survey",
    ticketCreation: false,
    ticketCategory: "Feedback",
    ticketLevel: "Question",
    noOfAssociation: 3,
    typeOfSurvey: "Link",
    status: "Draft",
    validFrom: "15/07/2025",
    validTo: "15/08/2025"
  },
  {
    id: "12347",
    title: "Product Quality Assessment",
    ticketCreation: true,
    ticketCategory: "Quality",
    ticketLevel: "Survey",
    noOfAssociation: 4,
    typeOfSurvey: "Link",
    status: "Published",
    validFrom: "01/08/2025",
    validTo: "31/08/2025"
  },
  {
    id: "12348",
    title: "Employee Engagement Survey",
    ticketCreation: true,
    ticketCategory: "HR",
    ticketLevel: "Survey",
    noOfAssociation: 3,
    typeOfSurvey: "QR",
    status: "Inactive",
    validFrom: "10/06/2025",
    validTo: "10/07/2025"
  },
  {
    id: "12349",
    title: "Market Research Survey",
    ticketCreation: false,
    ticketCategory: "Research",
    ticketLevel: "Question",
    noOfAssociation: 0,
    typeOfSurvey: "Link",
    status: "Draft",
    validFrom: "20/07/2025",
    validTo: "20/09/2025"
  },
  {
    id: "12350",
    title: "Service Quality Survey",
    ticketCreation: true,
    ticketCategory: "Service",
    ticketLevel: "Survey",
    noOfAssociation: 5,
    typeOfSurvey: "QR",
    status: "Published",
    validFrom: "05/08/2025",
    validTo: "05/10/2025"
  },
  {
    id: "12351",
    title: "Training Evaluation Survey",
    ticketCreation: false,
    ticketCategory: "Training",
    ticketLevel: "Question",
    noOfAssociation: 2,
    typeOfSurvey: "Link",
    status: "Inactive",
    validFrom: "25/06/2025",
    validTo: "25/07/2025"
  },
  {
    id: "12352",
    title: "Event Feedback Survey",
    ticketCreation: true,
    ticketCategory: "Events",
    ticketLevel: "Survey",
    noOfAssociation: 1,
    typeOfSurvey: "QR",
    status: "Active",
    validFrom: "12/07/2025",
    validTo: "12/08/2025"
  }
];
