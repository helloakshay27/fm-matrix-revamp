export interface VisitorDocument {
    id: number;
    document_url: string;
}

export interface VisitorAsset {
    id: number;
    asset_category_name: string;
    asset_name: string;
    serial_model_number: string;
    notes: string;
    documents: VisitorDocument[];
}

export interface VisitorIdentity {
    id: number;
    identity_type: string;
    government_id_number: string;
    documents: VisitorDocument[];
}

export interface AdditionalVisitor {
    id: number;
    name: string;
    gatekeeper_id: number;
    mobile: string;
    email: string;
    pass_number: string | null;
    vehicle_type: string;
    vehicle_number: string;
    parking_slot_number: string;
    carring_asset: boolean;
    identity: VisitorIdentity;
    assets: VisitorAsset[];
}

export interface VisitorPassData {
    id: number;
    guest_number: string;
    guest_vehicle_number: string;
    visit_purpose: string;
    guest_name: string;
    plus_person: number;
    expected_at: string;
    approve: number;
    notes: string;
    created_at: string;
    pass_start_date: string;
    pass_end_date: string;
    pass_days: string[];
    visitor_host_name: string | null;
    visitor_host_mobile: string | null;
    visitor_host_email: string | null;
    visitor_identity: VisitorIdentity;
    assets: VisitorAsset[];
    time_since_in: string;
    created_by: string;
    out_by: string;
    visit_to: string;
    visit_to_number: string;
    vstatus: string;
    qr_code_url: string;
    visitor_type: string;
    additional_visitors: AdditionalVisitor[];
    single_participant_invite: string;
    otp_string: string;
}
