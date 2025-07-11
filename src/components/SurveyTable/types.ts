
export interface Survey {
  id: string;
  title: string;
  ticketCreation: boolean;
  ticketCategory: string;
  ticketLevel: string;
  noOfAssociation: number;
  typeOfSurvey: string;
  status: string;
  validFrom: string;
  validTo: string;
}

export interface SurveyListTableProps {
  searchTerm: string;
}
