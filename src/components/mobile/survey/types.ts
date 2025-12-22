// Survey Types
export interface SurveyOption {
    id: number;
    qname: string;
    option_type: string;
}

export interface GenericTag {
    id: number;
    category_name: string;
    category_type: string;
    tag_type: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    icons: Array<{
        id: number;
        file_name: string;
        content_type: string;
        file_size: number;
        updated_at: string;
        url: string;
    }>;
}

export interface SurveyQuestion {
    id: number;
    descr: string;
    qtype: string;
    quest_mandatory: boolean;
    snag_quest_options: SurveyOption[];
    generic_tags?: GenericTag[];
}

export interface SurveyMapping {
    id: number;
    survey_title: string;
    status: string;
    active: boolean;
    message?: string;
    location?: string;
    site_name?: string;
    building_name?: string;
    wing_name?: string;
    floor_name?: string;
    area_name?: string;
    room_name?: string;
    snag_checklist: {
        questions_count: number;
        form_view: boolean;
        snag_questions: SurveyQuestion[];
        survey_attachment?: {
            url: string;
        };
    };
}

export interface SurveyAnswerData {
    qtype: string;
    value: string | number;
    selectedOptions?: SurveyOption[];
    rating?: number | null;
    emoji?: string;
    label?: string;
    selectedTags?: GenericTag[];
    comments?: string;
    optionId?: number;
}

export type SurveyAnswers = Record<number, SurveyAnswerData>;

export type NegativeType = "emoji" | "smiley" | "multiple" | "rating" | null;

export type PendingNegativeAnswer =
    | null
    | { rating: number; emoji: string; label: string }
    | SurveyOption[]
    | number
    | { rating: number; option: SurveyOption };
